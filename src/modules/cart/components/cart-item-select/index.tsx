'use client';

import { IconBadge, clx } from '@medusajs/ui';
import {
	SelectHTMLAttributes,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';

import ChevronDown from '@modules/common/icons/chevron-down';

type NativeSelectProps = {
	placeholder?: string;
	errors?: Record<string, unknown>;
	touched?: Record<string, unknown>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'>;

const CartItemSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
	({ placeholder = 'Select...', className, children, ...props }, ref) => {
		const innerRef = useRef<HTMLSelectElement>(null);
		const [isPlaceholder, setIsPlaceholder] = useState(false);

		useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
			ref,
			() => innerRef.current,
		);

		useEffect(() => {
			if (innerRef.current && innerRef.current.value === '') {
				setIsPlaceholder(true);
			} else {
				setIsPlaceholder(false);
			}
		}, [innerRef.current?.value]);

		return (
			<div>
				<IconBadge
					onFocus={() => innerRef.current?.focus()}
					onBlur={() => innerRef.current?.blur()}
					className={clx(
						'relative flex items-center txt-compact-small border text-ui-fg-base group !justify-end pr-2',
						className,
						{
							'text-ui-fg-subtle': isPlaceholder,
						},
					)}
				>
					<select
						ref={innerRef}
						{...props}
						className="text-lg !text-green-900 appearance-none bg-transparent border-none transition-colors duration-150 focus:border-gray-700 outline-none w-16 h-16 items-center px-2"
					>
						<option disabled value="">
							{placeholder}
						</option>
						{children}
					</select>
					<span className="absolute flex pointer-events-none justify-end w-8 group-hover:animate-pulse group-hover:scale-125">
						<ChevronDown className="!text-green-900" />
					</span>
				</IconBadge>
			</div>
		);
	},
);

CartItemSelect.displayName = 'CartItemSelect';

export default CartItemSelect;
