import { CustomerLayout } from '../components/CustomerLayout';

import { ArrowRight, Smartphone, Laptop, ShoppingBag } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
import { getProducts } from "../services/productApi";
export function Home() {
const navigate = useNavigate();

const [products, setProducts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);



  const categories = [
    { name: 'Mobile', icon: Smartphone, color: 'bg-blue-500' },
    { name: 'Laptop', icon: Laptop, color: 'bg-purple-500' },
    { name: 'Clothes', icon: ShoppingBag, color: 'bg-pink-500' },
  ];

  const featuredProducts = products.slice(0, 4);

  return (
    <CustomerLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Shop the latest in mobile, laptops, and fashion. Great deals, fast shipping, and quality guaranteed.
            </p>
            <Button
              size="lg"
              className="bg-gray text-blue-600 hover:bg-gray-100"
              onClick={() => navigate('products')}
            >
              Shop Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => navigate('products')}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 hover:shadow-xl transition-shadow"
            >
              <div className={`${category.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-4">Explore our collection</p>
              <span className="inline-flex items-center text-blue-600 font-medium">
                Browse <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <Button variant="outline" onClick={() => navigate('products')}>
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate('product-detail', product)}
                className="group cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </p>
                    <span className="text-sm text-gray-500">
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
            <p className="text-gray-600">All products come with warranty and quality assurance</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Shipping</h3>
            <p className="text-gray-600">Free shipping on orders over $100</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600">Your payment information is safe with us</p>
          </div>
        </div>
      </section>
    </CustomerLayout>
  );
}
