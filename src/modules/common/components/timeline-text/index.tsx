interface IProps {
	idx: string;
	title: string;
	description: string;
	className?: string;
}

const TimelineText = (props: IProps) => {
	const { idx, title, description, className } = props;
	return (
		<div
			className={`absolute ${className} xs:max-w-[70vw] z-100 w-full max-w-[230px] justify-center`}
		>
			<div className="flex items-center justify-center">
				<h1 className="xs:text-7xl font-serif text-6xl font-bold -tracking-widest text-yellow-500">
					{idx}
				</h1>
				<h1 className="xs:text-4xl font-serif text-3xl font-bold -tracking-widest text-green-900">
					{title}
				</h1>
			</div>
			<div className="flex justify-center">
				<p className="xs:text-xl xs:max-w-[350px] text-center font-serif text-sm leading-none text-green-900">
					{description}
				</p>
			</div>
		</div>
	);
};

export default TimelineText;
