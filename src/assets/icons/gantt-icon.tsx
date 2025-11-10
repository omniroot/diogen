import type * as React from "react";

export const GanttIcon = (props: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={24}
			height={24}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-chart-no-axes-gantt-icon lucide-chart-no-axes-gantt"
			{...props}
		>
			<title>GanttIcon</title>
			<path d="M6 5h12" />
			<path d="M4 12h10" />
			<path d="M12 19h8" />
		</svg>
	);
};
