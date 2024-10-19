import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Typography,
} from "@material-tailwind/react";
import Select from "react-select";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import { useUserContext } from "@/context/UserContext";
import { useProductoContext } from "@/context/ProductoContext";
import { apiUpdateArticulo } from "@/Api/Articulo/Articulo";

const UpdateArticuloModal = ({ open, handleOpen, articulo }) => {
  const { categorias, colores, generos } = useProductoContext();
  const { setArticulos, articulos,listadoArticulos } = useUserContext();
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(articulo?.imagen);

  const [formData, setFormData] = useState({
    nombre: articulo?.nombre || "",
    marca: articulo?.marca || "",
    precio: articulo?.precio || "",
    cantidadMinima: articulo?.cantidadMinima || "",
    stock: articulo?.stock || "",
    categoria: articulo?.categoria || "",
    imagen: null,
    estado: articulo?.estado ?? false,
    genero: articulo?.genero || "",
    descripcion: articulo?.descripcion || "",
    codigo: articulo?.codigo || "",
  });

  // Separar los colores ya registrados y los nuevos
  const [articuloColoresRegistrados, setArticuloColoresRegistrados] = useState(
    articulo?.colores || []
  );
  const [articuloColoresNuevos, setArticuloColoresNuevos] = useState([]);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (articulo) {
      setFormData({
        id: articulo.id,
        nombre: articulo.nombre,
        marca: articulo.marca,
        precio: articulo.precio,
        cantidadMinima: articulo.cantidadMinima,
        stock: articulo.stock,
        categoria: articulo.categoria,
        imagen: null,
        estado: articulo.estado,
        genero: articulo.genero,
        descripcion: articulo.descripcion,
        codigo: articulo.codigo,
      });
      setImagen(articulo.imagen);
      setArticuloColoresRegistrados(articulo.colores || []); // Colores ya registrados
    }
  }, [articulo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (selectedOption, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      imagen: file,
    }));
    setImagen(URL.createObjectURL(file));
  };

  const handleColorSelectChange = (selectedOption) => {
    setColor(selectedOption);
  };

  const agregarColor = () => {
    if (!color) {
      setMensaje("El campo de Color es obligatorio");
      return;
    }

    // Validar si el color ya existe, en registrados o en nuevos
    const existsInRegistrados = articuloColoresRegistrados.some(
      (c) => c.color.id === color.value
    );
    const existsInNuevos = articuloColoresNuevos.some(
      (c) => c.color.id === color.value
    );
    if (existsInRegistrados || existsInNuevos) {
      setMensaje("Este color ya ha sido agregado");
      return;
    }

    // Agregar el nuevo color
    const nuevoColor = {
      color: {
        id: color.value,
        nombre: color.label,
      },
    };
    setArticuloColoresNuevos((prev) => [...prev, nuevoColor]);
    setColor(null); // Limpiar el select después de agregar
    setMensaje(""); // Limpiar el mensaje de error
  };

  const eliminarColorNuevo = (index) => {
    setArticuloColoresNuevos((prev) => prev.filter((_, i) => i !== index));
  };

  const buscarArticulo = (codigo) => {
    return articulos.some((articulo) => articulo.codigo === codigo);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setMensaje("");

    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.cantidadMinima ||
      !formData.categoria ||
      !formData.genero ||
      !formData.descripcion
    ) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }

    if (!imagen) {
      setMensaje("Seleccione una imagen");
      return;
    }

    const existeCodigo = buscarArticulo(formData.codigo);
    if (existeCodigo && articulo.codigo !== formData.codigo) {
      setMensaje("El código ya existe");
      return;
    }

    if (
      articuloColoresRegistrados.length === 0 &&
      articuloColoresNuevos.length === 0
    ) {
      setMensaje("Debe agregar al menos un color");
      return;
    }

    const articuloData = {
      ...formData,
      imagen: undefined,
      colores: [
        ...articuloColoresRegistrados, // Colores registrados originales
        ...articuloColoresNuevos, // Nuevos colores agregados
      ].map((articuloColor) => ({
        color: {
          id: articuloColor.color.id,
          nombre: articuloColor.color.nombre,
        },
      })),
    };
    console.log(articuloData)
    const data = new FormData();
    data.append(
      "articulo",
      new Blob([JSON.stringify(articuloData)], { type: "application/json" })
    );
    if (formData.imagen) {
      data.append("file", formData.imagen);
    }

    setLoading(true);
    apiUpdateArticulo(data)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            if (data.success) {
                listadoArticulos()
                alertify.success("Artículo Actualizado");
                handleOpen();
            } else {
                setMensaje(data.mensaje);
            }
        })
        .catch((e) => {
            console.log(e);
        })
        .finally(() => {
            setLoading(false);
        });
  };

  const categoriesOptions = categorias.map((categoria) => ({
    value: categoria.id,
    label: categoria.nombre,
    data: categoria,
  }));

  const gendersOptions = generos.map((genero) => ({
    value: genero.valor,
    label: genero.nombre,
  }));

  const colorsOptions = colores.map((color) => ({
    value: color.id,
    label: color.nombre,
  }));

  return (
    <Dialog open={open} handler={handleOpen} dismiss={{ outsidePress: false }}>
      <Loader loading={loading} />
      <DialogHeader className="bg-blue-900 text-white">
        ACTUALIZAR PRODUCTO
      </DialogHeader>
      <form onSubmit={handleUpdate}>
        <DialogBody divider style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div className="mb-4">
            <Select
              options={categoriesOptions}
              value={categoriesOptions.find(
                (option) => option.value === formData?.categoria?.id
              )}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "categoria")
              }
              placeholder="Categoría"
              isSearchable
            />
          </div>

          <div className="mb-4">
            <Select
              options={gendersOptions}
              value={gendersOptions.find(
                (option) => option.value === formData?.genero
              )}
              onChange={(selectedOption) =>
                handleSelectChange(selectedOption, "genero")
              }
              placeholder="Género"
              isSearchable
            />
          </div>

          <div className="mb-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData?.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Descripción"
              name="descripcion"
              value={formData?.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Referencia"
              name="codigo"
              value={formData?.codigo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Precio de venta"
              name="precio"
              type="number"
              value={formData?.precio}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Cantidad Mínima"
              name="cantidadMinima"
              type="number"
              value={formData?.cantidadMinima}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
              <span className="ml-2"> PRODUCTO DISPONIBLE</span>
            </label>
          </div>

          <div className="mb-4 flex gap-4">
            <Select
              options={colorsOptions}
              value={color}
              onChange={handleColorSelectChange}
              placeholder="Color de camisa"
              isSearchable
            />
            <Button color="green" onClick={agregarColor}>
              Agregar
            </Button>
          </div>

          {articuloColoresRegistrados.length > 0 && (
            <div className="mb-4">
              <Typography variant="h6" className="mb-2 font-bold">
                Colores registrados:
              </Typography>
              <ul>
                {articuloColoresRegistrados.map((articuloColor, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>Color: {articuloColor.color.nombre}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          

          {articuloColoresNuevos.length > 0 && (
            <div className="mb-4">
              <Typography variant="h6" className="mb-2 font-bold">
                Nuevos colores agregados:
              </Typography>
              <ul>
                {articuloColoresNuevos.map((articuloColor, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>Color: {articuloColor.color.nombre}</span>
                    <Button
                      size="sm"
                      color="red"
                      onClick={() => eliminarColorNuevo(index)}
                    >
                      Eliminar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {mensaje && (
            <div className="mb-4">
              <p className="text-center text-red-700">{mensaje}</p>
            </div>
          )}
          <div className="mb-4">
            <Input label="Imagen" type="file" onChange={handleImageChange} />
          </div>
          {imagen && (
            <div className="mb-4">
              <img
                src={imagen}
                alt="Previsualización"
                className="w-full h-auto"
              />
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button onClick={handleOpen} className="mr-1 bg-red-900 text-white">
            <span>Cancelar</span>
          </Button>
          <Button type="submit" className="bg-blue-900 text-white">
            <span>Actualizar</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default UpdateArticuloModal;
