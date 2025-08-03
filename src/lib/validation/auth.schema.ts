import z from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username harus diisi"),
  password: z.string().min(6, "Password harus diisi"),
})

export const registerSchema = z.object({
  name: z.string().min(3, "Nama harus diisi"),
  username: z.string().min(3, "Username harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string({error: "Konfirmasi password wajib diisi"}),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})
