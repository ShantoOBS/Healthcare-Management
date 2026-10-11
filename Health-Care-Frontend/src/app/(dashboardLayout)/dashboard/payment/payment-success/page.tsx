import Link from "next/link"
import { CheckCircle2, ArrowRight, ReceiptText } from "lucide-react"

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    appointment_id?: string
    payment_id?: string
  }>
}) => {
  const params = await searchParams

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border border-[#dfeae6] bg-white p-8 shadow-xl shadow-[#1f5c4b]/5">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#eaf6ef] text-[#1f5c4b]">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f5c4b]">
          Payment successful
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#1a2d29]">
          Your appointment has been confirmed.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5e716c]">
          Your payment went through successfully. You can now manage your appointments,
          view confirmation details, and continue with your care plan.
        </p>

        {(params.appointment_id || params.payment_id) && (
          <div className="mt-6 space-y-3 rounded-xl border border-[#e5ebe7] bg-[#f8fbf9] p-4 text-sm text-[#1a2d29]">
            {params.appointment_id && (
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[#5e716c]">
                  <ReceiptText className="h-4 w-4" />
                  Appointment ID
                </span>
                <span className="font-semibold break-all">{params.appointment_id}</span>
              </div>
            )}

            {params.payment_id && (
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[#5e716c]">
                  <ReceiptText className="h-4 w-4" />
                  Payment ID
                </span>
                <span className="font-semibold break-all">{params.payment_id}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/my-appointments"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f5c4b] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#1f5c4b]/20 transition hover:bg-[#184b3d]"
          >
            View appointments
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md border border-[#dfeae6] bg-white px-4 py-2.5 text-sm font-semibold text-[#1a2d29] transition hover:bg-[#edf5f1]"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
