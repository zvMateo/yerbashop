  // ✅ COMPONENTE DE ALERTAS OPTIMIZADO - SIN USEMEMO
  const QuickAlerts = memo(() => {
    const alerts = [
      { 
        id: 'stock-mate-acero',
        type: 'stock', 
        message: 'Mate Acero tiene stock bajo (3 unidades)', 
        urgent: true,
        action: () => console.log('Navigate to product')
      },
      { 
        id: 'pending-orders',
        type: 'order', 
        message: '2 pedidos pendientes de más de 24h', 
        urgent: true,
        action: () => console.log('Navigate to orders')
      },
      { 
        id: 'promo-expiring',
        type: 'promo', 
        message: 'Promoción "VERANO2024" expira en 3 días', 
        urgent: false,
        action: () => console.log('Navigate to promotions')
      }
    ].filter(alert => !dismissedAlerts.has(alert.id)); // Sin useMemo

    const dismissAlert = useCallback((alertId) => {
      setDismissedAlerts(prev => new Set([...prev, alertId]));
    }, []);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Alertas Rápidas</h3>
          <div className="flex items-center space-x-1">
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500">{alerts.length} pendientes</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-500">No hay alertas pendientes</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.urgent 
                    ? 'bg-red-50 border-red-400 text-red-800' 
                    : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={alert.action}
                        className="text-xs px-2 py-1 bg-white rounded border hover:bg-gray-50 transition-colors"
                      >
                        Ver detalles
                      </button>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-xs px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 ml-2 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Link 
          to="/admin/alerts" 
          className="block text-center text-sm text-blue-600 hover:text-blue-800 mt-4 font-medium transition-colors"
        >
          Ver todas las alertas →
        </Link>
      </div>
    );
  });