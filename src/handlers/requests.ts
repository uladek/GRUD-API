import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate } from 'uuid';
import { UUID_REGEX } from '../constants/constants'

const users: { id: string, name: string }[] = [];


export function handleRequest(req: IncomingMessage, res: ServerResponse) {

    console.log("REC:" , req );
    const { method, url } = req;
    console.log(`${method} ${url}`);


    if (url === '/api/users' && method === 'POST') {
        handleCreateUser(req, res);
        // http://localhost:3003/api/users + body

     } else if (url === '/api/users' && method === 'GET') {
        handleGetUsers(req, res);
        // http://localhost:3003/api/users

    } else if (url && url.startsWith('/api/users/') && method === 'GET') {
        const userId = url.split('/').pop();
        handleGetUserById(req, res, userId);
        //  http://localhost:3003/api/users/{id}
        // {"name": "Uladz"}

    } else if (url && url.startsWith('/api/users/') && method === 'PUT') {
        const userId = url.split('/').pop();
        handleUpdateUser(req, res, userId);
    } else if (url && url.startsWith('/api/users/') && method === 'DELETE') {
        const userId = url.split('/').pop();
        handleDeleteUser(req, res, userId);
    }else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid endpoint' }));
    }
}

function handleDeleteUser(
    req: IncomingMessage, res: ServerResponse, userId: string | undefined) {
    if (!userId || !isValidUUID(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid userId' }));
        return;
    }

    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.writeHead(204);
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
    }
}

// function isValidUUID(uuid: string): boolean {
//     return /^[0-9a-fA-F]{8}(-[0-9a-fA-F]{4}){4}[0-9a-fA-F]{12}$/.test(uuid);
// }

// function isValidUUID(uuid: string): boolean {
//     return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);
// }

const isValidUUID = (uuid: string) => UUID_REGEX.test(uuid);

function handleUpdateUser(
    req: IncomingMessage, res: ServerResponse, userId: string | undefined) {
    if (!userId || !validate(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid userId' }));
        return;
    }

    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const userData = JSON.parse(body);
            if (!userData || !userData.name) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required fields' }));
                return;
            }

            const updatedUser = updateUser(userId, userData.name);
            if (updatedUser) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedUser));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

function updateUser(
    userId: string, newName: string): { id: string, name: string } | undefined {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].name = newName;
        return users[userIndex];
    }
    return undefined;
}



function handleGetUsers(req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

function handleCreateUser(req: IncomingMessage, res: ServerResponse) {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const userData = JSON.parse(body);
            if (!userData || !userData.name) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required fields' }));
                return;
            }

            const newUser = addUser(userData.name);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}


function addUser(name: string): { id: string, name: string } {
    const id = uuidv4();
    const newUser = { id, name };
    users.push(newUser);
    return newUser;
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
