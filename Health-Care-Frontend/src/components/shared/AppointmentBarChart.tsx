import { BarChartData } from "@/types/dashboard.types"
import { format } from "date-fns"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"



interface AppointmentBarChartProps {
    data : BarChartData[]
}

const AppointmentBarChart = ({data}: AppointmentBarChartProps) => {

    if(!data || !Array.isArray(data)){
        return (
            <Card className="admin-analytics-chart admin-analytics-bar-chart">
              <CardHeader className="admin-analytics-chart-header">
                    <CardTitle>Appointment Trends</CardTitle>
                    <CardDescription>Monthly Appointment Statistics</CardDescription>
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
        month : typeof item.month === "string" ? format(new Date(item.month), "MMM yyyy") : format(item.month, "MMM yyyy"),

        appointments : Number(item.count)
    }))


    if(!formattedData.length || formattedData.every(item => item.appointments === 0)){
        return (
          <Card className="admin-analytics-chart admin-analytics-bar-chart">
            <CardHeader className="admin-analytics-chart-header">
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Monthly Appointment Statistics</CardDescription>
            </CardHeader>
            <CardContent className="admin-analytics-chart-content flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                No appointment data available.
              </p>
            </CardContent>
          </Card>
        );
    }
  return (
    <Card className="admin-analytics-chart admin-analytics-bar-chart">
      <CardHeader className="admin-analytics-chart-header">
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>Monthly Appointment Statistics</CardDescription>
        </CardHeader>
        <CardContent className="admin-analytics-chart-content">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={formattedData}>
              <CartesianGrid stroke="#e8eee9" strokeDasharray="3 3" vertical={false} />
              <XAxis tickLine={false} axisLine={false} tick={{ fill: "#718179", fontSize: 12 }} dataKey="month" />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#718179", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#dce7df" }} cursor={{ fill: "#f3f7f4" }} />
              <Legend wrapperStyle={{ color: "#61736b", fontSize: 12 }} />
              <Bar
                dataKey="appointments"
                fill="#174c3b"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
    </Card>
  )
}

export default AppointmentBarChart