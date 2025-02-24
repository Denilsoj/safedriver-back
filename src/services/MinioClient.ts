import { Client } from "minio";
import "dotenv/config";

export const minioClient = new Client({
	endPoint: "localhost",
	port: 9000,
	useSSL: false,
	accessKey: process.env.access_key,
	secretKey: process.env.secret_key,
});

export const verifyBuncketExist = async (bucketName: string) => {
	try {
		const bucketExists = await minioClient.bucketExists(bucketName);

		if (!bucketExists) {
			console.log(`Bucket ${bucketName} não existe, criando...`);
			await minioClient.makeBucket(bucketName, "us-east-1");
			await minioClient.setBucketPolicy(
				bucketName,
				JSON.stringify({
					Version: "2012-10-17",
					Statement: [
						{
							Effect: "Allow",
							Principal: "*",
							Action: ["s3:GetObject"],
							Resource: [`arn:aws:s3:::${bucketName}/*`],
						},
					],
				}),
			);
			console.log(`Bucket ${bucketName} criado com sucesso.`);
		} else {
			console.log(`Bucket ${bucketName} já existe.`);
			return bucketExists;
		}
	} catch (error) {
		console.error("Erro ao verificar/criar bucket:", error);
	}
};

export const sendImageBucket = async (
	bucketName: string,
	fileName: string,
	fileBuffer: Buffer,
	fileLength: number,
	mimetype: string,
) => {
	try {
		const exists = await verifyBuncketExist(bucketName);

		await minioClient.putObject(bucketName, fileName, fileBuffer, fileLength, {
			"Content-Type": mimetype,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getImageBucket = async (bucketName: string, filename: string) => {
	const url = minioClient.presignedUrl("GET", bucketName, filename);
};
