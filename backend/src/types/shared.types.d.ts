export interface User {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  loginplatform?: "native" | "google" | "facebook" | "github" | "linkedin";
}
