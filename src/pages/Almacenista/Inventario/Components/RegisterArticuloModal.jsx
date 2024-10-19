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
import { apiSaveArticulo } from "@/Api/Articulo/Articulo";
import { useUserContext } from "@/context/UserContext";

const RegisterArticuloModal = ({ open, handleOpen }) => {
    const {setArticulos}=useUserContext()
    const [loading, setLoading] = useState(false);
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
        estado: false
    });

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
            estado: false
        });
    };

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

    const handleRegister = (e) => {
        e.preventDefault();
        setMensaje("");

        if (!formData.nombre || !formData.marca || !formData.precio || !formData.cantidadMinima  || !formData.categoria) {
            setMensaje("Todos los campos son obligatorios");
            return;
        }
        if (!imagen) {
            setMensaje("Seleccione una imagen");
            return;
        }
        const data = new FormData();
        data.append(
            "articulo",
            new Blob(
                [JSON.stringify({ ...formData, imagen: undefined })],
                { type: "application/json" }
            )
        );
        data.append("file", formData.imagen);
        console.log(formData)
        console.log(imagen)
        //Aquí puedes realizar la llamada a la API para guardar el artículo
        setLoading(true);
        apiSaveArticulo(data)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.success) {
                    console.log(data)
                    setArticulos((prevUsuarios) => [...prevUsuarios, data.data]);
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
            {loading && <Loader />}
            <DialogHeader>Registrar Artículo</DialogHeader>
            <form onSubmit={handleRegister}>
                <DialogBody divider style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div className="mb-4">
                        <Select
                            label="Categoría"
                            name="categoria"
                            value={formData.categoria}
                            onChange={handleSelectChange}
                            required
                        >
                            <Option value="LUBRICANTES">Lubricantes</Option>
                            <Option value="FILTROS">Filtros</Option>
                            <Option value="REFRIGERANTES">Refrigerantes</Option>
                            <Option value="LIQUIDOS DE FRENO">Líquidos de freno</Option>
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
                            label="Precio"
                            name="precio"
                            type="number"
                            value={formData.precio}
                            onChange={handleChange}
                            min={1}
                            required
                        />
                    </div>
                    {/* <div className="mb-4">
                        <Input
                            label="Stock"
                            name="stock"
                            type="number"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div> */}
                    <div className="mb-4">
                        <Input
                            label="Cantidad Minima"
                            name="cantidadMinima"
                            type="number"
                            value={formData.cantidadMinima}
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
                            <span className="ml-2">Disponible</span>
                        </label>
                    </div>

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
                            <img src={imagen} alt="Previsualización" className="w-full h-auto" />
                        </div>
                    )}
                   
                    {mensaje && (
                        <div className="mb-4">
                            <p className="text-center text-red-700">{mensaje}</p>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
                        <span>Cancelar</span>
                    </Button>
                    <Button variant="gradient" type="submit" color="green">
                        <span>Registrar</span>
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default RegisterArticuloModal;
