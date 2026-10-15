import AppointmentBookingConfirmation from "@/components/modules/Patient/Appointments/AppointmentBookingConfirmation"
import ConsultationPageBanner from "@/components/modules/Consultation/ConsultationPageBanner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { getDoctorById } from "@/services/doctor.services"
import { type IDoctorDetails } from "@/types/doctor.types"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

const ConfirmationPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ scheduleId?: string }>
}) => {
  const [{ id: doctorId }, query] = await Promise.all([params, searchParams])
  const scheduleId = query.scheduleId?.trim() ?? ""

  if (!scheduleId) {
    return (
      <>
        <ConsultationPageBanner
          title="Confirm Appointment"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Find a Doctor", href: "/consultation" },
            { label: "Appointment" },
          ]}
        />
        <section className="mx-auto max-w-5xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Appointment details missing</AlertTitle>
            <AlertDescription>
              Select a doctor and time slot from the consultation pages before confirming a booking.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/consultation">Browse Doctors</Link>
          </Button>
        </section>
      </>
    )
  }

  let doctorDetails: IDoctorDetails | null = null

  try {
    const response = await getDoctorById(doctorId)
    doctorDetails = response.data
  } catch {
    doctorDetails = null
  }

  if (!doctorDetails) {
    return (
      <>
        <ConsultationPageBanner
          title="Confirm Appointment"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Find a Doctor", href: "/consultation" },
            { label: "Appointment" },
          ]}
        />
        <section className="mx-auto space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Doctor details unavailable</AlertTitle>
            <AlertDescription>
              We could not load the selected doctor. Please return to consultation and try again.
            </AlertDescription>
          </Alert>
          <Button asChild>
            <Link href="/consultation">Back to Consultation</Link>
          </Button>
        </section>
      </>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const selectedSchedule = (doctorDetails.doctorSchedules ?? []).find((item) => {
    const startDateTime = item.schedule?.startDateTime

    if (item.isBooked || item.schedule?.id !== scheduleId || !startDateTime) {
      return false
    }

    const parsedDate = new Date(startDateTime)
    return !Number.isNaN(parsedDate.getTime()) && parsedDate >= today
  })

  return (
    <>
      <ConsultationPageBanner
        title="Confirm Appointment"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Find a Doctor", href: "/consultation" },
          { label: doctorDetails.name, href: `/consultation/doctor/${doctorId}` },
          { label: "Appointment" },
        ]}
      />
      <section className=" ">
        <AppointmentBookingConfirmation
          doctorId={doctorId}
          scheduleId={scheduleId}
          doctorName={doctorDetails.name}
          doctorDesignation={doctorDetails.designation}
          doctorProfilePhoto={doctorDetails.profilePhoto}
          doctorWorkingPlace={doctorDetails.currentWorkingPlace}
          appointmentFee={doctorDetails.appointmentFee}
          scheduleStart={selectedSchedule?.schedule?.startDateTime}
          scheduleEnd={selectedSchedule?.schedule?.endDateTime}
          isScheduleAvailable={Boolean(selectedSchedule)}
        />
      </section>
    </>
  )
}

export default ConfirmationPage