"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updatePatient } from "@/services/patient.services";
import { IPatient } from "@/types/patient.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditPatientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: IPatient | null;
}

const EditPatientFormModal = ({ open, onOpenChange, patient }: EditPatientFormModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!open || !patient) return;
    setName(patient.name);
    setContactNumber(patient.contactNumber ?? "");
    setAddress(patient.address ?? "");
  }, [open, patient]);

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!patient) throw new Error("Patient not found");
      return updatePatient(String(patient.id), {
        patientInfo: {
          name: name.trim(),
          contactNumber: contactNumber.trim(),
          address: address.trim(),
        },
      });
    },
    onSuccess: () => {
      toast.success("Patient updated successfully");
      onOpenChange(false);
      void queryClient.invalidateQueries({ queryKey: ["patients"] });
      void queryClient.invalidateQueries({ queryKey: ["patient-details", patient?.id] });
      router.refresh();
    },
    onError: () => toast.error("Could not update patient. Please try again."),
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="doctor-form-dialog doctor-edit-dialog max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)]">
        <DialogHeader className="doctor-dialog-header border-b px-6 py-5 pr-14">
          <DialogTitle className="doctor-dialog-title">Edit patient</DialogTitle>
          <DialogDescription className="doctor-dialog-description">
            Update the patient’s contact details. Account email cannot be changed here.
          </DialogDescription>
        </DialogHeader>

        <div className="doctor-form-body">
          <form className="doctor-form space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="patient-name">Full name</Label>
              <Input id="patient-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="patient-email">Email</Label>
              <Input id="patient-email" value={patient?.email ?? ""} readOnly disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="patient-contact">Contact number</Label>
              <Input id="patient-contact" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} maxLength={20} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="patient-address">Address</Label>
              <Textarea id="patient-address" value={address} onChange={(event) => setAddress(event.target.value)} maxLength={200} rows={3} />
            </div>
            <div className="doctor-form-footer flex items-center justify-end gap-3 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={updateMutation.isPending}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={updateMutation.isPending || !name.trim()}>
                {updateMutation.isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPatientFormModal;