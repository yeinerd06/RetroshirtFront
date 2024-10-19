import urlBackend from "../urlBackend";

async function apiListadoProveedores(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"proveedor",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function apiSaveProveedor(proveedor) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"proveedor/save",
      {
        method: "POST",
        body:JSON.stringify(proveedor),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-Type": "application/json"
        }
      }
    );
    return result;
  }
  async function apiUpdateProveedor(articulo) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"proveedor/update",
      {
        method: "PUT",
        body:JSON.stringify(articulo),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-Type": "application/json"
        }
      }
    );
    return result;
  }

  export {apiListadoProveedores,apiSaveProveedor,apiUpdateProveedor}