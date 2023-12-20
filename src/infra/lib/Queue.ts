import Queue from "bull";

import * as jobs from "@/core/jobs";
import { redisConfig } from "../config/redis";

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, {
    redis: redisConfig,
  }),
  name: job.key,
  handle: job.handle,
}));

export default {
  queues,
  add(name: string, data: any) {
    const queue = this.queues.find((queue) => queue.name === name);

    return queue?.bull.add(data);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);

      console.log(`Queue ${queue.name}: processing`);

      queue.bull.on("failed", (job, err) => {
        console.log("Job failed", queue.name, job.data);
        console.log(err);
      });
    });
  },
};
