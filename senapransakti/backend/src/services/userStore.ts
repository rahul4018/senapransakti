export type Role = "ADMIN" | "COMMANDER" | "MEDIC";

export interface User {
  email: string;
  role: Role;
  otp?: string;
  otpExpiry?: number;
}

// IMPORTANT: explicitly type this as User[]
export const users: User[] = [
  { email: "admin@test.com", role: "ADMIN" },
  { email: "commander@test.com", role: "COMMANDER" },
  { email: "medic@test.com", role: "MEDIC" },
];

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}
