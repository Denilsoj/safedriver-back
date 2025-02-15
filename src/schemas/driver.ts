import { z } from "zod";
import { isAdult } from "../utils/isAdult";
const addressSchema = z.object({
	street: z
		.string()
		.min(3, { message: "Street must have at least 3 characters" }),
	number: z
		.string()
		.regex(/^\d*?$/)
		.min(1, { message: "Number is required" }),
	city: z.string().min(2, { message: "City must have at least 2 characters" }),
	state: z
		.string()
		.length(2, { message: "State must be 2 letters (e.g., 'SP')" }),
	zipCode: z.string().regex(/^\d{8}$/, {
		message: "Zip Code must have at least 3 characters",
	}),
});

export const createDriverSchema = z.object({
	cpf: z
		.string()
		.length(11, { message: "CPF field must be 11 characters long" })
		.regex(/^\d{11}$/, { message: "CPF must contain only numbers" }),
	name: z
		.string()
		.min(3, { message: "Name field must have at least 3 characters" }),
	date_birth: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, {
			message: "Date must be in YYYY-MM-DD format",
		})
		.refine(isAdult, { message: "Driver must be at least 18 years old" }),
	email: z.string().email({ message: "E-mail invalid !" }),
	status: z.enum(["Ativo", "Inativo"]),
	telephone: z
		.string()
		.regex(/^\d*?$/)
		.optional(),
	src_cnh: z.string(),
	src_crlv: z.string(),
	address: addressSchema,
});
