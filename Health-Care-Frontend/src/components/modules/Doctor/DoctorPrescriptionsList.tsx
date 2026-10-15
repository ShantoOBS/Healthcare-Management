"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMyAppointments } from "@/services/appointment.services";
import {
  createPrescription,
  getMyPrescriptions,
  updatePrescription,
} from "@/services/prescription.services";
import { IMyPrescription } from "@/types/prescription.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowUpRight, FileText, PencilLine, Plus, Stethoscope } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

const formatDate = (value?: string | Date | null) => {
  if (!value) return "Not specified";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not specified" : format(date, "MMM dd, yyyy");
};

const formatAppointmentDate = (value?: string | Date | null) => {
  if (!value) return "Not scheduled";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Not scheduled" : format(date, "MMM dd, yyyy · hh:mm a");
};

type PrescriptionFormState = {
  appointmentId: string;
  instructions: string;
  followUpDate: string;
};

const emptyFormState: PrescriptionFormState = {
  appointmentId: "",
  instructions: "",
  followUpDate: "",
};

const DoctorPrescriptionsList = () => {
  const queryClient = useQueryClient();
  const { data: appointmentsResponse, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ["doctor-my-appointments"],
    queryFn: getMyAppointments,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  const { data: response, isLoading, isError } = useQuery({
    queryKey: ["doctor-my-prescriptions"],
    queryFn: getMyPrescriptions,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 60 * 6,
  });

  const appointments = appointmentsResponse?.data ?? [];
  const prescriptions = response?.data ?? [];
  const prescriptionMap = useMemo(
    () => new Map((prescriptions ?? []).map((item) => [item.appointment?.id ?? "", item])),
    [prescriptions],
  );

  const availableAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "COMPLETED" && !prescriptionMap.has(appointment.id),
      ),
    [appointments, prescriptionMap],
  );

  const [formState, setFormState] = useState<PrescriptionFormState>(emptyFormState);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "update">("create");
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setFormMode("create");
    setSelectedPrescriptionId(null);
    setFormError(null);
    setFormState({
      appointmentId: availableAppointments[0]?.id ?? "",
      instructions: "",
      followUpDate: "",
    });
    setIsFormOpen(true);
  };

  const openUpdateModal = (prescription: IMyPrescription) => {
    setFormMode("update");
    setSelectedPrescriptionId(prescription.id);
    setFormError(null);
    setFormState({
      appointmentId: prescription.appointment?.id ?? "",
      instructions: prescription.instructions ?? "",
      followUpDate: prescription.followUpDate
        ? new Date(prescription.followUpDate).toISOString().slice(0, 10)
        : "",
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setFormError(null);
    setFormState(emptyFormState);
    setSelectedPrescriptionId(null);
  };

  const createMutation = useMutation({
    mutationFn: createPrescription,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctor-my-prescriptions"] });
      await queryClient.invalidateQueries({ queryKey: ["doctor-my-appointments"] });
      closeForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { instructions?: string; followUpDate?: string } }) =>
      updatePrescription(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["doctor-my-prescriptions"] });
      closeForm();
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formState.appointmentId) {
      setFormError("Please select a completed appointment.");
      return;
    }

    if (!formState.instructions.trim()) {
      setFormError("Please add prescription instructions.");
      return;
    }

    const payload = {
      instructions: formState.instructions.trim(),
      ...(formState.followUpDate ? { followUpDate: formState.followUpDate } : {}),
    };

    try {
      if (formMode === "create") {
        await createMutation.mutateAsync({
          appointmentId: formState.appointmentId,
          ...payload,
        });
      } else if (selectedPrescriptionId) {
        await updateMutation.mutateAsync({ id: selectedPrescriptionId, payload });
      }
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "response" in error && error.response && typeof error.response === "object" && "data" in error.response && error.response.data && typeof error.response.data === "object" && "message" in error.response.data && typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Something went wrong while saving the prescription.";

      setFormError(message);
    }
  };

  return (
    <main className="doctor-management doctor-activity-page">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true"><FileText /></div>
        <div>
          <p className="doctor-management-eyebrow">Care records</p>
          <h1>My prescriptions</h1>
          <p className="doctor-management-description">Review prescriptions you have issued to patients.</p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{isLoading ? "—" : prescriptions.length}</strong>
          <span>prescriptions</span>
        </div>
      </header>

      <div className="mb-6 flex justify-end">
        <Button onClick={openCreateModal} className="bg-[#1f5c4b] text-white hover:bg-[#184b3d]" type="button">
          <Plus className="mr-2 h-4 w-4" />
          New prescription
        </Button>
      </div>

      {isError && <p className="doctor-activity-error" role="alert">Prescriptions could not be loaded. Please refresh.</p>}
      {isLoading || isAppointmentsLoading ? (
        <div className="doctor-prescription-list" aria-label="Loading prescriptions">
          {Array.from({ length: 3 }, (_, index) => <div className="doctor-activity-skeleton" key={index} />)}
        </div>
      ) : !isError && prescriptions.length === 0 ? (
        <div className="doctor-activity-empty">
          <Stethoscope aria-hidden="true" />
          <h2>No prescriptions issued</h2>
          <p>Prescriptions you create for patients will appear here.</p>
        </div>
      ) : !isError && (
        <section className="doctor-prescription-list" aria-label="Prescriptions issued by you">
          {prescriptions.map((prescription) => (
            <article className="doctor-prescription-item" key={prescription.id}>
              <header className="doctor-prescription-header">
                <div className="doctor-appointment-main">
                  <div className="doctor-appointment-avatar" aria-hidden="true">
                    {(prescription.patient?.name || "P").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("")}
                  </div>
                  <div className="min-w-0">
                    <span className="doctor-activity-eyebrow">Patient</span>
                    <h2>{prescription.patient?.name || "Patient"}</h2>
                    <p>{prescription.patient?.email || "No email listed"}</p>
                  </div>
                </div>
                <div className="doctor-prescription-dates">
                  <div><span>Issued</span><strong>{formatDate(prescription.createdAt)}</strong></div>
                  <div><span>Follow-up</span><strong>{formatDate(prescription.followUpDate)}</strong></div>
                </div>
              </header>
              <div className="doctor-prescription-instructions">
                <span>Instructions</span>
                <p>{prescription.instructions || "No instructions recorded."}</p>
              </div>
              <footer className="doctor-prescription-footer">
                <span>Prescription · {prescription.id.slice(0, 8)}</span>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => openUpdateModal(prescription)}>
                    <PencilLine className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                  {prescription.pdfUrl ? (
                    <Button asChild variant="outline" size="sm">
                      <a href={prescription.pdfUrl} target="_blank" rel="noreferrer">
                        View PDF <ArrowUpRight aria-hidden="true" />
                      </a>
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">PDF unavailable</span>
                  )}
                </div>
              </footer>
            </article>
          ))}
        </section>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f5c4b]">
                  {formMode === "create" ? "New" : "Update"}
                </p>
                <h2 className="text-2xl font-bold text-[#1a2d29]">
                  {formMode === "create" ? "Create prescription" : "Update prescription"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="text-lg font-semibold text-[#5e716c] hover:text-[#1a2d29]"
                aria-label="Close form"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1a2d29]">Appointment</label>
                <Select
                  value={formState.appointmentId || undefined}
                  onValueChange={(value) =>
                    setFormState((current) => ({ ...current, appointmentId: value }))
                  }
                  disabled={formMode === "update"}
                >
                  <SelectTrigger className="h-10 w-full cursor-pointer rounded-md border-[#dfeae6] bg-white text-sm text-[#1a2d29] transition hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b]">
                    <SelectValue placeholder="Select a completed appointment" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md border-[#e5ebe7] bg-white shadow-lg">
                    {(formMode === "create" ? availableAppointments : appointments)
                      .filter((appointment) => appointment.id === formState.appointmentId || appointment.status === "COMPLETED")
                      .map((appointment) => (
                      <SelectItem
                        key={appointment.id}
                        value={appointment.id}
                        className="cursor-pointer rounded-sm text-sm focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b]"
                      >
                        {appointment.patient?.name || "Patient"} · {formatAppointmentDate(appointment.schedule?.startDateTime)}
                      </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1a2d29]">Instructions</label>
                <textarea
                  rows={6}
                  value={formState.instructions}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, instructions: event.target.value }))
                  }
                  placeholder="Write medication instructions, dosage, and advice for the patient..."
                  className="w-full rounded-md border border-[#dfeae6] bg-white px-3 py-2 text-sm text-[#1a2d29] outline-none transition focus:border-[#1f5c4b]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1a2d29]">Follow-up date</label>
                <DatePicker
                  value={formState.followUpDate}
                  onChange={(value) =>
                    setFormState((current) => ({ ...current, followUpDate: value }))
                  }
                  placeholder="Select follow-up date"
                />
              </div>

              {formError && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1f5c4b] text-white hover:bg-[#184b3d]"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? formMode === "create"
                      ? "Creating..."
                      : "Updating..."
                    : formMode === "create"
                      ? "Create prescription"
                      : "Update prescription"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default DoctorPrescriptionsList;