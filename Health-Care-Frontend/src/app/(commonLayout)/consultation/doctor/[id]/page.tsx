
import DoctorProfileActions from "@/components/modules/Consultation/DoctorProfileActions"
import ConsultationPageBanner from "@/components/modules/Consultation/ConsultationPageBanner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDoctorById } from "@/services/doctor.services"
import { type IDoctorDetails } from "@/types/doctor.types"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

const formatDateTime = (value?: string | Date | null) => {
  if (!value) {
    return "N/A"
  }

  const dateValue = new Date(value)
  if (Number.isNaN(dateValue.getTime())) {
    return "N/A"
  }

  return format(dateValue, "MMM dd, yyyy hh:mm a")
}

const getInitials = (name?: string) => {
  if (!name) {
    return "DR"
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? "")
    .join("")
}

const getTodayStart = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const getSpecialtyNames = (doctorDetails: IDoctorDetails) => {
  const specialtyTitles = (doctorDetails.specialties ?? [])
    .map((item) => item.specialty.title)
    .filter(Boolean)

  return specialtyTitles.length > 0 ? specialtyTitles.join(", ") : "N/A"
}

const ConsultationDoctorByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  let doctorDetails: IDoctorDetails | null = null
  let errorMessage = ""

  try {
    const response = await getDoctorById(id)
    doctorDetails = response.data
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "response" in error &&
      error.response &&
      typeof error.response === "object" &&
      "data" in error.response &&
      error.response.data &&
      typeof error.response.data === "object" &&
      "message" in error.response.data &&
      typeof error.response.data.message === "string"
    ) {
      errorMessage = error.response.data.message
    } else {
      errorMessage = "Failed to load doctor details"
    }
  }

  if (!doctorDetails) {
    return (
      <>
        <ConsultationPageBanner
          title="Find a Doctor"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Find a Doctor", href: "/consultation" },
            { label: "Doctor Details" },
          ]}
        />
        <section className="mx-auto max-w-7xl space-y-4 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {errorMessage || "Doctor details not available."}
          </div>
        </section>
      </>
    )
  }

  const todayStart = getTodayStart()

  const availableUpcomingSchedules = (doctorDetails.doctorSchedules ?? [])
    .filter((item) => {
      if (item.isBooked) {
        return false
      }

      if (!item.schedule?.startDateTime) {
        return false
      }

      const startDate = new Date(item.schedule.startDateTime)
      if (Number.isNaN(startDate.getTime())) {
        return false
      }

      return startDate >= todayStart
    })
    .sort((a, b) => {
      const leftValue = new Date(a.schedule?.startDateTime ?? 0).getTime()
      const rightValue = new Date(b.schedule?.startDateTime ?? 0).getTime()
      return leftValue - rightValue
    })

  return (
    <>
      <ConsultationPageBanner
        title="Find a Doctor"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Find a Doctor", href: "/consultation" },
          { label: doctorDetails.name },
        ]}
      />

      <section className="mx-auto max-w-7xl space-y-8 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[280px_1fr] lg:grid-cols-[300px_1fr] lg:gap-10">
          <div className="space-y-4">
            <div className="relative aspect-3/4 w-full overflow-hidden bg-[#edf4f0]">
              {doctorDetails.profilePhoto ? (
                <Image
                  src={doctorDetails.profilePhoto}
                  alt={doctorDetails.name}
                  fill
                  unoptimized
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#edf4f0] text-4xl font-bold text-[#1f5c4b]">
                  {getInitials(doctorDetails.name)}
                </div>
              )}
            </div>

            <Button
              asChild
              className="h-11 w-full rounded-md border-0 bg-[#4ca27a] text-sm font-semibold text-white transition hover:bg-[#3f8d68]"
            >
              <Link href={`/consultation/doctor/${doctorDetails.id}/appointment`}>
                Get Appointment
              </Link>
            </Button>
          </div>

          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#b91c1c] sm:text-3xl">{doctorDetails.name}</h2>
              <DoctorProfileActions
                doctorName={doctorDetails.name}
                email={doctorDetails.email}
              />
            </div>

            <div className="space-y-1 text-sm sm:text-[15px]">
              <p>
                <span className="font-semibold text-[#333333]">Specialty -</span>{" "}
                <span className="text-[#555555]">{getSpecialtyNames(doctorDetails)}</span>
              </p>
              <p>
                <span className="font-semibold text-[#333333]">Degree -</span>{" "}
                <span className="text-[#555555]">{doctorDetails.qualification || "N/A"}</span>
              </p>
            </div>

            <div className="whitespace-pre-line text-sm leading-7 text-[#555555] sm:text-[15px] sm:leading-8">
              {doctorDetails.description?.trim() || "No description available."}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-[#e5ebe7] bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">Available Doctor Schedules</h2>
            <Badge variant="secondary">Today onward</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {availableUpcomingSchedules.slice(0, 18).map((item, index) => (
              <div
                key={item.id ?? item.schedule?.id ?? `schedule-${index}`}
                className="rounded-xl border bg-muted/20 p-4 text-sm"
              >
                <p><span className="font-medium">Start:</span> {formatDateTime(item.schedule?.startDateTime)}</p>
                <p><span className="font-medium">End:</span> {formatDateTime(item.schedule?.endDateTime)}</p>
                <p className="pt-1 text-xs text-emerald-700">Available</p>
              </div>
            ))}
            {availableUpcomingSchedules.length === 0 && (
              <p className="text-sm text-muted-foreground">No available schedules from today onward.</p>
            )}
          </div>
        </div>

        <div className="rounded-md border border-[#e5ebe7] bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-[#333333]">Patient Reviews</h2>
          <div className="space-y-3">
            {(doctorDetails.reviews ?? []).map((review, index) => (
              <div key={review.id ?? `review-${index}`} className="rounded-md border border-[#e5ebe7] p-3 text-sm text-[#555555]">
                <p><span className="font-medium">Rating:</span> {review.rating ?? "N/A"} / 5</p>
                <p><span className="font-medium">Comment:</span> {review.comment || "N/A"}</p>
                <p><span className="font-medium">Patient ID:</span> {review.patientId || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(review.createdAt)}</p>
              </div>
            ))}
            {(!doctorDetails.reviews || doctorDetails.reviews.length === 0) && (
              <p className="text-sm text-muted-foreground">No reviews yet.</p>
            )}
          </div>
        </div>

      </section>
    </>
  )
}

export default ConsultationDoctorByIdPage