import React from 'react';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        {user && (
          <p className="text-gray-600">
            Bienvenido, {user.firstName || user.emailAddresses[0]?.emailAddress}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Resumen</h3>
          <p className="text-gray-600">Información general de tu tienda</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Ventas</h3>
          <p className="text-gray-600">Estadísticas de ventas recientes</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Productos</h3>
          <p className="text-gray-600">Gestión de productos</p>
        </div>
      </div>
    </div>
  );
};


