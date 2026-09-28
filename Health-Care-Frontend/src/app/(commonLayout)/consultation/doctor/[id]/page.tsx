
import BookAppointmentModal from "@/components/modules/Patient/Appointments/BookAppointmentModal"
import DoctorProfileActions from "@/components/modules/Consultation/DoctorProfileActions"
import { Badge } from "@/components/ui/badge"
import { getUserInfo } from "@/services/auth.services"
import { getDoctorById } from "@/services/doctor.services"
import { type IDoctorDetails } from "@/types/doctor.types"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"

const CONSULTATION_BANNER_IMAGE =
  "https://www.squarehospital.com/frontEnd/images/common-banner.jpg"

type BreadcrumbItem = {
  label: string
  href?: string
}

const ConsultationPageBanner = ({
  title,
  breadcrumbs,
}: {
  title: string
  breadcrumbs: BreadcrumbItem[]
}) => (
  <div
    className="relative bg-cover bg-center bg-no-repeat mt-5"
    style={{ backgroundImage: `url(${CONSULTATION_BANNER_IMAGE})` }}
  >
    <div className="absolute inset-0 bg-linear-to-r from-[#1f5c4b]/90 via-[#184b3d]/80 to-[#1f5c4b]/75" />
    <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/90 md:justify-end"
        >
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 && <span className="text-white/60">/</span>}
              {item.href ? (
                <Link href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-white">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  </div>
)

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

const getSpecialtySummary = (doctorDetails: IDoctorDetails) => {
  const specialtyTitles = (doctorDetails.specialties ?? [])
    .map((item) => item.specialty.title)
    .filter(Boolean)

  const designation = doctorDetails.designation?.trim()

  if (designation && specialtyTitles.length > 0) {
    return `${designation}, ${specialtyTitles.join(", ")}`
  }

  if (designation) {
    return designation
  }

  if (specialtyTitles.length > 0) {
    return specialtyTitles.join(", ")
  }

  return "N/A"
}

const buildDoctorBioParagraphs = (doctorDetails: IDoctorDetails) => {
  const paragraphs: string[] = []
  const specialtySummary = getSpecialtySummary(doctorDetails)
  const workplace = doctorDetails.currentWorkingPlace?.trim()
  const qualification = doctorDetails.qualification?.trim()
  const registrationNumber = doctorDetails.registrationNumber?.trim()
  const experience = doctorDetails.experience ?? 0
  const appointmentFee = doctorDetails.appointmentFee?.toFixed(2) ?? "N/A"
  const averageRating = doctorDetails.averageRating?.toFixed(1) ?? "0.0"
  const email = doctorDetails.email?.trim()
  const contactNumber = doctorDetails.contactNumber?.trim()
  const address = doctorDetails.address?.trim()
  const gender = doctorDetails.gender?.replace(/_/g, " ").toLowerCase()

  paragraphs.push(
    `${doctorDetails.name} is a ${specialtySummary !== "N/A" ? specialtySummary.toLowerCase() : "healthcare professional"}${workplace ? ` currently serving at ${workplace}` : ""}.`,
  )

  if (qualification || registrationNumber) {
    const qualificationPart = qualification
      ? `holds the qualification ${qualification}`
      : "is a registered medical professional"
    const registrationPart = registrationNumber
      ? ` with registration number ${registrationNumber}`
      : ""

    paragraphs.push(
      `${doctorDetails.name} ${qualificationPart}${registrationPart}.`,
    )
  }

  paragraphs.push(
    `With ${experience} ${experience === 1 ? "year" : "years"} of professional experience, ${doctorDetails.name} provides consultation services at an appointment fee of $${appointmentFee} and maintains an average patient rating of ${averageRating} out of 5.`,
  )

  const contactDetails = [email, contactNumber].filter(Boolean)
  if (contactDetails.length > 0 || address || gender) {
    const contactPart = contactDetails.length > 0
      ? `Patients can reach out via ${contactDetails.join(" or ")}`
      : "Patients can contact the clinic for appointments"
    const addressPart = address ? ` at ${address}` : ""
    const genderPart = gender ? ` Gender: ${gender}.` : ""

    paragraphs.push(`${contactPart}${addressPart}.${genderPart}`)
  }

  const reviewCount = doctorDetails.reviews?.length ?? 0
  if (reviewCount > 0) {
    paragraphs.push(
      `${doctorDetails.name} has received ${reviewCount} patient ${reviewCount === 1 ? "review" : "reviews"}, reflecting ongoing feedback from people who have consulted with this doctor.`,
    )
  }

  return paragraphs
}

const ConsultationDoctorByIdPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const currentUser = await getUserInfo()

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

            <BookAppointmentModal
              doctorId={String(doctorDetails.id)}
              doctorName={doctorDetails.name}
              isAuthenticated={Boolean(currentUser)}
              viewerRole={currentUser?.role ?? null}
              triggerLabel="Get Appointment"
              showTriggerIcon={false}
              fullWidth
              triggerClassName="h-11 w-full rounded-md border-0 
               bg-[#4ca27a] cursor-pointer text-white transition hover:bg-[#3f8d68]
               text-sm font-semibold "
            />
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
                <span className="text-[#555555]">{getSpecialtySummary(doctorDetails)}</span>
              </p>
              <p>
                <span className="font-semibold text-[#333333]">Degree -</span>{" "}
                <span className="text-[#555555]">{doctorDetails.qualification || "N/A"}</span>
              </p>
            </div>

            <div className="space-y-4 text-sm leading-7 text-[#555555] sm:text-[15px] sm:leading-8">
              {buildDoctorBioParagraphs(doctorDetails).map((paragraph, index) => (
                <p key={`bio-${index}`}>{paragraph}</p>
              ))}
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