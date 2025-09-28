

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