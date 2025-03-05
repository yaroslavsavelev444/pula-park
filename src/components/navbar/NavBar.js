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
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const activeLink = {
    color: "red",
  };

  const inactiveLink = {
    color: "black",
  };



  return (
    <header>
      <div className="header-container" data-aos="fade-down">
        <img src={logo} alt="Logo" className="header-logo" />
        <nav className="header-nav">
        <NavLink 
  to="/" 
  className={({ isActive }) => (isActive ? "nav-active" : "nav-link")}
>
  Главная
</NavLink>

{store.isAuth === false &&
<NavLink 
  to="/auth" 
  className={({ isActive }) => (isActive ? "nav-active" : "nav-link")}
>
  Вход
</NavLink>
}

{store.isAuth === true &&
  <NavLink 
  to="/profile" 
  className={({ isActive }) => (isActive ? "nav-active" : "nav-link")}
>
  Профиль
</NavLink>

}

{store.isAuth === true &&
  <NavLink 
  to="/cars/" 
  className={({ isActive }) => (isActive ? "nav-active" : "nav-link")}
>
  Мои авто
</NavLink>

}

{store.isAuth === true &&
  <NavLink 
  to="/request" 
  className={({ isActive }) => (isActive ? "nav-active" : "nav-link")}
>
Заявки
</NavLink>

}
{store.isAuth === true &&
  <NavLink 
  to="/rentals" 
  className={({ isActive }) => (isActive ? "nav-active" : "nav-link")}
>
  Аренды
</NavLink>

}






        </nav>
      </div>
    </header>
  );
};

export default observer(NavBar);