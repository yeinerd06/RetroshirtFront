import { apiIniciarSesion } from "@/Api/Login/ApiLogin";
import { Loader } from "@/Components/Loader";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const [errorMessage, setErrorMessage]=useState([])
  const [loading, setloading] = useState(false);
  const handleLogin = (e) => {
    e.preventDefault();
    setloading(true)
    apiIniciarSesion(data)
    .then((response) => response.json())
      .then(data => {
        if (data.success) {
         // let modulo = localStorage.getItem("modulo")
          let token=data.data
          localStorage.setItem("token", token)
          const usuario = JSON.parse(JSON.stringify(parseJwt(token)));
          const rol = usuario?.roles[0]?.nombre?.split("_")[1].toLowerCase();
          localStorage.setItem("data",JSON.stringify(usuario))
          localStorage.setItem("modulo",rol)
          
          navigate("/" + rol + "/home")
        
        } else {
          let msg = data?.mensaje
          if (msg === "Bad credentials") {
            msg = "Contraseña Incorrecta"
          }

          setErrorMessage(msg)

        }


      })
      .catch(e => {
        console.log(e)
        setErrorMessage(e.mensaje)
      })
      .finally(f => {
      setloading(false)
      })

    
  };

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  return (
    <section className="flex flex-col justify-center items-center min-h-screen p-4 bg-gray-50"
      style={{
        backgroundImage: "url(/img/wise/wise-stock.jpg)",
      }}>

        {loading && (
          <Loader/>
        )}
      <div className="text-center mb-8">
        <Typography variant="h2" className="font-bold mb-4">Wise Stock</Typography>
      </div>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Login</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-full" onSubmit={handleLogin}>
          <div className="mb-4 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Usuario
            </Typography>
            <Input
              id="email"
              name="email"
              size="lg"
              placeholder="name@mail.com"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleChange}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              id="password"
              name="password"
              type="password"
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              onChange={handleChange}
            />
          </div>
          <p className="text-center text-red-700 p-1 ">{errorMessage}</p>

          <Button className="mt-6  bg-white"  fullWidth type="submit">
            Iniciar Sesión
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            <Link to="/auth/recuperar-contraseña" className="text-gray-900 ml-1">Olvidaste la contraseña?</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default Login;
