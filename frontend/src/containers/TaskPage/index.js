import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  styled,
  Box,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
} from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { useParams } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

import Drawer from '../../components/Drawer';
import LoadingSpinner from '../../components/LoadingSpinner';
import NewTodo from '../../components/NewTodo';
import TodoItem from '../../components/TodoItem';
import {
  errorNotification,
  successNotification,
} from '../../components/Notification';
import { formatDate } from '../../components/DateManager';

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

const TOGGLE_COMPLETE_TASK = gql`
  mutation ToggleCompleteTask($id: Int!) {
    toggleCompleteTask(id: $id) {
      id
      completed
    }
  }
`;

const UPDATE_ONE_TASK = gql`
  mutation UpdateOneTask(
    $data: TaskUpdateInput!
    $where: TaskWhereUniqueInput!
  ) {
    updateOneTask(data: $data, where: $where) {
      id
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
  const [isEdit, setIsEdit] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [taskData, setTaskData] = useState({});
  const [deleteItems, setDeleteItems] = useState([]);

  const { id } = useParams();
  const [toggleCompleteTodo] = useMutation(TOGGLE_COMPLETE_TASK, {
    onCompleted: () => {
      refetch();
    },
  });
  const [updateOneTask] = useMutation(UPDATE_ONE_TASK, {
    onError: (error) => {
      errorNotification(error.message);
    },
    onCompleted: () => {
      refetch();
      setIsEdit(false);
      successNotification('Task updated');
    },
  });
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

  const handleEdit = (task) => () => {
    const { title, description, startTime, endTime, isFullDay } = task;
    if (!isEdit) setIsCreate(false);
    if (Object.keys(taskData).length === 0)
      setTaskData({
        title,
        description,
        startTime,
        endTime,
        isFullDay,
      });

    setIsEdit((prev) => !prev);
    setDeleteItems([]);
  };

  const handleToggleDelete = (id) => {
    if (deleteItems.includes(id))
      setDeleteItems(deleteItems.filter((itemId) => itemId !== id));
    else setDeleteItems([...deleteItems, id]);
  };

  const handleSubmit = () => {
    if (!taskData.title) {
      setTitleError(true);
      errorNotification('No title is set');
    } else if (!taskData.isFullDay && !taskData.endTime) {
      setEndTimeError(true);
      errorNotification('No end time is set');
    } else if (!taskData.isFullDay && taskData.endTime < taskData.startTime) {
      setEndTimeError(true);
      errorNotification('End time is before start time');
    } else {
      const deleteTodos = deleteItems.reduce(
        (list, item) => [...list, { id: item }],
        []
      );
      updateOneTask({
        variables: {
          data: {
            ...taskData,
            isFullDay: { set: taskData.isFullDay },
            startTime: { set: taskData.startTime },
            endTime: taskData.endTime ? { set: taskData.endTime } : null,
            title: { set: taskData.title },
            description: { set: taskData.description },
            todos: { delete: deleteTodos },
          },
          where: { id: +id },
        },
      });
    }
  };

  const handleChange = (prop) => (event) => {
    if (prop === 'title' && titleError) {
      setTitleError(false);
    }
    setTaskData({ ...taskData, [prop]: event.target.value });
  };

  const handleChangeIsFullDay = (event) => {
    setTaskData({ ...taskData, isFullDay: event.target.checked });
  };

  const handleChangeStartTime = (time) => {
    setTaskData({ ...taskData, startTime: new Date(time).toISOString() });
  };

  const handleChangeEndTime = (time) => {
    setTaskData({ ...taskData, endTime: new Date(time).toISOString() });
    setEndTimeError(false);
  };

  const handleToggleComplete = () => {
    toggleCompleteTodo({ variables: { id: +id } });
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
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 8, pb: 1 }}>
            {isEdit ? (
              <TextField
                sx={{ width: 420 }}
                inputProps={{ style: { fontSize: 40 } }}
                variant="standard"
                required
                value={taskData.title}
                onChange={handleChange('title')}
                error={titleError}
              />
            ) : (
              <Typography variant="h3">{title}</Typography>
            )}
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'flex-end' }}>
              {isEdit && (
                <IconButton onClick={handleSubmit}>
                  <DoneIcon />
                </IconButton>
              )}
              <IconButton onClick={handleEdit(data.task)}>
                <EditIcon sx={isEdit ? { color: 'highlight.main' } : {}} />
              </IconButton>
              <FormControlLabel
                sx={{ pl: 1 }}
                label="Complete"
                control={
                  <Checkbox
                    checked={completed}
                    onChange={handleToggleComplete}
                  />
                }
              />
            </Box>
          </Box>
          {isEdit ? (
            <TextField
              label="Description"
              size="small"
              multiline
              onChange={handleChange('description')}
              sx={{ pb: 1 }}
            />
          ) : (
            description && (
              <Typography variant="body1" sx={{ pb: 1 }}>
                {description}
              </Typography>
            )
          )}
          <Divider />
          <Box
            sx={{ pt: 2.5, pb: 1, display: 'flex', flexDirection: 'column' }}
          >
            {isEdit ? (
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <Box flex={1}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} fullWidth />}
                    label="Start Time"
                    value={formatDate(taskData.startTime)}
                    onChange={handleChangeStartTime}
                  />
                </Box>
                {!taskData?.isFullDay && (
                  <Box flex={1}>
                    <DateTimePicker
                      renderInput={(props) => (
                        <TextField {...props} fullWidth error={endTimeError} />
                      )}
                      label="End Time"
                      value={taskData.endTime}
                      onChange={handleChangeEndTime}
                    />
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body1">
                {new Date(startTime).toLocaleString('en-GB', fullOptions)}
                {isFullDay
                  ? ''
                  : ` to ${new Date(endTime).toLocaleString(
                      'en-GB',
                      new Date(startTime).getFullYear() ===
                        new Date(endTime).getFullYear() &&
                        new Date(startTime).getMonth() ===
                          new Date(endTime).getMonth() &&
                        new Date(startTime).getDate() ===
                          new Date(endTime).getDate()
                        ? TimeOnlyOptions
                        : fullOptions
                    )}`}
              </Typography>
            )}
            <FormControlLabel
              label="isFullDay"
              control={
                <Checkbox
                  checked={isEdit ? taskData?.isFullDay : isFullDay}
                  disabled={!isEdit}
                  onChange={handleChangeIsFullDay}
                />
              }
            />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              onClick={handleCreateTodo}
              disabled={isCreate || isEdit}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {isCreate && <NewTodo taskId={id} onToggle={handleCreateTodo} />}
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              isEdit={isEdit}
              isDelete={deleteItems.includes(todo.id)}
              onToggleDelete={handleToggleDelete}
            />
          ))}
        </ContentWrapper>
      </Wrapper>
    </Box>
  );
}

export default TaskPage;
