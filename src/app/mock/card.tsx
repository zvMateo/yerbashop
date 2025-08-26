// ✅ COMPONENTE STATCARD OPTIMIZADO
  const StatCard = memo(({ title, value, icon, change, color = "blue", isCurrency = false, urgent = false }) => {
    const Icon = icon;
    
    const colorClasses = useMemo(() => ({
      green: { 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-200', 
        icon: 'text-emerald-600', 
        iconBg: 'bg-emerald-100',
        text: 'text-emerald-800'
      },
      blue: { 
        bg: 'bg-blue-50', 
        border: 'border-blue-200', 
        icon: 'text-blue-600', 
        iconBg: 'bg-blue-100',
        text: 'text-blue-800'
      },
      red: { 
        bg: urgent ? 'bg-red-100' : 'bg-red-50', 
        border: urgent ? 'border-red-300' : 'border-red-200', 
        icon: 'text-red-600', 
        iconBg: 'bg-red-100',
        text: 'text-red-800'
      },
      purple: { 
        bg: 'bg-purple-50', 
        border: 'border-purple-200', 
        icon: 'text-purple-600', 
        iconBg: 'bg-purple-100',
        text: 'text-purple-800'
      },
      yellow: { 
        bg: 'bg-yellow-50', 
        border: 'border-yellow-200', 
        icon: 'text-yellow-600', 
        iconBg: 'bg-yellow-100',
        text: 'text-yellow-800'
      },
      indigo: { 
        bg: 'bg-indigo-50', 
        border: 'border-indigo-200', 
        icon: 'text-indigo-600', 
        iconBg: 'bg-indigo-100',
        text: 'text-indigo-800'
      }
    }), [urgent]);

    const classes = colorClasses[color] || colorClasses.blue;
    
    const formatValue = useCallback((val) => {
      if (isCurrency) {
        return new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS',
          maximumFractionDigits: 0
        }).format(val);
      }
      return val.toLocaleString('es-AR');
    }, [isCurrency]);

    return (
      <div className={`${classes.bg} border-2 ${classes.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 ${urgent ? 'animate-pulse' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${urgent ? 'text-red-700' : classes.text}`}>
              {formatValue(value)}
            </p>
            
            {change !== undefined && (
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-4 w-4 mr-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'} ${change >= 0 ? '' : 'rotate-180'}`} />
                <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? '+' : ''}{change}% vs período anterior
                </span>
              </div>
            )}
          </div>
          
          <div className={`${classes.iconBg} rounded-full p-3 ${urgent ? 'animate-bounce' : ''}`}>
            <Icon className={`h-6 w-6 ${classes.icon}`} />
          </div>
        </div>
        
        {urgent && (
          <div className="mt-3 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
            ⚠️ Requiere atención inmediata
          </div>
        )}
      </div>
    );
  });


    {/* ✅ GRID DE KPIs CON TENDENCIAS REALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-8 gap-4 lg:gap-6">
        <div className="sm:col-span-1 lg:col-span-1 xl:col-span-2 2xl:col-span-2">
          <StatCard
            title="Ventas Totales"
            value={dashboardData.totalSales}
            icon={DollarSign}
            change={calculatedData.salesGrowth}
            color="green"
            isCurrency
          />
        </div>
        <StatCard
          title="Pedidos"
          value={dashboardData.totalOrders}
          icon={ShoppingBag}
          change={calculatedData.ordersGrowth}
          color="blue"
        />
        <StatCard
          title="Ticket Promedio"
          value={dashboardData.averageOrderValue}
          icon={TrendingUp}
          change={-2.1}
          color="purple"
          isCurrency
        />
        <StatCard
          title="Productos"
          value={dashboardData.productsCount}
          icon={Package}
          change={5.4}
          color="indigo"
        />
        <StatCard
          title="Stock Bajo"
          value={dashboardData.lowStockAlerts}
          icon={AlertTriangle}
          color="red"
          urgent={dashboardData.lowStockAlerts > 3}
        />
        <StatCard
          title="Nuevos Clientes"
          value={dashboardData.newCustomers}
          icon={Users}
          change={15.3}
          color="yellow"
        />
      </div>