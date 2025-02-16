import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
	validatorCompiler,
	serializerCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { routes } from "./routes/routes";
import errorHandler from "./errors/errorHandler";
import fastifyMultipar from "@fastify/multipart";
const app = fastify({
	logger: true,
}).withTypeProvider<ZodTypeProvider>();
app.register(fastifyMultipar);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, { origin: "*" });
app.register(routes);
app.setErrorHandler(errorHandler);

const server = async () => {
	try {
		await app.listen({ port: 8080 });
		console.log("Server listening on http://localhost:8080");
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

server();
