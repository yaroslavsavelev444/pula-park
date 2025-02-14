import React, { createContext, useContext, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [isShowing, setIsShowing] = useState(false);

  const showToast = (props) => {
    setQueue((prev) => [...prev, props]);
  };

  useEffect(() => {
    if (!isShowing && queue.length > 0) {
      const nextToast = queue[0];

      setIsShowing(true);
      toast(nextToast.text1, {
        type: nextToast.type,
        onClose: () => {
          setIsShowing(false);
          setQueue((prev) => prev.slice(1)); // Удаляем показанное уведомление
        },
        position: "top-center",
        autoClose: 5000,
      });
    }
  }, [queue, isShowing]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};
export default ToastProvider;