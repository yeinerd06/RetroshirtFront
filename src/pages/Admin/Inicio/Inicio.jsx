import React, { useState } from 'react';
import { useProductoContext } from '@/context/ProductoContext';
import { useUserContext } from '@/context/UserContext';
import {
  Input,
  Button,
  Card,
  CardBody,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { apiSaveColor } from '@/Api/Articulo/Color';
import { apiSaveTalla } from '@/Api/Articulo/Talla';
import { apiSaveCategoria } from '@/Api/Articulo/Categoria';
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.css";
import EmpresaInfo from './Empresa/EmpresaInfo';
// Modal Component for Form Input
const RegistroModal = ({ isOpen, onClose, title, onSubmit, children }) => (
  <Dialog open={isOpen} handler={onClose}>
    <DialogHeader>{title}</DialogHeader>
    <DialogBody>{children}</DialogBody>
    <DialogFooter>
      <Button onClick={onClose} variant="text" color="red">
        Cancelar
      </Button>
      <Button onClick={onSubmit} color="green">
        Registrar
      </Button>
    </DialogFooter>
  </Dialog>
);

// List Component with Add Button
const ListadoConBoton = ({ title, items, onAddClick, renderItem }) => (
  <Card className="shadow-lg">
    <CardBody>
      <div className="flex justify-between items-center">
        <Typography variant="h5" className="mb-4 font-bold">{title}</Typography>
        {!title.includes("Tallas") &&(
           <IconButton className="bg-blue-900 hover:bg-blue-700" onClick={onAddClick}>
           <PlusIcon className="h-5 w-5 text-white" />
         </IconButton>
        )}
       
      </div>
      <ul className="space-y-2">
        {items.map(renderItem)}
      </ul>
    </CardBody>
  </Card>
);

const Inicio = () => {
  const { categorias, tallas, colores, setCategorias, setTallas, setColores } = useProductoContext();
  const { setLoading } = useUserContext();

  const [modalState, setModalState] = useState({
    categoria: false,
    talla: false,
    color: false,
  });

  const [formData, setFormData] = useState({
    nombreCategoria: '',
    descripcionCategoria: '',
    nombreTalla: '',
    nombreColor: '',
    hexColor: '#FFFFFF'
  });

  const handleModalOpen = (key) => setModalState({ ...modalState, [key]: !modalState[key] });
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async (type) => {
    setLoading(true);
    const dataMap = {
      categoria: {
        api: apiSaveCategoria,
        data: {
          nombre: formData.nombreCategoria.toUpperCase(),
          descripcion: formData.descripcionCategoria.toUpperCase()
        },
        update: setCategorias,
        items: categorias,
        resetFields: { nombreCategoria: '', descripcionCategoria: '' }
      },
      talla: {
        api: apiSaveTalla,
        data: { nombre: formData.nombreTalla.toUpperCase() },
        update: setTallas,
        items: tallas,
        resetFields: { nombreTalla: '' }
      },
      color: {
        api: apiSaveColor,
        data: { nombre: formData.nombreColor.toUpperCase(), color: formData.hexColor },
        update: setColores,
        items: colores,
        resetFields: { nombreColor: '', hexColor: '#FFFFFF' }
      }
    };

    const { api, data, update, items, resetFields } = dataMap[type];

    try {
      const response = await api(data);
      const result = await response.json();
      if (result.success) {
        update([...items, data]);
        alertify.success(`${type.charAt(0).toUpperCase() + type.slice(1)} registrada correctamente!`);

        setFormData({ ...formData, ...resetFields });
        handleModalOpen(type);
      } else {
        alert(`Error al registrar ${type}`);
      }
    } catch (error) {
      console.error(`Error al registrar ${type}:`, error);
      alert(`Error al registrar ${type}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EmpresaInfo />
      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <ListadoConBoton
          title="Listado de Categorías"
          items={categorias}
          onAddClick={() => handleModalOpen('categoria')}
          renderItem={(c) => <li key={c.id} className="border-b pb-2">{c.nombre}</li>}
        />
        <ListadoConBoton
          title="Listado de Colores"
          items={colores}
          onAddClick={() => handleModalOpen('color')}
          renderItem={(col) => (
            <li key={col.id} className="border-b pb-2 grid grid-cols-3 items-center">
              <span className="col-span-1">{col.nombre}</span>
              <span className="col-span-1 w-4 h-4 rounded-full" style={{ backgroundColor: col.color }}></span>
              <span className="col-span-1 text-gray-500">{col.color}</span>
            </li>
          )}
        />

        <ListadoConBoton
          title="Listado de Tallas"
          items={tallas}
          onAddClick={() => handleModalOpen('talla')}
          renderItem={(t) => <li key={t.id} className="border-b pb-2">{t.nombre}</li>}
        />
      </div>

      {/* Modal Registrar Categoría */}
      <RegistroModal
        isOpen={modalState.categoria}
        onClose={() => handleModalOpen('categoria')}
        title="Registrar Categoría"
        onSubmit={() => handleSave('categoria')}
      >
        <Input
          label="Nombre de la Categoría"
          name="nombreCategoria"
          value={formData.nombreCategoria}
          onChange={handleInputChange}
          size="lg"
        />
        <Input
          label="Descripción"
          name="descripcionCategoria"
          value={formData.descripcionCategoria}
          onChange={handleInputChange}
          size="lg"
        />
      </RegistroModal>

      {/* Modal Registrar Color */}
      <RegistroModal
        isOpen={modalState.color}
        onClose={() => handleModalOpen('color')}
        title="Registrar Color"
        onSubmit={() => handleSave('color')}
      >
        <Input
          label="Nombre del Color"
          name="nombreColor"
          value={formData.nombreColor}
          onChange={handleInputChange}
          size="lg"
        />
        <input
          type="color"
          name="hexColor"
          value={formData.hexColor}
          onChange={handleInputChange}
          className="w-full h-10 p-1 rounded-md cursor-pointer border border-gray-300"
        />
      </RegistroModal>

      {/* Modal Registrar Talla */}
      <RegistroModal
        isOpen={modalState.talla}
        onClose={() => handleModalOpen('talla')}
        title="Registrar Talla"
        onSubmit={() => handleSave('talla')}
      >
        <Input
          label="Nombre de la Talla"
          name="nombreTalla"
          value={formData.nombreTalla}
          onChange={handleInputChange}
          size="lg"
        />
      </RegistroModal>
    </div>
  );
};

export default Inicio;
