// import { IncomingMessage, ServerResponse } from 'http';

// type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

// interface Route {
//     method: string;
//     path: string;
//     handler: RouteHandler;
// }

// export class Router {
//     private routes: Route[] = [];

//     get(path: string, handler: RouteHandler) {
//         this.routes.push({ method: 'GET', path, handler });
//     }

//     post(path: string, handler: RouteHandler) {
//         this.routes.push({ method: 'POST', path, handler });
//     }

//     put(path: string, handler: RouteHandler) {
//         this.routes.push({ method: 'PUT', path, handler });
//     }

//     delete(path: string, handler: RouteHandler) {
//         this.routes.push({ method: 'DELETE', path, handler });
//     }


// }
