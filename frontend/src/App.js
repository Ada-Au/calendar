import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@mui/material/styles';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import CssBaseline from '@mui/material/CssBaseline';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import client from './apolloClient';
import theme from './theme';

import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import TaskPage from './containers/TaskPage';
import TaskCreatePage from './containers/TaskCreatePage';

function App() {
  let history = createBrowserHistory();

  return (
    <ApolloProvider client={client}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* <LanguageProvider messages={messages}> */}
          <BrowserRouter history={history}>
            <NotificationContainer />
            <Routes>
              <Route exact path="/home" element={<HomePage />} />
              <Route exact path="/" element={<LoginPage />} />
              <Route path="/task/:id" element={<TaskPage />} />
              <Route path="/createTask" element={<TaskCreatePage />} />
            </Routes>
          </BrowserRouter>
          {/* </LanguageProvider> */}
        </ThemeProvider>
      </LocalizationProvider>
    </ApolloProvider>
  );
}

export default App;
