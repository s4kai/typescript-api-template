import Fastify from "fastify";

export const server = Fastify({});

server.get("/", async (request, reply) => {
  reply.send({ message: "Hello Fastify" });
});
