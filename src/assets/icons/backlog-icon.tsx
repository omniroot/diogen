import type * as React from "react";

export const BacklogIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width={14}
			height={14}
			viewBox="0 0 14 14"
			fill="none"
			className="sc-jdjTYm ekNTiZ workflow-state-icon"
			{...props}
		>
			<title>BacklogIcon</title>
			<circle
				cx={7}
				cy={7}
				r={6}
				fill="none"
				stroke="#bec2c8"
				strokeWidth={1.5}
				strokeDasharray="1.4 1.74"
				strokeDashoffset={0.65}
			></circle>
			<circle
				className="progress"
				cx={7}
				cy={7}
				r={2}
				fill="none"
				stroke="#bec2c8"
				strokeWidth={4}
				strokeDasharray="12.189379495928398 24.378758991856795"
				strokeDashoffset={12.189379495928398}
				transform="rotate(-90 7 7)"
			></circle>
		</svg>
	);
};
