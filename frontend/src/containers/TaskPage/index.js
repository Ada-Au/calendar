import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import {
  styled,
  Box,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

import AddIcon from '@mui/icons-material/Add';

import Drawer from '../../components/Drawer';
import LoadingSpinner from '../../components/LoadingSpinner';
import NewTodo from '../../components/NewTodo';
import TodoItem from '../../components/TodoItem';

const TASK = gql`
  query Task($id: Int!) {
    task(where: { id: $id }) {
      title
      description
      completed
      startTime
      endTime
      isFullDay
      todos {
        id
      }
    }
  }
`;

const ContentWrapper = styled(Box)(() => ({
  padding: '0px 32px',
  maxWidth: 700,
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
}));

const Wrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  overflowY: 'auto',
  backgroundColor: theme.palette.common.white,
}));

function TaskPage() {
  const [isCreate, setIsCreate] = useState(false);
  const { id } = useParams();
  const { data, loading, error, refetch } = useQuery(TASK, {
    variables: { id: +id },
  });

  const fullOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const TimeOnlyOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };

  const handleCreateTodo = () => {
    setIsCreate((prev) => !prev);
    refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error) {
    console.log('error', error);
    // todo: error page
    return;
  }

  const {
    title,
    description,
    completed,
    startTime,
    endTime,
    isFullDay,
    todos,
  } = data.task;
  return (
    <Box>
      <Wrapper>
        <Drawer />
        <ContentWrapper>
          <Typography variant="h3" sx={{ pt: 8, pb: 1 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" sx={{ pb: 1 }}>
              {description}
            </Typography>
          )}
          <Divider />
          <Box sx={{ pt: 2.5, pb: 1 }}>
            {isFullDay ? (
              <></>
            ) : (
              <Typography variant="body1">
                {new Date(startTime).toLocaleString('en-GB', fullOptions)}{' '}
                {endTime
                  ? ` to ${new Date(endTime).toLocaleString(
                      'en-GB',
                      new Date(startTime).getFullYear() ===
                        new Date(endTime).getFullYear() &&
                        new Date(startTime).getMonth() ===
                          new Date(endTime).getMonth() &&
                        new Date(startTime).getDate() ===
                          new Date(endTime).getDate()
                        ? TimeOnlyOptions
                        : fullOptions
                    )}`
                  : ''}
              </Typography>
            )}

            <FormControlLabel
              label="Complete"
              control={
                <Checkbox
                  value={completed}
                  onChange={() => {
                    console.log('todo: update');
                  }}
                  color="highlight"
                />
              }
            />
            <FormControlLabel
              sx={{ pl: 2 }}
              label="isFullDay"
              control={
                <Checkbox
                  value={completed}
                  onChange={() => {
                    console.log('todo: update');
                  }}
                  color="highlight"
                />
              }
            />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={handleCreateTodo} disabled={isCreate}>
              <AddIcon />
            </IconButton>
          </Box>

          {isCreate && <NewTodo taskId={id} onToggle={handleCreateTodo} />}
          {todos.map((todo) => (
            <TodoItem id={todo.id} />
          ))}
          {/* todo: map todo */}
        </ContentWrapper>
      </Wrapper>
    </Box>
  );
}

export default TaskPage;
