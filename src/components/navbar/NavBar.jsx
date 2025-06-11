import React, { useContext, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./NavBar.css";
import logo from "../../img/3d_logo_solo.png";
import { NavLink } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";

const NavBar = () => {
  const { store } = useContext(Context);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 10) {
        setHidden(true);
      } else if (window.scrollY < lastScrollY) {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const isAuth = store.isAuth;
  const role = store.user?.role;

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

          {!isAuth && (
            <NavLink
              to="/auth"
              className={({ isActive }) =>
                isActive ? "nav-active" : "nav-link"
              }
            >
              Вход
            </NavLink>
          )}

          {isAuth && role === "Support" ? (
            <>
              <NavLink
                to="/support-chats"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Чаты поддержки
              </NavLink>
              <NavLink
                to="/complaints"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Жалобы
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Профиль
              </NavLink>
            </>
          ) : isAuth ? (
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Профиль
              </NavLink>
              <NavLink
                to="/cars/"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Мои авто
              </NavLink>
              <NavLink
                to="/request"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Заявки
              </NavLink>
              <NavLink
                to="/rentals"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Аренды
              </NavLink>
              
              <NavLink
                to="/chats"
                className={({ isActive }) =>
                  isActive ? "nav-active" : "nav-link"
                }
              >
                Чаты
              </NavLink>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  );
};

export default observer(NavBar);