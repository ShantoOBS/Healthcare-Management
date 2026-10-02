"use client"

import {
  bookAppointmentAction,
  bookAppointmentWithPayLaterAction,
} from "@/app/_actions/appointment.actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { differenceInMinutes, format } from "date-fns"
import { AlertCircle, ArrowLeft, CalendarClock, Check, CreditCard, MapPin, ShieldCheck, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface AppointmentBookingConfirmationProps {
  doctorId: string
  scheduleId: string
  doctorName: string
  doctorDesignation?: string
  doctorProfilePhoto?: string
  doctorWorkingPlace?: string
  appointmentFee?: number
  scheduleStart?: string | Date
  scheduleEnd?: string | Date
  isScheduleAvailable: boolean
}

const formatDateTime = (value?: string | Date) => {
  if (!value) {
    return "N/A"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A"
  }

  return format(dateValue, "EEEE, MMM dd, yyyy • hh:mm a")
}

const getInitials = (name: string) => {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "DR"
}

const getDuration = (start?: string | Date, end?: string | Date) => {
  if (!start || !end) return null
  const minutes = differenceInMinutes(new Date(end), new Date(start))
  return minutes > 0 ? `${minutes} min` : null
}

const AppointmentBookingConfirmation = ({
  doctorId,
  scheduleId,
  doctorName,
  doctorDesignation,
  doctorProfilePhoto,
  doctorWorkingPlace,
  appointmentFee,
  scheduleStart,
  scheduleEnd,
  isScheduleAvailable,
}: AppointmentBookingConfirmationProps) => {
  const router = useRouter()

  const payNowMutation = useMutation({
    mutationFn: bookAppointmentAction,
  })

  const payLaterMutation = useMutation({
    mutationFn: bookAppointmentWithPayLaterAction,
  })

  const handlePayNow = async () => {
    const result = await payNowMutation.mutateAsync({ doctorId, scheduleId })

    if (!result.success) {
      toast.error(result.message || "Failed to book appointment")
      return
    }

    if (!result.data.paymentUrl) {
      toast.error("Payment link is unavailable right now")
      return
    }

    window.location.assign(result.data.paymentUrl)
  }

  const handlePayLater = async () => {
    const result = await payLaterMutation.mutateAsync({ doctorId, scheduleId })

    if (!result.success) {
      toast.error(result.message || "Failed to book appointment")
      return
    }

    router.push("/dashboard/my-appointments?status=pay_later_booked")
    router.refresh()
  }

  if (!isScheduleAvailable) {
    return (
      <main className="appointment-checkout">
        <header className="appointment-checkout-heading">
          <p className="appointment-checkout-eyebrow">Appointment booking</p>
          <h1>Confirm your appointment</h1>
          <p>Review your visit details and choose a payment option.</p>
        </header>
        <section className="appointment-unavailable">
          <div className="appointment-unavailable-mark" aria-hidden="true">
            <AlertCircle />
          </div>
          <div>
            <h2>Selected slot is no longer available</h2>
            <p>
            This schedule may already be booked or may have moved out of the available range.
            </p>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Choose another slot</AlertTitle>
            <AlertDescription>
              Go back to the consultation page or the doctor details page and select a different appointment time.
            </AlertDescription>
          </Alert>
          <div className="appointment-unavailable-actions">
            <Button asChild variant="outline">
              <Link href="/consultation">Back to consultation</Link>
            </Button>
            <Button asChild>
              <Link href={`/consultation/doctor/${doctorId}`}>Open doctor details</Link>
            </Button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="appointment-checkout">
      <header className="appointment-checkout-heading">
        <div>
          <p className="appointment-checkout-eyebrow">Appointment booking</p>
          <h1>Confirm your appointment</h1>
          <p>Review the selected visit, then choose how you’d like to pay.</p>
        </div>
        <div className="appointment-checkout-progress" aria-label="Booking progress">
          <div className="complete"><span><Check aria-hidden="true" /></span><small>Choose a slot</small></div>
          <i aria-hidden="true" />
          <div className="current"><span>2</span><small>Confirm booking</small></div>
        </div>
      </header>

      <div className="appointment-checkout-layout">
        <section className="appointment-review-panel">
          <div className="appointment-section-heading">
            <span>01</span>
            <div>
              <h2>Doctor and schedule</h2>
              <p>Check the details for your visit.</p>
            </div>
          </div>

          <div className="appointment-doctor-summary">
              <Avatar className="appointment-doctor-avatar">
                <AvatarImage src={doctorProfilePhoto} alt={doctorName} />
                <AvatarFallback>{getInitials(doctorName)}</AvatarFallback>
              </Avatar>

              <div className="appointment-doctor-copy">
                <p className="appointment-detail-label">Your doctor</p>
                <h3>{doctorName}</h3>
                <p>{doctorDesignation || "Medical practitioner"}</p>
                {doctorWorkingPlace && (
                  <span><MapPin aria-hidden="true" />{doctorWorkingPlace}</span>
                )}
              </div>
              <div className="appointment-verified-mark" title="Selected doctor">
                <ShieldCheck aria-hidden="true" />
              </div>
          </div>

          <div className="appointment-time-summary">
            <div className="appointment-time-icon" aria-hidden="true"><CalendarClock /></div>
            <div className="appointment-time-main">
              <p className="appointment-detail-label">Appointment time</p>
              <strong>{formatDateTime(scheduleStart)}</strong>
              <span>Ends {formatDateTime(scheduleEnd)}</span>
            </div>
            {getDuration(scheduleStart, scheduleEnd) && (
              <div className="appointment-duration">
                <span>Duration</span>
                <strong>{getDuration(scheduleStart, scheduleEnd)}</strong>
              </div>
            )}
          </div>

          <div className="appointment-booking-note">
            <span aria-hidden="true">i</span>
            <p>Your appointment will be reserved once you confirm one of the payment options.</p>
          </div>
        </section>

        <aside className="appointment-payment-panel">
          <div className="appointment-section-heading">
            <span>02</span>
            <div>
              <h2>Payment summary</h2>
              <p>Choose a payment option.</p>
            </div>
          </div>

          <div className="appointment-fee-summary">
            <span>Consultation fee</span>
            <strong>৳{appointmentFee?.toFixed(2) ?? "0.00"}</strong>
            <small>Bangladeshi Taka (BDT)</small>
          </div>

          <div className="appointment-payment-details">
            <div><span>Payment now</span><strong>৳{appointmentFee?.toFixed(2) ?? "0.00"}</strong></div>
            <div><span>Payment processing</span><strong>Secure checkout</strong></div>
          </div>

          <div className="appointment-payment-actions">
            <Button
              type="button"
              className="appointment-pay-now w-full"
              onClick={() => void handlePayNow()}
              disabled={payNowMutation.isPending || payLaterMutation.isPending}
            >
              <CreditCard className="size-4" />
              {payNowMutation.isPending ? "Redirecting to Payment..." : "Confirm & Pay Now"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="appointment-pay-later w-full"
              onClick={() => void handlePayLater()}
              disabled={payNowMutation.isPending || payLaterMutation.isPending}
            >
              <Wallet className="size-4" />
              {payLaterMutation.isPending ? "Booking..." : "Book & Pay Later"}
            </Button>

            <Button asChild variant="ghost" className="appointment-back-link w-full">
              <Link href={`/consultation/doctor/${doctorId}`}><ArrowLeft aria-hidden="true" />Back to doctor details</Link>
            </Button>
          </div>

          <p className="appointment-secure-note"><ShieldCheck aria-hidden="true" />Secure payment powered by Stripe</p>
        </aside>
      </div>
    </main>
  )
}

export default AppointmentBookingConfirmation