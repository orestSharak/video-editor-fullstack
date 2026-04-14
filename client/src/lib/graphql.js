import { GRAPHQL_API } from '@/constants';

export const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(GRAPHQL_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) throw new Error(result.errors[0].message);
  return result.data;
};
