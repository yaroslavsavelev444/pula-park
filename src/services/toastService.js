import { warn } from "../utils/logger";

let toastCallback = null;

export const registerToast = (callback) => {
  toastCallback = callback;
};

export const showToast = (params) => {
  if (toastCallback) {
    toastCallback(params);
  } else {
    warn("Toast not initialized yet");
  }
};