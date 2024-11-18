import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Filter, Grid, List } from "lucide-react";
import { useUserContext } from "@/context/UserContext";

const filters = [
  { name: "Género", options: ["Hombre", "Mujer", "Unisex"] },
  { name: "Talla", options: ["XS", "S", "M", "L", "XL", "XXL"] },
  { name: "Color", options: ["Negro", "Blanco", "Gris", "Azul", "Rojo"] },
  {
    name: "Precio",
    options: ["Menos de $100.000", "$100.000 - $150.000", "Más de $150.000"],
  },
];

export default function ProductGrid() {
  const { articulos } = useUserContext();

  const [isGridView, setIsGridView] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [expandedFilters, setExpandedFilters] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleFilter = (filterName) => {
    setExpandedFilters((prev) =>
      prev.includes(filterName)
        ? prev.filter((f) => f !== filterName)
        : [...prev, filterName]
    );
  };

  const toggleFilterOption = (filterName, option) => {
    setSelectedFilters((prev) => {
      const updatedFilter = prev[filterName] || [];
      return {
        ...prev,
        [filterName]: updatedFilter.includes(option)
          ? updatedFilter.filter((o) => o !== option)
          : [...updatedFilter, option],
      };
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 ${isGridView ? "bg-gray-200" : ""}`}
              onClick={() => setIsGridView(true)}
            >
              <Grid size={20} />
            </button>
            <button
              className={`p-2 ${!isGridView ? "bg-gray-200" : ""}`}
              onClick={() => setIsGridView(false)}
            >
              <List size={20} />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {articulos.length} productos
            </span>
            <select
              className="border-none bg-transparent text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Destacados</option>
              <option value="newest">Más nuevos</option>
              <option value="price_asc">Precio: Menor a mayor</option>
              <option value="price_desc">Precio: Mayor a menor</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 pr-8">
            <div className="mb-6">
              <button className="flex items-center text-lg font-semibold">
                <Filter size={20} className="mr-2" />
                Filtros
              </button>
            </div>
            {filters.map((filter) => (
              <div key={filter.name} className="mb-4">
                <button
                  className="flex items-center justify-between w-full text-left font-semibold"
                  onClick={() => toggleFilter(filter.name)}
                >
                  {filter.name}
                  {expandedFilters.includes(filter.name) ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
                {expandedFilters.includes(filter.name) && (
                  <div className="mt-2 space-y-2">
                    {filter.options.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={
                            selectedFilters[filter.name]?.includes(option) ||
                            false
                          }
                          onChange={() =>
                            toggleFilterOption(filter.name, option)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full md:w-3/4">
            <div
              className={`grid ${
                isGridView
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-1"
              } gap-6`}
            >
              {articulos.map((element) => {
                return (
                  <div key={element.id} className="group relative">
                    <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={element.imagen}
                        alt={element.name}
                        className="w-full h-44 object-center object-cover group-hover:opacity-75"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="text-white text-center">
                          <p className="font-semibold mb-2">
                            Tallas disponibles:
                          </p>
                          <div className="flex space-x-2">
                            {element.colores.map((color) => {
                              color.tallas.map((items) => {
                                return (
                                  <span
                                    key={items?.talla?.id}
                                    className="border border-white px-2 py-1 rounded"
                                  >
                                    {items?.talla?.nombre}
                                  </span>
                                );
                              });
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          {element.nombre}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {element.colores.length} colores
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        ${element.precio.toLocaleString("es-CO")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
