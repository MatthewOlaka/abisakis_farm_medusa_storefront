export type Job = {
	id: string;
	position: string;
	location: string;
	type: string;
	summary?: string;
	description?: string;
	requirements?: string[];
	applyUrl?: string;
};

export const jobs: Job[] = [
	{
		id: 'fe-001',
		position: 'Senior Frontend Engineer',
		location: 'Remote – Kenya',
		type: 'Full-time',
		summary: 'Own the web UI for our consumer experience.',
		description:
			'We are looking for an experienced frontend engineer who loves accessibility, performance, and delightful UX.',
		requirements: [
			'5+ years with React/TypeScript',
			'Solid CSS/Tailwind chops',
			'Experience with animations (GSAP/Framer) a plus',
		],
	},
	{
		id: 'fm-002',
		position: 'Farm Manager',
		location: 'Kitale, Kenya',
		type: 'Full-time',
		summary: 'Manage the farm and all the farm activities',
		description:
			'We are looking for an experienced farm manager who loves accessibility, performance, and delightful experience. We are seeking an experienced Project Manager to join our team at Kitale County. The ideal candidate will have a background in architecture or construction management and a proven track record of managing successful projects from concept to completion. In this role, you will be responsible for collaborating with clients, architects, and contractors to ensure project success, preparing project budgets and schedules, and ensuring project compliance with building codes and regulations.',
		requirements: [
			'5+ years with React/TypeScript',
			'Solid CSS/Tailwind chops',
			'Experience with animations (GSAP/Framer) a plus',
		],
	},
];
