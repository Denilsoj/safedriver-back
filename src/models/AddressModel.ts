import { z } from "zod";

export const AddressSchema = z.object({
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
	zip_code: z.string().regex(/^\d{8}$/, {
		message: "Zip Code must have at least 8 characters",
	}),
});
