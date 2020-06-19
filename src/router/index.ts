import Vue, { Component, ComponentOptions } from 'vue';
import VueRouter, { Route } from 'vue-router';
import { routes } from './routes';

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes
});
export default router;

interface VueComponentBody {
  middleware?: string[];
  layout?: string;
}

// The middleware for every page of the application.
const globalMiddleware = ['check-auth'];

router.beforeEach(async (to: Route, from: Route, next: Function) => {
  let components: VueComponentBody[] = [];

  try {
    // Get the matched components and resolve them.
    components = await resolveComponents(
      router.getMatchedComponents({ ...to })
    )
  } catch (error) {
    if (/^Loading( CSS)? chunk (\d)+ failed\./.test(error.message)) {
      window.location.reload(true)
      return
    }
  }

  if (components.length === 0) {
    return next();
  }

  // Get the middleware for all the matched components.
  const middleware = getMiddleware(components);

  // Call each middleware.
  callMiddleware(middleware, to, from, (...args: any[]) => {
    // Set the application layout only if "next()" was called with no args.
    if (args.length === 0) {
      router.app.$children[0].setLayout(components[0].layout || '')
    }

    next(...args)
  })
});

/**
 * Resolve async components.
 *
 * @param  {Array} components
 * @return {Array}
 */

function resolveComponents (components: any[]) {
  return Promise.all(components.map(component => {
    return typeof component === 'function' ? component() : component
  }))
}

/**
 * Merge the the global middleware with the components middleware.
 *
 * @param  {Array} components
 * @return {Array}
 */
function getMiddleware (components: VueComponentBody[]) {
  const middleware = [...globalMiddleware];

  components.filter(c => c.middleware).forEach(component => {
    if (Array.isArray(component.middleware)) {
      middleware.push(...component.middleware)
    }
  })

  return middleware
}

const requireContext = require.context('../middleware', false, /.*\.ts$/);
const routeMiddleware = (() => {
  return requireContext.keys()
    .map((file: string) => {
      return [file.replace(/(^.\/)|(\.ts$)/g, ''), requireContext(file)];
    })
    .reduce((guards: any, [name, guard]) => {
      return { ...guards, [name]: guard.default };
    }, {})
})();

/**
 * Call each middleware.
 *
 * @param {Array} middleware
 * @param {Route} to
 * @param {Route} from
 * @param {Function} next
 */
const callMiddleware = (middleware: any[], to: Route, from: Route, next: Function) => {
  const stack = middleware.reverse()

  const _next = (...args: any[]) => {
    // Stop if "_next" was called with an argument or the stack is empty.
    if (args.length > 0 || stack.length === 0) {
      return next(...args)
    }

    const middleware = stack.pop()

    if (typeof middleware === 'function') {
      middleware(to, from, _next)
    } else if (routeMiddleware[middleware]) {
      routeMiddleware[middleware](to, from, _next)
    } else {
      throw Error(`Undefined middleware [${middleware}]`)
    }
  }

  _next()
}
