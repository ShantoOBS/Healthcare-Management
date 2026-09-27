"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updatePatientProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Calendar,
  Heart,
  Save,
  ShieldAlert,
  Activity,
  FileText,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MyProfileClientProps {
  userInfo: any;
}

export default function MyProfileClient({ userInfo }: MyProfileClientProps) {
  const router = useRouter();

  // Extract nested patient / doctor / admin info
  const patientData = userInfo?.patient || {};
  const patientHealthData = patientData?.patientHealthData || {};
  const userDetails = userInfo || {};

  // Form State
  const [name, setName] = useState<string>(userDetails.name || patientData.name || "");
  const [contactNumber, setContactNumber] = useState<string>(patientData.contactNumber || "");
  const [address, setAddress] = useState<string>(patientData.address || "");

  // Health Data State
  const [gender, setGender] = useState<string>(patientHealthData.gender || "MALE");
  const [bloodGroup, setBloodGroup] = useState<string>(patientHealthData.bloodGroup || "O_POSITIVE");
  const [dateOfBirth, setDateOfBirth] = useState<string>(
    patientHealthData.dateOfBirth
      ? new Date(patientHealthData.dateOfBirth).toISOString().split("T")[0]
      : ""
  );
  const [height, setHeight] = useState<string>(patientHealthData.height || "");
  const [weight, setWeight] = useState<string>(patientHealthData.weight || "");
  const [dietaryPreferences, setDietaryPreferences] = useState<string>(
    patientHealthData.dietaryPreferences || ""
  );

  // Profile Photo File
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    userDetails.image || patientData.profilePhoto || null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const patientInfoPayload: Record<string, string> = {};
      if (name.trim()) patientInfoPayload.name = name.trim();
      if (contactNumber.trim()) patientInfoPayload.contactNumber = contactNumber.trim();
      if (address.trim()) patientInfoPayload.address = address.trim();

      const healthDataPayload: Record<string, any> = {};
      if (gender) healthDataPayload.gender = gender;
      if (bloodGroup) healthDataPayload.bloodGroup = bloodGroup;
      if (dateOfBirth) {
        const parsedDate = new Date(dateOfBirth);
        if (!isNaN(parsedDate.getTime())) {
          healthDataPayload.dateOfBirth = parsedDate.toISOString();
        }
      }
      if (height.trim()) healthDataPayload.height = height.trim();
      if (weight.trim()) healthDataPayload.weight = weight.trim();
      if (dietaryPreferences.trim()) healthDataPayload.dietaryPreferences = dietaryPreferences.trim();

      const payload: Record<string, any> = {};
      if (Object.keys(patientInfoPayload).length > 0) {
        payload.patientInfo = patientInfoPayload;
      }
      if (Object.keys(healthDataPayload).length > 0) {
        payload.patientHealthData = healthDataPayload;
      }

      formData.append("data", JSON.stringify(payload));

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      const result = await updatePatientProfileAction(formData);

      if (!result.success) {
        toast.error(result.message || "Failed to update profile");
        setIsSubmitting(false);
        return;
      }

      toast.success("Profile updated successfully!");
      setIsSubmitting(false);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
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
              <Image src={photoPreview} alt={name || "User"} fill className="object-cover" />
            ) : (
              (name || userDetails.name || "U").charAt(0).toUpperCase()
            )}
          </div>

          <label
            htmlFor="profile-photo-upload"
            className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#1f5c4b] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#184b3d] transition"
            title="Change Profile Photo"
          >
            <Camera className="h-4.5 w-4.5" />
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
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
              >
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
              >
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
