import { CalendarRange } from "lucide-react";

export default function AdminsSchedulesManagementLoading() {
  return (
    <div className="doctor-management" aria-busy="true" aria-label="Loading schedules">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <CalendarRange />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Care operations</p>
          <h1>Schedules</h1>
          <p className="doctor-management-description">
            Manage appointment windows and doctor availability.
          </p>
        </div>
      </header>
      <div className="doctor-management-table">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="flex h-11 items-center gap-6 bg-[#f3f7f4] px-4">
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-20 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-16 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
          </div>
          <div className="divide-y divide-[#edf2ee]">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="flex h-18 items-center gap-6 px-4" key={index}>
                <span className="h-3 w-36 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-36 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-16 rounded-full bg-[#edf2ee]" />
                <span className="h-6 w-20 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-10 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-10 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-24 rounded-full bg-[#edf2ee]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
