import urlBackend from "../urlBackend";



async function apiIniciarSesion(usuario){
    const result=await fetch(urlBackend+"user/login",{
        method:'POST',
        body:JSON.stringify(usuario),
        headers:{
            "Content-type":"application/json"
        }
    })
    return result;
}

export {apiIniciarSesion}