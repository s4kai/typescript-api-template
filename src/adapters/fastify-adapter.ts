import { FastifyReply, FastifyRequest } from "fastify";

export default class ExpressAdapter {
  static create(fn: Function) {
    return async function (req: FastifyRequest, res: FastifyReply) {
      const obj = await fn(req.params, req.body);

      return res.send(obj);
    };
  }
}
