import { apiSendEmailCodigoCambioPass, apiVerificarCodigoCambioPass } from "@/Api/Login/ApiCambio";
import { Loader } from "@/Components/Loader";
import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";
import { useState } from "react";
  import { Link } from "react-router-dom";
  
  export function Password() {

    const [loading, setLoading] = useState(false)
    const [data,setData]=useState([])
    const handleChange = (e) => {
      setData({
        ...data,
        [e.target.name]: e.target.value,
      });
    };
    const [mensaje, setMensaje] = useState([])
    const [codigoEnviado, setCodigoEnviado] = useState(false)
    const [uuid, setUuid] = useState([])
    const [codigoUsuario, setCodigoUsuario] = useState([])
    const [intentos, setIntentos] = useState(0)
    const handleInputChange = (event) => {
      setCodigoUsuario(event.target.value);
    };

    const handleSendCodigo=(e)=>{
      e.preventDefault();
      setMensaje("")

      setLoading(true)

      apiSendEmailCodigoCambioPass(data)
      .then(res=>res.json())
      .then(data=>{
        if(data.success){
        setCodigoEnviado(true)
        setUuid(data.data)
        }else{
          setMensaje(data.mensaje)
        }
      }).catch(e=>{
        console.log(e)
      })
      .finally((f)=>{
        setLoading(false)
      })
   
      
     
     
    }
    const handleValidarCodigo=(e)=>{
      e.preventDefault();
      setMensaje("")
      // console.log(data)
      // console.log("codigo Usuario",codigoUsuario)
      setIntentos(intentos + 1)
      if (intentos > 5) {
        setMensaje("Limite de intentos ")
        return;
      }
      setLoading(true)
      apiVerificarCodigoCambioPass(uuid, codigoUsuario, data)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Contraseña actualizada")
          window.location.href="/auth/login"
        } else {
          setMensaje(data.mensaje + "- Intento: " + (intentos+1))
        }
      })
      .catch(e => {
        console.log(e)
      })
      .finally(f => {
        setLoading(false)
      })
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
            <Typography variant="h2" className="font-bold mb-4">Recuperar contraseña</Typography>
           </div>
          {!codigoEnviado ? (
            <form className="mt-8 mb-2 mx-auto w-full" onSubmit={handleSendCodigo}>
            <div className="text-center">
              <Typography variant="h5" className="font-bold mb-4">Para validar su cuenta se enviara un codigo.</Typography>
             </div>
              <div className="mb-4 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                  Correo Electronico
                </Typography>
                <Input
                  size="lg"
                  id="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="name@mail.com"
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  required
                />
              
              </div>
              <p className="text-center text-red-700 p-1">{mensaje}</p>
              
              <Button className="mt-6" type="submit" fullWidth>
                  Recuperar
                </Button>
              
              <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
              
                <Link to="/auth/login" className="text-gray-900 ml-1">Iniciar Sesión</Link>
              </Typography>
            </form>
          ):(
            <form className="mt-8 mb-2 mx-auto w-full" onSubmit={handleValidarCodigo}>
          <div className="text-center">
            <Typography variant="h5" className="font-bold mb-4">
              Se envio un codigo de 6 digitos al email:</Typography>
              <Typography variant="h5" className="font-bold mb-4">
              {data.email}</Typography>
           </div>
            <div className="mb-4 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Codigo
              </Typography>
              <Input
                size="lg"
                id="codigo"
                name="codigo"
                value={codigoUsuario}
                onChange={(e)=>setCodigoUsuario(e.target.value)}
                placeholder="name@mail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            
            </div>
            <div className="mb-4 flex flex-col gap-6">
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Contraseña
              </Typography>
              <Input
                size="lg"
                id="password"
                name="password"
                 value={data.password}
                onChange={handleChange}
                placeholder="name@mail.com"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            
            </div>
            <p className="text-center text-red-700 p-1">{mensaje}</p>
            {intentos<5 &&(
               <Button className="mt-6" type="submit" fullWidth>
               Actualizar contraseña
             </Button>
            )}
           
            
          
          </form>
          )}
        </div>
      </section>
    );
  }
  
  export default Password;
  