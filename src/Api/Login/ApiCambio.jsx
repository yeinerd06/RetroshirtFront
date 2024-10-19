import urlBackend from "../urlBackend";

async function apiSendEmailCodigoCambioPass(codigo){
    const result=await fetch(urlBackend+"usuario/codigo-cambio",{
        method: 'POST',
        body:JSON.stringify(codigo), 
        headers:{
            'Content-Type': 'application/json'
        }
    });

    return result;
}

async function apiVerificarCodigoCambioPass(uuid,codigo,usuario){
    const result=await fetch(urlBackend+"usuario/cambio/"+uuid+"/"+codigo,{
        method: 'POST',
        body:JSON.stringify(usuario), 
        headers:{
            'Content-Type': 'application/json'
        }
    });

    return result;
}

export {apiSendEmailCodigoCambioPass,apiVerificarCodigoCambioPass}
