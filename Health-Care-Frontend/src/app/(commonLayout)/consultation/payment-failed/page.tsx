import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react"
import Link from "next/link"

const PaymentFailedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string
    error?: string
    appointment_id?: string
  }>
}) => {
  const params = await searchParams
  const reason =
    params.message ||
    (params.error === "payment_cancelled"
      ? "Your payment was cancelled. Your appointment may remain available to pay from your appointments list."
      : params.error) ||
    "Your payment could not be completed. Please return to consultation or contact support."

  return (
    <main className="flex min-h-[60vh] m-auto items-center justify-center max-w-7xl  px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full m-auto rounded-md border
       border-[#f1d8d8] bg-white p-6 shadow-lg shadow-red-100/50 sm:p-8">
        <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#d94a4a]">
          <AlertCircle className="size-7" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[#d94a4a]">
          Payment not completed
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[#1a2d29] sm:text-3xl">
          We could not complete your payment.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5e716c]">{reason}</p>
        <div className="mt-6 rounded-md border border-[#f1d8d8] bg-[#fff7f7] p-4 text-sm text-[#6b3a3a]">
          If an appointment was created, you can check its payment status in your appointments list.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f5c4b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184b3d]"
          >
            <RefreshCcw className="size-4" aria-hidden="true" /> Return to consultation
          </Link>
          <Link
            href="/dashboard/my-appointments"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#dfeae6] px-4 py-2.5 text-sm font-semibold text-[#1a2d29] transition hover:bg-[#edf5f1]"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> View appointments
          </Link>
        </div>
      </section>
    </main>
  )
}

export default PaymentFailedPage