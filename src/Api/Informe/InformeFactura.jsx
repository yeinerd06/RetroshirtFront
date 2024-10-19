import urlBackend from "../urlBackend";

async function apiListadoInformeCaja(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"informe/caja",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function apiDeleteInformeFactura(id){
  const token=localStorage.getItem("token")
  const result=await fetch(urlBackend+"informe/caja/delete/"+id,{
      method:'DELETE',
      headers:{
          "Authorization":"Bearer "+token
      }
  })
  return result;
}


async function apiSaveInformeCaja(informe) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"informe/caja/save",
      {
        method: "POST",
        body:JSON.stringify(informe),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
      }
    );
    return result;
  }

  export {apiSaveInformeCaja ,apiDeleteInformeFactura ,apiListadoInformeCaja}