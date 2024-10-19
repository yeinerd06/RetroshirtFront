import urlBackend from "../urlBackend";
async function apiInformationEmpresa(){
    const token=localStorage.getItem("token")
    const result=await fetch(urlBackend+"empresa",{
        method:'GET',
        headers:{
            "Authorization":"Bearer "+token
        }
    })
    return result;
}

async function apiUpdateEmpresa(empresa) {
    const token = localStorage.getItem("token");
    const result = await fetch(
      urlBackend+"empresa/update",
      {
        method: "PUT",
        body:JSON.stringify(empresa),
        headers:{
            "Authorization":"Bearer "+token,
             "Content-type":"application/json"
        }
      }
    );
    return result;
  }

  export {apiInformationEmpresa,apiUpdateEmpresa}