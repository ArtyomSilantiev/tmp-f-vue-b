// Load layout components dynamically.
const requireContext = require.context('../layouts', false, /.*\.vue$/)
export const layouts = requireContext.keys()
  .map(file =>
    [file.replace(/(^.\/)|(\.vue$)/g, ''), requireContext(file)]
  )
  .reduce((components: any, [name, component]) => {
    components[name] = component.default || component;
    return components;
  }, {});
