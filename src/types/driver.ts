import type { z } from "zod";
import type { createDriverSchema } from "../schemas/driver";

export type ReqDriverBodyStore = z.infer<typeof createDriverSchema>;
