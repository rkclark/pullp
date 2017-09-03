import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import ApiForm from '.';

describe('ApiForm', () => {
  let component;
  let props;
  beforeEach(() => {
    props = {
      saveGithubCredentials: jest.fn(),
    };
    component = shallow(<ApiForm {...props} />);
  });

  it('renders successsfully', () => {
    expect(component).toHaveLength(1);
  });

  describe('githubClientId input field', () => {
    it('takes its value from the state', () => {
      component.setState({ githubClientId: 'test' });
      const value = component.find('[name="githubClientId"]').prop('value');
      expect(value).toBe('test');
    });
    describe('when component first loads', () => {
      it('is empty', () => {
        const value = component.find('[name="githubClientId"]').prop('value');
        expect(value).toBe('');
      });
    });

    describe('when value entered', () => {
      it('calls onChange function', () => {
        const handleChangeSpy = sinon.spy(ApiForm.prototype, 'handleChange');
        const event = { target: { name: 'githubClientId', value: 'test' } };
        const mountedComponent = mount(<ApiForm {...props} />);
        mountedComponent
          .find('[name="githubClientId"]')
          .simulate('change', event);
        expect(handleChangeSpy.called).toBe(true);
        handleChangeSpy.restore();
      });
    });
  });
  describe('githubClientSecret input field', () => {
    it('takes its value from the state', () => {
      component.setState({ githubClientSecret: 'test' });
      const value = component.find('[name="githubClientSecret"]').prop('value');
      expect(value).toBe('test');
    });
    describe('when component first loads', () => {
      it('is empty', () => {
        const value = component
          .find('[name="githubClientSecret"]')
          .prop('value');
        expect(value).toBe('');
      });
    });

    describe('when value entered', () => {
      it('calls onChange function', () => {
        const handleChangeSpy = sinon.spy(ApiForm.prototype, 'handleChange');
        const event = { target: { name: 'githubClientSecret', value: 'test' } };
        const mountedComponent = mount(<ApiForm {...props} />);
        mountedComponent
          .find('[name="githubClientSecret"]')
          .simulate('change', event);
        expect(handleChangeSpy.called).toBe(true);
        handleChangeSpy.restore();
      });
    });
  });

  describe('when githubClientId and githubClientSecret fields filled in and save button clicked', () => {
    it('calls the saveGithubCredentials action with the entered credentials', () => {
      const creds = {
        githubClientSecret: 'githubClientSecretTest',
        githubClientId: 'githubClientIdTest',
      };
      const mountedComponent = mount(<ApiForm {...props} />);
      const githubClientIdEvent = {
        target: { name: 'githubClientId', value: creds.githubClientId },
      };
      mountedComponent
        .find('[name="githubClientId"]')
        .simulate('change', githubClientIdEvent);
      const githubClientSecretEvent = {
        target: { name: 'githubClientSecret', value: creds.githubClientSecret },
      };
      mountedComponent
        .find('[name="githubClientSecret"]')
        .simulate('change', githubClientSecretEvent);
      mountedComponent.find('button').simulate('click');
      expect(props.saveGithubCredentials).toHaveBeenCalledWith(creds);
    });
  });
});
