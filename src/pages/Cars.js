import React, { use, useEffect } from "react";
import "../components/Car/Car.css";
import { useContext, useState } from "react";
import { Context } from "../index";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Buttons/Button";
import Modal from "../components/UI/Modal/Modal";
import Input from "../components/UI/Input/Input";
import { useToast } from "../providers/ToastProvider";
import { observer } from "mobx-react-lite";
import CarItem from "../components/Car/CarItem";
import CarImagesUpload from "../components/UI/CarImagesUpload/CarImagesUpload";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import CarModalContent from "../components/Modals/CarModalContent";
import { Checkbox } from "../components/UI/CheckBox/CheckBox";
import Loader from "../components/UI/Loader/Loader";

const Cars = () => {
  const navigate = useNavigate();
  const { store, companyStore } = useContext(Context);
  const [modalContent, setModalContent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carModalData, setCarModalData] = useState("");
  const [carVin, setCarVin] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [carPricePerDay, setCarPricePerDay] = useState("");
  const [deposit, setDeposit] = useState(false);
  const [depositPrice, setDepositPrice] = useState("");
  const [brand, setBrand] = useState("Lada"); 
  const [model, setModel] = useState("Vesta"); 
  const [year, setYear] = useState("2022"); 
  const [vehicleType, setVehicleType] = useState("sedan"); 
  const [carClass, setCarClass] = useState("economy"); 
  const [seats, setSeats] = useState("5"); 
  const [mileage, setMileage] = useState("100000"); 
  const [fuelType, setFuelType] = useState("petrol"); 
  const [transmissionType, setTransmissionType] = useState("manual"); 
  const [wdType, setWdType] = useState("fwd"); 
  const [trunkVolume, setTrunkVolume] = useState("50"); 
  const { showToast } = useToast();
  const [carImages, setCarImages] = useState([]);
  const [Loading, setLoading] = useState(false);
  
  if (store.isAuth === false) {
    navigate("/auth");
  }
  const handleAddCar = () => {
    setModalContent("addCompany");
    setIsModalOpen(true);
  };

  const handleCheckIsEmailVerified = () => {
    if (store.user.isActivated === false) {
      showToast({
        text1: "Подтвердите почту, чтобы создать компанию",
        type: "error",
      });
      return;
    }
    handleAddCar();
  };

  const handleCarModal = (car) => {
    setCarModalData(car);
    setModalContent("carModal");
    setIsModalOpen(true);
  };

  const generateRandomFolderName = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let folderName = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      folderName += chars[randomIndex];
    }
    return folderName;
  };

  const uploadImages = async () => {
    if (carImages.length < 3) {
      alert("Минимум 3 фото для загрузки");
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
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    }
  };

  const handleSendCarData = async () => {
    
    try {
      const { urls, folderName } = await uploadImages();
      if (!urls || urls.length < 3) {
        showToast({ text1: "Ошибка загрузки изображений", type: "error" });
        return;
      }
  
      const carData = {
        vin: carVin,
        licensePlate: carNumber,
        brand,
        model,
        year,
        vehicle_type: vehicleType,
        car_class: carClass,
        seats,
        trunk_volume: trunkVolume,
        mileage,
        fuelType,
        transmissionType,
        wdType,
        photos: urls,
        deposit_amount: depositPrice,
        price_per_day: carPricePerDay
      };
  
      const ownerData = {
        owner: companyStore.company._id, 
        owner_type: "car_park", 
      };
  
      await companyStore.addCar(carData, folderName, ownerData);
      showToast({ text1: "Автомобиль успешно добавлен", type: "success" });
      companyStore.fetchCarsData(store.user.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Ошибка добавления машины", error);
      showToast({ text1: "Ошибка добавления автомобиля", type: "error" });
    }
  };
  useEffect(() => {
    companyStore.fetchCarsData(store.user.id);
    console.log("companyStore.cars", companyStore);
  }, []);

  const handleUploadComplete = (newImages) => {
    setCarImages(newImages);
  };

  const handleFetchCarsData = () => {
    console.log("handleFetchCarsData");
    companyStore.fetchCarsData(store.user.id);
  };

  return (
    <div className="cars-wrapper">
      <div className="left-sidebar">
        <div className="left-add-car">
          <Button onClick={handleCheckIsEmailVerified}>Добавить машину</Button>
        </div>
        <div className="left-sort">
          {companyStore.cars.length === 0 ? (
            <h1>У вас нет автомобилей</h1>
          ) : (
            <h1>Сортировка</h1>
          )}
        </div>
      </div>
      <div className="right-content-wrapper">
      <div className="right-content">
        {companyStore.cars.length > 0 ? (
          <>
            {companyStore.cars.map((car) => (
                <CarItem car={car} key={car.vin} handleFetchCarsData={handleFetchCarsData}  onClick={handleCarModal}/>
            ))}
          </>
        ) : (
          <h1>У вас нет автомобилей</h1>
        )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      {modalContent === "addCompany" && (
  <>
    <h1>Добавить автомобиль</h1>
    {companyStore.isLoading === true ? (
      <Loader />
    ) : (
      <div className="modal-input-wrapper">
        <CarImagesUpload onSubmit={handleUploadComplete} userId={companyStore.company._id} />
        <Input placeholder="Vin" value={carVin} onChange={(e) => setCarVin(e.target.value)} required className="modal-input" />
        <Input placeholder="Номер автомобиля" value={carNumber} onChange={(e) => setCarNumber(e.target.value)} required className="modal-input" />
        <Input placeholder="Цена в день" value={carPricePerDay} onChange={(e) => setCarPricePerDay(e.target.value)} required className="modal-input" />
        <Checkbox label="Депозит" onChange={setDeposit} checked={deposit} />
        {deposit && (
            <Input placeholder="Депозит" value={depositPrice} onChange={(e) => setDepositPrice(e.target.value)} className="modal-input" />
        )}
        <Input placeholder="Марка" value={brand} onChange={(e) => setBrand(e.target.value)} required className="modal-input" />
        <Input placeholder="Модель" value={model} onChange={(e) => setModel(e.target.value)} required className="modal-input" />
        <Input placeholder="Год" value={year} onChange={(e) => setYear(e.target.value)} required className="modal-input" />
        <Input placeholder="Тип кузова" value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} required className="modal-input" />
        <Input placeholder="Класс автомобиля" value={carClass} onChange={(e) => setCarClass(e.target.value)} required className="modal-input" />
        <Input placeholder="Количество мест" value={seats} onChange={(e) => setSeats(e.target.value)} required className="modal-input" />
        <Input placeholder="Пробег" value={mileage} onChange={(e) => setMileage(e.target.value)} required className="modal-input" />
        <Input placeholder="Тип топлива" value={fuelType} onChange={(e) => setFuelType(e.target.value)} required className="modal-input" />
        <Input placeholder="Тип трансмиссии" value={transmissionType} onChange={(e) => setTransmissionType(e.target.value)} required className="modal-input" />
        <Input placeholder="Тип привода" value={wdType} onChange={(e) => setWdType(e.target.value)} required className="modal-input" />
        <Input placeholder="Объем багажника" value={trunkVolume} onChange={(e) => setTrunkVolume(e.target.value)} className="modal-input" />
        <Button onClick={handleSendCarData}>Добавить</Button>
      </div>
    )}
  </>
)}

        {modalContent === "carModal" && (
          <>
            <CarModalContent car={carModalData} onClose={() => setIsModalOpen(false)} />
          </>
        )}
      </Modal>
    </div>
  );
};

export default observer(Cars);