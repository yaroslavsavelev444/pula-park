import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import "../components/Request/Request.css";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../components/UI/SelectMenu/SelectMenu";
import FilterBar from "../components/UI/FilterBar/FilterBar";
import Empty from "../components/Empty/Empty";
import Modal from "../components/UI/Modal/Modal";
import RentalItem from "../components/Rental/RentalItem";
import RentalModalContent from "../components/Modals/RentalModalContent";
import {
  filterRentalOptions,
  sortRentalOptions,
} from "../components/constants/options";

const Rentals = () => {
  const navigate = useNavigate();
  const { store, companyStore } = useContext(Context);
  const ownerId = companyStore.company ? companyStore.company._id : null;
  // Загружаем фильтры из localStorage, если они там есть
  const storedFilters = localStorage.getItem("rentalFilterData");
  const initialFilters = storedFilters ? JSON.parse(storedFilters) : [];
  const storedSort = localStorage.getItem("rentalSortData");
  const initialSort = storedSort ? JSON.parse(storedSort) : "dateDesc";
  const [sortParam, setSortParam] = useState(initialSort);

  const [filterParam, setFilterParam] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  //Все для динамической пагинации
  const [isFetching, setIsFetching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const handleFilterChange = (values) => {
    setFilterParam(values);
    localStorage.setItem("rentalFilterData", JSON.stringify(values));
    if (ownerId) {
      companyStore.fetchRentals(ownerId, values, sortParam);
    }
  };

  // Функция обновления и сохранения сортировки
  const handleSortChange = (value) => {
    if (!companyStore?.rentals.length) return;
    setSortParam(value);
    localStorage.setItem("rentalSortData", JSON.stringify(value));
    if (ownerId) {
      companyStore.fetchRentals(ownerId, filterParam, value);
    }
  };


  const handleRentalModal = (rental) => {
    setModalContent({ type: "rentalModal", rental });
    setIsModalOpen(true);
  };


  //Динамическая пагинация

  useEffect(() => {
    if (ownerId) {
      companyStore.fetchRentals(ownerId, filterParam, sortParam , limit , currentPage);
    }
  }, [ownerId, filterParam, sortParam]);
  
    useEffect(() => {
      if (isFetching) {
        companyStore
          .fetchRentals(ownerId, filterParam, sortParam , limit , currentPage + 1) // Передаем следующую страницу
          .then(() => {
            setCurrentPage(prev => prev + 1);
            setIsFetching(false);
          })
          .catch(() => setIsFetching(false)); // Обязательно сбрасываем состояние при ошибке
      }
    }, [isFetching, ownerId, filterParam, sortParam, limit]); 
  
    useEffect(() => {
      document.addEventListener("scroll", scrollHandler);
      return () => {
        document.removeEventListener("scroll", scrollHandler);
      };
    }, []);
  
    const scrollHandler = () => {
      if (
        document.documentElement.scrollHeight -
          (document.documentElement.scrollTop + document.documentElement.clientHeight) <
          450 &&
        companyStore?.totalRentals > companyStore?.rentals.length &&
        !isFetching // Добавляем проверку, чтобы не запускать повторно
      ) {
        setIsFetching(true);
      }
    };
  

  return (
    <div className="page_wrapper">
      <div className="left-sidebar">
        <div className="left-add-car">
          <Empty text={"Пусто"} />
        </div>
        <div className="left-sort">
          <>
            <FilterBar
              options={filterRentalOptions}
              onChange={handleFilterChange}
              selectedFilters={filterParam} // Передаем выбранные фильтры
            />
          </>
        </div>
      </div>
      <div className="right-content-wrapper">
        <div className="right-sort-wrapper">
          <SelectMenu
            options={sortRentalOptions}
            onChange={handleSortChange}
            value={sortParam}
          />
        </div>
        {companyStore?.rentals.length > 0 ? (
          <div className="right-content">
            <>
              {companyStore?.rentals.map((rental) => (
                <RentalItem
                  rental={rental}
                  key={rental._id}
                  onClick={handleRentalModal}
                />
              ))}
            </>
          </div>
        ) : (
          <Empty text={"Аренд нет"} />
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent?.type === "rentalModal" && (
          <>
            <RentalModalContent
              rental={modalContent.rental}
              onClose={() => setIsModalOpen(false)}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default observer(Rentals);
