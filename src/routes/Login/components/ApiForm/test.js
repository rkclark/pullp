import React from 'react';
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

  describe('when githubClientId and githubClientSecret fields filled in and save button clicked', () => {
    it('calls the saveGithubCredentials action with the entered credentials', () => {
      const creds = {
        githubClientSecret: 'githubClientSecretTest',
        githubClientId: 'githubClientIdTest',
      };
      const mountedComponent = mount(<ApiForm {...props} />);
      mountedComponent.find('[name="githubClientId"]').node.value =
        creds.githubClientId;
      mountedComponent.find('[name="githubClientSecret"]').node.value =
        creds.githubClientSecret;
      mountedComponent.find('button').simulate('click');
      expect(props.saveGithubCredentials).toHaveBeenCalledWith(creds);
    });
  });
});
