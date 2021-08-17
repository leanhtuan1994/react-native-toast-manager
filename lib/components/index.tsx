import React from "react";
import { NotificationItem } from "./NotificationItem";
import NotificationManager from "./NotificationManager";
import { Notification } from "./type";



export const NotificationContainer: React.FC<{}> = () => {
  const [notification, setNotification] = React.useState<
    Notification | undefined
  >();

  React.useEffect(() => {
    NotificationManager.addChangeListener(setNotification);

    return () => {
      NotificationManager.removeChangeListener(setNotification);
    };
  });

  const onRemove = React.useCallback(() => {}, []);

  return <NotificationItem notification={notification} onRemove={onRemove} />;
};
