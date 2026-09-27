"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSpecialties } from "@/services/specialty.services";
import { ISpecialty } from "@/types/specialty.types";
import { Plus, Search, Trash2, Stethoscope, Sparkles, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CreateSpecialtyModal from "./CreateSpecialtyModal";
import DeleteSpecialtyConfirmationDialog from "./DeleteSpecialtyConfirmationDialog";
import { ApiResponse } from "@/types/api.types";

export default function SpecialtiesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [specialtyToDelete, setSpecialtyToDelete] = useState<ISpecialty | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: specialtiesResponse, isLoading, isError } = useQuery({
    queryKey: ["specialties"],
    queryFn: () => getAllSpecialties(),
  });

  const responseData = (specialtiesResponse || {}) as ApiResponse<ISpecialty[]> | ISpecialty[];
  const specialties: ISpecialty[] = Array.isArray(responseData)
    ? responseData
    : (responseData as ApiResponse<ISpecialty[]>)?.data || [];

  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (specialty: ISpecialty) => {
    setSpecialtyToDelete(specialty);
    setIsDeleteOpen(true);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-[#1a2d29]">Specialties Management</h1>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f5c4b] text-[11px] font-bold text-white">
              {specialties.length}
            </span>
          </div>
          <p className="text-xs text-[#7a8c87]">
            Manage medical specialties, departments, and category icon assets
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="rounded-2xl bg-[#1f5c4b] hover:bg-[#184b3d] text-white font-semibold px-5 py-2.5 shadow-md shadow-[#1f5c4b]/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Specialty
        </Button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-[#e5ebe7] p-6 shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-5">
        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8aa099]" />
            <input
              type="text"
              placeholder="Search specialty by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f4f7f5] text-xs text-[#1a2d29] placeholder:text-[#8aa099] rounded-2xl pl-10 pr-4 py-2.5 outline-none border border-transparent focus:border-[#1f5c4b] transition"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-[#7a8c87] gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-[#1f5c4b] border-t-transparent animate-spin" />
            <p className="text-xs font-medium">Loading specialties...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-12 text-center text-red-500 text-xs">
            Failed to load specialties. Please try refreshing.
          </div>
        )}

        {/* Specialties Grid / Table */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            {filteredSpecialties.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                <div className="h-12 w-12 rounded-full bg-[#edf4f0] text-[#1f5c4b] flex items-center justify-center">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-[#1a2d29]">No specialties found</h3>
                <p className="text-xs text-[#7a8c87] max-w-xs">
                  {searchTerm ? "No matching specialty found for your search." : "Get started by adding a new medical specialty."}
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#f0f4f2] text-[11px] font-bold text-[#8fa09b] uppercase tracking-wider">
                    <th className="py-3 px-4">Icon</th>
                    <th className="py-3 px-4">Specialty Title</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f8f6]">
                  {filteredSpecialties.map((specialty) => (
                    <tr key={specialty.id} className="hover:bg-[#f7faf8] transition-colors group">
                      {/* Icon */}
                      <td className="py-3.5 px-4">
                        <div className="h-10 w-10 rounded-2xl bg-[#edf4f0] border border-[#e2ede7] flex items-center justify-center overflow-hidden relative shadow-sm">
                          {specialty.icon ? (
                            <Image
                              src={specialty.icon}
                              alt={specialty.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Stethoscope className="h-5 w-5 text-[#1f5c4b]" />
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 font-bold text-sm text-[#1a2d29]">
                        {specialty.title}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-xs text-[#7a8c87]">
                        {specialty.createdAt
                          ? new Date(specialty.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(specialty)}
                          className="h-9 w-9 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 transition"
                          title="Delete Specialty"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modals & Dialogs */}
      <CreateSpecialtyModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <DeleteSpecialtyConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        specialty={specialtyToDelete}
      />
    </div>
  );
}
