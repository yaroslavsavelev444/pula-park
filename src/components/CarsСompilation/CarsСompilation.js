import React, { useEffect } from "react";
import { unAuthStore } from "../..";
import { observer } from "mobx-react-lite";
import "./CarsСompilation.css";
import CarItem from "../Car/CarItem";

const CarsСompilation = () => {
  useEffect(() => {
    if (!Array.isArray(unAuthStore.cars) || !unAuthStore.cars.length) {
      unAuthStore.fetchCarsUnAuth();
    }
  }, []);

  return (
    <div className="cars-wrapper">
      <div className="cars-content">
        {Array.isArray(unAuthStore.cars) &&
          unAuthStore.cars.map((car, index) => (
            <CarItem car={car} key={car.vin} isClickable={false} />
          ))}
      </div>
    </div>
  );
};

export default observer(CarsСompilation);
