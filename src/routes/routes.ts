import DriverController from "../controllers/DriverController";
import type { FastifyTypedInstance } from "../types/global";

export async function routes(app: FastifyTypedInstance) {
	app.get("/driver", DriverController.show);
	app.post("/driver", DriverController.store);
	app.get("/driver/:cpf", DriverController.index);
	app.patch("/driver/:cpf", DriverController.update);
}
