import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';

function createComponent(providerName, fn, propTypes, contextTypes, customStatics, Component, ...args) {
  function Provider(props, context) {
    return <Component {...props} {...fn(props, context, ...args)} />;
  }

  const componentName = Component.displayName || Component.name;
  Provider.displayName = `${providerName}${componentName}`;

  hoistNonReactStatics(Provider, Component, customStatics);

  if (contextTypes) {
    Provider.contextTypes = contextTypes;
  }

  if (propTypes) {
    Component.propTypes = {
      ...Component.propTypes,
      ...propTypes,
    };
  }

  return Provider;
}

export default function provideProps(providerName, fn, propTypes, contextTypes, customStatics) {
  if (!fn) {
    throw new Error('fn is undefined');
  }

  if (!providerName) {
    throw new Error('Name is undefined');
  }

  return function provider(Component, ...args) {
    // support for decorator pattern
    if (typeof Component !== 'function') {
      return (ComponentToDecorate) => createComponent(
        providerName,
        fn,
        propTypes,
        contextTypes,
        customStatics,
        ComponentToDecorate,
        Component,
        ...args);
    }

    return createComponent(providerName, fn, propTypes, contextTypes, customStatics, Component, ...args);
  };
}
