export interface IPatient {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  createdAt: string | Date;
  user: {
    id: string;
    status: string;
    createdAt: string | Date;
  };
}

export interface IPatientProfileUpdate {
  patientInfo: {
    name?: string;
    contactNumber?: string;
    address?: string;
  };
}

export interface IPatientDetails extends IPatient {
  patientHealthData?: {
    gender?: string;
    dateOfBirth?: string | Date;
    bloodGroup?: string;
    height?: string;
    weight?: string;
    hasAllergies?: boolean;
    hasDiabetes?: boolean;
    hasPastSurgeries?: boolean;
  } | null;
  medicalReports?: Array<{
    id: string;
    reportName: string;
    createdAt: string | Date;
  }>;
}