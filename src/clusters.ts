import cluster from 'cluster';
import os from 'os';
import http from 'http';
import dotenv from 'dotenv';
import { handleRequest } from './handlers/requests';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4000', 10);
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(` Server running on port ${PORT}, Primary process PID: ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  // fork workers

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
  // restart worker if it worker dies
} else if (cluster.isWorker && cluster.worker) {
  // if isWorker run server om dif ports
  const server = http.createServer(handleRequest);
  const workerPort = PORT + cluster.worker.id;

  server.listen(workerPort, () => {
    console.log(`Worker ${process.pid} is running on port ${workerPort}`);
  });
}
