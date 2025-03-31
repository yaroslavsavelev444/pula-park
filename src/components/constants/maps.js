// constants/maps.js

export const getVehicleType = (type) => {
  switch (type) {
    case 'sedan':
      return "Седан";
    case 'suv':
      return "Внедорожник";
    case 'truck':
      return "Грузовик";
    case 'van':
      return "Фургон";
    default:
      return type;
  }
};

export const getCarClass = (carClass) => {
  switch (carClass) {
    case 'economy':
      return "Эконом";
    case 'cargo':
      return "Грузовой";
    default:
      return carClass;
  }
};

export const getFuelType = (fuelType) => {
  switch (fuelType) {
    case 'petrol':
      return "Бензин";
    case 'diesel':
      return "Дизель";
    case 'electric':
      return "Электрический";
    case 'hybrid':
      return "Гибрид";
    default:
      return fuelType;
  }
};

export const getCarWd = (wd) => {
  switch (wd) {
    case 'fwd':
      return "Передний";
    case 'rwd':
      return "Задний";
    case 'awd':
      return "Полный";
    default:
      return wd;
  }
};

export const getCarShiftBox = (shiftBox) => {
  switch (shiftBox) {
    case 'manual':
      return "МКПП";
    case 'automatic':
      return "AT";
    case 'robot':
      return "AMT";
    default:
      return shiftBox;
  }
};

export const getCarColor = (color) => {
  switch (color) {
    case 'red':
      return "Красный";
    case 'blue':
      return "Синий";
    case 'black':
      return "Чёрный";
    case 'white':
      return "Белый";
    case 'silver':
      return "Серебряный";
    default:
      return color;
  }
};

export const getStatuses = (status) => {
  switch (status) {
    case 'pending':
      return "В ожидании";
      case 'awaiting':
        return "Запланирована";
    case 'canceled':
      return "Отменён";
      case 'canceledAhead':
        return "Досрочно отменен";
    case 'accepted':
      return "Принят";
    case 'declined':
      return "Отклонён";
      case 'active':
      return "Активный";
    case 'rejected':
      return "Отклонён";
    case 'approved':
      return "Принят";
    case 'confirmed':
      return "Подтверждён";
    case 'cancelled':
      return "Отменён";
    case 'completed':
      return 'Завершена';
    default:
      return status;
  }
};

export const  getRoleType = (role) => {
  switch (role) {
    case 'admin':
      return "Администратор";
    case 'Doer':
      return "Исполнитель";
      case 'Creator':
      return "Заказчик";
      case 'Car-park':
        return "Автопарк";
    default:
      return role;
  }
};

export const  getRentalCancelReason = (reason) => {
  switch (reason) {
    case 'carProblemы':
      return "Проблемы с автомобилем";
    case 'notCome':
      return "Не пришел";
    default:
      return reason;
  }
};
export const  getCarStatus = (status) => {
  switch (status) {
    case 'available':
      return "Доступен";
    case 'unavailable':
      return "Недоступен";
    case 'in_use':
      return "В прокате";
      case 'awaiting':
        return "Запланирована";
    default:
      return status;
  }
};

