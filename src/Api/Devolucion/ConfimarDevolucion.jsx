import urlBackend from "../urlBackend";

async function apiConfirmarDevolucionPedidoProveedor(pedidoProveedor) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"devolucion/proveedor/confirmar",
      {
        method: "PUT",
        body:JSON.stringify(pedidoProveedor),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
      }
    );
    return result;
  }

  export {apiConfirmarDevolucionPedidoProveedor}

