
import type { FastifyRequest, FastifyReply } from "fastify";

class DriverController{

    async show(req: FastifyRequest, reply:FastifyReply){
        reply.send([])
    }
}


export default new DriverController()