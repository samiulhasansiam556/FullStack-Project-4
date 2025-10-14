export interface SignUpForm {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  ok: boolean;
  message: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LogInResponse {
  ok: boolean;
  message: string;
  token: string;
  user: {
    role: string;
    id?: string;
    name?: string;
    username?: string;
    email?: string;
    profileImage?: string;
  };
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ForgetPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface University {
  id: number;
  name: string;
  createdAt: string;
  departments: Department[];
}

export interface Department {
  id: number;
  name: string;
  courses: Course[];
}

export interface Course {
  id: number;
  name: string;
  materials: Material[]
}

export interface Material {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploaderId: number;
  courseId: number;
  createdAt: string;

  // Populated relations
  course?: {
    id: number;
    name: string;
    department?: {
      id: number;
      name: string;
      university?: {
        id: number;
        name: string;
      };
    };
  };

  uploader?: User;
}

export interface User {
  id: string;
  name: string | null;
  username: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
  phone: string | null;
  bio: string | null;
  createdAt: Date;
}

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  PREMIUM = "PREMIUM",
}

export interface UserProfile {
  id: number;
  name: string;
  username: string;
  bio?: string;
  profileImage?: string;
  materials: Material[];
}

export interface StudentProfile {
  id: number;
  name: string;
  username: string;
  bio?: string;
  profileImage?: string;
  materials: Material[];
}

export interface UserProfileResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface Student {
  bio: string;
  id: number;
  materials: any[];
  name: string;
  profileImage: string;
  username: string;
}

export interface StudentResponse {
  data: User;
}

export interface AuthRequest extends Request {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}
