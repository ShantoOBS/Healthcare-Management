"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSpecialtyAction } from "@/app/(dashboardLayout)/admin/dashboard/specialties-management/_action";
import { toast } from "sonner";
import { Upload, Stethoscope, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface CreateSpecialtyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSpecialtyModal({
  open,
  onOpenChange,
}: CreateSpecialtyModalProps) {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

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
      
      // Reset Form State
      setTitle("");
      setSelectedFile(null);
      setPreviewUrl(null);
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create specialty");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 bg-white border-[#e5ebe7]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-10 w-10 rounded-2xl bg-[#edf4f0] text-[#1f5c4b] flex items-center justify-center">
              <Stethoscope className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#1a2d29]">Add New Specialty</DialogTitle>
              <p className="text-xs text-[#7a8c87]">Create a medical specialty category</p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
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
              className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b] focus:ring-[#1f5c4b]"
              required
            />
          </div>

          {/* Icon Upload Input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#1a2d29]">
              Specialty Icon / Image
            </Label>
            
            <div className="border-2 border-dashed border-[#d8e3dd] hover:border-[#1f5c4b] rounded-2xl p-4 text-center bg-[#f9fbfa] transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              
              {previewUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden border border-emerald-100 shadow-sm">
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
              className="rounded-xl border-[#e5ebe7] text-[#5e716c]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl bg-[#1f5c4b] hover:bg-[#184b3d] text-white font-semibold shadow-md shadow-[#1f5c4b]/20"
            >
              {isPending ? "Creating..." : "Create Specialty"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
