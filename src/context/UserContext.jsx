import { apiListadoArticulos } from "@/Api/Articulo/Articulo";
import { apiListadoProveedores } from "@/Api/Proveedor/Proveedor";
import { apiListadoRoles } from "@/Api/Usuarios/Roles";
import { apiListadoUsuarios } from "@/Api/Usuarios/Usuarios";
import { Loader } from "@/Components/Loader";
import React, { createContext, useContext, useEffect, useState } from "react";


const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {

  let token = localStorage.getItem("token") || ""
  const user = JSON.parse(JSON.stringify(parseJwt(token)));
  const rol = user?.roles[0].nombre?.split("_")[1].toLowerCase();
  const [usuario, setUsuario] = useState(user);
  const [modulo, setModulo] = useState(rol);
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [articulos, setArticulos] = useState([])
  const [facturas, setFacturas] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [informesCaja, setInformesCaja] = useState([])
  const [loading, setLoading] = useState(false)
  const listadoArticulos = async () => {
    try {
      const response = await apiListadoArticulos();
      const data = await response.json();
      console.log(data)
      setArticulos(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const listadoUsuarios = async () => {
    try {
      const response = await apiListadoUsuarios();
      const data = await response.json();
      //console.log(data)
      setUsuarios(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const listadoRoles = async () => {
    try {
      const response = await apiListadoRoles();
      const data = await response.json();
      //console.log(data)
      setRoles(data.data);
    } catch (error) {
      console.log(error);
    }
  };
 

  useEffect(() => {
    if (modulo === "admin") {
      listadoUsuarios()
      listadoRoles()
    }


  }, [modulo])
  useEffect(() => {
    listadoArticulos()
    listadoProveedores()
 


  }, [modulo])

  const listadoProveedores = async () => {
    try {
      const response = await apiListadoProveedores();
      const data = await response.json();


      setProveedores(data.data.reverse());

    } catch (error) {
      console.log(error);
    }
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
    <UserContext.Provider

      value={{
        usuario, modulo, roles, usuarios, setUsuarios,
        articulos, setArticulos, listadoArticulos,
        facturas, setFacturas,
        proveedores, setProveedores,
        informesCaja, setInformesCaja,
        loading, setLoading

      }}
    >
      {children}
      <Loader  loading={loading}/>
    </UserContext.Provider>
  );
};