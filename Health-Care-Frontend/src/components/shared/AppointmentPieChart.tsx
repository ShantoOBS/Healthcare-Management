import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PieChartData } from "@/types/dashboard.types";


interface AppointmentPieChartProps {
    data : PieChartData[]
    title ?: string
    description ?: string
}

const CHART_COLORS = ["#174c3b", "#d9a441", "#6d9fa5", "#c96f5d", "#8da96b"];


const AppointmentPieChart = ({
    data,
    title = "Appointment status",
    description = "Distribution by current status",
}: AppointmentPieChartProps) => {

    if(!data || !Array.isArray(data)){
        return (
            <Card className="admin-analytics-chart admin-analytics-pie-chart">
                <CardHeader className="admin-analytics-chart-header">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="admin-analytics-chart-content flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        Invalid data provided for the chart.
                    </p>
                </CardContent>
            </Card>
        )
    }


    const formattedData = data.map((item) => ({
      name: item.status
        .replace(/_/g, " ") // Replace underscores with spaces for better readability
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize the first letter of each word
        ,
      value: Number(item.count),
    }));


    if(!formattedData.length || formattedData.every(item => item.value === 0)){
        return (
            <Card className="admin-analytics-chart admin-analytics-pie-chart">
                <CardHeader className="admin-analytics-chart-header">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>

                <CardContent className="admin-analytics-chart-content flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No appointment data available to display the chart.
                    </p>
                </CardContent>
            </Card>
        )
    }
  return (
    <Card className="admin-analytics-chart admin-analytics-pie-chart">
        <CardHeader className="admin-analytics-chart-header">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent className="admin-analytics-chart-content">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="50%"
                        outerRadius={92}
                        dataKey={"value"}
                    >
                        {formattedData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dce7df" }} />
                    <Legend wrapperStyle={{ color: "#61736b", fontSize: 12 }} />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}

export default AppointmentPieChart