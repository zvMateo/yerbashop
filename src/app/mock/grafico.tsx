// ✅ COMPONENTE DE GRÁFICO OPTIMIZADO
  const SalesChart = memo(({ data, filter }) => (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => format(new Date(value), filter === '1d' ? 'HH:mm' : 'dd/MM')}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          formatter={(value, name) => [
            name === 'ventas' ? `$${value.toLocaleString('es-AR')}` : value,
            name === 'ventas' ? 'Ventas' : 'Pedidos'
          ]}
          labelFormatter={(value) => format(new Date(value), 'dd MMMM yyyy', { locale: es })}
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />  
        <Area 
          type="monotone" 
          dataKey="ventas" 
          stroke="#3B82F6" 
          fill="url(#colorVentas)"
          strokeWidth={2}
        />
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
      </AreaChart>
    </ResponsiveContainer>
  ));


   {/* ✅ GRÁFICO CON DATOS FILTRADOS */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{calculatedData.periodLabel}</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Ventas</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Pedidos</span>
                </div>
              </div>
            </div>
          </div>
          <SalesChart data={filteredSalesData} filter={timeFilter} />
        </div>

        <div className="xl:col-span-1">
          <QuickAlerts />
        </div>
      </div>