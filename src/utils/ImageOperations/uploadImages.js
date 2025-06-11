import { generateRandomFolderName } from "../generators/randomFolderName";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { showToast } from "../../services/toastService";

const uploadImages = async (carImages, companyStore) => {
  if (carImages.length < 3) {
    return;
  }
  const folderName = generateRandomFolderName();
  try {
    companyStore.setLoading(true);
    const uploadPromises = carImages.map(async (img, index) => {
      const fileName = `${index + 1}.png`;
      const fileRef = ref(
        storage,
        `cars/${companyStore.company._id}/${folderName}/${fileName}`
      );
      await uploadBytes(fileRef, img.blob);
      return getDownloadURL(fileRef);
    });
    const urls = await Promise.all(uploadPromises);
    return {
      urls,
      folderName,
    };
  } catch (e) {
    error("Ошибка загрузки:", e);
    showToast({ text1: "Произошла ошибка", type: "error" });
  }
};

export { uploadImages };
