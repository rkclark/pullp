import React from 'react';
import { shallow } from 'enzyme';
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

  describe('clientId input field', () => {
    it('takes its value from the state', () => {
      component.setState({ clientId: 'test' });
      const value = component.find('[name="clientId"]').prop('value');
      expect(value).toBe('test');
    });
    describe('when component first loads', () => {
      it('is empty', () => {
        const value = component.find('[name="clientId"]').prop('value');
        expect(value).toBe('');
      });
    });
    // TODO - sort this out
     describe('when value entered', () => {
      it('calls onChange function', () => {
        const value = component.find('[name="clientId"]').prop('value');
        expect(value).toBe('');
      });
    });
  });
  describe('clientSecret input field', () => {
    it('takes its value from the state', () => {
      component.setState({ clientSecret: 'test' });
      const value = component.find('[name="clientSecret"]').prop('value');
      expect(value).toBe('test');
    });
    describe('when component first loads', () => {
      it('is empty', () => {
        const value = component.find('[name="clientSecret"]').prop('value');
        expect(value).toBe('');
      });
    });
  });

  describe('when save button clicked', () => {
    it('calls the saveGithubCredentials action with the entered credentials', () => {
      const creds = { clientSecret: 'test', clientId: 'test' };
      component.setState(creds);
      component.find('button').simulate('click');
      expect(props.saveGithubCredentials).toHaveBeenCalledWith(creds);
    });
  });
});
