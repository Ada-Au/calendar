import React, { useState } from 'react';
import {
  styled,
  Box,
  Divider,
  Checkbox,
  FormControlLabel,
  TextField,
  IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';

import Drawer from '../../components/Drawer';
import DateTimePicker from '@mui/lab/DateTimePicker';
import DatePicker from '@mui/lab/DatePicker';

import DoneIcon from '@mui/icons-material/Done';
import { formatDate } from '../../components/DateManager';
import {
  errorNotification,
  successNotification,
} from '../../components/Notification';
import BackButton from '../../components/BackButton';

const ME = gql`
  query Me {
    me {
      id
    }
  }
`;

const CREATE_ONE_TASK = gql`
  mutation CreateOneTask($data: TaskCreateInput!) {
    createOneTask(data: $data) {
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
  backgroundColor: theme.palette.common.white,
}));

function TaskCreatePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { start, end } = state;

  const [taskData, setTaskData] = useState({
    startTime: new Date(start),
    endTime: new Date(end),
    isFullDay: start === end || !end ? true : false,
  });
  const [endTimeError, setEndTimeError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [titleError, setTitleError] = useState(false);

  const [createOneTask] = useMutation(CREATE_ONE_TASK, {
    onError: (error) => {
      errorNotification(error.message);
    },
    onCompleted: ({ createOneTask }) => {
      successNotification('Task created');
      navigate(`/task/${createOneTask.id}`, { replace: true });
    },
  });
  const { data } = useQuery(ME);

  const handleSubmit = () => {
    if (!taskData.title) {
      setTitleError(true);
      errorNotification('No title is set');
    } else if (taskData.isFullDay && !taskData.startTime) {
      setDateError(true);
      errorNotification('No date is set');
    } else if (!taskData.isFullDay && !taskData.endTime) {
      setEndTimeError(true);
      errorNotification('No end time is set');
    } else if (
      !taskData.isFullDay &&
      new Date(taskData.endTime) < new Date(taskData.startTime)
    ) {
      setEndTimeError(true);
      errorNotification('End time is before start time');
    } else {
      if (data?.me?.id)
        createOneTask({
          variables: {
            data: {
              ...taskData,
              user: { connect: { id: data.me.id } },
              endTime: taskData.isFullDay ? null : taskData.endTime,
            },
          },
        });
      else {
        errorNotification('Cannot get user data');
      }
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
    if (dateError) setDateError(false);
    if (endTimeError) setEndTimeError(false);
  };

  const handleChangeStartTime = (time) => {
    setTaskData({ ...taskData, startTime: new Date(time).toISOString() });
    if (dateError) setDateError(false);
  };

  const handleChangeEndTime = (time) => {
    setTaskData({ ...taskData, endTime: new Date(time).toISOString() });
    if (endTimeError) setEndTimeError(false);
  };

  return (
    <Box>
      <Wrapper>
        <Drawer />
        <ContentWrapper>
          <BackButton sx={{ pt: 8 }} />
          <Box sx={{ display: 'flex', flexDirection: 'row', pb: 1 }}>
            <TextField
              sx={{ width: 420 }}
              inputProps={{ style: { fontSize: 40 } }}
              variant="standard"
              required
              label="Title"
              value={taskData.title}
              onChange={handleChange('title')}
              error={titleError}
            />

            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'flex-end' }}>
              <IconButton onClick={handleSubmit}>
                <DoneIcon />
              </IconButton>
            </Box>
          </Box>

          <TextField
            label="Description"
            size="small"
            multiline
            onChange={handleChange('description')}
            sx={{ pb: 1 }}
          />

          <Divider />
          <Box
            sx={{ pt: 2.5, pb: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
              {!taskData?.isFullDay ? (
                <>
                  <Box flex={1}>
                    <DateTimePicker
                      renderInput={(props) => (
                        <TextField {...props} fullWidth />
                      )}
                      label="Start Time"
                      value={formatDate(taskData.startTime)}
                      onChange={handleChangeStartTime}
                    />
                  </Box>

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
                </>
              ) : (
                <DatePicker
                  label="Date"
                  renderInput={(props) => (
                    <TextField {...props} fullWidth error={dateError} />
                  )}
                  value={formatDate(taskData.startTime)}
                  onChange={handleChangeStartTime}
                />
              )}
            </Box>

            <FormControlLabel
              label="isFullDay"
              control={
                <Checkbox
                  checked={taskData.isFullDay}
                  onChange={handleChangeIsFullDay}
                />
              }
            />
          </Box>
          <Divider />
        </ContentWrapper>
      </Wrapper>
    </Box>
  );
}

export default TaskCreatePage;
