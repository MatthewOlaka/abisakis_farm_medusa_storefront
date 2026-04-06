import 'server-only';

import { supabaseAdmin } from '@lib/lib/supabase-admin';

export interface TeamMember {
	id: string;
	name: string;
	title: string;
	description: string;
	src: string;
	isFounder?: boolean;
}

interface TeamMemberRow {
	id: string | number;
	name: string;
	title: string;
	description: string | null;
	image_url: string;
	is_founder: boolean | null;
	sort_order: number | null;
	is_active: boolean | null;
}

export async function listTeamMembers(): Promise<TeamMember[]> {
	const { data, error } = await supabaseAdmin
		.from('team_members')
		.select('id, name, title, description, image_url, is_founder, sort_order, is_active')
		.eq('is_active', true)
		.order('sort_order', { ascending: true })
		.order('name', { ascending: true });

	if (error) {
		console.error('Failed to load team members from Supabase:', error.message);
		return [];
	}

	return ((data ?? []) as TeamMemberRow[]).map((member) => ({
		id: String(member.id),
		name: member.name,
		title: member.title,
		description: member.description ?? '',
		src: member.image_url,
		isFounder: member.is_founder ?? false,
	}));
}
