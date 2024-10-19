import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiStar } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { apiIniciarSesion } from "@/Api/Login/ApiLogin";
import { Loader } from "@/Components/Loader";
import { Button, Typography } from "@material-tailwind/react";

export const ResetPassword = () => {
  return (
    <section className="grid min-h-screen grid-cols-1 bg-slate-50 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]">
      <Logo />
      <Form />
      <SupplementalContent />
    </section>
  );
};

const Form = () => {
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage]=useState([])
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
    <motion.div
      initial="initial"
      whileInView="animate"
      transition={{
        staggerChildren: 0.05,
      }}
      viewport={{ once: true }}
      className="flex items-center justify-center pb-4 "
    >
       {loading && (
          <Loader/>
        )}
      {/* Ajuste del contenedor para que sea más ancho */}
      <div className="mx-auto my-auto w-full max-w-xl px-4 md:pr-0">
        <motion.h1
          variants={primaryVariants}
          className="mb-2 text-center text-gray-100 text-4xl font-semibold"
        >
          RETRO SHIRT
        </motion.h1>
        <motion.p variants={primaryVariants} className="mb-8 text-center text-gray-100">
        Recuperar contraseña
        </motion.p>

        {!codigoEnviado ? (
        <form onSubmit={handleSendCodigo} className="w-full text-gray-100">
        <div className="text-center">
              <Typography variant="h5" className="font-bold mb-4">Se enviara un codigo de 6 digitos a su email</Typography>
             </div>
          <motion.div variants={primaryVariants} className="mb-6 w-full ">
            <label
              htmlFor="email-input"
              className="mb-1 inline-block text-sm font-medium"
            >
              Email<span className="text-red-600">*</span>
            </label>
            <input
              id="email-input"
              type="text"
              name="email"
                  value={data.email}
                  onChange={handleChange}
              placeholder="Ingrese su email"
              className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
              required
              
            />
          </motion.div>

       

          <p className="text-center text-red-700 p-1 ">{errorMessage}</p>

          <motion.button
            variants={primaryVariants}
            whileTap={{
              scale: 0.985,
            }}
            type="submit"
            className="mb-3 w-full  rounded bg-gray-100 px-4 py-2 text-center font-bold text-gray-900 transition-colors hover:bg-gray-500"
          >
            Enviar codigo
          </motion.button>
          <motion.p variants={primaryVariants} className="text-xs text-center mt-3">
            Iniciar Sesión?{" "}
            <Link className="text-indigo-600 underline" to="/inicio/login">
              Login
            </Link>
          </motion.p>
        </form>
        ):(
          <form className="mt-8 mb-2 mx-auto w-full text-gray-100" onSubmit={handleValidarCodigo}>
          <div className="text-center">
            <Typography variant="h5" className="font-bold mb-4">
              Se envio un codigo de 6 digitos al email:</Typography>
              <Typography variant="h5" className="font-bold mb-4">
              {data.email}</Typography>
           </div>
           <motion.div variants={primaryVariants} className="mb-6 w-full ">
            <label
              htmlFor="email-input"
              className="mb-1 inline-block text-sm font-medium"
            >
              Codigo<span className="text-red-600">*</span>
            </label>
            <input
                 id="codigo"
                 name="codigo"
                 value={codigoUsuario}
                 onChange={(e)=>setCodigoUsuario(e.target.value)}
                 type="number"
              placeholder="Ingresa el codigo de 6 digitos "
              className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
              required
              
            />
          </motion.div>
          <motion.div variants={primaryVariants} className="mb-6 w-full ">
            <label
              htmlFor="email-input"
              className="mb-1 inline-block text-sm font-medium"
            >
              Contraseña Nueva<span className="text-red-600">*</span>
            </label>
            <input
            id="password"
            name="password"
             value={data.password}
            onChange={handleChange}
                 type="text"
              placeholder="Ingresa su nueva contraseña"
              className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600"
              required
              
            />
          </motion.div>

           <p className="text-center text-red-700 p-1">{mensaje}</p>
            {intentos<5 &&(
               <Button className="mt-6 bg-gray-100 hover:bg-green-500 text-gray-900 " type="submit"  fullWidth>
               Actualizar contraseña
             </Button>
            )}
           </form>
        )}
      </div>
    </motion.div>
  );
};

const SupplementalContent = () => {
  return (
    <div className="group sticky top-4 m-4 h-80 overflow-hidden rounded-3xl rounded-tl-[4rem] bg-slate-950 md:h-[calc(100vh_-_2rem)]">
      <img
        alt="An example image"
        src="/img/retro-shirt.jpg"
        className="h-full w-full bg-white object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-50"
      />

      <div className="absolute right-2 top-4 z-10">
        <FiArrowUpRight className="rotate-45 text-6xl text-indigo-200 opacity-0 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
      </div>

      <motion.div
        initial="initial"
        whileInView="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        viewport={{ once: true }}
        className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-slate-950/90 to-slate-950/0 p-8"
      >
        {/* <motion.h2
          className="mb-2 text-3xl font-semibold leading-[1.25] text-white lg:text-4xl"
          variants={primaryVariants}
        >
          Connecting Designers
          <br />
          with Opportunities
        </motion.h2> */}
        {/* <motion.p
          variants={primaryVariants}
          className="mb-6 max-w-md text-sm text-slate-300"
        >
          Bloop is the home of makers, making amazing things, and getting paid.
          Find your dream job with us.
        </motion.p> */}
      </motion.div>
    </div>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <svg
      width="50"
      height="39"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-[50%] top-4 -translate-x-[50%] fill-slate-950 md:left-4 md:-translate-x-0"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#000000"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#000000"
      ></path>
    </svg>
  );
};

const primaryVariants = {
  initial: {
    y: 25,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
};

const avatarVariants = {
  initial: {
    x: 10,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
  },
};
