"use client"

import { initiateAppointmentPaymentAction } from "@/app/_actions/appointment.actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type IAppointment } from "@/types/appointment.types"
import { useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { AlertCircle, CalendarClock, CalendarDays, Check, CircleDollarSign, CreditCard, UsersRound } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"

interface PatientAppointmentsListProps {
  appointments: IAppointment[]
  feedbackType?: "success" | "error"
  feedbackMessage?: string
}

const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A"
  }

  return format(dateValue, "MMM dd, yyyy • hh:mm a")
}

const PatientAppointmentsList = ({
  appointments,
  feedbackType,
  feedbackMessage,
}: PatientAppointmentsListProps) => {
  const [activeFilter, setActiveFilter] = useState("ALL")
  const initiatePaymentMutation = useMutation({
    mutationFn: initiateAppointmentPaymentAction,
  })

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((left, right) => {
      const leftValue = new Date(left.schedule?.startDateTime ?? left.createdAt ?? 0).getTime()
      const rightValue = new Date(right.schedule?.startDateTime ?? right.createdAt ?? 0).getTime()
      return rightValue - leftValue
    })
  }, [appointments])

  const paidCount = appointments.filter((item) => item.paymentStatus === "PAID").length
  const unpaidCount = appointments.filter((item) => item.paymentStatus !== "PAID" && item.status !== "CANCELED").length
  const upcomingCount = appointments.filter((item) => item.status === "SCHEDULED" || item.status === "INPROGRESS").length
  const completedCount = appointments.filter((item) => item.status === "COMPLETED").length
  const canceledCount = appointments.filter((item) => item.status === "CANCELED").length

  const visibleAppointments = useMemo(() => {
    if (activeFilter === "UPCOMING") {
      return sortedAppointments.filter((item) => item.status === "SCHEDULED" || item.status === "INPROGRESS")
    }
    if (activeFilter === "COMPLETED" || activeFilter === "CANCELED") {
      return sortedAppointments.filter((item) => item.status === activeFilter)
    }
    return sortedAppointments
  }, [activeFilter, sortedAppointments])

  const handlePayNow = async (appointmentId: string) => {
    const result = await initiatePaymentMutation.mutateAsync(appointmentId)

    if (!result.success) {
      toast.error(result.message || "Failed to initiate payment")
      return
    }

    if (!result.data.paymentUrl) {
      toast.error("Payment link is unavailable right now")
      return
    }

    window.location.assign(result.data.paymentUrl)
  }

  return (
    <main className="patient-appointments">
      <header className="patient-appointments-header">
        <div className="patient-appointments-heading">
          <div className="patient-appointments-mark" aria-hidden="true">
            <CalendarDays />
          </div>
          <div>
            <p className="patient-appointments-eyebrow">Your care</p>
            <h1>My appointments</h1>
            <p>Track visits, payment, and follow-up with your care team.</p>
          </div>
        </div>

        <div className="patient-appointment-summary" aria-label="Appointment summary">
          <div><strong>{appointments.length}</strong><span>Total</span></div>
          <div><strong>{upcomingCount}</strong><span>Upcoming</span></div>
          <div><strong>{paidCount}</strong><span>Paid</span></div>
          <div><strong>{unpaidCount}</strong><span>Payment due</span></div>
        </div>
      </header>

      {feedbackType && feedbackMessage && (
        <Alert variant={feedbackType === "error" ? "destructive" : "default"}>
          <AlertCircle className="size-4" />
          <AlertTitle>{feedbackType === "error" ? "Payment update" : "Appointment update"}</AlertTitle>
          <AlertDescription>{feedbackMessage}</AlertDescription>
        </Alert>
      )}

      <section className="patient-appointments-content" aria-label="Appointment list">
        <div className="patient-appointment-toolbar">
          <div className="patient-appointment-filters" role="group" aria-label="Filter appointments">
            {[
              { id: "ALL", label: "All", count: appointments.length },
              { id: "UPCOMING", label: "Upcoming", count: upcomingCount },
              { id: "COMPLETED", label: "Completed", count: completedCount },
              { id: "CANCELED", label: "Canceled", count: canceledCount },
            ].map((filter) => (
              <button
                aria-pressed={activeFilter === filter.id}
                className={`patient-appointment-filter${activeFilter === filter.id ? " active" : ""}`}
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                type="button"
              >
                {filter.label}<span>{filter.count}</span>
              </button>
            ))}
          </div>
          <p className="patient-appointment-results">
            Showing {visibleAppointments.length} of {appointments.length}
          </p>
        </div>

        {visibleAppointments.length === 0 ? (
          <div className="patient-appointments-empty">
            <div className="patient-appointments-mark" aria-hidden="true"><CalendarDays /></div>
            <h2>{appointments.length === 0 ? "No appointments yet" : "No appointments in this view"}</h2>
            <p>
              {appointments.length === 0
                ? "Choose a doctor and an available time to get started."
                : "Try another filter to see more of your care history."}
            </p>
            {appointments.length === 0 && (
              <Button asChild>
                <Link href="/consultation"><UsersRound aria-hidden="true" />Browse doctors</Link>
              </Button>
            )}
          </div>
        ) : (
        <div className="patient-appointment-list">
          {visibleAppointments.map((appointment) => {
            const canPayNow =
              appointment.paymentStatus !== "PAID" && appointment.status !== "CANCELED"
            const doctorInitials = appointment.doctor?.name
              ?.split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("") || "DR"

            return (
              <article className="patient-appointment" key={appointment.id}>
                <header className="patient-appointment-card-header">
                  <div className="patient-appointment-doctor">
                    <Avatar className="patient-appointment-avatar">
                      <AvatarImage src={appointment.doctor?.profilePhoto || undefined} alt={appointment.doctor?.name || "Doctor"} />
                      <AvatarFallback>{doctorInitials}</AvatarFallback>
                    </Avatar>
                    <div className="patient-appointment-doctor-copy">
                      <h2>{appointment.doctor?.name || "Doctor appointment"}</h2>
                      <p>{appointment.doctor?.designation || "Consultation"}</p>
                    </div>
                  </div>

                  <div className="patient-appointment-badges">
                    <Badge className={`patient-appointment-status ${appointment.status?.toLowerCase() || "scheduled"}`} variant="outline">
                      {appointment.status || "SCHEDULED"}
                    </Badge>
                    <Badge className={`patient-appointment-payment ${appointment.paymentStatus?.toLowerCase() || "unpaid"}`} variant="outline">
                      {appointment.paymentStatus || "UNPAID"}
                    </Badge>
                  </div>
                </header>

                <div className="patient-appointment-details">
                  <div className="patient-appointment-detail">
                    <CalendarClock aria-hidden="true" />
                    <div>
                      <span>Appointment time</span>
                      <strong>{formatDateTime(appointment.schedule?.startDateTime)}</strong>
                      <small>Ends {formatDateTime(appointment.schedule?.endDateTime)}</small>
                    </div>
                  </div>
                  <div className="patient-appointment-detail">
                    <CircleDollarSign aria-hidden="true" />
                    <div>
                      <span>Payment</span>
                      <strong>৳{appointment.doctor?.appointmentFee?.toFixed(2) ?? appointment.payment?.amount?.toFixed(2) ?? "0.00"}</strong>
                      <small>Transaction {appointment.payment?.transactionId || "Pending"}</small>
                    </div>
                  </div>
                </div>

                <footer className="patient-appointment-footer">
                  <span className="patient-appointment-id">ID · {appointment.id}</span>
                  <div className="patient-appointment-actions">
                  <Button asChild variant="outline">
                    <Link href={`/consultation/doctor/${appointment.doctorId || appointment.doctor?.id || ""}`}>
                      View Doctor
                    </Link>
                  </Button>

                  {canPayNow ? (
                    <Button
                      type="button"
                      onClick={() => void handlePayNow(appointment.id)}
                      disabled={initiatePaymentMutation.isPending}
                    >
                      <CreditCard className="size-4" />
                      {initiatePaymentMutation.isPending ? "Redirecting..." : "Pay Now"}
                    </Button>
                  ) : (
                    <Button type="button" variant="secondary" disabled>
                      {appointment.paymentStatus === "PAID" ? "Paid" : "Unavailable"}
                    </Button>
                  )}
                  </div>
                </footer>
              </article>
            )
          })}
        </div>
        )}
      </section>
    </main>
  )
}

export default PatientAppointmentsList