import * as http from 'http';
import { handleRequest } from '../src/handlers/requests';
import dotenv from 'dotenv';

dotenv.config();
const PORT = parseInt(process.env.PORT || '4000', 10);

const server = http.createServer(handleRequest);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
