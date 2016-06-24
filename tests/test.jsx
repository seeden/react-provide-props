import React, { PropTypes } from 'react';
import should from 'should';
import createProvider from '../dist';
import { renderJSX } from '../utils/tester';
import { findDOMNode } from 'react-dom';
import TestUtils from 'react-addons-test-utils';

describe('provider', () => {
  it('should be able to create simple provider', () => {
    const provider = createProvider('PlaceholderProvider', (props, context) => ({
      placeholder: `What is your favorite color ${props.name}?`,
    }), {
      placeholder: PropTypes.string,
    });

    function MyComponent(props) {
      return (
        <input type="text" placeholder={props.placeholder} />
      );
    }

    MyComponent.onEnter = () => 'onEnter function';

    const MyUpdatedComponent = provider(MyComponent);

    const node = renderJSX(
      <MyUpdatedComponent name="Zlatko" />
    );

    findDOMNode(node).nodeName.should.equal('INPUT');
    findDOMNode(node).getAttribute('placeholder').should.equal('What is your favorite color Zlatko?');

    MyUpdatedComponent.displayName.should.equal('PlaceholderProviderMyComponent');
    MyUpdatedComponent.onEnter().should.equal('onEnter function');
  });
});
