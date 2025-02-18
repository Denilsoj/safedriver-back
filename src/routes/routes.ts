import DriverController from "../controllers/DriverController";
import type { FastifyTypedInstance } from "../types/global";
import { CreateDriverSchema } from "../models/DriverModel";
import { z } from "zod";
export async function routes(app: FastifyTypedInstance) {
	app.get("/driver", DriverController.show);
	app.post("/driver", DriverController.store);
}
