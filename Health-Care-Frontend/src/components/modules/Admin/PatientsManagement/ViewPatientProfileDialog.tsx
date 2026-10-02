"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPatientById } from "@/services/patient.services";
import { IPatient } from "@/types/patient.types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface ViewPatientProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: IPatient | null;
}

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not provided";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not provided" : format(date, "MMM dd, yyyy");
};

const ViewPatientProfileDialog = ({
  open,
  onOpenChange,
  patient,
}: ViewPatientProfileDialogProps) => {
  const patientId = patient?.id ?? "";
  const { data, isLoading, isError } = useQuery({
    queryKey: ["patient-details", patientId],
    queryFn: () => getPatientById(patientId),
    enabled: open && patientId.length > 0,
    staleTime: 1000 * 60,
  });
  const details = data?.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="doctor-profile-dialog max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)]">
        <DialogHeader className="doctor-dialog-header border-b px-6 py-5 pr-14">
          <DialogTitle className="doctor-dialog-title">Patient Profile</DialogTitle>
          <DialogDescription className="doctor-dialog-description">
            Contact information, account status, and available health details.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="doctor-dialog-scroll max-h-[calc(90vh-5.5rem)]">
          <div className="space-y-4 px-6 py-5">
            {isLoading && (
              <div className="rounded-lg border border-[#dce7df] p-5 text-sm text-muted-foreground">
                Loading patient profile...
              </div>
            )}
            {isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                Could not load this patient profile. Please try again.
              </div>
            )}
            {details && (
              <>
                <div className="doctor-profile-hero">
                  <div className="doctor-profile-avatar grid place-items-center rounded-full bg-[#e2efe4] font-semibold text-[#174c3b]">
                    {details.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "PT"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="doctor-profile-eyebrow">Patient record</p>
                    <h2 className="doctor-profile-name">{details.name}</h2>
                    <p className="doctor-profile-email">{details.email}</p>
                  </div>
                  <span className="doctor-profile-status rounded-full border px-2.5 py-1 text-xs font-semibold">
                    {details.user.status.toLowerCase()}
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <section className="doctor-profile-section">
                    <h3>Contact details</h3>
                    <div className="doctor-profile-details">
                      <p><span>Phone</span>{details.contactNumber || "Not provided"}</p>
                      <p><span>Address</span>{details.address || "Not provided"}</p>
                      <p><span>Registered</span>{formatDate(details.createdAt)}</p>
                    </div>
                  </section>

                  <section className="doctor-profile-section">
                    <h3>Health details</h3>
                    <div className="doctor-profile-details">
                      <p><span>Gender</span>{details.patientHealthData?.gender || "Not provided"}</p>
                      <p><span>Date of birth</span>{formatDate(details.patientHealthData?.dateOfBirth)}</p>
                      <p><span>Blood group</span>{details.patientHealthData?.bloodGroup || "Not provided"}</p>
                      <p><span>Height / weight</span>{details.patientHealthData?.height || "-"} / {details.patientHealthData?.weight || "-"}</p>
                      <p><span>Allergies</span>{details.patientHealthData?.hasAllergies ? "Reported" : "None reported"}</p>
                      <p><span>Diabetes</span>{details.patientHealthData?.hasDiabetes ? "Reported" : "None reported"}</p>
                    </div>
                  </section>
                </div>

                <section className="doctor-profile-section">
                  <h3>Medical reports</h3>
                  {details.medicalReports?.length ? (
                    <div className="space-y-2">
                      {details.medicalReports.map((report) => (
                        <div className="doctor-profile-record flex items-center justify-between gap-3 text-sm" key={report.id}>
                          <span className="font-medium">{report.reportName}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No medical reports available.</p>
                  )}
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ViewPatientProfileDialog;