'use client';
import Image from 'next/image';
import { useCallback, useState } from 'react';

interface IProps {
	name: string;
	title: string;
	description: string;
	src: string;
	isFounder?: boolean;
}

const TeamCard = ({ name, title, description, src, isFounder }: IProps) => {
	const [open, setOpen] = useState(false);

	const toggle = useCallback(() => setOpen((v) => !v), []);
	const onKey = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggle();
			}
		},
		[toggle],
	);

	return (
		<div
			className={`group relative h-[300px] w-[250px] touch-manipulation overflow-hidden rounded-md border-2 md:h-[270px] md:w-[200px] ${isFounder ? 'border-yellow-500' : 'border-green-900'} ${isFounder ? 'bg-yellow-200' : 'bg-green-900/10'}`}
			role="button"
			tabIndex={0}
			aria-expanded={open}
			onClick={toggle}
			onKeyDown={onKey}
		>
			{/* background image */}
			<Image
				src={src}
				alt={`${name} headshot`}
				fill
				priority
				className="mt-2 object-contain"
				onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
			/>

			{/* gradient veil */}
			<div
				className={[
					'pointer-events-none absolute inset-0',
					'bg-gradient-to-t from-green-900/60 via-green-900/20 to-transparent',
					'transition-opacity duration-500 ease-out',
					open ? 'opacity-100' : 'opacity-0',
					'md:group-hover:opacity-100',
				].join(' ')}
			/>

			{/* drawer */}
			<div className="absolute inset-x-1 bottom-1">
				<div
					className={[
						'transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] will-change-transform',
						open ? 'translate-y-0' : 'translate-y-[76%]',
						'md:group-hover:translate-y-0',
						'motion-reduce:transform-none motion-reduce:transition-none',
					].join(' ')}
				>
					<div
						className={[
							'pointer-events-none rounded-xl text-center shadow-lg backdrop-blur-sm transition-colors duration-300',
							open ? 'bg-yellow-200' : 'bg-yellow-200/70',
							'md:group-hover:bg-yellow-200',
						].join(' ')}
					>
						<h2 className="font-serif text-lg font-bold text-green-900">{name}</h2>
						<h3 className="text-xs text-green-900/90">{title}</h3>

						<p
							className={[
								'mt-2 pb-2 text-[11px] leading-snug text-green-900 transition-all ease-out',
								open
									? 'translate-y-0 opacity-100 delay-100 duration-500'
									: 'translate-y-2 opacity-0 duration-300',
								'md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-hover:delay-100 md:group-hover:duration-500',
								'motion-reduce:transition-none',
							].join(' ')}
						>
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TeamCard;
