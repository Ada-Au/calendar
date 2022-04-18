import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@mui/material/styles';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import client from './apolloClient';
import theme from './theme';

import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';

function App() {
  let history = createBrowserHistory();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        {/* <LanguageProvider messages={messages}> */}
        <BrowserRouter history={history}>
          <NotificationContainer />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route exact path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
        {/* </LanguageProvider> */}
      </ThemeProvider>
    </ApolloProvider>
  );
}

{
  /*
   */
}
export default App;
