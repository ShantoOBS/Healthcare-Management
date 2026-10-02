"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllSpecialties } from "@/services/specialty.services";
import { ISpecialty } from "@/types/specialty.types";
import { Plus, Search, Trash2, Stethoscope } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="doctor-management">
      <header className="doctor-management-heading">
        <div className="doctor-management-mark" aria-hidden="true">
          <Stethoscope />
        </div>
        <div>
          <p className="doctor-management-eyebrow">Clinical taxonomy</p>
          <h1>Specialties</h1>
          <p className="doctor-management-description">
            Manage medical departments and their directory icons.
          </p>
        </div>
        <div className="doctor-management-count" aria-live="polite">
          <strong>{specialties.length}</strong>
          <span>specialties</span>
        </div>
      </header>

      <div className="doctor-management-table specialties-management-table">
        <div className="specialties-toolbar">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search specialties..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="h-9 pl-9"
              aria-label="Search specialties"
            />
          </div>
          <div className="doctor-management-create-action">
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Add specialty
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="specialties-loading-rows" aria-label="Loading specialties">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="specialties-loading-row" key={index}>
                <span className="specialties-loading-icon" />
                <span className="specialties-loading-title" />
                <span className="specialties-loading-date" />
                <span className="specialties-loading-action" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="specialties-error-state">
            Failed to load specialties. Please try refreshing.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            {filteredSpecialties.length === 0 ? (
              <div className="specialties-empty-state">
                <div className="doctor-management-mark" aria-hidden="true">
                  <Stethoscope />
                </div>
                <h2>No specialties found</h2>
                <p>
                  {searchTerm ? "No matching specialty found for your search." : "Get started by adding a new medical specialty."}
                </p>
              </div>
            ) : (
              <table className="specialties-native-table">
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Specialty</th>
                    <th>Created</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f8f6]">
                  {filteredSpecialties.map((specialty) => (
                    <tr key={specialty.id}>
                      <td>
                        <div className="specialty-icon-frame">
                          {specialty.icon ? (
                            <Image
                              src={specialty.icon}
                              alt={specialty.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Stethoscope className="h-5 w-5" />
                          )}
                        </div>
                      </td>

                      <td className="specialty-title-cell">
                        {specialty.title}
                      </td>

                      <td className="specialty-date-cell">
                        {specialty.createdAt
                          ? new Date(specialty.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </td>

                      <td className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(specialty)}
                          className="specialty-delete-button h-9 w-9"
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
