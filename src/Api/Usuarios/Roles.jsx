import urlBackend from "../urlBackend";



async function apiListadoRoles(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"rol",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

export {apiListadoRoles}