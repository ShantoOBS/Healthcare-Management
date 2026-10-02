import { UsersRound } from "lucide-react";

export default function AdminsPatientsManagementLoading() {
  return (
    <div className="doctor-management" aria-busy="true" aria-label="Loading patients">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <UsersRound />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Patient directory</p>
          <h1>Patients</h1>
          <p className="doctor-management-description">
            Review patient contact details and account status.
          </p>
        </div>
      </header>

      <div className="doctor-management-table">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="flex h-11 items-center gap-6 bg-[#f3f7f4] px-4">
            <span className="h-3 w-28 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-20 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
          </div>
          <div className="divide-y divide-[#edf2ee]">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="flex h-18 items-center gap-6 px-4" key={index}>
                <div className="flex min-w-56 flex-1 items-center gap-3">
                  <span className="h-10 w-10 shrink-0 rounded-full bg-[#edf2ee]" />
                  <span className="grid w-36 gap-2">
                    <span className="h-3 w-full rounded-full bg-[#edf2ee]" />
                    <span className="h-2.5 w-4/5 rounded-full bg-[#f3f7f4]" />
                  </span>
                </div>
                <span className="h-3 w-32 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-40 rounded-full bg-[#edf2ee]" />
                <span className="h-6 w-16 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-24 rounded-full bg-[#edf2ee]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
