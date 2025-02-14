const showNotification = (showToast, text, isSuccess = true) => {
    const notificationType = isSuccess ? "success" : "error";
    
    showToast({
      text1: text,
      type: notificationType,
    });
  };

  export default showNotification