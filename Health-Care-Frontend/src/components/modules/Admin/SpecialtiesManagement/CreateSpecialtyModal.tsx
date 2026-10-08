"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpecialtyAction } from "@/app/(dashboardLayout)/admin/dashboard/specialties-management/_action";
import { toast } from "sonner";
import { Upload, Stethoscope, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface CreateSpecialtyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSpecialtyModal({
  open,
  onOpenChange,
}: CreateSpecialtyModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createSpecialtyAction,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a specialty title");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    if (description.trim()) {
      formData.append("description", description.trim());
    }
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const result = await mutateAsync(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to create specialty");
        return;
      }

      toast.success("Specialty created successfully");
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      router.refresh();
      
      // Reset Form State
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setPreviewUrl(null);
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create specialty");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="doctor-form-dialog specialty-create-dialog max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] gap-0 overflow-y-auto p-0 sm:w-[calc(100vw-3rem)] sm:max-w-[min(92vw,36rem)]">
        <DialogHeader className="doctor-dialog-header border-b px-6 py-5 pr-14">
          <div className="flex items-center gap-3">
            <div className="specialty-dialog-mark" aria-hidden="true">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="doctor-dialog-title">Add Specialty</DialogTitle>
              <DialogDescription className="doctor-dialog-description">
                Add a specialty to the directory with an optional icon.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="doctor-form space-y-5 p-6">
          {/* Title Input */}
          <div className="space-y-1.5">
            <Label htmlFor="specialty-title" className="text-xs font-semibold text-[#1a2d29]">
              Specialty Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="specialty-title"
              type="text"
              placeholder="e.g. Cardiology, Neurology, Orthopedics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-md border-[#e5ebe7] focus:border-[#1f5c4b] focus:ring-[#1f5c4b]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specialty-description" className="text-xs font-semibold text-[#1a2d29]">
              Description
            </Label>
            <Textarea
              id="specialty-description"
              placeholder="Describe the care provided by this specialty"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border-[#e5ebe7] focus:border-[#1f5c4b] focus:ring-[#1f5c4b]"
              rows={3}
            />
          </div>

          {/* Icon Upload Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#1a2d29]">
              Specialty Icon / Image
            </Label>
            
            <div className="specialty-upload-control relative cursor-pointer border border-dashed border-[#d8e3dd] bg-[#f9fbfa] p-5 text-center transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              
              {previewUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-emerald-100 shadow-sm">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-[#1f5c4b]">Change Image</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#7a8c87]">
                  <div className="h-10 w-10 rounded-full bg-[#edf4f0] flex items-center justify-center text-[#1f5c4b]">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium">
                    Click or drag & drop icon image
                  </p>
                  <span className="text-[10px] text-[#9ab0aa]">PNG, JPG, SVG or WEBP up to 5MB</span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
              <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="rounded-md border-[#e5ebe7] text-[#5e716c]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-[#1f5c4b] font-semibold text-white shadow-md shadow-[#1f5c4b]/20 hover:bg-[#184b3d]"
            >
              {isPending ? "Creating..." : "Create Specialty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
