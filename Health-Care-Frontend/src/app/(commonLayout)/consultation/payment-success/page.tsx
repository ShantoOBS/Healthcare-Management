import { ArrowRight, CheckCircle2, ReceiptText } from "lucide-react"
import Link from "next/link"

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
    <main className="flex min-h-[60vh] m-auto items-center justify-center max-w-7xl  px-4 py-8 sm:px-6 lg:px-8">
      <section className="w-full m-auto max-w-7xl rounded-md border
       border-[#dfeae6] bg-white p-6 shadow-lg shadow-[#1f5c4b]/5 sm:p-8">
        <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#eaf6ef] text-[#1f5c4b]">
          <CheckCircle2 className="size-7" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1f5c4b]">
          Payment successful
        </p>
        <h1 className="mt-3 text-2xl font-bold text-[#1a2d29] sm:text-3xl">
          Your appointment is confirmed.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#5e716c]">
          Your payment went through successfully. You can review your appointment details or continue browsing consultation options.
        </p>

        {(params.appointment_id || params.payment_id) && (
          <div className="mt-6 space-y-3 rounded-md border border-[#e5ebe7] bg-[#f8fbf9] p-4 text-sm text-[#1a2d29]">
            {params.appointment_id && (
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[#5e716c]">
                  <ReceiptText className="size-4" aria-hidden="true" /> Appointment ID
                </span>
                <span className="break-all font-semibold">{params.appointment_id}</span>
              </div>
            )}
            {params.payment_id && (
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-[#5e716c]">
                  <ReceiptText className="size-4" aria-hidden="true" /> Payment ID
                </span>
                <span className="break-all font-semibold">{params.payment_id}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard/my-appointments"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1f5c4b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#184b3d]"
          >
            View appointments <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center rounded-md border border-[#dfeae6] px-4 py-2.5 text-sm font-semibold text-[#1a2d29] transition hover:bg-[#edf5f1]"
          >
            Back to consultation
          </Link>
        </div>
      </section>
    </main>
  )
}

export default PaymentSuccessPage