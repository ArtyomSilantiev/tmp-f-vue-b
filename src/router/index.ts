import Vue from "vue";
import VueRouter, { Route } from "vue-router";
import { routes } from "./routes";
import store from "@/store";
import MiddlewareWrapper, { IMiddlewareContext } from '@/middleware/MiddlewareWrapper';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes
});
export default router;

router.beforeEach(async (to: Route, from: Route, next: Function) => {
  if (!to.meta.middleware) {
    return next();
  }
  const middleware = <MiddlewareWrapper[]>to.meta.middleware;
  const context = {
    to,
    from,
    next,
    store
  };
  return middleware[0].middleware({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  });
});

function middlewarePipeline(
  context: IMiddlewareContext,
  middleware: MiddlewareWrapper[],
  index: number
) {
  if (!middleware || !middleware[index]) {
    return context.next;
  }
  const nextMiddleware = middleware[index].middleware;
  if (!nextMiddleware) {
    return context.next;
  }
  return () => {
    const nextPipeline = middlewarePipeline(context, middleware, index + 1);
    nextMiddleware({ ...context, next: nextPipeline });
  };
}
