import React, { useState } from 'react';
import {
  styled,
  Typography,
  Checkbox,
  IconButton,
  Paper,
  Collapse,
} from '@mui/material';
import 'react-calendar/dist/Calendar.css';
import { gql, useMutation, useQuery } from '@apollo/client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingSpinner from '../LoadingSpinner';

const TOGGLE_COMPLETE_TODO = gql`
  mutation ToggleCompleteTodo($id: Int!) {
    toggleCompleteTodo(id: $id) {
      id
      title
      completed
    }
  }
`;

const TODO = gql`
  query Todo($where: TodoWhereUniqueInput!) {
    todo(where: $where) {
      id
      title
      description
      completed
    }
  }
`;

const Wrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

function TodoItem({ id }) {
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useQuery(TODO, {
    variables: { where: { id } },
  });

  const [toggleCompleteTodo] = useMutation(TOGGLE_COMPLETE_TODO);

  const handleToggleComplete = () => {
    toggleCompleteTodo({ variables: { id } });
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    console.log('error', error);
    // todo: error page
    return;
  }
  const todo = data.todo;
  return (
    <Paper sx={{ p: 1, my: 1 }}>
      <Wrapper>
        <Checkbox
          checked={todo.completed}
          onChange={handleToggleComplete}
          color="highlight"
        />
        <Typography>{todo.title}</Typography>
        {todo.description && (
          <>
            <div style={{ flex: 1 }} />
            <IconButton onClick={() => setOpen((prev) => !prev)}>
              <ExpandMoreIcon />
            </IconButton>
          </>
        )}
      </Wrapper>
      {todo.description && (
        <Collapse in={open}>
          <Typography variant="body2" sx={{ p: 1 }}>
            {todo.description}
          </Typography>
        </Collapse>
      )}
    </Paper>
  );
}

export default TodoItem;
