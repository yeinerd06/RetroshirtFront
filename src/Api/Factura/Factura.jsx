import urlBackend from "../urlBackend";

async function apiListadoFacturas(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"factura",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function apiPagoFactura(id){
  const token=localStorage.getItem("token")
  const result=await fetch(urlBackend+"factura/pago/"+id,{
      method:'GET',
      headers:{
          "Authorization":"Bearer "+token
      }
  })
  return result;
}


async function apiSaveFactura(factura) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"factura/save",
      {
        method: "POST",
        body:JSON.stringify(factura),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
      }
    );
    return result;
  }
  async function apiUpdateFactura(factura) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"factura/update",
      {
        method: "PUT",
        body:JSON.stringify(factura),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
      }
    );
    return result;
  }
  async function apiSaveDevolucionFactura(id,devoluciones,nuevoTotal) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"factura/devolucion/"+id+"/"+nuevoTotal,
      {
        method: "POST",
        body:JSON.stringify(devoluciones),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
      }
    );
    return result;
  }

  export  {apiListadoFacturas,apiUpdateFactura,apiSaveFactura,apiSaveDevolucionFactura,apiPagoFactura}