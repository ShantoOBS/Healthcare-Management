"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updatePatientProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import {
  User,
  Mail,
  Camera,
  Save,
  Activity,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientHealthData {
  gender?: string | null;
  bloodGroup?: string | null;
  dateOfBirth?: string | Date | null;
  height?: string | null;
  weight?: string | null;
  dietaryPreferences?: string | null;
}

interface PatientProfile {
  name?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  profilePhoto?: string | null;
  patientHealthData?: PatientHealthData | null;
}

interface MyProfileUserInfo {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
  patient?: PatientProfile | null;
}

interface MyProfileClientProps {
  userInfo: MyProfileUserInfo | null;
}

const toDateInputValue = (value: PatientHealthData["dateOfBirth"]) => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

export default function MyProfileClient({ userInfo }: MyProfileClientProps) {
  const router = useRouter();

  const patientData = userInfo?.patient ?? {};
  const patientHealthData = patientData.patientHealthData ?? {};
  const userDetails = userInfo ?? {};
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(userDetails.name || patientData.name || "");
  const [contactNumber, setContactNumber] = useState(patientData.contactNumber || "");
  const [address, setAddress] = useState(patientData.address || "");

  const [gender, setGender] = useState(patientHealthData.gender || "");
  const [bloodGroup, setBloodGroup] = useState(patientHealthData.bloodGroup || "");
  const [dateOfBirth, setDateOfBirth] = useState(toDateInputValue(patientHealthData.dateOfBirth));
  const [height, setHeight] = useState(patientHealthData.height || "");
  const [weight, setWeight] = useState(patientHealthData.weight || "");
  const [dietaryPreferences, setDietaryPreferences] = useState(
    patientHealthData.dietaryPreferences || ""
  );

  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    userDetails.image || patientData.profilePhoto || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!photoPreview?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WEBP image");
      e.currentTarget.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photos must be 5 MB or smaller");
      e.currentTarget.value = "";
      return;
    }

    setProfilePhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearSelectedPhoto = () => {
    setProfilePhotoFile(null);
    setPhotoPreview(userDetails.image || patientData.profilePhoto || null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      const payload = {
        patientInfo: {
          name: name.trim(),
          contactNumber: contactNumber.trim() || null,
          address: address.trim() || null,
        },
        patientHealthData: {
          gender,
          bloodGroup,
          dateOfBirth: new Date(dateOfBirth).toISOString(),
          height: height.trim(),
          weight: weight.trim(),
          dietaryPreferences: dietaryPreferences.trim() || null,
        },
      };
      formData.append("data", JSON.stringify(payload));

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      const result = await updatePatientProfileAction(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full 
     mx-auto space-y-6 pb-10">
      {/* Header Profile Banner */}
      <div className="bg-white rounded-md p-6 sm:p-8 border border-[#e5ebe7] 
      shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row
       items-center gap-6">
        {/* Profile Avatar Upload */}
        <div className="relative group">
          <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border-4 border-[#edf4f0] bg-[#1f5c4b] text-white flex items-center justify-center font-bold text-3xl shadow-md relative">
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt={name || "User"}
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              (name || userDetails.name || "U").charAt(0).toUpperCase()
            )}
          </div>

          <label
            htmlFor="profile-photo-upload"
            className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#1f5c4b] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#184b3d] transition"
            title="Choose a profile photo"
          >
            <Camera className="h-4.5 w-4.5" />
            <input
              ref={photoInputRef}
              id="profile-photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          {profilePhotoFile && (
            <button
              type="button"
              onClick={clearSelectedPhoto}
              className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-white text-[#1a2d29] flex items-center justify-center shadow-md hover:bg-[#f4f7f5]"
              aria-label="Discard selected profile photo"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a2d29]">
              {name || userDetails.name || "User Profile"}
            </h1>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#edf4f0] text-[#1f5c4b] uppercase tracking-wider">
              {userDetails.role?.replace("_", " ") || "PATIENT"}
            </span>
          </div>

          <p className="text-xs text-[#7a8c87] flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            {userDetails.email || "No email provided"}
          </p>

          <p className="text-xs text-[#8fa09b] pt-1">
            Manage your personal contact info, medical preferences, and health data
          </p>
          <p className="text-xs text-[#8fa09b]">
            Choose a JPG, PNG, or WEBP profile photo up to 5 MB.
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details Section */}
        <div className="bg-white rounded-md p-6 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f0f4f2] pb-3">
            <User className="h-5 w-5 text-[#1f5c4b]" />
            <h2 className="font-bold text-base text-[#1a2d29]">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Full Name</Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b]"
                required
              />
            </div>

            {/* Email (Disabled) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Email Address</Label>
              <Input
                type="email"
                value={userDetails.email || ""}
                disabled
                className="rounded-xl border-[#e5ebe7] bg-[#f4f7f5] text-[#7a8c87]"
              />
            </div>

            {/* Contact Number */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Contact Phone Number</Label>
              <Input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b]"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Home Address</Label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Health Ave, City, Country"
                className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b]"
              />
            </div>
          </div>
        </div>

        {/* Health & Medical Information Section */}
        <div className="bg-white rounded-md p-6 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2 border-b border-[#f0f4f2] pb-3">
            <Activity className="h-5 w-5 text-[#1f5c4b]" />
            <h2 className="font-bold text-base text-[#1a2d29]">Health & Medical Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Gender */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Gender</Label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#e5ebe7] bg-white text-xs font-medium text-[#1a2d29] outline-none focus:border-[#1f5c4b]"
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Blood Group</Label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#e5ebe7] bg-white text-xs font-medium text-[#1a2d29] outline-none focus:border-[#1f5c4b]"
                required
              >
                <option value="" disabled>Select blood group</option>
                <option value="A_POSITIVE">A+</option>
                <option value="B_POSITIVE">B+</option>
                <option value="O_POSITIVE">O+</option>
                <option value="AB_POSITIVE">AB+</option>
                <option value="A_NEGATIVE">A-</option>
                <option value="B_NEGATIVE">B-</option>
                <option value="O_NEGATIVE">O-</option>
                <option value="AB_NEGATIVE">AB-</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Date of Birth</Label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b]"
                required
              />
            </div>

            {/* Height */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Height (cm / ft)</Label>
              <Input
                type="text"
                placeholder="e.g. 175 cm"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b]"
                required
              />
            </div>

            {/* Weight */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Weight (kg / lbs)</Label>
              <Input
                type="text"
                placeholder="e.g. 70 kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b]"
                required
              />
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Dietary Preference</Label>
              <Input
                type="text"
                placeholder="e.g. Vegetarian, Non-Vegetarian"
                value={dietaryPreferences}
                onChange={(e) => setDietaryPreferences(e.target.value)}
                className="rounded-xl border-[#e5ebe7] focus:border-[#1f5c4b]"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md cursor-pointer bg-[#1f5c4b] hover:bg-[#184b3d] text-white font-semibold px-8 py-3 shadow-md shadow-[#1f5c4b]/20 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving Changes..." : "Save Profile Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
