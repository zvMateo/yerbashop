{/* ✅ ALERTAS DE STOCK BAJO */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Alertas de Stock Bajo</h3>
            <Link 
              to="/admin/inventory"
              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
            >
              Ver inventario completo →
            </Link>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 1, name: 'Yerba Mate Premium 1kg', stock: 3, unit: 'kg' },
            { id: 2, name: 'Mate Acero Inoxidable', stock: 2, unit: 'unidades' },
            { id: 3, name: 'Yuyo Digestivo', stock: 1, unit: 'kg' },
            { id: 4, name: 'Mate Calabaza Chico', stock: 4, unit: 'unidades' },
          ].map((product) => (
            <LowStockAlert key={product.id} product={product} />
          ))}
        </div>
      </div>