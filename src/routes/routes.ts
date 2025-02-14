import type { FastifyInstance } from 'fastify'
import DriverController from '../controllers/DriverController'


export async function routes(app:FastifyInstance) {
    app.get('/', DriverController.show)
} 