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

function TodoItem({ id, isEdit, isDelete, onToggleDelete }) {
  const [open, setOpen] = useState(false);
  const { data, loading, error, refetch } = useQuery(TODO, {
    variables: { where: { id } },
  });

  const [toggleCompleteTodo] = useMutation(TOGGLE_COMPLETE_TODO, {
    onCompleted: () => {
      refetch();
    },
  });

  const handleToggleComplete = () => {
    toggleCompleteTodo({ variables: { id } });
  };

  const handleToggleDelete = () => {
    onToggleDelete(id);
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    console.log('error', error);
    // todo: error page
    return;
  }
  const { title, description, completed } = data.todo;

  return (
    <Paper sx={{ p: 1, my: 1 }}>
      <Wrapper>
        <Checkbox
          indeterminate={isEdit ? isDelete : false}
          checked={isEdit ? false : completed}
          onChange={isEdit ? handleToggleDelete : handleToggleComplete}
          color={isEdit ? 'highlight' : 'primary'}
          sx={{ color: isEdit ? 'highlight.main' : '' }}
        />

        <Typography>{title}</Typography>
        {description && (
          <IconButton
            onClick={() => setOpen((prev) => !prev)}
            sx={{ ml: 'auto' }}
          >
            <ExpandMoreIcon />
          </IconButton>
        )}
      </Wrapper>
      {description && (
        <Collapse in={open}>
          <Typography variant="body2" sx={{ p: 1 }}>
            {description}
          </Typography>
        </Collapse>
      )}
    </Paper>
  );
}

export default TodoItem;
