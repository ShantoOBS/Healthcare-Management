import DoctorAppointmentSelection from "@/components/modules/Consultation/DoctorAppointmentSelection"
import ConsultationPageBanner from "@/components/modules/Consultation/ConsultationPageBanner"
import { getUserInfo } from "@/services/auth.services"
import { getDoctorById } from "@/services/doctor.services"

const getDoctorLoadErrorMessage = (error: unknown) => {
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
    return error.response.data.message
  }

  return "Failed to load doctor details"
}

const DoctorAppointmentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  let errorMessage = ""
  const [doctorResponse, currentUser] = await Promise.all([
    getDoctorById(id).catch((error: unknown) => {
      errorMessage = getDoctorLoadErrorMessage(error)
      return null
    }),
    getUserInfo(),
  ])

  const doctor = doctorResponse?.data
  if (!doctor) {
    return (
      <>
        <ConsultationPageBanner
          title="Book an Appointment"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Find a Doctor", href: "/consultation" },
            { label: "Appointment" },
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

  return (
    <>
      <ConsultationPageBanner
        title="Book an Appointment"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Find a Doctor", href: "/consultation" },
          { label: doctor.name, href: `/consultation/doctor/${doctor.id}` },
          { label: "Appointment" },
        ]}
      />
      <DoctorAppointmentSelection
        doctor={doctor}
        isAuthenticated={Boolean(currentUser)}
        viewerRole={currentUser?.role ?? null}
      />
    </>
  )
}

export default DoctorAppointmentPage