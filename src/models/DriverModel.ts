import { z } from "zod";
import { isAdult } from "../utils/helpers";
import { AddressSchema } from "./AddressModel";

export const DriverSchema = z.object({
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
		.refine(isAdult, {
			message: "Driver must be at least 18 years old",
		}),
	email: z.string().email({ message: "E-mail invalid !" }),
	status: z.enum(["Ativo", "Inativo"]).default("Ativo"),
	telephone: z
		.string()
		.regex(/^\d*?$/)
		.optional(),
	src_cnh: z.string().min(1, { message: "src_cnh filed is required" }),
	src_crlv: z.string().min(1, { message: "src_crlv filed is required" }),
	address: AddressSchema,
});
