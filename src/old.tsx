/* <Tabs.Root
				w={"100%"}
				defaultValue="timeline"
				value={tab}
				onValueChange={(v) => setTab(v.value)}
				variant="plain"
				css={{
					"--tabs-indicator-bg": "colors.surface-container",
					"--tabs-indicator-shadow": "none",
					"--tabs-trigger-radius": "radii.full",
					"--transition-duration": "300ms",
				}}
			>
				<Tabs.List w={"100%"} justifyContent={"space-between"}>
					<Tabs.Trigger w={"100%"} justifyContent={"center"} value="timeline">
						Timeline
					</Tabs.Trigger>
					<Tabs.Trigger w={"100%"} justifyContent={"center"} value="configure">
						Configure
					</Tabs.Trigger>
					<Tabs.Indicator />
				</Tabs.List>
				<Tabs.Content
					value="timeline"
					css={{
						"--focus-ring-color": "transparent",
					}}
				>
</Tabs.Content>
				<Tabs.Content
					value="configure"
					css={{
						"--focus-ring-color": "transparent",
					}}
				>
</Tabs.Content>
			</Tabs.Root> */

