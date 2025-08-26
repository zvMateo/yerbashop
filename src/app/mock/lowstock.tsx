// ✅ COMPONENTES AUXILIARES MEMOIZADOS
  const LowStockAlert = memo(({ product }) => (
    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150">
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-red-900">{product.name}</p>
          <p className="text-xs text-red-600">
            Stock actual: {product.stock} {product.unit}
          </p>
        </div>
      </div>
      <Link
        to={`/admin/products/${product.id}`}
        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-200 transition-colors duration-150"
      >
        <Edit className="h-4 w-4" />
      </Link>
    </div>
  ));

  const ProductRow = memo(({ product, index }) => (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">{product.category}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <Package className="h-4 w-4 text-gray-400 mr-2" />
          <span>{product.sold} unidades</span>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            product.trend.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.trend}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
        ${product.revenue.toLocaleString('es-AR')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.stock <= 5 ? 'bg-red-100 text-red-800' : 
          product.stock <= 10 ? 'bg-yellow-100 text-yellow-800' : 
          'bg-green-100 text-green-800'
        }`}>
          Stock: {product.stock}
          {product.stock <= 5 && <AlertTriangle className="h-3 w-3 ml-1" />}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/products/${product.id}`}
            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors duration-150"
            title="Ver producto"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/admin/products/${product.id}/edit`}
            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-100 transition-colors duration-150"
            title="Editar producto"
          >
            <Edit className="h-4 w-4" />
          </Link>
        </div>
      </td>
    </tr>
  ));