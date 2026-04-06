import { supabaseAdmin } from '@lib/lib/supabase-admin';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';

const DEFAULT_NOTIFY_EMAIL = 'matthew.olaka0@gmail.com';

const ContactSchema = z.object({
	firstName: z.string().trim().min(1).max(100),
	lastName: z.string().trim().min(1).max(100),
	email: z.string().trim().email().max(254),
	phone: z.string().trim().max(50).optional(),
	reason: z.string().trim().max(120).optional(),
	message: z.string().trim().min(1).max(5000),
	source: z.string().trim().max(80).optional(),
	hp: z.string().optional(),
});

type ContactPayload = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string | null;
	reason: string | null;
	message: string;
	source: string;
};

function escapeHtml(value: string) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

async function readBody(req: Request): Promise<Record<string, string> | null> {
	const contentType = req.headers.get('content-type') || '';

	try {
		if (contentType.includes('multipart/form-data')) {
			const formData = await req.formData();
			const entries = Object.fromEntries(formData.entries());
			return Object.fromEntries(
				Object.entries(entries).map(([key, value]) => [
					key,
					typeof value === 'string' ? value : '',
				]),
			);
		}

		if (contentType.includes('application/json')) {
			const data = await req.json();
			if (!data || typeof data !== 'object') return null;
			return Object.fromEntries(
				Object.entries(data).map(([key, value]) => [key, typeof value === 'string' ? value : '']),
			);
		}

		const fallback = await req.formData();
		const entries = Object.fromEntries(fallback.entries());
		return Object.fromEntries(
			Object.entries(entries).map(([key, value]) => [key, typeof value === 'string' ? value : '']),
		);
	} catch {
		return null;
	}
}

async function sendContactNotificationEmail(payload: ContactPayload) {
	const resendApiKey = process.env.RESEND_API_KEY;
	const fromEmail = process.env.CONTACT_FROM_EMAIL;
	const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;

	if (!resendApiKey || !fromEmail) {
		console.warn('[contact] email skipped: RESEND_API_KEY or CONTACT_FROM_EMAIL missing');
		return { sent: false, skipped: true as const };
	}

	const safeFirstName = escapeHtml(payload.firstName);
	const safeLastName = escapeHtml(payload.lastName);
	const safeEmail = escapeHtml(payload.email);
	const safePhone = escapeHtml(payload.phone || '-');
	const safeReason = escapeHtml(payload.reason || '-');
	const safeSource = escapeHtml(payload.source);
	const safeMessage = escapeHtml(payload.message).replace(/\n/g, '<br />');

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
			subject: `[Contact] ${payload.firstName} ${payload.lastName} (${payload.source})`,
			html: `
				<h2>New website contact request</h2>
				<p><strong>Name:</strong> ${safeFirstName} ${safeLastName}</p>
				<p><strong>Email:</strong> ${safeEmail}</p>
				<p><strong>Phone:</strong> ${safePhone}</p>
				<p><strong>Reason:</strong> ${safeReason}</p>
				<p><strong>Source:</strong> ${safeSource}</p>
				<p><strong>Message:</strong><br />${safeMessage}</p>
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
	const rawBody = await readBody(req);
	if (!rawBody) {
		return NextResponse.json({ ok: false, error: 'Invalid request body' }, { status: 400 });
	}

	const parsed = ContactSchema.safeParse(rawBody);
	if (!parsed.success) {
		return NextResponse.json({ ok: false, error: 'Invalid contact form payload' }, { status: 400 });
	}

	const { firstName, lastName, email, phone, reason, message, source, hp } = parsed.data;

	// Honeypot filled: silently pretend success.
	if (hp && hp.trim().length > 0) {
		return NextResponse.json({ ok: true });
	}

	const payload: ContactPayload = {
		firstName,
		lastName,
		email,
		phone: phone && phone.length > 0 ? phone : null,
		reason: reason && reason.length > 0 ? reason : null,
		message,
		source: source && source.length > 0 ? source : 'contact-page',
	};

	const { error: insertError } = await supabaseAdmin.from('contact_requests').insert({
		first_name: payload.firstName,
		last_name: payload.lastName,
		email: payload.email,
		phone: payload.phone,
		reason: payload.reason,
		message: payload.message,
		source: payload.source,
	});

	if (insertError) {
		console.error('[contact] insert error:', insertError);
		return NextResponse.json(
			{ ok: false, error: 'Failed to save contact request' },
			{ status: 500 },
		);
	}

	try {
		const emailResult = await sendContactNotificationEmail(payload);
		return NextResponse.json({ ok: true, emailSent: emailResult.sent });
	} catch (error) {
		console.error('[contact] email notify error:', error);
		return NextResponse.json(
			{ ok: false, error: 'Saved request, but failed to send notification email' },
			{ status: 500 },
		);
	}
}
