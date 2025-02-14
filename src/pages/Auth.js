import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import Form from "../form/Form";

const Auth = () => {
  const { store } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (store.isAuth) {
      navigate("/profile"); // Перенаправляем, если уже авторизован
    }
  }, [store.isAuth, navigate]);

    return ( 
        <Form/>
        
    );
}
 
export default Auth;