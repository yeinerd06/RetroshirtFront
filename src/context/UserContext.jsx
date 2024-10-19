import { apiListadoArticulos } from "@/Api/Articulo/Articulo";
import { apiListadoFacturas } from "@/Api/Factura/Factura";
import { apiListadoInformeCaja } from "@/Api/Informe/InformeFactura";
import { apiListadoProveedores } from "@/Api/Proveedor/Proveedor";
import { apiListadoRoles } from "@/Api/Usuarios/Roles";
import { apiListadoUsuarios } from "@/Api/Usuarios/Usuarios";
import React, { createContext, useContext, useEffect, useState } from "react";


const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {

  let token = localStorage.getItem("token")
  const user = JSON.parse(JSON.stringify(parseJwt(token)));
  const rol = user?.roles[0].nombre?.split("_")[1].toLowerCase();
  const [usuario, setUsuario] = useState(user);
  const [modulo, setModulo] = useState(rol);
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [articulos, setArticulos] = useState([])
  const [facturas, setFacturas] = useState([])
  const [facturaImprimir, setFacturaImprimir] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [informesCaja, setInformesCaja] = useState([])
  const listadoArticulos = async () => {
    try {
      const response = await apiListadoArticulos();
      const data = await response.json();
      //console.log(data)
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
  const listadoFacturas = async () => {
    try {
      const response = await apiListadoFacturas();
      const data = await response.json();
      console.log(data.data)
      if (modulo !== "admin") {
        let tipoFactura = "";
        switch (modulo) {
          case "almacenista":
            tipoFactura = "COMPRA";
            break;
          case "vendedor":
            tipoFactura = "VENTA";
            break;
          default:
            break;
        }
        console.log(tipoFactura)
        const filteredFacturas = data.data.filter((factura) => {
          return factura.tipoFactura.nombre === tipoFactura;
        });

        setFacturas(filteredFacturas.reverse());
      } else {
        setFacturas(data.data.reverse());
      }


    } catch (error) {
      console.log(error);
    }
  };
  const listadoInformesCaja = async () => {
    try {
      const response = await apiListadoInformeCaja();
      const data = await response.json();

      setInformesCaja(data.data.reverse());
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
    listadoFacturas()
    listadoProveedores()
    listadoInformesCaja()


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
        listadoFacturas


      }}
    >
      {children}
    </UserContext.Provider>
  );
};