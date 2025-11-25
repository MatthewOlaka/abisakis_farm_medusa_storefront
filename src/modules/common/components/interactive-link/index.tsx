import { ArrowUpRightMini } from '@medusajs/icons';
import { Text } from '@medusajs/ui';
import LocalizedClientLink from '../localized-client-link';

type InteractiveLinkProps = {
	href: string;
	children?: React.ReactNode;
	onClick?: () => void;
	wrapperClassname?: string;
};

const InteractiveLink = ({
	href,
	children,
	onClick,
	wrapperClassname,
	...props
}: InteractiveLinkProps) => {
	return (
		<LocalizedClientLink
			className={`flex gap-x-1 items-center group`}
			href={href}
			onClick={onClick}
			{...props}
		>
			<Text className={`text-ui-fg-interactive ${wrapperClassname}`}>{children}</Text>
			<ArrowUpRightMini
				className="group-hover:rotate-45 ease-in-out duration-150"
				color="var(--fg-interactive)"
			/>
		</LocalizedClientLink>
	);
};

export default InteractiveLink;
