import { FileText } from "lucide-react";

export default function AdminsPrescriptionsManagementLoading() {
  return (
    <div className="doctor-management" aria-busy="true" aria-label="Loading prescriptions">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><FileText /></div>
        <div>
          <p className="doctor-management-eyebrow">Care records</p>
          <h1>Prescriptions</h1>
          <p className="doctor-management-description">
            Review patient instructions, follow-ups, and prescription documents.
          </p>
        </div>
      </header>
      <div className="doctor-management-table">
        <div className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="flex h-11 items-center gap-6 bg-[#f3f7f4] px-4">
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-32 rounded-full bg-[#dce7df]" />
            <span className="h-3 w-24 rounded-full bg-[#dce7df]" />
          </div>
          <div className="divide-y divide-[#edf2ee]">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="flex h-18 items-center gap-6 px-4" key={index}>
                {[0, 1].map((identity) => (
                  <div className="flex min-w-44 flex-1 items-center gap-3" key={identity}>
                    <span className="h-9 w-9 shrink-0 rounded-full bg-[#edf2ee]" />
                    <span className="grid w-32 gap-2">
                      <span className="h-3 w-full rounded-full bg-[#edf2ee]" />
                      <span className="h-2.5 w-4/5 rounded-full bg-[#f3f7f4]" />
                    </span>
                  </div>
                ))}
                <span className="h-3 w-32 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-24 rounded-full bg-[#edf2ee]" />
                <span className="h-3 w-20 rounded-full bg-[#edf2ee]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
