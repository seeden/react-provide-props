import { createElement } from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

function createComponent(providerName, fn, propTypes, customStatics, Component) {
  function Provider(props, ...args) {
    return createElement(Component, {
      ...props,
      ...fn(props, ...args),
    });
  }

  const componentName = Component.displayName || Component.name;
  Provider.displayName = `${componentName}${providerName}`;

  if (propTypes) {
    Component.propTypes = {
      ...Component.propTypes,
      ...propTypes,
    };
  }

  hoistNonReactStatics(Provider, Component, customStatics);

  return Provider;
}

export default function provideProps(providerName, fn, propTypes, customStatics) {
  if (!fn) {
    throw new Error('fn is undefined');
  }

  if (!providerName) {
    throw new Error('Name is undefined');
  }

  return function provider(...args) {
    // support for decorator pattern
    if (args.length === 0) {
      return (Component) => createComponent(providerName, fn, propTypes, customStatics, Component);
    }

    return createComponent(providerName, fn, propTypes, customStatics, ...args);
  };
}
