// import { supabaseAdmin } from '@lib/lib/supabase-admin';
// import { NextResponse } from 'next/server';
// import { z } from 'zod';

import { supabaseAdmin } from '@lib/lib/supabase-admin';

// export const runtime = 'nodejs';

// const Schema = z.object({
// 	email: z
// 		.string()
// 		.email()
// 		.transform((s) => s.trim().toLowerCase()),
// 	source: z.string().optional(),
// 	hp: z.string().optional(), // honeypot
// });

// async function readBody(req: Request) {
// 	const ct = req.headers.get('content-type') || '';
// 	try {
// 		if (ct.includes('application/json')) return await req.json();
// 		if (ct.includes('application/x-www-form-urlencoded')) {
// 			const text = await req.text();
// 			return Object.fromEntries(new URLSearchParams(text));
// 		}
// 		if (ct.includes('multipart/form-data')) {
// 			const fd = await req.formData();
// 			return Object.fromEntries(fd.entries());
// 		}
// 		// fallback: try json
// 		return await req.json();
// 	} catch {
// 		return null;
// 	}
// }

// export async function POST(req: Request) {
// 	const raw = await readBody(req);
// 	if (!raw) {
// 		return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
// 	}

// 	const parsed = Schema.safeParse(raw);
// 	if (!parsed.success) {
// 		return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 });
// 	}

// 	const { email, source, hp } = parsed.data;

// 	// Honeypot filled: pretend success
// 	if (hp) return NextResponse.json({ ok: true });

// 	const { error } = await supabaseAdmin
// 		.from('newsletter_subscribers')
// 		// ⬇️ don't send email_ci; it’s generated from email
// 		.upsert(
// 			{ email, source },
// 			{ onConflict: 'email_ci', ignoreDuplicates: false }, // still use email_ci for conflict
// 		);

// 	if (error && process.env.NODE_ENV !== 'production') {
// 		console.error('[newsletter] upsert error:', error);
// 	}

// 	// Always return ok to avoid leaking whether the email exists
// 	return NextResponse.json({ ok: true });
// }

// app/api/newsletter/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const { email, source } = await req.json();

	if (typeof email !== 'string' || !email.includes('@')) {
		return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
	}

	// Do NOT send email_ci; it's a generated column
	const { error } = await supabaseAdmin.from('newsletter_subscribers').upsert(
		{ email, source: source ?? null }, // single object is fine
		{ onConflict: 'email_ci', ignoreDuplicates: true }, // ✅ valid options in v2
	);

	if (error) {
		console.error('[newsletter] upsert error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}

	// If you want the inserted row, chain .select() instead of a non-existent `returning` option:
	// const { data, error } = await supabaseAdmin
	//   .from('newsletter_subscribers')
	//   .upsert({ email, source: source ?? null }, { onConflict: 'email_ci', ignoreDuplicates: true })
	//   .select('id, email')
	//   .single();

	return NextResponse.json({ ok: true });
}
