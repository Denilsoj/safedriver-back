import type { FastifyRequest, FastifyReply } from "fastify";
import DriverServices from "../services/DriverServices";
import { DriverSchema, DriverSchemaUpdated } from "../models/DriverModel";
import { generateUniqueFilename } from "../utils/helpers";
import { FileSchema } from "../models/FilesModel";
import { sendImageBucket } from "../services/MinioClient";

class DriverController {
	async show(req: FastifyRequest, reply: FastifyReply) {
		try {
			const drivers = await DriverServices.getAll();
			reply.status(200).send(drivers);
		} catch (error) {
			error;
		}
	}
	async index(
		req: FastifyRequest<{ Params: { cpf: string } }>,
		reply: FastifyReply,
	) {
		const { cpf } = req.params;
		console.log(cpf);
		const driver = await DriverServices.getDriverBy(cpf);

		return reply.status(200).send(driver);
	}
	async store(req: FastifyRequest, reply: FastifyReply) {
		try {
			const bucketName = process.env.bucket_name as string;

			const fields: Record<string, unknown> = {};
			const filesInfo = [];
			for await (const part of req.parts()) {
				if (part.type === "file") {
					const filename = generateUniqueFilename(
						part.fieldname,
						part.filename,
						fields.name,
					);

					const buffer = await part.toBuffer();

					const validatioFile = FileSchema.parse({
						filename: filename,
						mimetype: part.mimetype,
						size: buffer.byteLength,
					});
					const filepath = `${process.env.minio_api_endpoint}${process.env.bucket_name}/${filename}`;

					// console.log(filepath);
					filesInfo.push({
						filename: filename,
						fieldname: part.fieldname,
						filepath: filepath,
						size: buffer.byteLength,
					});

					await sendImageBucket(
						bucketName,
						filename,
						buffer,
						buffer.byteLength,
						part.mimetype,
					);
				}

				if (part.type === "field") {
					if (part.fieldname === "address") {
						if (typeof part.value === "string") {
							fields[part.fieldname] = JSON.parse(part.value);
						}
					} else if (part.fieldname !== "address") {
						fields[part.fieldname] = part.value;
					}
				}
			}
			for (const file of filesInfo) {
				fields[file.fieldname] = file.filepath;
			}

			const dataValidation = DriverSchema.parse(fields);
			const driver = await DriverServices.create(dataValidation);

			return reply.status(201).send(driver);
		} catch (e) {
			return reply.send(e);
		}
	}

	async update(
		req: FastifyRequest<{ Params: { cpf: string } }>,
		reply: FastifyReply,
	) {
		try {
			const bucketName = process.env.bucket_name as string;
			const fields: Record<string, unknown> = {};
			const files = [];
			const parts = await req.parts();
			const { cpf } = req.params;
			for await (const part of parts) {
				if (part.type === "file") {
					const filename = generateUniqueFilename(
						part.fieldname,
						part.filename,
						fields.name,
					);
					const filepath = `${process.env.minio_api_endpoint}${process.env.bucket_name}/${filename}`;
					const buffer = await part.toBuffer();
					files.push({
						filename: filename,
						fieldname: part.fieldname,
						filepath: filepath,
						size: buffer.byteLength,
					});
					await sendImageBucket(
						bucketName,
						filename,
						buffer,
						buffer.byteLength,
						part.mimetype,
					);
				}

				if (part.type === "field") {
					if (part.fieldname === "address") {
						if (typeof part.value === "string") {
							fields[part.fieldname] = JSON.parse(part.value);
						}
					} else if (part.fieldname !== "address") {
						fields[part.fieldname] = part.value;
					}
				}
			}
			for (const file of files) {
				fields[file.fieldname] = file.filepath;
			}
			const dataValidation = DriverSchemaUpdated.parse(fields);
			const driver = DriverServices.update(dataValidation, cpf);

			reply.status(200).send(driver);
		} catch (error) {
			reply.status(400).send(error);
		}
	}
}

export default new DriverController();
