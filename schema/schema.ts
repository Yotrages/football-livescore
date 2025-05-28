import { z } from "zod";

export const registerSchema = z
  .object({
    first_name: z
      .string()
      .min(2, { message: "First name should have at least 2 letters" }),
    last_name: z
      .string()
      .min(2, { message: "Last name should have at least 2 letters" }),
    email: z.string().email("Invalid email"),
    // phone: z.number().min(11, "Phone number must have at least 11 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

  export const loginSchema = z.object({
    username: z.string().email('invalid email'),
    password: z.string()
  })