"use client";

import AppointmentPieChart from "@/components/shared/AppointmentPieChart";
import { getDashboardData } from "@/services/dashboard.services";
import { ApiErrorResponse, ApiResponse } from "@/types/api.types";
import { IDoctorDashboardData, IPatientDashboardData } from "@/types/dashboard.types";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Star, UsersRound, Wallet } from "lucide-react";

type RoleDashboardData = IDoctorDashboardData | IPatientDashboardData;
type DashboardRole = "doctor" | "patient";

const formatCurrency = (amount: number) => new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
}).format(amount);

const RoleDashboardContent = ({ role }: { role: DashboardRole }) => {
  const { data: response, isLoading, isError } = useQuery<
    ApiResponse<RoleDashboardData> | ApiErrorResponse
  >({
    queryKey: [`${role}-dashboard-data`],
    queryFn: () => getDashboardData<RoleDashboardData>(),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const data = response?.success ? response.data : undefined;
  const hasError = isError || response?.success === false;
  const metrics = role === "doctor"
    ? [
        {
          label: "Appointments",
          value: data?.appointmentCount ?? 0,
          detail: "Across your schedule",
          icon: CalendarDays,
          tone: "appointments",
        },
        {
          label: "Patients",
          value: data?.patientCount ?? 0,
          detail: "Unique patients seen",
          icon: UsersRound,
          tone: "patients",
        },
        {
          label: "Reviews",
          value: data?.reviewCount ?? 0,
          detail: "Patient feedback received",
          icon: Star,
          tone: "doctors",
        },
        {
          label: "Paid revenue",
          value: formatCurrency(data && "totalRevenue" in data ? data.totalRevenue : 0),
          detail: "From completed payments",
          icon: Wallet,
          tone: "revenue",
        },
      ]
    : [
        {
          label: "Appointments",
          value: data?.appointmentCount ?? 0,
          detail: "Your care visits",
          icon: CalendarDays,
          tone: "appointments",
        },
        {
          label: "Reviews",
          value: data?.reviewCount ?? 0,
          detail: "Reviews you have shared",
          icon: Star,
          tone: "patients",
        },
      ];

  return (
    <main className="admin-analytics role-dashboard">
      <header className="admin-analytics-heading">
        <div>
          <p className="admin-analytics-eyebrow">{role === "doctor" ? "Care practice" : "Your care"}</p>
          <h1>{role === "doctor" ? "Doctor Dashboard" : "Patient Dashboard"}</h1>
          <p>
            {role === "doctor"
              ? "A clear view of your appointments, patients, and outcomes."
              : "A clear view of your appointments and patient feedback."}
          </p>
        </div>
        <div className="admin-analytics-live-state">
          <span aria-hidden="true" />
          Updated live
        </div>
      </header>

      {hasError && (
        <div className="admin-analytics-error" role="alert">
          Dashboard data could not be loaded. Refresh the page to try again.
        </div>
      )}

      <section className={`admin-analytics-metrics${role === "patient" ? " patient-dashboard-metrics" : ""}`} aria-label="Dashboard metrics">
        {metrics.map((metric) => {
          const MetricIcon = metric.icon;
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
          );
        })}
      </section>

      <section className="admin-analytics-charts role-dashboard-charts" aria-label="Appointment status">
        <AppointmentPieChart
          data={data?.appointmentStatusDistribution ?? []}
          title="Appointment status"
          description="Your appointments by current status"
        />
      </section>
    </main>
  );
};

export default RoleDashboardContent;