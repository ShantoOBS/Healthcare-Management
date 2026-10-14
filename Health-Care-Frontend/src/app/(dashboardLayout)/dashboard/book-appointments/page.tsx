import { redirect } from "next/navigation"

const BookAppointmentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ doctorId?: string; scheduleId?: string }>
}) => {
  const params = await searchParams
  const doctorId = params.doctorId?.trim() ?? ""
  const scheduleId = params.scheduleId?.trim() ?? ""

  if (!doctorId || !scheduleId) {
    redirect("/consultation")
  }

  redirect(`/consultation/doctor/${encodeURIComponent(doctorId)}/appointment/confirmation?scheduleId=${encodeURIComponent(scheduleId)}`)
}

export default BookAppointmentsPage