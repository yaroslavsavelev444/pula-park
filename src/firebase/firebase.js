import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: 'AIzaSyBSOsmvbSVHAhEQWuu4CkcjZdgRld2Afq8',
    authDomain: 'pulauni2.firebaseapp.com',
    projectId: 'pulauni2',
    storageBucket: 'pulauni2.appspot.com',
    messagingSenderId: '988662897499',
    appId: '1:988662897499:ios:27ba078eb814078d82187e',
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Получаем и экспортируем хранилище
const storage = getStorage(app);

export { app, storage };