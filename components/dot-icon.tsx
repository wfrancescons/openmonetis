type DotIconProps = {
	color: string;
};

export default function DotIcon({ color }: DotIconProps) {
	return (
		<span>
			<span className={`${color} flex size-2 rounded-full`}></span>
		</span>
	);
}
