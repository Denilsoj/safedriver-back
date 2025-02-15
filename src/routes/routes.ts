import DriverController from "../controllers/DriverController";
import type { FastifyTypedInstance } from "../types/global";
import { createDriverSchema } from "../schemas/driver";

export async function routes(app: FastifyTypedInstance) {
	app.get("/driver", DriverController.show);
	app.post(
		"/driver",
		{
			schema: {
				body: createDriverSchema,
			},
		},
		DriverController.store,
	);
}
