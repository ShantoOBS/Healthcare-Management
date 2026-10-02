export interface IAdminPrescription {
  id: string;
  followUpDate: string | Date;
  instructions: string;
  pdfUrl?: string | null;
  createdAt: string | Date;
  doctor: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
  };
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
  };
  appointment: {
    id: string;
    schedule?: {
      id: string;
      startDateTime: string | Date;
      endDateTime: string | Date;
    } | null;
  };
}

export interface IMyPrescription {
  id: string;
  followUpDate: string | Date;
  instructions: string;
  pdfUrl?: string | null;
  createdAt: string | Date;
  doctor?: {
    id?: string;
    name?: string;
    email?: string;
    profilePhoto?: string | null;
  } | null;
  patient?: {
    id?: string;
    name?: string;
    email?: string;
  } | null;
  appointment?: {
    id?: string;
    status?: string;
  } | null;
}