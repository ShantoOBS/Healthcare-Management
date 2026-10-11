import Link from "next/link"
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react"

const PaymentFailedPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string
    error?: string
  }>
}) => {
  const params = await searchParams
  const reason =
    params.message ||
    params.error ||
    "Your payment could not be completed. Please try again or contact support."

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-[#f1d8d8] bg-white p-8 shadow-xl shadow-red-100/50">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f1] text-[#d94a4a]">
          <AlertCircle className="h-8 w-8" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d94a4a]">
          Payment failed
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#1a2d29]">
          We could not complete your payment.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5e716c]">{reason}</p>

        <div className="mt-6 rounded-xl border border-[#f1d8d8] bg-[#fff7f7] p-4 text-sm text-[#6b3a3a]">
          Your appointment is not confirmed yet. Please try a fresh payment or contact our
          support team for help.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/my-appointments"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f5c4b] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#1f5c4b]/20 transition hover:bg-[#184b3d]"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-[#dfeae6] bg-white px-4 py-2.5 text-sm font-semibold text-[#1a2d29] transition hover:bg-[#edf5f1]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentFailedPage
