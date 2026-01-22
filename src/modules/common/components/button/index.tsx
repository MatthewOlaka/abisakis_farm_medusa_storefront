import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
}

export const Button = (props: IButtonProps) => {
	const { onClick, primaryColor, secondaryColor, borderRadius, size, wrapperClass, icon } = props;

	return (
		<button
			onClick={onClick}
			className={`cursor-pointer ${wrapperClass ?? ''} ${primaryColor || 'bg-yellow-500 hover:bg-yellow-500/80'} ${secondaryColor || 'text-white'} ${borderRadius || 'rounded'} ${size === 'x-small' ? 'px-3 py-0.5 text-[6px]' : ''} ${size === 'small' ? 'px-3 py-1 text-sm' : ''} ${size === 'medium' ? 'px-4 py-2 text-base' : ''} ${size === 'large' ? 'px-6 py-3 text-lg' : ''} `}
			disabled={props.disabled}
		>
			{props.text || ''}
			{icon && <FontAwesomeIcon icon={icon} />}
		</button>
	);
};
