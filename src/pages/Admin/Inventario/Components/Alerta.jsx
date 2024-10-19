import { useUserContext } from "@/context/UserContext";
import { BellIcon, ClockIcon } from "@heroicons/react/24/solid";
import { Avatar, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";


const AlertaInventario = () => {
    const {articulos,modulo}=useUserContext()
  // Filtrar los artículos cuyo stock es menor que la cantidad mínima
  const articulosBajoStock = articulos?.filter(articulo => articulo.stock < articulo.cantidadMinima && articulo.estado);
  const bajoStockCount = articulosBajoStock.length;
  return (
    <Menu>
    <MenuHandler>
       <div className="relative">
         <IconButton variant="text" color="blue-gray">
           <BellIcon className="h-5 w-5 text-blue-gray-900" />
         </IconButton>
         {bajoStockCount > 0 && (
           <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
             {bajoStockCount}
           </span>
         )}
       </div>
     </MenuHandler>
     <MenuList className="w-max border-0">
       {articulosBajoStock?.length > 0 ? (
         articulosBajoStock.map((articulo) => (
           <MenuItem className="flex items-center gap-3" key={articulo.id}>
               <Link to={"/admin/inventario"}>
               <Avatar
               src={articulo.imagen}
               alt="item-1"
               size="sm"
               variant="circular"
             />
             <div>
               <Typography
                 variant="small"
                 color="blue-gray"
                 className="mb-1 font-normal"
               >
                 <strong>{articulo.nombre}</strong> {articulo.marca}
               </Typography>
               <Typography
                 variant="small"
                 color="blue-gray"
                 className="flex items-center gap-1 text-xs font-normal opacity-60"
               >
                 <ClockIcon className="h-3.5 w-3.5 text-red-900" /> Min: {articulo.cantidadMinima}
               </Typography>
               <Typography
                 variant="small"
                 color="blue-gray"
                 className="flex items-center gap-1 text-xs font-normal opacity-60 mt-1"
               >
                 <ClockIcon className="h-3.5 w-3.5 text-red-900" /> Stock: {articulo.stock}
               </Typography>
             </div>
               </Link>
          
           </MenuItem>
         ))
       ) : (
         <MenuItem className="flex items-center gap-3">
           <Typography
             variant="small"
             color="blue-gray"
             className="text-xs font-normal"
           >
             No hay artículos con bajo stock.
           </Typography>
         </MenuItem>
       )}
     </MenuList>
   </Menu>
  );
};

export default AlertaInventario;
