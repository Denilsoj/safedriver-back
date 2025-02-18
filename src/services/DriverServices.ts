import { prisma } from "../database/connection";
import type { Driver } from "../types/driver";

class DriverServices {
	async create(driverData: Driver) {
		try {
			const createUser = await prisma.driver.create({
				data: {
					cpf: driverData.cpf,
					name: driverData.name,
					date_birth: new Date(driverData.date_birth),
					email: driverData.email,
					status: driverData.status,
					src_cnh: driverData.src_cnh,
					src_crlv: driverData.src_crlv,
					address: {
						create: driverData.address,
					},
				},
			});
			return createUser;
		} catch (error) {
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw error;
		}
	}
}

export default new DriverServices();
