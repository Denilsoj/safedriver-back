import type { z } from "zod";
import type { DriverSchema } from "../models/DriverModel";

export type Driver = z.infer<typeof DriverSchema>;
