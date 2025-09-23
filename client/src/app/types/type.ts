

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