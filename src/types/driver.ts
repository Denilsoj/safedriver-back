import type { z } from "zod";
import type { DriverSchema, DriverSchemaUpdated } from "../models/DriverModel";

export type Driver = z.infer<typeof DriverSchema>;
export type DriverUpdate = z.infer<typeof DriverSchemaUpdated>;
