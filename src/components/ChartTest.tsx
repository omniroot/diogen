import { Chart, useChart } from "@chakra-ui/charts";
import { Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";
import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import { sleepMetricsHooksApi } from "@/features/metrics/api/sleep-metrics.api.ts";

const minutesToHoursMinutes = (totalMinutes: number) => {
	const hours = Math.floor(totalMinutes / 60);
	const minutes = totalMinutes % 60;

	return `${hours}ч ${minutes}м`;
};

type Props = { a?: any };
export const ChartTest: React.FC<Props> = () => {
	const { data: sleepMetrics } = sleepMetricsHooksApi.useList({});
	const chartData = sleepMetrics
		?.map((item) => {
			const start = dayjs(item.start_at);
			const end = dayjs(item.end_at);

			const durationMinutes = end.diff(start, "minute");

			return {
				date: start.format("YYYY-MM-DD"),
				score: item.score,

				// для графика
				duration: Number((durationMinutes / 60).toFixed(2)),

				// для человека
				durationLabel: minutesToHoursMinutes(durationMinutes),
			};
		})
		.reverse();

	const chart = useChart({
		data: chartData ?? [],
		series: [
			// { name: "score", color: "teal.solid" },
			{ name: "duration", color: "primary" },
		],
	});
	console.log({ sleepMetrics });

	return (
		<Chart.Root maxH="sm" chart={chart}>
			<AreaChart data={chart.data}>
				<CartesianGrid stroke={chart.color("border.muted")} vertical={false} />

				<XAxis
					dataKey={chart.key("date")}
					tickFormatter={(v) => v.slice(5)} // MM-DD
					axisLine={false}
				/>

				<YAxis axisLine={false} />

				<Tooltip
					content={({ payload }) => {
						if (!payload?.length) return null;

						const data = payload[0].payload;

						return (
							<VStack
								bg={"surface-container"}
								p={2}
								borderRadius={"md"}
								alignItems={"start"}
								fontSize={"14px"}
							>
								<Text>📅 {data.date}</Text>
								<Text>🧠 Score: {data.score}</Text>
								<Text>😴 Сон: {data.durationLabel}</Text>
							</VStack>
						);
					}}
				/>
				<Legend content={<Chart.Legend />} />

				{chart.series.map((item) => (
					<Area
						key={item.name}
						dataKey={chart.key(item.name)}
						fill={chart.color(item.color)}
						stroke={chart.color(item.color)}
						strokeWidth={"3"}
						style={{ borderRadius: "20px" }}
						type={"step"}
						fillOpacity={0.5}
					/>
				))}
			</AreaChart>
		</Chart.Root>
	);
};
