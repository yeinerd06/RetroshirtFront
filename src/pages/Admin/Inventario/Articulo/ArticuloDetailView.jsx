import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Chip
} from "@material-tailwind/react";
import { useUserContext } from "@/context/UserContext";

const ArticuloDetailView = () => {
    const { id } = useParams();
    const { articulos } = useUserContext();
    const [articulo, setArticulo] = useState(null);

    useEffect(() => {
        const foundArticulo = articulos.find(art => art.id === parseInt(id));
        setArticulo(foundArticulo);
    }, [id, articulos]);

    if (!articulo) {
        return <Typography variant="lead" className="text-center mt-8">Artículo no encontrado</Typography>;
    }

    const { nombre, marca, precio, cantidadMinima, stock, categoria, estado, imagen } = articulo;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-4xl mx-auto my-8 shadow-2xl flex flex-row">
                <CardHeader className="w-1/3">
                    <img src={imagen || "default-image.jpg"} alt={nombre} className="w-full h-full object-cover rounded-l-lg" />
                </CardHeader>
                <CardBody className="w-2/3 p-6">
                    <Typography variant="h4" className="mb-4">
                        {nombre}
                    </Typography>
                    <Chip value={categoria} color="black" className="mb-4" />
                    <div className="mb-4">
                        <Typography variant="lead" className="text-gray-700">
                            <strong>Marca:</strong> {marca}
                        </Typography>
                    </div>
                    <div className="mb-4">
                        <Typography variant="lead" className="text-gray-700">
                            <strong>Precio de venta:</strong> ${precio}
                        </Typography>
                    </div>
                    <div className="mb-4">
                        <Typography variant="lead" className="text-gray-700">
                            <strong>Cantidad Mínima:</strong> {cantidadMinima}
                        </Typography>
                    </div>
                    <div className="mb-4">
                        <Typography variant="lead" className="text-gray-700">
                            <strong>Stock:</strong> {stock}
                        </Typography>
                    </div>
                    <div className="mb-4">
                        <Typography variant="lead" className="text-gray-700">
                            <strong>Estado:</strong> {estado ? "Disponible" : "No Disponible"}
                        </Typography>
                    </div>
                    <div className="flex justify-end">
                        <Button color="black" variant="gradient" onClick={() => window.history.back()}>
                            Volver
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default ArticuloDetailView;
