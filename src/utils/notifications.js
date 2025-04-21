export const generateNotification = (title = 'Title Here', message = 'Message Here') => {
    let notification = null;
    Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          notification = new Notification(title, {
              body: message
          });
        } else {
          console.log('Unable to get permission to notify.');
        }
    });
    return notification;
}
export const enableNotification = () => {
    Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Unable to get permission to notify.');
        }
        window.location.reload();
    });
}