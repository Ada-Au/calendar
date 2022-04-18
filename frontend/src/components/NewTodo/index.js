import React, { useState } from 'react';
import { Paper, TextField, Box, IconButton } from '@mui/material';
import { gql, useMutation } from '@apollo/client';

import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import { errorNotification, successNotification } from '../Notification';

const CREATE_ONE_TODO = gql`
  mutation CreateOneTodo($data: TodoCreateInput!) {
    createOneTodo(data: $data) {
      id
      title
    }
  }
`;

function NewTodo({ taskId, onToggle }) {
  const [todoData, setTodoData] = useState({});
  const [titleError, setTitleError] = useState(false);
  const [createOneTodo, { loading: loginLoading }] = useMutation(
    CREATE_ONE_TODO,
    {
      onError: (error) => {
        errorNotification(error.message);
      },
      onCompleted: () => {
        setTodoData({});
        onToggle();
        successNotification('Todo created!');
      },
    }
  );

  const handleChange = (prop) => (event) => {
    if (prop === 'title' && titleError) {
      setTitleError(false);
    }
    setTodoData({ ...todoData, [prop]: event.target.value });
  };

  const handleSubmit = () => {
    if (!todoData.title) {
      setTitleError(true);
      errorNotification('No title is set');
    } else
      createOneTodo({
        variables: {
          data: { ...todoData, task: { connect: { id: +taskId } } },
        },
      });
  };

  return (
    <Paper sx={{ p: 2, flexDirection: 'column', display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pb: 1 }}>
        <TextField
          sx={{ maxWidth: 300 }}
          label="Title"
          color="highlight"
          size="small"
          required
          onChange={handleChange('title')}
          error={titleError}
        />
        <div style={{ flex: 1 }} />
        <IconButton onClick={onToggle}>
          <CloseIcon />
        </IconButton>
        <IconButton onClick={handleSubmit}>
          <DoneIcon />
        </IconButton>
      </Box>
      <TextField
        label="Description"
        color="highlight"
        size="small"
        multiline
        onChange={handleChange('description')}
      />
    </Paper>
  );
}

export default NewTodo;
