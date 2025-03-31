import React, { useContext, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./NavBar.css";
import logo from "../../img/3d_logo_solo.png";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

const NavBar = () => {
  const { store, companyStore } = useContext(Context);
  const [lastScrollY, setLastScrollY] = useState(0);  // Последнее положение прокрутки
  const [hidden, setHidden] = useState(false); // Состояние скрытого навбара

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 10) {
        // Скролл вниз
        setHidden(true);
      } else if (window.scrollY < lastScrollY) {
        // Скролл вверх
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`header ${hidden ? "hidden" : ""}`}>
      <div className="header-container" data-aos="fade-down">
        <nav className="header-nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "nav-active" : "nav-link")}
          >
            Главная
          </NavLink>

          {store.isAuth === false && (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              Вход
            </NavLink>
          )}

          {store.isAuth === true && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              Профиль
            </NavLink>
          )}

          {store.isAuth === true && (
            <NavLink
              to="/cars/"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              Мои авто
            </NavLink>
          )}

          {store.isAuth === true && (
            <NavLink
              to="/request"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              Заявки
            </NavLink>
          )}
          {store.isAuth === true && (
            <NavLink
              to="/rentals"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              Аренды
            </NavLink>
          )}
          {store.isAuth === true && (
            <NavLink
              to="/chats"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              Чаты
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};

export default observer(NavBar);