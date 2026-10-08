import { UserRole } from "@/lib/authUtils";

export interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string | null;
    emailVerified?: boolean;
    status?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patient?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doctor?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    admin?: any;
}