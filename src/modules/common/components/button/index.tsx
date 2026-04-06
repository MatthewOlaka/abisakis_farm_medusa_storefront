import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@lib/lib/utils';

interface IButtonProps {
	onClick?: () => void;
	primaryColor?: string;
	secondaryColor?: string;
	borderRadius?: string;
	size?: 'x-small' | 'small' | 'medium' | 'large';
	text?: string;
	disabled?: boolean;
	wrapperClass?: string;
	icon?: IconDefinition;
	type?: 'button' | 'submit' | 'reset';
}

export const Button = (props: IButtonProps) => {
	const {
		onClick,
		primaryColor,
		secondaryColor,
		borderRadius,
		size,
		wrapperClass,
		icon,
		type = 'button',
	} = props;

	const sizeClass =
		size === 'x-small'
			? 'px-3 py-0.5 text-[6px]'
			: size === 'small'
				? 'px-3 py-1 text-sm'
				: size === 'medium'
					? 'px-4 py-2 text-base'
					: size === 'large'
						? 'px-6 py-3 text-lg'
						: '';

	return (
		<button
			type={type}
			onClick={onClick}
			className={cn(
				'cursor-pointer flex items-center w-full justify-center gap-1',
				wrapperClass,
				primaryColor || 'bg-yellow-500 hover:bg-amber-400',
				secondaryColor || 'text-white',
				borderRadius || 'rounded',
				sizeClass,
			)}
			disabled={props.disabled}
		>
			{props.text || ''}
			{icon && <FontAwesomeIcon icon={icon} />}
		</button>
	);
};
