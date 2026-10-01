"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type IDoctorDetails, type IDoctorScheduleItem } from "@/types/doctor.types"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight, CalendarDays, Clock3 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface DoctorAppointmentSelectionProps {
  doctor: IDoctorDetails
  isAuthenticated: boolean
  viewerRole?: string | null
}

const getInitials = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "DR"

const getScheduleDateKey = (value: string | Date) => format(new Date(value), "yyyy-MM-dd")

const DoctorAppointmentSelection = ({
  doctor,
  isAuthenticated,
  viewerRole,
}: DoctorAppointmentSelectionProps) => {
  const router = useRouter()

  const availableSchedules = useMemo<IDoctorScheduleItem[]>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return (doctor.doctorSchedules ?? [])
      .filter((item) => {
        if (item.isBooked || !item.schedule?.id || !item.schedule.startDateTime) {
          return false
        }

        const start = new Date(item.schedule.startDateTime)
        return !Number.isNaN(start.getTime()) && start >= today
      })
      .sort((left, right) =>
        new Date(left.schedule?.startDateTime ?? 0).getTime() -
        new Date(right.schedule?.startDateTime ?? 0).getTime(),
      )
  }, [doctor.doctorSchedules])

  const dates = useMemo(() => {
    const grouped = new Map<string, IDoctorScheduleItem[]>()

    for (const schedule of availableSchedules) {
      const start = schedule.schedule?.startDateTime
      if (!start) continue

      const key = getScheduleDateKey(start)
      const slots = grouped.get(key) ?? []
      slots.push(schedule)
      grouped.set(key, slots)
    }

    return Array.from(grouped, ([key, schedules]) => ({ key, schedules }))
  }, [availableSchedules])

  const [selectedDateKey, setSelectedDateKey] = useState(() => dates[0]?.key ?? "")
  const [selectedScheduleId, setSelectedScheduleId] = useState("")
  const selectedDate = dates.find((date) => date.key === selectedDateKey)
  const selectedSchedule = selectedDate?.schedules.find(
    (item) => item.schedule?.id === selectedScheduleId,
  )

  const handleContinue = () => {
    if (!selectedScheduleId) {
      toast.error("Choose an appointment time to continue")
      return
    }

    const confirmationPath = `/dashboard/book-appointments?doctorId=${encodeURIComponent(String(doctor.id))}&scheduleId=${encodeURIComponent(selectedScheduleId)}`

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(confirmationPath)}`)
      return
    }

    if (viewerRole && viewerRole !== "PATIENT") {
      toast.error("Only patient accounts can book appointments")
      return
    }

    router.push(confirmationPath)
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      

      <header className="flex flex-col gap-5 border-b pb-6 sm:flex-row sm:items-center">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-xl font-semibold text-emerald-800">
          {doctor.profilePhoto ? (
            <Image src={doctor.profilePhoto} alt={doctor.name} fill unoptimized className="object-cover" />
          ) : (
            getInitials(doctor.name)
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-2xl font-semibold">{doctor.name}</h1>
            <Badge variant="secondary">Appointment booking</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
          <p className="text-sm font-medium text-emerald-800">
            {doctor.designation}{doctor.specialties.length ? `, ${doctor.specialties.map((item) => item.specialty.title).join(", ")}` : ""}
          </p>
          {doctor.currentWorkingPlace && (
            <p className="text-sm text-muted-foreground">{doctor.currentWorkingPlace}</p>
          )}
        </div>
        <div className="border-t pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <p className="text-xs text-muted-foreground">Consultation fee</p>
          <p className="text-xl font-semibold">৳{doctor.appointmentFee.toFixed(2)}</p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr_0.9fr]">
        <section aria-labelledby="appointment-date-heading">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-5 text-emerald-700" />
            <h2 id="appointment-date-heading" className="text-lg font-semibold">Choose appointment date</h2>
          </div>
          {dates.length === 0 ? (
            <p className="border-y py-5 text-sm text-muted-foreground">
              No available appointments from today onward.
            </p>
          ) : (
            <div className="divide-y border-y">
              {dates.map(({ key, schedules }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selectedDateKey === key}
                  onClick={() => {
                    setSelectedDateKey(key)
                    setSelectedScheduleId("")
                  }}
                  className={`flex w-full items-center justify-between gap-3 py-4 text-left transition ${selectedDateKey === key ? "text-emerald-800" : "hover:text-emerald-700"}`}
                >
                  <span className="font-medium">{format(new Date(`${key}T00:00:00`), "EEE, MMM d, yyyy")}</span>
                  <span className="text-xs text-muted-foreground">{schedules.length} {schedules.length === 1 ? "time" : "times"}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="appointment-time-heading">
          <div className="mb-4 flex items-center gap-2">
            <Clock3 aria-hidden="true" className="size-5 text-emerald-700" />
            <h2 id="appointment-time-heading" className="text-lg font-semibold">Choose appointment time</h2>
          </div>
          {!selectedDate ? (
            <p className="border-y py-5 text-sm text-muted-foreground">No appointment times available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 border-y py-4 sm:grid-cols-3">
              {selectedDate.schedules.map((item) => {
                const scheduleId = item.schedule?.id ?? ""
                const start = item.schedule?.startDateTime
                const end = item.schedule?.endDateTime
                const isSelected = selectedScheduleId === scheduleId

                return (
                  <button
                    key={scheduleId}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedScheduleId(scheduleId)}
                    className={`min-h-11 rounded-md border px-3 py-2 text-sm font-medium transition ${isSelected ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "hover:border-emerald-600 hover:bg-emerald-50/60"}`}
                  >
                    {start ? format(new Date(start), "h:mm a") : "Time unavailable"}
                    {end && <span className="block text-xs font-normal text-muted-foreground">to {format(new Date(end), "h:mm a")}</span>}
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <aside className="self-start border-t pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <h2 className="text-lg font-semibold">Appointment details</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Doctor</span>
              <span className="text-right font-medium">{doctor.name}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Date</span>
              <span className="text-right font-medium">
                {selectedSchedule?.schedule?.startDateTime
                  ? format(new Date(selectedSchedule.schedule.startDateTime), "EEE, MMM d, yyyy")
                  : "Select a date"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Time</span>
              <span className="text-right font-medium">
                {selectedSchedule?.schedule?.startDateTime
                  ? format(new Date(selectedSchedule.schedule.startDateTime), "h:mm a")
                  : "Select a time"}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-t pt-3">
              <span className="text-muted-foreground">Fee</span>
              <span className="font-semibold">৳{doctor.appointmentFee.toFixed(2)}</span>
            </div>
          </div>
          <Button type="button" className="mt-5 w-full" disabled={!selectedScheduleId} onClick={handleContinue}>
            Continue to confirmation
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
          {!isAuthenticated && (
            <p className="mt-2 text-xs text-muted-foreground">You’ll be asked to log in before confirming.</p>
          )}
        </aside>
      </div>
    </main>
  )
}

export default DoctorAppointmentSelection