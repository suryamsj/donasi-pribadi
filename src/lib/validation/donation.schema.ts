import z from "zod";

export const donationSchema = z.object({
  name: z.string().optional(),
  email: z.email({error: "Email wajib diisi"}),
  amount: z.number({error: "Jumlah donasi wajib diisi"}).int().min(10000, {error: "Jumlah donasi minimal Rp 10.000"})
})
