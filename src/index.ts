import * as http from 'http';
import { handleRequest } from '../src/handlers/requests';


const server = http.createServer(handleRequest);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
