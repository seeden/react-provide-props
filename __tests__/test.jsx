import React, { Component, PropTypes } from 'react';
import should from 'should';
import { findDOMNode } from 'react-dom';
import { shallow, mount, render } from 'enzyme';
import TestUtils from 'react-addons-test-utils';
import createProvider from '../src';

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

    const wrapper = mount(
      <MyUpdatedComponent name="Zlatko" />
    );

    expect(wrapper.html()).toBe('<input type="text" placeholder="What is your favorite color Zlatko?">');

    MyUpdatedComponent.displayName.should.equal('PlaceholderProviderMyComponent');
    MyUpdatedComponent.onEnter().should.equal('onEnter function');
  });

  it('should be able to create simple provider', () => {
    const provider = createProvider('PlaceholderProvider', (props, context, ...args) => {
      return {
      placeholder: `What is your favorite color ${props.name}?`,
    };
    }, {
      placeholder: PropTypes.string,
    },{
      viewerProvider: PropTypes.object.isRequired,
    });

    @provider(true)
    class MyComponent extends Component {
      render() {
        return (
          <input type="text" placeholder={this.props.placeholder} />
        );
      }
    }

    const MyUpdatedComponent = provider(MyComponent);


    const wrapper = mount(
      <MyUpdatedComponent name="Zlatko" />
    );

    expect(wrapper.html()).toBe('<input type="text" placeholder="What is your favorite color Zlatko?">');
  });
});
