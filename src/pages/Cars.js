import React, { useEffect } from "react";
import "../components/Car/Car.css";
import { useContext, useState } from "react";
import { Context } from "../index";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/UI/Buttons/Button";
import Modal from "../components/UI/Modal/Modal";
import Input from "../components/UI/Input/Input";
import { useToast } from "../providers/ToastProvider";
import { observer } from "mobx-react-lite";
import CarItem from "../components/Car/CarItem";
import CarImagesUpload from "../components/UI/CarImagesUpload/CarImagesUpload";
import CarModalContent from "../components/Modals/CarModalContent";
import { Checkbox } from "../components/UI/CheckBox/CheckBox";
import Loader from "../components/UI/Loader/Loader";
import { uploadImages } from "../utils/ImageOperations/uploadImages";
import FilterBar from "../components/UI/FilterBar/FilterBar";
import SelectMenu from "../components/UI/SelectMenu/SelectMenu";
import Empty from "../components/Empty/Empty";

const statusOptions = [
  { value: "available", label: "Свободные", color: "#F44336" },
  { value: "in_use", label: "В прокате", color: "#4CAF50" },
  { value: "unavailable", label: "Недоступные", color: "#2196F3" },
];

const typeOptions = [
  { value: "sedan", label: "Седан", color: "#F44336" },
  { value: "suv", label: "Кроссовер", color: "#4CAF50" },
  { value: "truck", label: "Грузовик", color: "#2196F3" },
  { value: "van", label: "Фургон", color: "#2196F3" },
];

const sortOptions = [
  {
    value: "dateAsc",
    label: "По дате создания (по возрастанию)",
    default: false,
  },
  {
    value: "dateDesc",
    label: "По дате создания (по убыванию)",
    default: true,
    color: "#FF9800",
  },
  {
    value: "mileageAsc",
    label: "По пробегу (по возрастанию)",
    default: false,
    color: "#FF9800",
  },
  {
    value: "mileageDesc",
    label: "По пробегу (по убыванию)",
    default: false,
    color: "#FF9800",
  },
];

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
  const [carImages, setCarImages] = useState([])
  const { carId } = useParams();

  const storedSort = localStorage.getItem('carSortData');
  const parsedSort = storedSort ? JSON.parse(storedSort) : "dateDesc";
  const [sortParam, setSortParam] = useState(parsedSort);

  const storedStatuses = JSON.parse(localStorage.getItem('carsStorageKeyStatuses')) || [];
  const storedTypes = JSON.parse(localStorage.getItem('carsStorageKeyTypes')) || [];
  const [selectedStatuses, setSelectedStatuses] = useState(storedStatuses);
  const [selectedTypes, setSelectedTypes] = useState(storedTypes);

  useEffect(() => {
    if (carId) {
      const car = companyStore.cars.find(car => car._id === carId);
      if (car) {
        console.log("car", car);
        setCarModalData(car);
        setModalContent("carModal");
        setIsModalOpen(true);
      } else {
        navigate("/cars"); // Если id не найден, просто показываем список
      }
    }
  }, [carId, companyStore.cars]);

  const handleStatusOptionChange = (value) => {
    setSelectedStatuses(value);
    localStorage.setItem('carsStorageKeyStatuses', JSON.stringify(value));
    if (companyStore.company._id !== null) {
      companyStore.fetchCarsData(
        companyStore.company._id,
        value,
        selectedTypes,
        sortParam
      );
    }
  };

  const handleTypeOptionChange = (value) => {
    setSelectedTypes(value);
    localStorage.setItem('carsStorageKeyTypes', JSON.stringify(value));
    if (companyStore.company._id !== null) {
      companyStore.fetchCarsData(
        companyStore.company._id,
        selectedStatuses,
        value,
        sortParam
      );
    }
  };

  const handleSortOptionChange = (value) => {
    setSortParam(value);
    localStorage.setItem('carSortData', JSON.stringify(value)); // Просто сохраняем строку
    if (companyStore.company._id !== null) {
      companyStore.fetchCarsData(
        companyStore.company._id,
        selectedStatuses,
        selectedTypes,
        value
      );
    }
  };

  const handleAddCar = () => {
    console.log("handleAddCar");
    setModalContent("addCompany");
    setIsModalOpen(true);
  };

  const handleCheckIsEmailVerified = () => {
    if (!store.user.isActivated) {
      console.log("Подтвердите почту, чтобы создать компанию");
      showToast({
        text1: "Подтвердите почту, чтобы создать компанию",
        type: "error",
      });
      return;
    }
    console.log("Почта подтврждена, пропускаем к созданию компании");
    handleAddCar();
  };

  const handleCarModal = (car) => {
    setCarModalData(car);
    setModalContent("carModal");
    setIsModalOpen(true);
  };

  const handleSendCarData = async () => {
    try {
      const { urls, folderName } = await uploadImages(carImages, companyStore);
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
        price_per_day: carPricePerDay,
      };

      const ownerData = {
        owner: companyStore.company._id,
        owner_type: "car_park",
      };

      await companyStore.addCar(carData, folderName, ownerData);
      showToast({ text1: "Автомобиль успешно добавлен", type: "success" });
      companyStore.fetchCarsData(companyStore.company._id);
      setIsModalOpen(false);
      setCarVin("");
      setCarNumber("");
      setCarPricePerDay("");
    } catch (error) {
      console.error("Ошибка добавления машины", error);
      showToast({ text1: "Ошибка добавления автомобиля", type: "error" });
    }
  };
  useEffect(() => {
    if (companyStore.company?._id) {
      companyStore.fetchCarsData(
        companyStore.company._id,
        selectedStatuses,
        selectedTypes,
        sortParam
      );
    }
  }, [companyStore.company?._id, sortParam, selectedStatuses, selectedTypes]);

  const handleUploadComplete = (newImages) => {
    setCarImages(newImages);
  };

  const handleFetchCarsData = () => {
    companyStore.fetchCarsData(store.user.id);
  };

  return (
    <div className="page_wrapper">
      <div className="left-sidebar">
        <div className="left-add-car">
          <Button onClick={handleCheckIsEmailVerified}>Добавить машину</Button>
        </div>
        <div className="left-sort">
          <>
            <FilterBar
              options={typeOptions}
              onChange={handleTypeOptionChange}
            />
            <FilterBar
              options={statusOptions}
              onChange={handleStatusOptionChange}
            />
          </>
        </div>
      </div>
      <div className="right-content-wrapper">
        <div className="right-sort-wrapper">
          <SelectMenu
            options={sortOptions}
            onChange={handleSortOptionChange}
            value={sortParam}
          />
        </div>
        <div className="right-content">
          {companyStore.cars.length > 0 ? (
            <>
              {companyStore.cars.map((car) => (
                <CarItem
                  car={car}
                  key={car.vin}
                  handleFetchCarsData={handleFetchCarsData}
                  onClick={handleCarModal}
                />
              ))}
            </>
          ) : (
            <Empty text="Нет автомобилей" />
          )}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} fullscreen>
        {modalContent === "addCompany" && (
          <>
            <h1>Добавить автомобиль</h1>
            {companyStore.isLoading === true ? (
              <Loader />
            ) : (
              <div className="modal-input-wrapper">
                <CarImagesUpload
                  onSubmit={handleUploadComplete}
                  userId={companyStore.company._id}
                />
                <Input
                  placeholder="Vin"
                  value={carVin}
                  onChange={(e) => setCarVin(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Номер автомобиля"
                  value={carNumber}
                  onChange={(e) => setCarNumber(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Цена в день"
                  value={carPricePerDay}
                  onChange={(e) => setCarPricePerDay(e.target.value)}
                  required
                  className="modal-input"
                />
                <Checkbox
                  label="Депозит"
                  onChange={setDeposit}
                  checked={deposit}
                />
                {deposit && (
                  <Input
                    placeholder="Депозит"
                    value={depositPrice}
                    onChange={(e) => setDepositPrice(e.target.value)}
                    className="modal-input"
                  />
                )}
                <Input
                  placeholder="Марка"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Модель"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Год"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Тип кузова"
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Класс автомобиля"
                  value={carClass}
                  onChange={(e) => setCarClass(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Количество мест"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Пробег"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Тип топлива"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Тип трансмиссии"
                  value={transmissionType}
                  onChange={(e) => setTransmissionType(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Тип привода"
                  value={wdType}
                  onChange={(e) => setWdType(e.target.value)}
                  required
                  className="modal-input"
                />
                <Input
                  placeholder="Объем багажника"
                  value={trunkVolume}
                  onChange={(e) => setTrunkVolume(e.target.value)}
                  className="modal-input"
                />
                <Button onClick={handleSendCarData}>Добавить</Button>
              </div>
            )}
          </>
        )}

        {modalContent === "carModal" && (
          <>
            <CarModalContent
              car={carModalData}
              onClose={() => setIsModalOpen(false)}
              showToast={showToast}

            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default observer(Cars);
