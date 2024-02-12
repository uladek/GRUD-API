import { IncomingMessage, ServerResponse } from 'http';
import { IUser } from 'src/types/types';
import { v4 as uuidv4, validate as validateUUID } from 'uuid';

// const users: { id: string, name: string }[] = [];
const users: IUser[] = [];

export function handleRequest(req: IncomingMessage, res: ServerResponse) {

    const { method, url } = req;

    if (url === '/api/users' && method === 'POST') {
        handleCreateUser(req, res);
     } else if (url === '/api/users' && method === 'GET') {
        handleGetUsers(req, res);
    } else if (url && url.startsWith('/api/users/') && method === 'GET') {
        const userId = url.split('/').pop();
        handleGetUserById(req, res, userId);
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
    if (!userId || !validateUUID(userId)) {
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
        res.end(JSON.stringify({ error: `User doesn't exist` }));
    }
}

function handleUpdateUser(
    req: IncomingMessage, res: ServerResponse, userId: string | undefined) {
    if (!userId || !validateUUID(userId)) {
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
            if (
                !userData || !userData.username || !userData.age || !userData.hobbies) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required fields' }));
                return;
            }

            const updatedUser = updateUser(
                userId, userData.username, userData.age, userData.hobbies);
            if (updatedUser) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(updatedUser));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(
                    { error: `User with id ${userId} doesn't exist` }));
            }
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

function updateUser(
    userId: string,
    newUsername: string,
    newAge: number,
    newHobbies: string[]
    ): IUser | undefined {
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        users[userIndex].age = newAge;
        users[userIndex].hobbies = newHobbies;
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
            if (
                !userData
                || !userData.username
                || !userData.age
                || !userData.hobbies
                ) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required fields' }));
                return;
            }

            const newUser =
             addUser(userData.username, userData.age, userData.hobbies);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

function addUser(username: string, age: number, hobbies: string[]): IUser {
    const id = uuidv4();
    const newUser: IUser = { id, username, age, hobbies };
    users.push(newUser);
    return newUser;
}

function handleGetUserById(
    req: IncomingMessage, res: ServerResponse, userId: string | undefined) {
        if (!userId || !validateUUID(userId)) {
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
            res.end(JSON.stringify(
                { error: `User with userId ${userId} doesn't exist` }));
        }
    }
