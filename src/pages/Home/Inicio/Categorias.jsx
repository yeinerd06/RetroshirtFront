import React from 'react'
import { ArrowRight, ShoppingBag } from 'lucide-react'

export default function CategoriasInicio() {
  return (
    <div className="bg-white">
 

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Categorías Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Camisetas', 'Jeans', 'Chaquetas'].map((category) => (
            <div key={category} className="relative overflow-hidden rounded-lg group">
              <img src={`/placeholder.svg?height=400&width=600&text=${category}`} alt={category} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{category}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Productos Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((product) => (
              <div key={product} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <img src={`/placeholder.svg?height=300&width=300&text=Producto ${product}`} alt={`Producto ${product}`} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">Producto Retro {product}</h3>
                  <p className="text-gray-600 mb-4">Descripción breve del producto...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">$99.99</span>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-4">Únete a Nuestra Newsletter</h2>
          <p className="mb-8">Recibe las últimas noticias y ofertas exclusivas directamente en tu bandeja de entrada.</p>
          <form className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Tu dirección de email"
              className="flex-grow px-4 py-2 rounded-md text-gray-900"
              required
            />
            <button type="submit" className="px-6 py-2 bg-white text-gray-900 rounded-md font-semibold hover:bg-gray-100">
              Suscribirse
            </button>
          </form>
        </div>
      </div>

    
    </div>
  )
}