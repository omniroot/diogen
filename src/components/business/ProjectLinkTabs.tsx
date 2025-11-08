import { SegmentGroup } from "@chakra-ui/react";
import { IconAssembly, IconBlocks, IconLayoutKanban } from "@tabler/icons-react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useLocationStore } from "@/stores/location.store.tsx";

const getSelectedValue = (currentPath: string) => {
	if (currentPath.includes("modules")) return "modules";
	if (currentPath.includes("issues")) return "issues";
	return "general";
};

export const ProjectLinkTabs = () => {
	const { custom_id } = useLocationStore();
	const navigate = useNavigate();

	const [value] = useState<string | null>(getSelectedValue(useLocation().href));

	const tabs = [
		{
			value: "general",
			name: "General",
			icon: <IconAssembly />,
			path: `/projects/${custom_id}/`,
		},
		{
			value: "issues",
			name: "Issues",
			icon: <IconLayoutKanban />,
			path: `/projects/${custom_id}/issues`,
		},
		{
			value: "modules",
			name: "Modules",
			icon: <IconBlocks />,
			path: `/projects/${custom_id}/modules`,
		},
	];
	return (
		<SegmentGroup.Root
			defaultValue={value}
			border={"1px solid {colors.outline}"}
			p={2}
			gap={1}
			borderRadius={"md"}
			// value={value}
			// onValueChange={(e) => {
			// 	setValue(e.value);
			// }}
			// css={{
			// 	"--segment-indicator-bg": "colors.teal.500",
			// 	"--segment-indicator-shadow": "shadows.md",
			// }}
		>
			<SegmentGroup.Indicator borderRadius={"sm"} bg={"surface_container_highest"} color={"text_primary"} />
			{tabs.map((tab) => {
				return (
					<SegmentGroup.Item
						key={tab.value}
						value={tab.value}
						onClick={() => {
							setTimeout(() => {
								navigate({ to: tab.path });
							}, 0);
						}}
						_icon={{
							w: "18px",
							h: "18px",
						}}
						borderRadius={"sm"}
						transition={"background 200ms"}
					>
						{/* <Link to="/projects/$custom_id" params={{ custom_id: String(custom_id) }}> */}
						{tab.icon}
						<SegmentGroup.ItemText>{tab.name}</SegmentGroup.ItemText>
						<SegmentGroup.ItemHiddenInput />
						{/* </Link> */}
					</SegmentGroup.Item>
				);
			})}

			{/* <SegmentGroup.Item value="issues">
				<Link to="/projects/$custom_id/issues" params={{ custom_id: String(custom_id) }}>
					<SegmentGroup.ItemText>Issues</SegmentGroup.ItemText>
					<SegmentGroup.ItemHiddenInput />
				</Link>
			</SegmentGroup.Item>
			<SegmentGroup.Item value="modules">
				<Link to="/projects/$custom_id/modules" params={{ custom_id: String(custom_id) }}>
					<SegmentGroup.ItemText>Modules</SegmentGroup.ItemText>
					<SegmentGroup.ItemHiddenInput />
				</Link>
			</SegmentGroup.Item> */}
			{/* <SegmentGroup.Items
					items={[
						{ value: "react", label: "React" },
						{ value: "vue", label: "Vue" },
						{ value: "solid", label: "Solid" },
					]}
				/> */}
		</SegmentGroup.Root>
	);
};
