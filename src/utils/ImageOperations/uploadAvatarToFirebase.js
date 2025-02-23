import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../../firebase/firebase'; // Импортируем уже инициализированное хранилище

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
        console.log("Uploaded file successfully", snapshot);

        // Получаем URL загруженного файла
        const downloadURL = await getDownloadURL(fileRef);
        console.log("File available at", downloadURL);
        
        return downloadURL; // Возвращаем URL для сохранения в базе данных
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error; // Пробрасываем ошибку
    }
};