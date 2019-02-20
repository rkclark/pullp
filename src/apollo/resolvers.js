import { get } from 'lodash';
import gql from 'graphql-tag';

export default {
  Mutation: {
    toggleSelectedRepo: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({
        __typename: 'Repository',
        id: variables.id,
      });

      const fragment = gql(`
        fragment selectedRepo on Repository {
          isSelected
        }`);

      const repo = cache.readFragment({ fragment, id });
      const data = { ...repo, isSelected: !repo.isSelected };

      cache.writeData({ id, data });

      return null;
    },
    clearSelectedRepos: (_, variables, { cache }) => {
      // Get entire data store object from cache
      const cacheData = get(cache, 'data.data');

      if (!cacheData) {
        return null;
      }

      // Filter cache data to only Repository items
      const repos = Object.entries(cacheData).filter(({ 0: id }) =>
        id.startsWith('Repository:'),
      );

      // Filter Repositories to only those that are selected
      const selectedRepos = repos.filter(({ 1: value }) => value.isSelected);

      const fragment = gql(`
        fragment selectedRepo on Repository {
          isSelected
        }`);

      // Iterate through selected repos and set their isSelected flag to false
      selectedRepos.forEach(({ 0: id }) => {
        const repoFragment = cache.readFragment({
          fragment,
          id,
        });

        const data = {
          ...repoFragment,
          isSelected: false,
        };

        cache.writeData({ id, data });
      });

      return null;
    },
  },
  Repository: {
    isSelected: (_, variables, { cache, getCacheKey }) => {
      // Look for existing repo with this id in the cache
      const id = getCacheKey({
        __typename: 'Repository',
        id: _.id,
      });

      // This repo isn't in the cache, so isSelected must be false
      if (!id) {
        return false;
      }

      const fragment = gql(`
        fragment selectedRepo on Repository {
          isSelected
        }`);

      const repo = cache.readFragment({ fragment, id });

      // Repo is selected in the cache, so set isSelected to true
      if (repo && repo.isSelected) {
        return true;
      }

      // Repo is not selected in the cache, so set isSelected to false
      return false;
    },
  },
};
