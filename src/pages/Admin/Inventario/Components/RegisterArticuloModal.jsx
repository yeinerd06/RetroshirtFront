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
import { apiSaveArticulo } from "@/Api/Articulo/Articulo";
import { useUserContext } from "@/context/UserContext";
import { useProductoContext } from "@/context/ProductoContext";

const RegisterArticuloModal = ({ open, handleOpen }) => {
  const { categorias, colores, generos } = useProductoContext();
  const { setArticulos, articulos, setLoading ,listadoArticulos} = useUserContext();
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    marca: "",
    precio: "",
    cantidadMinima: "",
    stock: 0,
    categoria: "",
    imagen: null,
    estado: false,
    genero: "",
    descripcion: "",
    codigo: "",
  });

  const [articuloColores, setArticuloColores] = useState([]);
  const [color, setColor] = useState(null);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setMensaje("");
    setImagen(null);
    setFormData({
      nombre: "",
      marca: "",
      precio: "",
      cantidadMinima: "",
      stock: 0,
      categoria: "",
      imagen: null,
      estado: false,
      genero: "",
      descripcion: "",
      codigo: "",
    });
    setArticuloColores([]);
    setColor(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
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

  // Crear opciones para react-select
  const categoriesOptions = categorias.map((categoria) => ({
    value: categoria.id,
    label: categoria.nombre,
    data: {
        id: categoria.id,
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
    },
  }));
  

  const gendersOptions = generos.map((genero) => ({
    value: genero.valor,
    label: genero.nombre,
  }));

  const colorsOptions = colores.map((color) => ({
    value: color.id,
    label: color.nombre,
  }));

  // Manejar cambios en el selector de color
  const handleColorSelectChange = (selectedOption) => {
    setColor(selectedOption);
  };

  const agregarColor = () => {
    if (!color) {
      setMensaje("El campo de Color es obligatorio");
      return;
    }

    const exists = articuloColores.some((c) => c.value === color.value);

    if (exists) {
      setMensaje("Este color ya ha sido agregado");
      return;
    }

    setArticuloColores((prev) => [...prev, color]);
    setColor(null); // Reiniciar el selector de color
  };

  const eliminarColor = (index) => {
    setArticuloColores((prev) => prev.filter((_, i) => i !== index));
  };

  const buscarArticulo = (codigo) => {
    return articulos.some((articulo) => articulo.codigo === codigo);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMensaje("");
    if (
      !formData.nombre ||
      !formData.precio ||
      !formData.cantidadMinima ||
      !formData.categoria
    ) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }
    if (!imagen) {
      setMensaje("Seleccione una imagen");
      return;
    }

    if (buscarArticulo(formData.codigo)) {
      setMensaje("El código ya existe");
      return;
    }

    if (articuloColores.length === 0) {
      setMensaje("Debe agregar al menos un color");
      return;
    }

    const articuloData = {
      ...formData,
      imagen: undefined,
      colores: articuloColores.map((item) => ({
        color: {
          id: item.value,
          nombre: item.label,
        },
      })),
    };
    console.log(articuloData);
    const data = new FormData();
    data.append(
      "articulo",
      new Blob([JSON.stringify(articuloData)], {
        type: "application/json",
      })
    );
    data.append("file", formData.imagen);

    setLoading(true);
    apiSaveArticulo(data)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          listadoArticulos()
          alertify.success("Artículo Registrado");
          handleOpen();
          resetForm();
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

  return (
    <Dialog open={open} handler={handleOpen} dismiss={{ outsidePress: false }}>
      <DialogHeader className="bg-blue-900 text-white">
        REGISTRAR PRODUCTO
      </DialogHeader>
      <form onSubmit={handleRegister}>
        <DialogBody divider style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {/* Selector de categorías */}
          <div className="mb-4">
            <Select
              options={categoriesOptions}
              value={categoriesOptions.find(
                (option) => option.value === formData.categoria
              )}
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  categoria: selectedOption ? selectedOption.data : "",
                }))
              }
              placeholder="Categoría"
              isSearchable
            />
          </div>

          {/* Selector de géneros */}
          <div className="mb-4">
            <Select
              options={gendersOptions}
              value={gendersOptions.find(
                (option) => option.value === formData.genero
              )}
              onChange={(selectedOption) =>
                setFormData((prev) => ({
                  ...prev,
                  genero: selectedOption ? selectedOption.value : "",
                }))
              }
              placeholder="Género"
              isSearchable
            />
          </div>

          {/* Otros campos de formulario */}
          <div className="mb-4">
            <Input
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Referencia"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              label="Precio de venta"
              name="precio"
              type="number"
              value={formData.precio}
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
              value={formData.cantidadMinima}
              onChange={handleChange}
              min={1}
              required
            />
          </div>

          {/* Selector de colores para ArticuloColores */}
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

          {/* Lista de ArticuloColores agregados */}
          {articuloColores.length > 0 && (
            <div className="mb-4">
              <Typography variant="h6" className="mb-2 font-bold">
                Colores agregados:
              </Typography>
              <ul>
                {articuloColores.map((c, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>Color: {c.label}</span>
                    <Button
                      color="red"
                      size="sm"
                      onClick={() => eliminarColor(index)}
                    >
                      Eliminar
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
              <span className="ml-2">PRODUCTO DISPONIBLE</span>
            </label>
          </div>

          {/* Imagen, Mensaje y Botones */}
          <div className="mb-4">
            <Input
              label="Imagen"
              type="file"
              onChange={handleImageChange}
              required
            />
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

          {mensaje && (
            <div className="mb-4">
              <p className="text-center text-red-700">{mensaje}</p>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button className="mr-1 bg-red-900 text-white" onClick={handleOpen}>
            <span>Cancelar</span>
          </Button>
          <Button type="submit" className="bg-blue-900 text-white">
            <span>Registrar</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

export default RegisterArticuloModal;
