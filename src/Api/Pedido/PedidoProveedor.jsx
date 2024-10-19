import urlBackend from "../urlBackend";


async function apiListadoPedidoProveedor(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"pedido/proveedor",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}
async function apiSavePedidoProveedor(pedidoProveedor) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"pedido/proveedor/save",
      {
        method: "POST",
        body:JSON.stringify(pedidoProveedor),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-type":"application/json"
        }
      }
    );
    return result;
  }

  export {apiSavePedidoProveedor,apiListadoPedidoProveedor}