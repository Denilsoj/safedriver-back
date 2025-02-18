import type { FastifyRequest, FastifyReply } from "fastify";
import DriverServices from "../services/DriverServices";
import { DriverSchema } from "../models/DriverModel";
import { generateUniqueFilename } from "../utils/helpers";
import { FileSchema } from "../models/FilesModel";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";
class DriverController {
	async show(req: FastifyRequest, reply: FastifyReply) {
		reply.send([]);
	}

	async store(req: FastifyRequest, reply: FastifyReply) {
		try {
			const PATHFILES = join(process.cwd(), "upload");
			const MAXFILES = 2;
			let chekoutFiles = 0;
			if (!existsSync(PATHFILES)) {
				try {
					mkdirSync(PATHFILES, { recursive: true });
					console.log(`INFO:. Upload directory created in: ${PATHFILES}`);
				} catch (error) {
					console.log(`ERROR:. Error creating upload directory: ${PATHFILES}`);
				}
			}
			const filesProcess = [];
			const fields: Record<string, unknown> = {};
			const filesInfo = [];
			for await (const part of req.parts()) {
				if (part.type === "file") {
					if (chekoutFiles > MAXFILES) {
						return reply.status(400).send({
							error: "Too many files",
							message: `You can upload a maximum of ${MAXFILES} files.`,
						});
					}
					chekoutFiles++;

					filesProcess.push(part);
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

					const filepath = join(PATHFILES, filename);

					filesInfo.push({
						filename: filename,
						fieldname: part.fieldname,
						filepath: filepath,
						size: buffer.byteLength,
					});
					chekoutFiles++;
					await Bun.write(filepath, buffer);
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
			const user = await DriverServices.create(dataValidation);

			return reply.status(201).send();
		} catch (e) {
			return reply.send(e);
		}
	}
}

export default new DriverController();
