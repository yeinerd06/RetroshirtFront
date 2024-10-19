import urlBackend from "../urlBackend";

async function apiListadoColores(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"api/color",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function apiSaveColor(color) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"api/color/save",
      {
        method: "POST",
        body:JSON.stringify(color),
        headers:{
            "Authorization":"Bearer "+token,
            "Content-Type": "application/json"
        }
      }
    );
    return result;
  }

  export {apiListadoColores , apiSaveColor}