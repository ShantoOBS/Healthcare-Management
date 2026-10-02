"use client"

import AppointmentBarChart from "@/components/shared/AppointmentBarChart"
import AppointmentPieChart from "@/components/shared/AppointmentPieChart"
import { getDashboardData } from "@/services/dashboard.services"
import { ApiErrorResponse, ApiResponse } from "@/types/api.types"
import { IAdminDashboardData } from "@/types/dashboard.types"
import { useQuery } from "@tanstack/react-query"
import { CalendarDays, Stethoscope, UsersRound, Wallet } from "lucide-react"

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
}).format(amount)

const AdminDashboardContent = () => {
  const { data: adminDashboardData, isLoading, isError } = useQuery<ApiResponse<IAdminDashboardData> | ApiErrorResponse>({
    queryKey: ["admin-dashboard-data"],
    queryFn: getDashboardData,
    refetchOnWindowFocus: "always",
  });

  const data = adminDashboardData?.success ? adminDashboardData.data : undefined;
  const hasError = isError || adminDashboardData?.success === false;
  const metrics = [
    {
      label: "Appointments",
      value: data?.appointmentCount ?? 0,
      detail: "All scheduled visits",
      icon: CalendarDays,
      tone: "appointments",
    },
    {
      label: "Patients",
      value: data?.patientCount ?? 0,
      detail: "Registered patients",
      icon: UsersRound,
      tone: "patients",
    },
    {
      label: "Doctors",
      value: data?.doctorCount ?? 0,
      detail: "Active care providers",
      icon: Stethoscope,
      tone: "doctors",
    },
    {
      label: "Paid revenue",
      value: formatCurrency(data?.totalRevenue ?? 0),
      detail: `${data?.paymentCount ?? 0} payment records`,
      icon: Wallet,
      tone: "revenue",
    },
  ]

  return (
    <main className="admin-analytics">
      <header className="admin-analytics-heading">
        <div>
          <p className="admin-analytics-eyebrow">Administration</p>
          <h1>Analytics Overview</h1>
          <p>Healthcare activity and paid revenue across the platform.</p>
        </div>
        <div className="admin-analytics-live-state">
          <span aria-hidden="true" />
          Updated live
        </div>
      </header>

      {hasError && (
        <div className="admin-analytics-error" role="alert">
          Analytics could not be loaded. Refresh the page to try again.
        </div>
      )}

      <section className="admin-analytics-metrics" aria-label="Key metrics">
        {metrics.map((metric) => {
          const MetricIcon = metric.icon
          return (
            <article className={`admin-analytics-metric ${metric.tone}`} key={metric.label}>
              <div className="admin-analytics-metric-topline">
                <span>{metric.label}</span>
                <MetricIcon aria-hidden="true" />
              </div>
              {isLoading ? (
                <span className="admin-analytics-value-skeleton" aria-label="Loading" />
              ) : (
                <strong>{metric.value}</strong>
              )}
              <p>{metric.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="admin-analytics-charts" aria-label="Appointment analytics">
        <AppointmentBarChart data={data?.barChartData || []} />
        <AppointmentPieChart
          data={data?.pieChartData || []}
          title="Appointment status"
          description="Distribution by current status"
        />
      </section>
    </main>
  );
}

export default AdminDashboardContent