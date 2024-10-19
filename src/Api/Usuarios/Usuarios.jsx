import urlBackend from "../urlBackend";

async function apiToken(){
  const token=localStorage.getItem("token")
  const result=await fetch(urlBackend+"usuario/api",{
      method:'GET',
      headers:{
          "Authorization":"Bearer "+token
      }
  })
  return result;
}


async function apiListadoUsuarios(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"usuario",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function apiSaveUsuario(usuario) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"usuario/save",
      {
        method: "POST",
        body:usuario,
        headers:{
            "Authorization":"Bearer "+token,
        }
      }
    );
    return result;
  }
  
async function apiUpdateUsuario(usuario) {
  const token = localStorage.getItem("token");
  const result = await fetch(
    urlBackend+"usuario/update",
    {
      method: "PUT",
      body:usuario,
      headers:{
          "Authorization":"Bearer "+token,
      }
    }
  );
  return result;
}
async function apiDeleteUsuario(id) {
  const token = localStorage.getItem("token");
  const result = await fetch(
    urlBackend+"usuario/"+id,
    {
      method: "DELETE",
      headers:{
          "Authorization":"Bearer "+token,
      }
    }
  );
  return result;
}


export {apiToken,apiListadoUsuarios,apiSaveUsuario,apiUpdateUsuario,apiDeleteUsuario}