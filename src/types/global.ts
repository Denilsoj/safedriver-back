import type {
	RawRequestDefaultExpression,
	FastifyInstance,
	RawServerDefault,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
} from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
export type FastifyTypedInstance = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
	ZodTypeProvider
>;
