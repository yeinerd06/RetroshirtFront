import urlBackend from "../urlBackend";

async function apiListadoArticulos() {
  const token = localStorage.getItem("token");
  const options = {
    method: "GET",
  };

  if (token) {
    options.headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  const result = await fetch(`${urlBackend}articulo`, options);
  return result;
}

async function apiSaveArticulo(articulo) {
  const token = localStorage.getItem("token");
  const result = await fetch(urlBackend + "articulo/save", {
    method: "POST",
    body: articulo,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return result;
}
async function apiUpdateArticulo(articulo) {
  const token = localStorage.getItem("token");
  const result = await fetch(urlBackend + "articulo/update", {
    method: "PUT",
    body: articulo,
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return result;
}

export { apiListadoArticulos, apiSaveArticulo, apiUpdateArticulo };
