import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import {
	PrismaClientKnownRequestError,
	PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { z } from "zod";
export default (
	error: FastifyError,
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	if (error instanceof z.ZodError) {
		return reply.status(400).send({
			error: "Validation error",
			message: "The data provided is invalid",
			details: error.issues.map((issue) => ({
				message: issue.message,
				fields: issue.path.join("."),
			})),
		});
	}

	if (error.validation) {
		reply.status(400).send({
			error: "Validation error",
			message: "The data provided is invalid",
			details: error.validation.map((err) => ({
				field: err.instancePath.replaceAll("/", ""),
				message: err.message,
			})),
		});
	}
	if (error instanceof PrismaClientKnownRequestError) {
		if (error.code === "P2002") {
			const target = error.meta?.target as string[];
			return reply.status(400).send({
				code: "P2002",
				error: "Unique Constraint Violation",
				message: `The fields ${target.join(", ")} must be unique`,
			});
		}
		if (error.code === "P2025") {
			return reply.status(404).send({
				code: "P2025",
				error: "Not Found",
				message: "Record not found",
			});
		}

		return reply.status(400).send({
			error: "Database Error",
			message: error.message,
			code: error.code,
		});
	}

	if (error instanceof PrismaClientValidationError) {
		return reply.status(400).send({
			error: "Database Validation Error",
			message: "The provided data does not match the expected schema",
			details: error.message,
		});
	}

	return reply.status(500).send(error.message);
};
