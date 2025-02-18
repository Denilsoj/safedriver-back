import { z } from "zod";

export const FileSchema = z.object({
	filename: z.string().refine((name) => /\.(png|jpg|jpeg)$/i.test(name), {
		message: "Invalid file type. Allowed: .png, .jpg, .jpeg",
	}),
	mimetype: z.enum(["image/png", "image/jpeg", "image/jpg"]),
	size: z.number().max(10 * 1024 * 1024, "File size must be less than 10MB"),
});
