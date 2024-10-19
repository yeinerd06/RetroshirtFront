import React, { useState } from 'react';
import { useProductoContext } from '@/context/ProductoContext';
import { apiSaveCategoria } from '@/Api/Articulo/Categoria';
import { apiSaveTalla } from '@/Api/Articulo/Talla';
import { apiSaveColor } from '@/Api/Articulo/Color';
import { useUserContext } from '@/context/UserContext';
import { Input, Button, Card, CardBody, Typography } from "@material-tailwind/react";

const Inicio = () => {
  const { categorias, tallas, colores, setCategorias, setTallas, setColores } = useProductoContext();
  const { setLoading } = useUserContext();
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [nombreTalla, setNombreTalla] = useState('');
  const [nombreColor, setNombreColor] = useState('');
  const [hexColor, setHexColor] = useState('#FFFFFF');

  const handleSaveCategoria = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newCategoria = { 
        nombre: nombreCategoria.toUpperCase(), 
        descripcion: descripcionCategoria.toUpperCase() 
      };
      apiSaveCategoria(newCategoria)
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            alert('Error al registrar la Categoría');
          } else {
            setCategorias([...categorias, newCategoria]);
            alert('Categoría registrada correctamente!');
            setNombreCategoria('');
            setDescripcionCategoria('');
          }
        })
        .catch((e) => {
          console.log(e);
      })
      .finally(() => {
          setLoading(false);
      });
        
    } catch (error) {
      console.error('Error al registrar la categoría:', error);
      alert('Error al registrar la categoría');
      setLoading(false);
    } 
  };

  const handleSaveTalla = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newTalla = { nombre: nombreTalla.toUpperCase() };
      apiSaveTalla(newTalla)
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            alert('Error al registrar la Talla');
          } else {
            setTallas([...tallas, newTalla]);
            alert('Talla registrada correctamente!');
            setNombreTalla('');
          }
        })
        .catch((e) => {
          console.log(e);
      })
      .finally(() => {
          setLoading(false);
      });
    } catch (error) {
      console.error('Error al registrar la talla:', error);
      alert('Error al registrar la talla');
    } 
  };

  const handleSaveColor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newColor = { 
        nombre: nombreColor.toUpperCase(), 
        color: hexColor 
      };
      apiSaveColor(newColor)
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            alert('Error al registrar el Color');
          } else {
            setColores([...colores, newColor]);
            alert('Color registrado correctamente!');
            setNombreColor('');
            setHexColor('#FFFFFF');
          }
        })
        .catch((e) => {
          console.log(e);
      })
      .finally(() => {
          setLoading(false);
      });
    } catch (error) {
      console.error('Error al registrar el color:', error);
      alert('Error al registrar el color');
    } 
  };

  return (
    <div className="mx-auto p-4">
      {/* Sección de formularios en 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg flex flex-col justify-between h-full">
          <CardBody className="flex flex-col justify-between">
            <div>
              <Typography variant="h5" className="mb-4 font-bold">Registrar Categoría</Typography>
              <form onSubmit={handleSaveCategoria} className="space-y-4">
                <Input
                  label="Nombre de la Categoría"
                  value={nombreCategoria}
                  onChange={(e) => setNombreCategoria(e.target.value.toUpperCase())}
                  size="lg"
                />
                <Input
                  label="Descripción"
                  value={descripcionCategoria}
                  onChange={(e) => setDescripcionCategoria(e.target.value.toUpperCase())}
                  size="lg"
                />
              </form>
            </div>
            <Button type="submit" onClick={handleSaveCategoria} color="blue" fullWidth className="mt-4 bg-green-700 hover:bg-green-900">
              Registrar Categoría
            </Button>
          </CardBody>
        </Card>

        <Card className="shadow-lg flex flex-col justify-between h-full">
          <CardBody className="flex flex-col justify-between">
            <div>
              <Typography variant="h5" className="mb-4 font-bold">Registrar Talla</Typography>
              <form onSubmit={handleSaveTalla} className="space-y-4">
                <Input
                  label="Nombre de la Talla"
                  value={nombreTalla}
                  onChange={(e) => setNombreTalla(e.target.value.toUpperCase())}
                  size="lg"
                />
                <Input
                  label="Descripción (Opcional)"
                  size="lg"
                />
              </form>
            </div>
            <Button type="submit" onClick={handleSaveTalla}  fullWidth className="mt-4 bg-green-700 hover:bg-green-900">
              Registrar Talla
            </Button>
          </CardBody>
        </Card>

        <Card className="shadow-lg flex flex-col justify-between h-full">
          <CardBody className="flex flex-col justify-between">
            <div>
              <Typography variant="h5" className="mb-4 font-bold">Registrar Color</Typography>
              <form onSubmit={handleSaveColor} className="space-y-4">
                <Input
                  label="Nombre del Color"
                  value={nombreColor}
                  onChange={(e) => setNombreColor(e.target.value.toUpperCase())}
                  size="lg"
                />
                <div>
                  <input
                    type="color"
                    value={hexColor}
                    onChange={(e) => setHexColor(e.target.value)}
                    className="w-full h-10 p-1 rounded-md cursor-pointer border border-gray-300"
                  />
                </div>
              </form>
            </div>
            <Button type="submit" onClick={handleSaveColor} color="blue" fullWidth className="mt-4 bg-green-700 hover:bg-green-900">
              Registrar Color
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Sección de listados en 3 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="shadow-lg">
          <CardBody>
            <Typography variant="h5" className="mb-4 font-bold">Listado de Categorías</Typography>
            <ul className="space-y-2">
              {categorias.map((c) => (
                <li key={c.id} className="border-b pb-2">{c.nombre}</li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="shadow-lg">
          <CardBody>
            <Typography variant="h5" className="mb-4 font-bold">Listado de Tallas</Typography>
            <ul className="space-y-2">
              {tallas.map((t) => (
                <li key={t.id} className="border-b pb-2">{t.nombre}</li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="shadow-lg">
          <CardBody>
            <Typography variant="h5" className="mb-4 font-bold">Listado de Colores</Typography>
            <ul className="space-y-2">
              {colores.map((col) => (
                <li key={col.id} className="border-b pb-2 flex items-center">
                  <span className="mr-2">{col.nombre}</span>
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: col.color }}
                  ></span>
                  <span className="ml-2 text-gray-500">{col.color}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Inicio;
