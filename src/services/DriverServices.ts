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

	async getAll() {
		try {
			const drivers = await prisma.driver.findMany({
				include: { address: true },
			});

			return drivers;
		} catch (error) {
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw error;
		}
	}
	async getDriverBy(cpf: string) {
		try {
			const driver = await prisma.driver.findUnique({
				where: {
					cpf: cpf,
				},
				include: {
					address: true,
				},
			});
			return driver ? driver : "Motorista não cadastrado";
		} catch (error) {
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw error;
		}
	}
}

export default new DriverServices();
