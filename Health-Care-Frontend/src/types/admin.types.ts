export type AdminRole = "ADMIN" | "SUPER_ADMIN";
export type AdminStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
  user: {
    id: string;
    role: AdminRole;
    status: AdminStatus;
    createdAt: string | Date;
  };
}

export interface IAdminUpdatePayload {
  admin: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}

export interface ICreateAdminPayload {
  password: string;
  admin: {
    name: string;
    email: string;
    contactNumber?: string;
  };
  role: "ADMIN";
}