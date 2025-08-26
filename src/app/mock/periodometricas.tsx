 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas del Período</h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.newCustomers}</p>
                <p className="text-xs text-gray-600">Nuevos Clientes</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{dashboardData.conversionRate}%</p>
                <p className="text-xs text-gray-600">Conversión</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">
                  {filteredSalesData.length}
                </p>
                <p className="text-xs text-gray-600">Días con Datos</p>
              </div>
            </div>
          </div>
        </div>
      </div>