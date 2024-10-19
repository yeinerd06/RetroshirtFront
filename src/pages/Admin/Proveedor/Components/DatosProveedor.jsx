import { Typography } from "@material-tailwind/react";

const DatosProveedor = ({proveedor}) => {
    return (
        <div className="">
          

            <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div>
                    <Typography className="font-medium text-gray-700">Nombre:</Typography>
                    <Typography className="text-lg text-gray-900">{proveedor?.nombre || 'N/A'}</Typography>
                </div>
                <div>
                    <Typography className="font-medium text-gray-700">Documento:</Typography>
                    <Typography className="text-lg text-gray-900">{proveedor?.documento || 'N/A'}</Typography>
                </div>
                <div>
                    <Typography className="font-medium text-gray-700">Email:</Typography>
                    <Typography className="text-lg text-gray-900">{proveedor?.email || 'N/A'}</Typography>
                </div>
                <div>
                    <Typography className="font-medium text-gray-700">Teléfono:</Typography>
                    <Typography className="text-lg text-gray-900">{proveedor?.telefono || 'N/A'}</Typography>
                </div>
            </div>

        </div>
    );
};

export default DatosProveedor