import urlBackend from "../urlBackend";

async function apiListadoArticulosInicio(){
    const result=await fetch(urlBackend+"articulo/inicio",{
        method:'GET',
      
    })
    return result;
}

export {apiListadoArticulosInicio}