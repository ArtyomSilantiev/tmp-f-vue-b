import { Route } from 'vue-router';

export interface IMiddlewareContext {
  to: Route,
  from: Route,
  next: Function
}

export interface IMiddleware {
    (context: IMiddlewareContext): void;
}

export default class MiddlewareWrapper {
    public middleware: IMiddleware;

    constructor (middleware: IMiddleware) {
        this.middleware = middleware;
    }
}
