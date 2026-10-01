
import ConsultationPageBanner from "@/components/modules/Consultation/ConsultationPageBanner"
import { getAllSpecialties } from "@/services/specialty.services"
import { ArrowUpRight, Stethoscope } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const DepartmentPage = async () => {
  let specialties = await getAllSpecialties()
    .then((response) => response.data)
    .catch(() => null)

  return (
    <>
      <ConsultationPageBanner
        title="Departments"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Departments" },
        ]}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#dce7df] pb-5">
          <div>
            <p className="text-sm font-medium text-[#4c7664]">Explore our care areas</p>
            <h2 className="mt-1 text-2xl font-semibold text-[#17372d]">Medical specialties</h2>
          </div>
          <p className="text-sm text-[#61736b]">
            {specialties ? `${specialties.length} specialties` : "Specialties unavailable"}
          </p>
        </div>

        {!specialties ? (
          <p role="alert" className="border-y border-[#dce7df] py-6 text-sm text-[#61736b]">
            We couldn&apos;t load the departments right now. Please try again later.
          </p>
        ) : specialties.length === 0 ? (
          <p className="border-y border-[#dce7df] py-6 text-sm text-[#61736b]">
            No departments are available yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((specialty) => (
              <Link
                key={specialty.id}
                href={`/consultation?specialties.specialty.title=${encodeURIComponent(specialty.title)}`}
                className="group flex min-h-48 flex-col border border-[#dce7df] bg-white p-5 transition-colors hover:border-[#4c8a6c] hover:bg-[#f5f8f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#174c3b]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#edf4f0] text-[#1f5c4b]">
                    {specialty.icon ? (
                      <Image src={specialty.icon} alt="" fill unoptimized className="object-contain p-2" />
                    ) : (
                      <Stethoscope aria-hidden="true" className="size-6" />
                    )}
                  </div>
                  <ArrowUpRight aria-hidden="true" className="size-4 text-[#668174] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-[#17372d]">{specialty.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#61736b]">
                  {specialty.description?.trim() || "Explore doctors and care in this specialty."}
                </p>
                <span className="mt-4 text-sm font-semibold text-[#1f5c4b]">Find doctors</span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default DepartmentPage