"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInfo } from "@/services/auth.services";
import { updatePatientProfileAction } from "@/app/(dashboardLayout)/(commonProtectedLayout)/my-profile/_action";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Activity,
  Heart,
  FileText,
  Trash2,
  Plus,
  X,
  Stethoscope,
  Briefcase,
  GraduationCap,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Loader2,
  Award,
  Sparkles,
  HeartPulse,
  ClipboardList,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

interface PatientHealthData {
  gender?: string | null;
  bloodGroup?: string | null;
  dateOfBirth?: string | Date | null;
  height?: string | null;
  weight?: string | null;
  dietaryPreferences?: string | null;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  smokingStatus?: boolean;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string | null;
  immunizationStatus?: string | null;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: string | null;
}

interface MedicalReport {
  id: string;
  reportName?: string | null;
  reportLink?: string | null;
  createdAt?: string | Date | null;
}

interface PatientProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  profilePhoto?: string | null;
  patientHealthData?: PatientHealthData | null;
  medicalReports?: MedicalReport[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointments?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prescriptions?: any[];
}

interface DoctorSpecialty {
  specialtyId?: string;
  specialty?: {
    id?: string;
    title?: string;
    icon?: string;
  };
}

interface DoctorProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  profilePhoto?: string | null;
  registrationNumber?: string | null;
  experience?: number | string | null;
  gender?: string | null;
  appointmentFee?: number | string | null;
  qualification?: string | null;
  currentWorkingPlace?: string | null;
  designation?: string | null;
  description?: string | null;
  averageRating?: number | null;
  specialties?: DoctorSpecialty[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointments?: any[];
}

interface AdminProfile {
  id?: string;
  name?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  profilePhoto?: string | null;
}

interface MyProfileUserInfo {
  id?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  image?: string | null;
  emailVerified?: boolean;
  status?: string;
  createdAt?: string | Date | null;
  patient?: PatientProfile | null;
  doctor?: DoctorProfile | null;
  admin?: AdminProfile | null;
}

interface MyProfileClientProps {
  initialUserInfo?: MyProfileUserInfo | null;
}

const toDateInputValue = (value?: string | Date | null) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

// Calculate BMI helper
const calculateBMI = (heightStr?: string | null, weightStr?: string | null) => {
  if (!heightStr || !weightStr) return null;
  const hMatch = heightStr.match(/(\d+(\.\d+)?)/);
  const wMatch = weightStr.match(/(\d+(\.\d+)?)/);
  if (!hMatch || !wMatch) return null;

  let h = parseFloat(hMatch[0]);
  const w = parseFloat(wMatch[0]);
  if (h <= 0 || w <= 0) return null;

  // If height in cm convert to meters
  if (h > 3) {
    h = h / 100;
  }

  const bmi = w / (h * h);
  if (isNaN(bmi) || bmi <= 5 || bmi >= 100) return null;

  let category = "Normal";
  let color = "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (bmi < 18.5) {
    category = "Underweight";
    color = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
    color = "text-orange-700 bg-orange-50 border-orange-200";
  } else if (bmi >= 30) {
    category = "Obese";
    color = "text-red-700 bg-red-50 border-red-200";
  }

  return { bmi: bmi.toFixed(1), category, color };
};

export default function MyProfileClient({ initialUserInfo }: MyProfileClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // TanStack Query to manage profile cache
  const {
    data: userInfo,
    isLoading: isFetchingProfile,
    refetch,
  } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getUserInfo(),
    initialData: initialUserInfo ?? undefined,
    staleTime: 1000 * 60, // 1 minute
  });

  const currentUser = userInfo || initialUserInfo;
  const role = (currentUser?.role || "PATIENT").toUpperCase();
  const isPatient = role === "PATIENT";
  const isDoctor = role === "DOCTOR";
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  const patientData = currentUser?.patient ?? {};
  const doctorData = currentUser?.doctor ?? {};
  const adminData = currentUser?.admin ?? {};
  const patientHealthData = patientData.patientHealthData ?? {};
  const userDetails = currentUser ?? {};

  const photoInputRef = useRef<HTMLInputElement>(null);
  const reportFileInputRef = useRef<HTMLInputElement>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"general" | "health_or_practice" | "reports">("general");

  const initialPatientData = initialUserInfo?.patient ?? {};
  const initialDoctorData = initialUserInfo?.doctor ?? {};
  const initialAdminData = initialUserInfo?.admin ?? {};
  const initialHealthData = initialPatientData?.patientHealthData ?? {};

  // Common Profile Fields
  const [name, setName] = useState(
    initialUserInfo?.name ||
    initialPatientData.name ||
    initialDoctorData.name ||
    initialAdminData.name ||
    ""
  );
  const [contactNumber, setContactNumber] = useState(
    initialPatientData.contactNumber ||
    initialDoctorData.contactNumber ||
    initialAdminData.contactNumber ||
    ""
  );
  const [address, setAddress] = useState(
    initialPatientData.address || initialDoctorData.address || ""
  );

  // Patient Health Fields
  const [gender, setGender] = useState(
    initialHealthData.gender || initialDoctorData.gender || ""
  );
  const [bloodGroup, setBloodGroup] = useState(
    initialHealthData.bloodGroup || ""
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    toDateInputValue(initialHealthData.dateOfBirth)
  );
  const [height, setHeight] = useState(initialHealthData.height || "");
  const [weight, setWeight] = useState(initialHealthData.weight || "");
  const [dietaryPreferences, setDietaryPreferences] = useState(
    initialHealthData.dietaryPreferences || ""
  );
  const [maritalStatus, setMaritalStatus] = useState(
    initialHealthData.maritalStatus || ""
  );
  const [hasAllergies, setHasAllergies] = useState(
    Boolean(initialHealthData.hasAllergies)
  );
  const [hasDiabetes, setHasDiabetes] = useState(
    Boolean(initialHealthData.hasDiabetes)
  );
  const [smokingStatus, setSmokingStatus] = useState(
    Boolean(initialHealthData.smokingStatus)
  );
  const [pregnancyStatus, setPregnancyStatus] = useState(
    Boolean(initialHealthData.pregnancyStatus)
  );
  const [hasPastSurgeries, setHasPastSurgeries] = useState(
    Boolean(initialHealthData.hasPastSurgeries)
  );
  const [mentalHealthHistory, setMentalHealthHistory] = useState(
    initialHealthData.mentalHealthHistory || ""
  );
  const [immunizationStatus, setImmunizationStatus] = useState(
    initialHealthData.immunizationStatus || ""
  );

  // Patient Medical Reports State
  const [existingReports, setExistingReports] = useState<MedicalReport[]>(
    initialPatientData.medicalReports || []
  );
  const [reportsToDelete, setReportsToDelete] = useState<string[]>([]);
  const [newReportName, setNewReportName] = useState("");
  const [newReportFile, setNewReportFile] = useState<File | null>(null);

  // Doctor Fields
  const [qualification, setQualification] = useState(
    initialDoctorData.qualification || ""
  );
  const [designation, setDesignation] = useState(
    initialDoctorData.designation || ""
  );
  const [currentWorkingPlace, setCurrentWorkingPlace] = useState(
    initialDoctorData.currentWorkingPlace || ""
  );
  const [experience, setExperience] = useState(
    initialDoctorData.experience !== null && initialDoctorData.experience !== undefined
      ? String(initialDoctorData.experience)
      : ""
  );
  const [appointmentFee, setAppointmentFee] = useState(
    initialDoctorData.appointmentFee !== null && initialDoctorData.appointmentFee !== undefined
      ? String(initialDoctorData.appointmentFee)
      : ""
  );
  const [description, setDescription] = useState(
    initialDoctorData.description || ""
  );

  // Photo state
  const initialPhoto =
    initialUserInfo?.image ||
    initialPatientData.profilePhoto ||
    initialDoctorData.profilePhoto ||
    initialAdminData.profilePhoto ||
    null;
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialPhoto);

  // Sync state whenever TanStack query data updates
  useEffect(() => {
    if (!currentUser) return;

    const pData = currentUser.patient ?? {};
    const dData = currentUser.doctor ?? {};
    const aData = currentUser.admin ?? {};
    const hData = pData.patientHealthData ?? {};

    setName(
      currentUser.name ||
      pData.name ||
      dData.name ||
      aData.name ||
      ""
    );
    setContactNumber(
      pData.contactNumber ||
      dData.contactNumber ||
      aData.contactNumber ||
      ""
    );
    setAddress(pData.address || dData.address || "");

    setGender(hData.gender || dData.gender || "");
    setBloodGroup(hData.bloodGroup || "");
    setDateOfBirth(toDateInputValue(hData.dateOfBirth));
    setHeight(hData.height || "");
    setWeight(hData.weight || "");
    setDietaryPreferences(hData.dietaryPreferences || "");
    setMaritalStatus(hData.maritalStatus || "");
    setHasAllergies(Boolean(hData.hasAllergies));
    setHasDiabetes(Boolean(hData.hasDiabetes));
    setSmokingStatus(Boolean(hData.smokingStatus));
    setPregnancyStatus(Boolean(hData.pregnancyStatus));
    setHasPastSurgeries(Boolean(hData.hasPastSurgeries));
    setMentalHealthHistory(hData.mentalHealthHistory || "");
    setImmunizationStatus(hData.immunizationStatus || "");

    setExistingReports(pData.medicalReports || []);

    setQualification(dData.qualification || "");
    setDesignation(dData.designation || "");
    setCurrentWorkingPlace(dData.currentWorkingPlace || "");
    setExperience(
      dData.experience !== null && dData.experience !== undefined
        ? String(dData.experience)
        : ""
    );
    setAppointmentFee(
      dData.appointmentFee !== null && dData.appointmentFee !== undefined
        ? String(dData.appointmentFee)
        : ""
    );
    setDescription(dData.description || "");

    const committedPhoto =
      currentUser.image ||
      pData.profilePhoto ||
      dData.profilePhoto ||
      aData.profilePhoto ||
      null;

    if (!profilePhotoFile) {
      setPhotoPreview(committedPhoto);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!photoPreview?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  // Mutation for updating profile
  const { mutateAsync: saveProfile, isPending: isSubmitting } = useMutation({
    mutationFn: async (formData: FormData) => updatePatientProfileAction(formData),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Profile updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["my-profile"] });
        setProfilePhotoFile(null);
        setNewReportFile(null);
        setNewReportName("");
        setReportsToDelete([]);
        if (reportFileInputRef.current) reportFileInputRef.current.value = "";
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Choose a JPG, PNG, or WEBP image");
      e.currentTarget.value = "";
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("Profile photos must be 20 MB or smaller");
      e.currentTarget.value = "";
      return;
    }

    setProfilePhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const clearSelectedPhoto = () => {
    setProfilePhotoFile(null);
    const committedPhoto =
      currentUser?.image ||
      patientData.profilePhoto ||
      doctorData.profilePhoto ||
      adminData.profilePhoto ||
      null;
    setPhotoPreview(committedPhoto);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const handleMarkReportDelete = (reportId: string) => {
    setReportsToDelete((prev) => [...prev, reportId]);
    setExistingReports((prev) => prev.filter((r) => r.id !== reportId));
    toast.info("Report marked for removal. Click 'Save Profile Changes' to apply.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        name: name.trim(),
      };

      if (isPatient) {
        payload.patientInfo = {
          name: name.trim(),
          contactNumber: contactNumber.trim() || null,
          address: address.trim() || null,
        };

        const hasAnyHealthInput =
          gender ||
          bloodGroup ||
          dateOfBirth ||
          height.trim() ||
          weight.trim() ||
          dietaryPreferences.trim() ||
          maritalStatus.trim() ||
          mentalHealthHistory.trim() ||
          immunizationStatus.trim() ||
          hasAllergies ||
          hasDiabetes ||
          smokingStatus ||
          pregnancyStatus ||
          hasPastSurgeries;

        if (hasAnyHealthInput) {
          payload.patientHealthData = {
            ...(gender ? { gender } : {}),
            ...(bloodGroup ? { bloodGroup } : {}),
            ...(dateOfBirth && !isNaN(new Date(dateOfBirth).getTime())
              ? { dateOfBirth: new Date(dateOfBirth).toISOString() }
              : {}),
            ...(height.trim() ? { height: height.trim() } : {}),
            ...(weight.trim() ? { weight: weight.trim() } : {}),
            dietaryPreferences: dietaryPreferences.trim() || null,
            maritalStatus: maritalStatus.trim() || null,
            mentalHealthHistory: mentalHealthHistory.trim() || null,
            immunizationStatus: immunizationStatus.trim() || null,
            hasAllergies,
            hasDiabetes,
            smokingStatus,
            pregnancyStatus,
            hasPastSurgeries,
          };
        }

        if (reportsToDelete.length > 0) {
          payload.medicalReports = reportsToDelete.map((id) => ({
            shouldDelete: true,
            reportId: id,
          }));
        }
      } else if (isDoctor) {
        payload.doctorInfo = {
          name: name.trim(),
          contactNumber: contactNumber.trim() || null,
          address: address.trim() || null,
          ...(gender ? { gender } : {}),
          qualification: qualification.trim() || null,
          designation: designation.trim() || null,
          currentWorkingPlace: currentWorkingPlace.trim() || null,
          experience: experience ? Number(experience) : 0,
          appointmentFee: appointmentFee ? Number(appointmentFee) : 0,
          description: description.trim() || null,
        };
      } else if (isAdmin) {
        payload.adminInfo = {
          name: name.trim(),
          contactNumber: contactNumber.trim() || null,
        };
      }

      formData.append("data", JSON.stringify(payload));

      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }

      if (newReportFile) {
        formData.append("medicalReports", newReportFile);
      }

      await saveProfile(formData);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  const bmiData = calculateBMI(height, weight);

  return (
    <div className="w-full mx-auto space-y-6 pb-16">
      {/* Top Hero Banner Card */}
      <div className="relative overflow-hidden rounded-md border border-[#e5ebe7] bg-white p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar Area */}
          <div className="relative group shrink-0">
            <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-[#edf4f0] bg-[#1f5c4b] text-white flex items-center justify-center font-bold text-4xl shadow-md relative">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt={name || "User Avatar"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                (name || userDetails.name || "U").charAt(0).toUpperCase()
              )}
            </div>

            {/* Photo Upload Trigger */}
            <label
              htmlFor="profile-photo-upload"
              className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-[#1f5c4b] text-white flex items-center justify-center cursor-pointer shadow-md hover:bg-[#184b3d] active:scale-95 transition"
              title="Upload new profile photo"
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

            {/* Discard Preview Button */}
            {profilePhotoFile && (
              <button
                type="button"
                onClick={clearSelectedPhoto}
                className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition cursor-pointer"
                title="Discard selected photo"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* User Details & Status Bar */}
          <div className="flex-1 text-center sm:text-left space-y-2.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1a2d29] tracking-tight">
                {name || userDetails.name || "User Profile"}
              </h1>

              {/* Role Pill */}
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-[#edf4f0] text-[#1f5c4b] tracking-wider uppercase">
                {role.replace("_", " ")}
              </span>

              {/* Verified Pill */}
              {userDetails.emailVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                  Unverified
                </span>
              )}

              {/* Account Status */}
              {userDetails.status && (
                <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-md bg-[#edf4f0] text-[#1f5c4b] border border-[#d6e4dc]">
                  {userDetails.status}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-[#7a8c87]">
              <p className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#1f5c4b]" />
                {userDetails.email || "No email provided"}
              </p>
              {contactNumber && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#1f5c4b]" />
                  {contactNumber}
                </p>
              )}
              {address && (
                <p className="flex items-center gap-1.5 truncate max-w-xs">
                  <MapPin className="h-3.5 w-3.5 text-[#1f5c4b]" />
                  {address}
                </p>
              )}
            </div>

            {/* Quick Metrics & Summary Badges Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              {isPatient && (
                <>
                  {bloodGroup && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#e5ebe7] shadow-xs text-xs font-semibold text-[#1a2d29]">
                      <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                      Blood Group: <span className="text-[#1f5c4b] font-bold">{bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-")}</span>
                    </div>
                  )}

                  {dateOfBirth && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#e5ebe7] shadow-xs text-xs font-semibold text-[#1a2d29]">
                      <Calendar className="h-3.5 w-3.5 text-[#1f5c4b]" />
                      DOB: <span className="text-[#556963]">{new Date(dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}

                  {existingReports.length > 0 && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#e5ebe7] shadow-xs text-xs font-semibold text-[#1a2d29]">
                      <FileText className="h-3.5 w-3.5 text-[#1f5c4b]" />
                      Reports: <span className="text-[#1f5c4b] font-bold">{existingReports.length}</span>
                    </div>
                  )}

                  {bmiData && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md border text-xs font-bold ${bmiData.color}`}>
                      <HeartPulse className="h-3.5 w-3.5" />
                      BMI: {bmiData.bmi} ({bmiData.category})
                    </div>
                  )}
                </>
              )}

              {isDoctor && (
                <>
                  {doctorData.registrationNumber && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#e5ebe7] shadow-xs text-xs font-semibold text-[#1a2d29]">
                      <Award className="h-3.5 w-3.5 text-[#1f5c4b]" />
                      License: <span className="font-mono text-[#1f5c4b]">{doctorData.registrationNumber}</span>
                    </div>
                  )}
                  {experience && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#e5ebe7] shadow-xs text-xs font-semibold text-[#1a2d29]">
                      <Clock className="h-3.5 w-3.5 text-[#1f5c4b]" />
                      Experience: <span className="text-[#1f5c4b] font-bold">{experience} yrs</span>
                    </div>
                  )}
                  {appointmentFee && (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#e5ebe7] shadow-xs text-xs font-semibold text-[#1a2d29]">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                      Fee: <span className="text-emerald-700 font-bold">${appointmentFee}</span>
                    </div>
                  )}
                </>
              )}

              {isAdmin && (
                <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-white border border-[#e5ebe7] shadow-xs text-xs font-semibold text-[#1f5c4b]">
                  <ShieldCheck className="h-4 w-4 text-[#1f5c4b]" />
                  Full System Control Access
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="mt-6 pt-4 border-t border-[#f0f4f2] flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === "general"
                ? "bg-[#1f5c4b] text-white shadow-md shadow-[#1f5c4b]/20"
                : "bg-white text-[#5e716c] hover:bg-[#edf4f0] hover:text-[#1f5c4b] border border-[#e5ebe7]"
            }`}
          >
            <User className="h-4 w-4" />
            General Information
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("health_or_practice")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer ${
              activeTab === "health_or_practice"
                ? "bg-[#1f5c4b] text-white shadow-md shadow-[#1f5c4b]/20"
                : "bg-white text-[#5e716c] hover:bg-[#edf4f0] hover:text-[#1f5c4b] border border-[#e5ebe7]"
            }`}
          >
            {isDoctor ? (
              <>
                <Stethoscope className="h-4 w-4" />
                Medical Practice Details
              </>
            ) : isPatient ? (
              <>
                <Activity className="h-4 w-4" />
                Health & Metrics
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Admin Overview
              </>
            )}
          </button>

          {isPatient && (
            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold transition cursor-pointer ${
                activeTab === "reports"
                  ? "bg-[#1f5c4b] text-white shadow-md shadow-[#1f5c4b]/20"
                  : "bg-white text-[#5e716c] hover:bg-[#edf4f0] hover:text-[#1f5c4b] border border-[#e5ebe7]"
              }`}
            >
              <FileText className="h-4 w-4" />
              Medical Reports ({existingReports.length})
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab 1: General Personal Information */}
        {activeTab === "general" && (
          <div className="bg-white rounded-md p-6 sm:p-8 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0f4f2] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-[#edf4f0] flex items-center justify-center text-[#1f5c4b]">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-[#1a2d29]">Personal Information</h2>
                  <p className="text-xs text-[#7a8c87]">Your contact details and primary account info</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  required
                />
              </div>

              {/* Email Address (Read-only) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa09b]" />
                  <Input
                    type="email"
                    value={userDetails.email || ""}
                    disabled
                    className="h-10 rounded-md border-[#e5ebe7] bg-[#f4f7f5] text-[#7a8c87] pl-10 cursor-not-allowed font-medium text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Contact Phone Number */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Contact Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa09b]" />
                  <Input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="h-10 rounded-md pl-10 border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>
              </div>

              {/* Home / Workplace Address */}
              {!isAdmin && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa09b]" />
                    <Input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Healthcare Ave, City, Country"
                      className="h-10 rounded-md pl-10 border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Health & Metrics (Patient) */}
        {activeTab === "health_or_practice" && isPatient && (
          <div className="space-y-6">
            <div className="bg-white rounded-md p-6 sm:p-8 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
              <div className="flex items-center justify-between border-b border-[#f0f4f2] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-[#edf4f0] flex items-center justify-center text-[#1f5c4b]">
                    <Activity className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-base sm:text-lg text-[#1a2d29]">Health & Vitals</h2>
                    <p className="text-xs text-[#7a8c87]">Your biological and medical indicators</p>
                  </div>
                </div>

                {bmiData && (
                  <div className={`hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-md border text-xs font-bold ${bmiData.color}`}>
                    <HeartPulse className="h-4 w-4" />
                    <span>BMI: {bmiData.bmi} ({bmiData.category})</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {/* Gender */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Gender</Label>
                  <Select
                    value={gender || undefined}
                    onValueChange={(val) => setGender(val)}
                  >
                    <SelectTrigger className="w-full h-10 rounded-md border-[#e5ebe7] bg-white text-xs font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition cursor-pointer">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#e5ebe7] rounded-md shadow-lg">
                      <SelectItem value="MALE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        Male
                      </SelectItem>
                      <SelectItem value="FEMALE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        Female
                      </SelectItem>
                      <SelectItem value="OTHER" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Blood Group */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Blood Group</Label>
                  <Select
                    value={bloodGroup || undefined}
                    onValueChange={(val) => setBloodGroup(val)}
                  >
                    <SelectTrigger className="w-full h-10 rounded-md border-[#e5ebe7] bg-white text-xs font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition cursor-pointer">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#e5ebe7] rounded-md shadow-lg">
                      <SelectItem value="A_POSITIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        A+ (A Positive)
                      </SelectItem>
                      <SelectItem value="B_POSITIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        B+ (B Positive)
                      </SelectItem>
                      <SelectItem value="O_POSITIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        O+ (O Positive)
                      </SelectItem>
                      <SelectItem value="AB_POSITIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        AB+ (AB Positive)
                      </SelectItem>
                      <SelectItem value="A_NEGATIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        A- (A Negative)
                      </SelectItem>
                      <SelectItem value="B_NEGATIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        B- (B Negative)
                      </SelectItem>
                      <SelectItem value="O_NEGATIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        O- (O Negative)
                      </SelectItem>
                      <SelectItem value="AB_NEGATIVE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                        AB- (AB Negative)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date of Birth */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Date of Birth</Label>
                  <DatePicker
                    value={dateOfBirth}
                    onChange={(val) => setDateOfBirth(val)}
                    placeholder="Select date of birth"
                  />
                </div>

                {/* Height */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Height</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 175 cm / 5'9''"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Weight</Label>
                  <Input
                    type="text"
                    placeholder="e.g. 70 kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>

                {/* Dietary Preference */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Dietary Preference</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Vegetarian, Non-Veg, Keto"
                    value={dietaryPreferences}
                    onChange={(e) => setDietaryPreferences(e.target.value)}
                    className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>

                {/* Marital Status */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Marital Status</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Single, Married"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>

                {/* Immunization Status */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Immunization Status</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Fully Vaccinated, Up to date"
                    value={immunizationStatus}
                    onChange={(e) => setImmunizationStatus(e.target.value)}
                    className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>

                {/* Mental Health History */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Mental Health Notes</Label>
                  <Input
                    type="text"
                    placeholder="Optional notes"
                    value={mentalHealthHistory}
                    onChange={(e) => setMentalHealthHistory(e.target.value)}
                    className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>
              </div>

              {/* Lifestyle / Condition Toggles */}
              <div className="pt-4 border-t border-[#f0f4f2]">
                <Label className="text-xs font-semibold text-[#1a2d29] block mb-3">
                  Health & Medical History Status
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <label className="flex items-center justify-between p-3 rounded-md border border-[#e5ebe7] hover:bg-[#f9fbfa] cursor-pointer transition">
                    <span className="text-xs font-semibold text-[#1a2d29]">Has Allergies</span>
                    <input
                      type="checkbox"
                      checked={hasAllergies}
                      onChange={(e) => setHasAllergies(e.target.checked)}
                      className="rounded text-[#1f5c4b] focus:ring-[#1f5c4b] h-4 w-4 cursor-pointer accent-[#1f5c4b]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-md border border-[#e5ebe7] hover:bg-[#f9fbfa] cursor-pointer transition">
                    <span className="text-xs font-semibold text-[#1a2d29]">Has Diabetes</span>
                    <input
                      type="checkbox"
                      checked={hasDiabetes}
                      onChange={(e) => setHasDiabetes(e.target.checked)}
                      className="rounded text-[#1f5c4b] focus:ring-[#1f5c4b] h-4 w-4 cursor-pointer accent-[#1f5c4b]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-md border border-[#e5ebe7] hover:bg-[#f9fbfa] cursor-pointer transition">
                    <span className="text-xs font-semibold text-[#1a2d29]">Smoking Status</span>
                    <input
                      type="checkbox"
                      checked={smokingStatus}
                      onChange={(e) => setSmokingStatus(e.target.checked)}
                      className="rounded text-[#1f5c4b] focus:ring-[#1f5c4b] h-4 w-4 cursor-pointer accent-[#1f5c4b]"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-md border border-[#e5ebe7] hover:bg-[#f9fbfa] cursor-pointer transition">
                    <span className="text-xs font-semibold text-[#1a2d29]">Past Surgeries</span>
                    <input
                      type="checkbox"
                      checked={hasPastSurgeries}
                      onChange={(e) => setHasPastSurgeries(e.target.checked)}
                      className="rounded text-[#1f5c4b] focus:ring-[#1f5c4b] h-4 w-4 cursor-pointer accent-[#1f5c4b]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Doctor Practice Details */}
        {activeTab === "health_or_practice" && isDoctor && (
          <div className="bg-white rounded-md p-6 sm:p-8 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0f4f2] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-[#edf4f0] flex items-center justify-center text-[#1f5c4b]">
                  <Stethoscope className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-[#1a2d29]">Medical Practice Details</h2>
                  <p className="text-xs text-[#7a8c87]">Your qualifications, workplace, and consultation setup</p>
                </div>
              </div>
            </div>

            {/* Specialties Badges List */}
            {doctorData.specialties && doctorData.specialties.length > 0 && (
              <div className="space-y-2 p-4 rounded-md bg-[#f7faf8] border border-[#e2ece6]">
                <Label className="text-xs font-bold text-[#1f5c4b] uppercase tracking-wider">
                  Assigned Specialties
                </Label>
                <div className="flex flex-wrap gap-2">
                  {doctorData.specialties.map((item, idx) => (
                    <span
                      key={item.specialtyId || idx}
                      className="px-3 py-1 rounded-md text-xs font-semibold bg-white text-[#1f5c4b] border border-[#cfe2d7] shadow-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="h-3 w-3 text-[#1f5c4b]" />
                      {item.specialty?.title || "Specialty"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {/* Gender */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Gender</Label>
                <Select
                  value={gender || undefined}
                  onValueChange={(val) => setGender(val)}
                >
                  <SelectTrigger className="w-full h-10 rounded-md border-[#e5ebe7] bg-white text-xs font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition cursor-pointer">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#e5ebe7] rounded-md shadow-lg">
                    <SelectItem value="MALE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                      Male
                    </SelectItem>
                    <SelectItem value="FEMALE" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                      Female
                    </SelectItem>
                    <SelectItem value="OTHER" className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm">
                      Other
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Qualification */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Qualification</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa09b]" />
                  <Input
                    type="text"
                    placeholder="e.g. MBBS, FCPS, MD"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="h-10 rounded-md pl-10 border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Designation</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa09b]" />
                  <Input
                    type="text"
                    placeholder="e.g. Senior Consultant"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="h-10 rounded-md pl-10 border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>
              </div>

              {/* Current Working Place */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Current Workplace / Hospital</Label>
                <Input
                  type="text"
                  placeholder="e.g. City Central Hospital"
                  value={currentWorkingPlace}
                  onChange={(e) => setCurrentWorkingPlace(e.target.value)}
                  className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                />
              </div>

              {/* Experience (Years) */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Experience (Years)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 8"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                />
              </div>

              {/* Appointment Fee */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1a2d29]">Appointment Fee ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8fa09b]" />
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 50"
                    value={appointmentFee}
                    onChange={(e) => setAppointmentFee(e.target.value)}
                    className="h-10 rounded-md pl-10 border-[#e5ebe7] bg-white text-xs sm:text-sm font-semibold text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition"
                  />
                </div>
              </div>

              {/* License Number (Read-only) */}
              {doctorData.registrationNumber && (
                <div className="space-y-1.5 sm:col-span-2 md:col-span-3">
                  <Label className="text-xs font-semibold text-[#1a2d29]">Medical License / Registration Number</Label>
                  <Input
                    type="text"
                    value={doctorData.registrationNumber}
                    disabled
                    className="h-10 rounded-md border-[#e5ebe7] bg-[#f4f7f5] text-[#7a8c87] font-mono cursor-not-allowed text-xs sm:text-sm"
                  />
                </div>
              )}
            </div>

            {/* Doctor Bio */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1a2d29]">Professional Biography / About</Label>
              <textarea
                rows={4}
                placeholder="Share a brief overview of your clinical background, specialties, and patient care approach..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-md border border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition resize-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Admin Overview */}
        {activeTab === "health_or_practice" && isAdmin && (
          <div className="bg-white rounded-md p-6 sm:p-8 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center gap-3 border-b border-[#f0f4f2] pb-4">
              <div className="h-9 w-9 rounded-md bg-[#edf4f0] flex items-center justify-center text-[#1f5c4b]">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="font-bold text-base sm:text-lg text-[#1a2d29]">System Administration</h2>
                <p className="text-xs text-[#7a8c87]">Your security permissions and role capabilities</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-[#f7faf8] border border-[#e2ece6] space-y-1.5">
                <p className="text-xs font-bold text-[#1f5c4b] uppercase tracking-wider">Account Role</p>
                <p className="text-base font-bold text-[#1a2d29]">{role.replace("_", " ")}</p>
                <p className="text-xs text-[#7a8c87]">Authorized for global system management and access control.</p>
              </div>

              <div className="p-4 rounded-md bg-[#f7faf8] border border-[#e2ece6] space-y-1.5">
                <p className="text-xs font-bold text-[#1f5c4b] uppercase tracking-wider">Security Clearance</p>
                <p className="text-base font-bold text-emerald-700">Level 1 Administrator</p>
                <p className="text-xs text-[#7a8c87]">Full privileges across Doctors, Patients, and Schedules.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Medical Reports (Patient Only) */}
        {activeTab === "reports" && isPatient && (
          <div className="bg-white rounded-md p-6 sm:p-8 border border-[#e5ebe7] shadow-[0_4px_25px_rgba(0,0,0,0.02)] space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0f4f2] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-[#edf4f0] flex items-center justify-center text-[#1f5c4b]">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h2 className="font-bold text-base sm:text-lg text-[#1a2d29]">Medical Reports & Documents</h2>
                  <p className="text-xs text-[#7a8c87]">Manage your laboratory results, prescriptions, and medical files</p>
                </div>
              </div>
            </div>

            {/* Saved Reports Gallery */}
            {existingReports.length > 0 ? (
              <div className="space-y-3">
                <Label className="text-xs font-bold text-[#1a2d29] uppercase tracking-wider">
                  Saved Documents ({existingReports.length})
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {existingReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-3.5 rounded-md border border-[#e5ebe7] bg-[#fbfdfc] hover:border-[#1f5c4b]/30 transition shadow-2xs"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="h-8 w-8 rounded-md bg-[#edf4f0] flex items-center justify-center text-[#1f5c4b] shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-[#1a2d29] truncate">
                            {report.reportName || "Medical Report"}
                          </p>
                          {report.createdAt && (
                            <p className="text-[10px] text-[#8fa09b]">
                              Uploaded on {new Date(report.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {report.reportLink && (
                          <a
                            href={report.reportLink}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-md text-[#1f5c4b] hover:bg-[#edf4f0] transition"
                            title="View Document"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleMarkReportDelete(report.id)}
                          className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Report"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4 rounded-md border border-dashed border-[#dce7e1] bg-[#fbfdfc]">
                <FileText className="h-8 w-8 text-[#a0b3ac] mx-auto mb-2" />
                <p className="text-xs font-semibold text-[#526661]">No medical documents uploaded yet</p>
                <p className="text-[11px] text-[#8fa09b]">Upload blood tests, imaging, or prescriptions below</p>
              </div>
            )}

            {/* Upload New Document Box */}
            <div className="pt-4 border-t border-[#f0f4f2] space-y-3">
              <Label className="text-xs font-bold text-[#1a2d29] uppercase tracking-wider">
                Upload New Document
              </Label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <Input
                  ref={reportFileInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setNewReportFile(file);
                    if (file && !newReportName) {
                      setNewReportName(file.name.replace(/\.[^/.]+$/, ""));
                    }
                  }}
                  className="rounded-md border-[#e5ebe7] text-xs file:bg-[#1f5c4b] file:text-white file:rounded-md file:border-0 file:px-3 file:py-1 file:mr-3 file:text-xs hover:file:bg-[#184b3d]"
                />
                {newReportFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNewReportFile(null);
                      setNewReportName("");
                      if (reportFileInputRef.current) reportFileInputRef.current.value = "";
                    }}
                    className="text-red-500 hover:bg-red-50 rounded-md text-xs shrink-0"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear File
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Save Button Bar */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetchingProfile}
            className="rounded-md text-xs font-semibold text-[#5e716c] border-[#e5ebe7] hover:bg-[#edf4f0] hover:text-[#1f5c4b] cursor-pointer"
          >
            {isFetchingProfile ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
            )}
            Reload Data
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md cursor-pointer bg-[#1f5c4b] hover:bg-[#184b3d] text-white font-semibold px-8 py-2.5 shadow-md shadow-[#1f5c4b]/20 flex items-center gap-2 transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
