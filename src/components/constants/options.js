export const statusOptions = [
    { value: "available", label: "Свободные", color: "#F44336" },
    { value: "in_use", label: "В прокате", color: "#4CAF50" },
    { value: "awaiting", label: "Запланированные", color: "#4CAF50" },
    { value: "unavailable", label: "Недоступные", color: "#2196F3" },
  ];
  
  export const typeOptions = [
    { value: "sedan", label: "Седан", color: "#F44336" },
    { value: "suv", label: "Кроссовер", color: "#4CAF50" },
    { value: "truck", label: "Грузовик", color: "#2196F3" },
    { value: "van", label: "Фургон", color: "#2196F3" },
  ];

  export const sortOptions = [
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

  export const optionsMap = {
    available: ["Архив", "Удалить"],
    unavailable: ["Вернуть", "Удалить"],
    in_use: [],
  };

  export const chatOptions = [
    { value: "harassment", label: "Оскорбления и агрессия" },
    { value: "discrimination", label: "Дискриминация " },
    { value: "fraud", label: "Мошенничество и обман " },
  ]
  
  export const lanOptions = [
    { value: "Ru", label: "Русский", color: "#F44336" },
    { value: "En", label: "English", color: "#4CAF50" },
    { value: "Ge", label: "Deutsch", color: "#2196F3" },
  ];

  export const cancelRentalOptions = [
    { value: "notCome", label: "Не пришел в офис " },
    { value: "carProblem", label: "Проблемы с автомобилем " },
    { value: "other", label: "Другое " },
  ];


  export const filterRentalOptions = [
    { value: "active", label: "Активные", color: "#F44336" },
    { value: "completed", label: "Завершенные", color: "#4CAF50" },
    { value: "awaiting", label: "Запланированные", color: "#2444F3" },
    { value: "canceled", label: "Отмененные", color: "#2196F3" },
  ];
  
  export const sortRentalOptions = [
    { value: "dateAsc", label: "По дате (возрастание)" },
    { value: "dateDesc", label: "По дате (убывание)", default: true },
  ];


  export const requestOptions = [
    { value: "rejected", label: "Отклоненные", color: "#F44336" },
    { value: "approved", label: "Принятые", color: "#4CAF50" },
    { value: "confirmed", label: "Подтвержденные", color: "#4CAF50" },
    { value: "pending", label: "Ожидающие", color: "#2196F3" },
    { value: "cancelled", label: "Отменено", color: "#2196F3" },
  ];

  export const sortRequestOptions = [
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
  ];
  