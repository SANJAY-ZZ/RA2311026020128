let notifications = [];

export function addNotification(data) {
  const newNotification = {
    id: Date.now(),
    ...data,
    isRead: false,
    timestamp: new Date()
  };

  notifications.push(newNotification);
  return { message: "Notification created", data: newNotification };
}

export function fetchNotifications() {
  return { notifications };
}