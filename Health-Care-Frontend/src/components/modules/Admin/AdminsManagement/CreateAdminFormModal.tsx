"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdmin } from "@/services/admin.services";
import { ICreateAdminPayload } from "@/types/admin.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const CreateAdminFormModal = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const createMutation = useMutation({
    mutationFn: (payload: ICreateAdminPayload) => createAdmin(payload),
    onSuccess: () => {
      toast.success("Admin account created successfully");
      setOpen(false);
      setName("");
      setEmail("");
      setPassword("");
      setContactNumber("");
      void queryClient.invalidateQueries({ queryKey: ["admins"] });
      void queryClient.refetchQueries({ queryKey: ["admins"], type: "active" });
      router.refresh();
    },
    onError: () => toast.error("Could not create the admin account. Check the details and try again."),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedContact = contactNumber.trim();
    createMutation.mutate({
      password,
      admin: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        ...(normalizedContact ? { contactNumber: normalizedContact } : {}),
      },
      role: "ADMIN",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="shrink-0">
          <Plus aria-hidden="true" className="size-4" />
          Create Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="doctor-form-dialog doctor-create-dialog max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-hidden p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-3rem)]">
        <DialogHeader className="doctor-dialog-header border-b px-6 py-5 pr-14">
          <DialogTitle className="doctor-dialog-title">Create admin</DialogTitle>
          <DialogDescription className="doctor-dialog-description">
            Add an administrator account with a temporary password.
          </DialogDescription>
        </DialogHeader>
        <div className="doctor-form-body">
          <form className="doctor-form space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="new-admin-name">Full name</Label>
              <Input
                id="new-admin-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                minLength={5}
                maxLength={30}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-admin-email">Email</Label>
              <Input
                id="new-admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-admin-password">Temporary password</Label>
              <Input
                id="new-admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                maxLength={20}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-admin-contact">Contact number <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="new-admin-contact"
                type="tel"
                value={contactNumber}
                onChange={(event) => setContactNumber(event.target.value)}
                minLength={11}
                maxLength={14}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-admin-role">Role</Label>
              <Input id="new-admin-role" value="Admin" readOnly disabled />
            </div>
            <div className="doctor-form-footer flex items-center justify-end gap-3 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={createMutation.isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdminFormModal;