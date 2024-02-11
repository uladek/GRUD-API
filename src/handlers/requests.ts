import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';

// const users = [
//     { id: '1', name: 'Uladz' },
//     { id: '2', name: 'Uladzimir' },
//     { id: '3', name: 'Vova' },
// ];
const users: { id: string, name: string }[] = [];
// const USERS_FILE_PATH = 'users.json';


// const database: { id: string, name: string }[] = [];


export function handleRequest(req: IncomingMessage, res: ServerResponse) {

    console.log("REC:" , req );
    const { method, url } = req;
    console.log(`${method} ${url}`);


    if (url === '/api/users' && method === 'POST') {
        handleCreateUser(req, res);

     } else if (url === '/api/users' && method === 'GET') {
        handleGetUsers(req, res);
        // curl http://localhost:3003/api/users

    } else if (url && url.startsWith('/api/users/') && method === 'GET') {
        const userId = url.split('/').pop();
        handleGetUserById(req, res, userId);
        // curl http://localhost:3003/api/users/1



    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid endpoint' }));
    }
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
            // Проверяем, что в теле запроса есть все необходимые поля
            if (!userData || !userData.name) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Missing required fields' }));
                return;
            }

            const newUser = addUser(userData.name);

            // Сохраняем нового пользователя в базе данных
            // const newUser = { id: generateUserId(), name: userData.name };
            // database.push(newUser);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error' }));
        }
    });
}

// function addUser(name: string): { id: string, name: string } {
//     const id = generateUserId();
//     const newUser = { id, name };
//     users.push(newUser);
//     return newUser;
// }

function addUser(name: string): { id: string, name: string } {
    const id = uuidv4();
    const newUser = { id, name };
    users.push(newUser);
    return newUser;
}

// function generateUserId(): string {
//     // Генерируем уникальный идентификатор пользователя (просто для примера)
//     return Math.random().toString(36).substring(2, 10);
// }


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
