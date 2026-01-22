interface IProps {
	title: string;
	wrapperClass?: string;
}

const Title = (props: IProps) => {
	const { title, wrapperClass } = props;
	return (
		<h1
			className={`${wrapperClass ?? ''} pointer-events-none relative z-50 mb-4 flex w-full items-center justify-center font-serif text-7xl font-semibold text-green-900`}
		>
			{title}
		</h1>
	);
};

export default Title;
