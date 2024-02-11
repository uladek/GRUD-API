import { IncomingMessage, ServerResponse } from 'http';

const users = [
    { id: '1', name: 'Uladz' },
    { id: '2', name: 'Uladzimir' },
    { id: '3', name: 'Vova' },
    { id: '3', name: 'Vova2' }

];

export function handleRequest(req: IncomingMessage, res: ServerResponse) {
    const { method, url } = req;
    console.log(`${method} ${url}`);

    if (url === '/api/users' && method === 'GET') {
        handleGetUsers(req, res);
        // curl http://localhost:3001/api/users

    } else if (url && url.startsWith('/api/users/') && method === 'GET') {
        const userId = url.split('/').pop();
        handleGetUserById(req, res, userId);
        // curl http://localhost:3001/api/users/1

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid endpoint' }));
    }
}

function handleGetUsers(req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}


function handleGetUserById(
    req: IncomingMessage, res: ServerResponse, userId: string | undefined) {
    if (!userId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid userId' }));
        return;
    }

    const user = users.find(user => user.id === userId);
    if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
    }
}
