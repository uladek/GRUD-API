import * as http from 'http';
import { handleRequest } from '../src/handlers/requests';
import dotenv from 'dotenv';

dotenv.config();
const server = http.createServer(handleRequest);

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
