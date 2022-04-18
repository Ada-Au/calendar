import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import { Cookies } from 'react-cookie';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

const backendHost = 'http://localhost:4001/graphql';
const loginPage = 'http://localhost:3000/login';

const cookies = new Cookies();

const uploadLink = createUploadLink({
  uri: backendHost,
});

const authLink = setContext((_, { headers }) => {
  const token = cookies.get('token');

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ response, graphQLErrors }) => {
  const responseErr = response && response.errors && response.errors[0].message;
  const gqlError = graphQLErrors && graphQLErrors[0].message;
  if (
    (responseErr &&
      (responseErr.includes('Token Missing') ||
        responseErr.includes('Not Authorised'))) ||
    (gqlError && gqlError.includes('Token Missing'))
  ) {
    cookies.remove('token', { path: '/login' });
    localStorage.clear();
    window.location.href = loginPage;
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, errorLink, uploadLink]),
  cache: new InMemoryCache(),
});

export default client;
