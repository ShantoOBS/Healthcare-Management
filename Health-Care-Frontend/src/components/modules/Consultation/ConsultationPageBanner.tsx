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
    className="relative mt-5 bg-cover bg-center bg-no-repeat"
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

export default ConsultationPageBanner