import type * as React from "react";

export const ProgressIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width={14}
			height={14}
			viewBox="0 0 14 14"
			fill="none"
			className="sc-jdjTYm ekNTiZ workflow-state-icon"
			{...props}
		>
			<title>ProgressIcon</title>
			<circle
				cx={7}
				cy={7}
				r={6}
				fill="none"
				stroke="lch(80% 90 85)"
				strokeWidth={1.5}
				strokeDasharray="3.14 0"
				strokeDashoffset={-0.7}
			></circle>
			<circle
				className="progress"
				cx={7}
				cy={7}
				r={2}
				fill="none"
				stroke="lch(80% 90 85)"
				strokeWidth={4}
				strokeDasharray="12.189379495928398 24.378758991856795"
				strokeDashoffset={6.094689747964199}
				transform="rotate(-90 7 7)"
			></circle>
		</svg>
	);
};
