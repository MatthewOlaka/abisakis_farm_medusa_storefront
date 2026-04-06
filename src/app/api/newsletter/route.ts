import { supabaseAdmin } from '@lib/lib/supabase-admin';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
	const { email, source } = await req.json();

	if (typeof email !== 'string' || !email.includes('@')) {
		return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
	}

	const { error } = await supabaseAdmin.from('newsletter_subscribers').upsert(
		{ email: email.trim().toLowerCase(), source: source ?? null },
		{ onConflict: 'email_ci', ignoreDuplicates: true },
	);

	if (error) {
		console.error('[newsletter] upsert error:', error);
		return NextResponse.json(
			{ error: 'Unable to subscribe. Please try again later.' },
			{ status: 500 },
		);
	}

	return NextResponse.json({ ok: true });
}
