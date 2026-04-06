import { supabaseAdmin } from '@lib/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const DEFAULT_NOTIFY_EMAIL = 'matthew.olaka0@gmail.com';

const ALLOWED_MIME_TYPES = new Set([
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function getExtension(name: string): string {
	const dot = name.lastIndexOf('.');
	return dot >= 0 ? name.slice(dot).toLowerCase() : '';
}

function escapeHtml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function sanitizeFileName(name: string) {
	return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 200);
}

async function uploadFile(file: File, folder: string): Promise<{ path: string | null; error?: string }> {
	const ext = getExtension(file.name);
	if (!ALLOWED_MIME_TYPES.has(file.type) && !ALLOWED_EXTENSIONS.has(ext)) {
		return { path: null, error: `Invalid file type: "${file.type}" / ext "${ext}"` };
	}
	if (file.size > MAX_FILE_SIZE) {
		return { path: null, error: `File too large: ${file.size} bytes` };
	}

	const timestamp = Date.now();
	const safeName = sanitizeFileName(file.name);
	const path = `${folder}/${timestamp}_${safeName}`;

	const buffer = Buffer.from(await file.arrayBuffer());

	const { error } = await supabaseAdmin.storage
		.from('job-applications')
		.upload(path, buffer, { contentType: file.type || 'application/octet-stream', upsert: false });

	if (error) {
		console.error('[apply] upload error:', error);
		return { path: null, error: `Storage error: ${error.message}` };
	}

	return { path };
}

type ApplicationPayload = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	jobId: string;
	jobTitle: string;
	resumePath: string | null;
	coverLetterPath: string | null;
};

async function sendApplicationNotificationEmail(payload: ApplicationPayload) {
	const resendApiKey = process.env.RESEND_API_KEY;
	const fromEmail = process.env.CONTACT_FROM_EMAIL;
	const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

	if (!resendApiKey || !fromEmail) {
		console.warn('[apply] email skipped: RESEND_API_KEY or CONTACT_FROM_EMAIL missing');
		return { sent: false, skipped: true as const };
	}

	const safeFirst = escapeHtml(payload.firstName);
	const safeLast = escapeHtml(payload.lastName);
	const safeEmail = escapeHtml(payload.email);
	const safePhone = escapeHtml(payload.phone || '-');
	const safeTitle = escapeHtml(payload.jobTitle);

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${resendApiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: fromEmail,
			to: [notifyEmail],
			reply_to: payload.email,
			subject: `[Job Application] ${payload.firstName} ${payload.lastName} – ${payload.jobTitle}`,
			html: `
				<h2>New Job Application</h2>
				<p><strong>Position:</strong> ${safeTitle}</p>
				<p><strong>Name:</strong> ${safeFirst} ${safeLast}</p>
				<p><strong>Email:</strong> ${safeEmail}</p>
				<p><strong>Phone:</strong> ${safePhone}</p>
				<p><strong>Resume:</strong> ${payload.resumePath ? 'Uploaded' : 'Not provided'}</p>
				<p><strong>Cover Letter:</strong> ${payload.coverLetterPath ? 'Uploaded' : 'Not provided'}</p>
				<p style="margin-top:16px;color:#666;">Files are stored in the <code>job-applications</code> Supabase storage bucket.</p>
			`,
		}),
	});

	if (!response.ok) {
		const details = await response.text();
		throw new Error(`Failed to send email notification: ${details}`);
	}

	return { sent: true as const, skipped: false as const };
}

export async function POST(req: Request) {
	let formData: FormData;
	try {
		formData = await req.formData();
	} catch {
		return NextResponse.json({ ok: false, error: 'Invalid form data' }, { status: 400 });
	}

	const firstName = String(formData.get('firstName') || '').trim();
	const lastName = String(formData.get('lastName') || '').trim();
	const email = String(formData.get('email') || '').trim();
	const phone = String(formData.get('phone') || '').trim();
	const jobId = String(formData.get('jobId') || '').trim();
	const jobTitle = String(formData.get('jobTitle') || '').trim();

	// Basic validation
	if (!firstName || !lastName || !email || !phone || !jobId || !jobTitle) {
		return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
	}

	if (!email.includes('@') || email.length > 254) {
		return NextResponse.json({ ok: false, error: 'Invalid email address' }, { status: 400 });
	}

	// Upload files
	const resumeFile = formData.get('resume');
	const coverLetterFile = formData.get('coverLetter');

	let resumePath: string | null = null;
	let coverLetterPath: string | null = null;

	if (resumeFile instanceof File && resumeFile.size > 0) {
		const result = await uploadFile(resumeFile, `${jobId}`);
		if (!result.path) {
			console.error('[apply] resume upload rejected:', result.error);
			return NextResponse.json(
				{ ok: false, error: `Resume upload failed: ${result.error}` },
				{ status: 400 },
			);
		}
		resumePath = result.path;
	}

	if (coverLetterFile instanceof File && coverLetterFile.size > 0) {
		const result = await uploadFile(coverLetterFile, `${jobId}`);
		if (!result.path) {
			console.error('[apply] cover letter upload rejected:', result.error);
			return NextResponse.json(
				{ ok: false, error: `Cover letter upload failed: ${result.error}` },
				{ status: 400 },
			);
		}
		coverLetterPath = result.path;
	}

	// Insert into Supabase
	const { error: insertError } = await supabaseAdmin.from('job_applications').insert({
		first_name: firstName,
		last_name: lastName,
		email,
		phone,
		job_id: jobId,
		job_title: jobTitle,
		resume_path: resumePath,
		cover_letter_path: coverLetterPath,
	});

	if (insertError) {
		console.error('[apply] insert error:', insertError);
		return NextResponse.json({ ok: false, error: 'Failed to save application' }, { status: 500 });
	}

	// Send email notification
	const payload: ApplicationPayload = {
		firstName,
		lastName,
		email,
		phone,
		jobId,
		jobTitle,
		resumePath,
		coverLetterPath,
	};

	try {
		const emailResult = await sendApplicationNotificationEmail(payload);
		return NextResponse.json({ ok: true, emailSent: emailResult.sent });
	} catch (error) {
		console.error('[apply] email notify error:', error);
		// Application was saved successfully, just the email failed
		return NextResponse.json({ ok: true, emailSent: false });
	}
}
