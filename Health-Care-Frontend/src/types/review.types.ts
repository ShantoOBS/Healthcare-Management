export interface IAdminReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string | Date;
  patient: {
    id: string;
    name: string;
    email: string;
    profilePhoto?: string | null;
  };
  doctor: {
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
    } | null;
  };
}

export interface IMyReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string | Date;
  patient?: {
    id?: string;
    name?: string;
    email?: string;
    profilePhoto?: string | null;
  } | null;
  appointment?: {
    id?: string;
  } | null;
}

export interface ICreateReviewPayload {
  appointmentId: string;
  rating: number;
  comment: string;
}

export interface IUpdateReviewPayload {
  rating: number;
  comment: string;
}