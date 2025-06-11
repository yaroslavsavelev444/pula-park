import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase"; // Импортируем уже инициализированное хранилище
import { error, log } from "../logger";
import { showToast } from "../../services/toastService";

export const uploadAvatarToFirebase = async (file, userId) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Переименовываем файл с использованием userId
  const fileName = `${userId}.png`; // Используем расширение png для сохранения файла

  const fileRef = ref(storage, `avatars/${userId}/${fileName}`);

  try {
    // Загружаем файл в Firebase Storage
    const snapshot = await uploadBytes(fileRef, file);
    log("Uploaded file successfully", snapshot);

    // Получаем URL загруженного файла
    const downloadURL = await getDownloadURL(fileRef);
    log("File available at", downloadURL);

    return downloadURL; // Возвращаем URL для сохранения в базе данных
  } catch (e) {
    error("Error uploading file:", e);
    showToast({ text1: "Произошла ошибка", type: "error" });

    throw e; // Пробрасываем ошибку
  }
};
