

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
    // Add other user properties you need
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
};





export interface Course {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  courses: Course[];
}





export interface Material {
  id: number;
  title: string;
  fileUrl: string;
  course: {
    id: number;
    name: string;
    department: {
      id: number;
      name: string;
      university: {
        id: number;
        name: string;
      };
    };
  };
}


export interface StudentProfile {
  id: number;
  name: string;
  username: string;
  bio?: string;
  profileImage?: string;
  materials: Material[];
}



// types/user.types.ts

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
  USER = 'USER',
  ADMIN = 'ADMIN',
  PREMIUM = 'PREMIUM'
}

// Request interface extending Express Request
export interface AuthRequest extends Request {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

// Response interface for the profile endpoint
export interface UserProfileResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}


interface Student {
  bio: string;
  id: number;
  materials: any[]; // or define proper Material interface if you know the structure
  name: string;
  profileImage: string;
  username: string;
}

export interface StudentResponse {
  data: User;
}


export interface University {
  id: number;
  name: string;
  createdAt: string;
  departments: Department[];
}



