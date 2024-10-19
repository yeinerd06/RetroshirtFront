import React, { useEffect, useState } from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Input,
    Select,
    Option
} from "@material-tailwind/react";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import { Loader } from "@/Components/Loader";
import { useUserContext } from "@/context/UserContext";
import { apiUpdateArticulo } from "@/Api/Articulo/Articulo";

const UpdateArticuloModal = ({ open, handleOpen, articulo }) => {
    const { setArticulos, usuario,articulos } = useUserContext();
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
        estado: articulo?.estado ?? true,
        codigo:articulo?.codigo
    });

    useEffect(() => {
        if (articulo) {
            setFormData({
                nombre: articulo.nombre,
                marca: articulo.marca,
                precio: articulo.precio,
                cantidadMinima: articulo.cantidadMinima,
                stock: articulo.stock,
                categoria: articulo.categoria,
                imagen: null,
                estado: articulo.estado,
                codigo:articulo?.codigo
            });
            setImagen(articulo.imagen);

        }
    }, [articulo]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSelectChange = (value) => {
        setFormData((prevData) => ({
            ...prevData,
            categoria: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            imagen: file
        }));
        setImagen(URL.createObjectURL(file));
    };

    const buscarArticulo = (codigo) => {
        return articulos.some(articulo => articulo.codigo === codigo);
      };
    const handleUpdate = (e) => {
        e.preventDefault();
        setMensaje("");
   

        if (!formData.nombre || !formData.marca || !formData.precio || !formData.cantidadMinima ||  !formData.categoria) {
            setMensaje("Todos los campos son obligatorios");
            return;
        }

        if(!formData.estado && formData.stock>0){
            setMensaje("No de puede dar de baja el producto, aun tiene stock")
            return;
        }
        const existeCodigo=buscarArticulo(formData.codigo)
        if(existeCodigo && articulo.codigo!== formData.codigo){
        setMensaje("El codigo ya existe ")
        return
        }

        const data = new FormData();
        data.append(
            "articulo",
            new Blob(
                [JSON.stringify({ ...formData, imagen: undefined, id: articulo.id })],
                { type: "application/json" }
            )
        );
        if (formData.imagen) {
            data.append("file", formData.imagen);
        }

        console.log(formData)
        setLoading(true);
        apiUpdateArticulo(data)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setArticulos(prevUsuarios => {
                        // Actualiza la lista de semestres con el semestre actualizado
                        return prevUsuarios.map(prevUsuario => {
                            // Si el semestre actualizado tiene el mismo ID que el semestre existente, devolver el semestre actualizado
                            if (prevUsuario.id === data?.data?.id) {
                                return data.data;
                            } else {
                                return prevUsuario; // Devuelve el semestre existente sin cambios
                            }
                        });
                    })
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

    return (
        <Dialog open={open} handler={handleOpen} dismiss={{ outsidePress: false }}>
            {loading && <Loader />}
            <DialogHeader>Actualizar Artículo</DialogHeader>
            <form onSubmit={handleUpdate}>
                <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="mb-4">
                        <Select
                            label="Categoría"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleSelectChange}
                            required
                        >
                            <Option value="LUBRICANTES">LUBRICANTES</Option>
                            <Option value="FILTROS">FILTROS</Option>
                            <Option value="REFRIGERANTES">REFRIGERANTES</Option>
                            <Option value="LIQUIDOS DE FRENO">LIQUIDOS DE FRENO</Option>
                        </Select>
                    </div>
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
                            label="Marca"
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Input
                            label="Código"
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
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stock">
                            Stock
                        </label>
                        <Input
                            id="stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            disabled={true}
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        
                        <Input
                            label="Cantidad Minima"
                            id="cantidadMinima"
                            name="cantidadMinima"
                            type="number"
                            value={formData.cantidadMinima}
                            onChange={handleChange}
                            min={1}
                            required
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                            <span className="ml-2">Disponible</span>
                        </label>
                    </div>

                    <div className="mb-4">
                        <Input
                            label="Imagen"
                            type="file"
                            onChange={handleImageChange}
                        />
                    </div>
                    {imagen && (
                        <div className="mb-4">
                            <img src={imagen} alt="Previsualización" className="w-full h-auto" />
                        </div>
                    )}

                  
                </DialogBody>
                <DialogFooter>
                    <div>
                          {mensaje && (
                        <div className="mb-4">
                            <p className="text-center text-red-700">{mensaje}</p>
                        </div>
                    )}
                    </div>
                    <div>
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                        <span>Cancelar</span>
                    </Button>
                    <Button variant="gradient" type="submit" color="green">
                        <span>Actualizar</span>
                    </Button>
                    </div>
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default UpdateArticuloModal;
