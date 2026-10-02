"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMyAppointments } from "@/services/appointment.services";
import { IAppointment } from "@/types/appointment.types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarClock, CalendarDays, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";

const formatDateTime = (value?: string | Date | null) => {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not scheduled" : format(date, "MMM dd, yyyy · hh:mm a");
};

const DoctorAppointmentsList = () => {
  const [filter, setFilter] = useState("ALL");
  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["doctor-my-appointments"],
    queryFn: getMyAppointments,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });
  const appointments = response?.data ?? [];
  const sortedAppointments = useMemo(() => [...appointments].sort((left, right) => (
    new Date(right.schedule?.startDateTime ?? right.createdAt ?? 0).getTime()
    - new Date(left.schedule?.startDateTime ?? left.createdAt ?? 0).getTime()
  )), [appointments]);
  const upcomingCount = appointments.filter((item) => item.status === "SCHEDULED" || item.status === "INPROGRESS").length;
  const completedCount = appointments.filter((item) => item.status === "COMPLETED").length;
  const canceledCount = appointments.filter((item) => item.status === "CANCELED").length;
  const visibleAppointments = sortedAppointments.filter((item) => {
    if (filter === "UPCOMING") return item.status === "SCHEDULED" || item.status === "INPROGRESS";
    return filter === "ALL" || item.status === filter;
  });

  const filters = [
    { id: "ALL", label: "All", count: appointments.length },
    { id: "UPCOMING", label: "Upcoming", count: upcomingCount },
    { id: "COMPLETED", label: "Completed", count: completedCount },
    { id: "CANCELED", label: "Canceled", count: canceledCount },
  ];

  return (
    <main className="doctor-management doctor-activity-page">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><CalendarDays /></div>
        <div>
          <p className="doctor-management-eyebrow">Care practice</p>
          <h1>My appointments</h1>
          <p className="doctor-management-description">Review your scheduled visits and patient details.</p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{isLoading ? "—" : appointments.length}</strong>
          <span>appointments</span>
        </div>
      </header>

      <section className="doctor-activity-summary" aria-label="Appointment summary">
        <div><CalendarClock aria-hidden="true" /><strong>{upcomingCount}</strong><span>Upcoming</span></div>
        <div><UsersRound aria-hidden="true" /><strong>{appointments.length}</strong><span>Patient visits</span></div>
        <div><Badge className="doctor-activity-summary-check" aria-hidden="true">✓</Badge><strong>{completedCount}</strong><span>Completed</span></div>
      </section>

      <section className="doctor-activity-panel" aria-label="Appointment list">
        <div className="doctor-activity-toolbar">
          <div className="doctor-activity-filters" role="group" aria-label="Filter appointments">
            {filters.map((item) => (
              <button
                aria-pressed={filter === item.id}
                className={`doctor-activity-filter${filter === item.id ? " active" : ""}`}
                key={item.id}
                onClick={() => setFilter(item.id)}
                type="button"
              >
                {item.label}<span>{item.count}</span>
              </button>
            ))}
          </div>
          <span className="doctor-activity-result-count">{visibleAppointments.length} shown</span>
        </div>

        {isError && <p className="doctor-activity-error" role="alert">Appointments could not be loaded. Please refresh.</p>}
        {!isLoading && !isError && visibleAppointments.length === 0 && (
          <div className="doctor-activity-empty">
            <CalendarDays aria-hidden="true" />
            <h2>No appointments in this view</h2>
            <p>New patient appointments will appear here when scheduled.</p>
          </div>
        )}
        {isLoading ? (
          <div className="doctor-activity-list" aria-label="Loading appointments">
            {Array.from({ length: 4 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
          </div>
        ) : !isError && visibleAppointments.length > 0 && (
          <div className="doctor-activity-list">
            {visibleAppointments.map((appointment: IAppointment) => (
              <article className="doctor-appointment-item" key={appointment.id}>
                <div className="doctor-appointment-main">
                  <div className="doctor-appointment-avatar" aria-hidden="true">
                    {(appointment.patient?.name || "P").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")}
                  </div>
                  <div className="min-w-0">
                    <h2>{appointment.patient?.name || "Patient"}</h2>
                    <p>{appointment.patient?.email || "No email listed"}</p>
                  </div>
                </div>
                <div className="doctor-appointment-time">
                  <CalendarClock aria-hidden="true" />
                  <span>{formatDateTime(appointment.schedule?.startDateTime)}</span>
                </div>
                <div className="doctor-appointment-badges">
                  <Badge className={`doctor-appointment-status ${appointment.status?.toLowerCase() || "scheduled"}`} variant="outline">
                    {appointment.status || "SCHEDULED"}
                  </Badge>
                  <Badge className={`doctor-appointment-payment ${appointment.paymentStatus?.toLowerCase() || "unpaid"}`} variant="outline">
                    {appointment.paymentStatus || "UNPAID"}
                  </Badge>
                </div>
                <div className="doctor-appointment-id">{appointment.id.slice(0, 8)}</div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default DoctorAppointmentsList;