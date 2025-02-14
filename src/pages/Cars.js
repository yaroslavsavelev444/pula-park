import React, { useEffect } from "react";
import "../components/Car/Car.css";
import { useContext, useState } from "react";
import { Context } from "../index";
import { Navigate, useNavigate } from "react-router-dom";
import Button from "../components/UI/Buttons/Button";
import Modal from "../components/UI/Modal/Modal";
import Input from "../components/UI/Input/Input";
import { useToast } from "../providers/ToastProvider";
import { observer } from "mobx-react-lite";
import CarCard from "../components/Car/CarItem";
const Cars = () => {
    const navigate = useNavigate();
    const { store, companyStore } = useContext(Context);
    const [modalContent, setModalContent ] = useState(false);
    const [isModalOpen, setIsModalOpen ] = useState(false);
    const [carVin, setCarVin] = useState("");
    const [carNumber, setCarNumber] = useState("");
      const { showToast } = useToast();
    
    if(store.isAuth === false) {
        navigate("/auth");
    }


    const handleAddCar = () => {
        setModalContent("addCompany"); // Устанавливаем контент для добавления компании
        setIsModalOpen(true);
      };

      const handleCheckIsEmailVerified = () => {
        if (store.user.isActivated === false) {
         showToast({
            text1: "Подтвердите почту, чтобы создать компанию",
            type: "error",});
          return;
        }
        handleAddCar();
      }

      const handleSendCarData = async () => {
        try {
          const carData = {
            carVin: carVin,
            carNumber: carNumber,
          };
          await companyStore.addCar(companyStore.company._id, carData);
          showToast({
            text1: "Автомобиль успеfsшно добавлен",
            type: "success",
          })
        }catch{
          console.log("error");
          showToast({
            text1: "Ошибка добавления автомобиля",
            type: "error",
          })
        }

      }
      useEffect(() => {
        companyStore.fetchCarsData(store.user.id);
        console.log('companyStore.cars', companyStore);
      }, []);



  return (
    <div className="cars-wrapper">
      <div className="left-sidebar">
        <div className="left-add-car">
         <Button onClick={handleCheckIsEmailVerified}> Добавить машину</Button>
        </div>
        <div className="left-sort">
        {companyStore.cars.length === 0 ? (
            <h1>У вас нет автомобилей</h1>
        ) : (
            <h1>Сортировка</h1>

        )}
        </div>
      </div>
      <div className="right-content">
      {companyStore.cars.length > 0 ? (
    <div>
        {companyStore.cars.map((car) => (
            <CarCard key={car.vin} car={car} />
        ))}
    </div>
) : (
    <h1>У вас нет автомобилей</h1>
)}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent === "addCompany" && (
          <>
            <h1>Добавить автомобиль</h1>
            <div className="modal-input-wrapper">
            <div className="company-logo">
            </div>
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
             

            <Button onClick={handleSendCarData}>Добавить</Button>

            </div>
          </>
        )}
      </Modal>
    </div>
    
  );
};

export default observer(Cars);