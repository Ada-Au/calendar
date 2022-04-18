import { NotificationManager } from 'react-notifications';

export const errorNotification = (errorMsg) => {
  console.log('errorMsg', errorMsg);
  NotificationManager.error(errorMsg, 'Error', 5000);
};

export const successNotification = (msg) => {
  NotificationManager.success('Success!', msg, 1000);
};
