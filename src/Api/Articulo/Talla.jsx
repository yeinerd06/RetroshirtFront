import urlBackend from "../urlBackend";

async function apiListadoTallas(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"api/talla",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function apiSaveTalla(talla) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"api/talla/save",
      {
        method: "POST",
        body:JSON.stringify(talla),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-Type": "application/json"
        }
      }
    );
    return result;
  }

  export {apiListadoTallas,apiSaveTalla}