import urlBackend from "../urlBackend";

async function apiListadoCategorias() {
  const token = localStorage.getItem("token");
  const result = await fetch(urlBackend + "api/categoria", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return result;
}

async function apiSaveCategoria(categoria) {
  const token = localStorage.getItem("token");
  const result = await fetch(urlBackend + "api/categoria/save", {
    method: "POST",
    body: JSON.stringify(categoria),
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  });
  return result;
}

export { apiListadoCategorias, apiSaveCategoria };
