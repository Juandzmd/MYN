# Progreso: Product Integration

## ✅  Completado:

1. **DashboardCharts con filtrado por tab**:
   - Tab "Dashboard": Muestra TODOS los gráficos
   - Tab "Ventas": Muestra SOLO gráficos de ventas (Pie Chart + Tendencia de Ingresos)
   - Tab "Visitas": Muestra SOLO gráfico de visitas
   
2. **Productos SQL actualizados**:
   - Kenya Nyeri Signature ($13,500 - 250g)
   - Perú Valle Chanchamayo ($12,000 - 250g)
   - Drip Coffee Individual ($1,500 - 15g)

3. **AdminView actualizado**:
   - Pasa `activeTab` a DashboardCharts correctamente

## ⏳ Pendiente (Requiere actualización manual de código):

Las siguientes vistas tienen productos hardcodeados y deben conectarse a Supabase:

### 1. HomeView.tsx - Featured Products
Reemplazar productos estáticos con:
```tsx
const [products, setProducts] = useState([]);

useEffect(() => {
  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .limit(3);
    setProducts(data || []);
  };
  fetchProducts();
}, []);
```

### 2. ShopView.tsx - Product Grid
Igual que HomeView, fetch todos los productos.

### 3. CoffeeQuiz.tsx - Recommendations
Actualizar recomendaciones para usar productos reales de la DB.

### 4. UserDashboardView.tsx
Línea 89 tiene "Etiopía Yirgacheffe" hardcoded - debe ser dinámico.

## Archivos a ejecutar en Supabase:
1. `update_products.sql` - Para actualizar productos existentes

## Estado: 70% Completo
- ✅ Dashboard charts separados por tab
- ✅ Productos SQL correctos
- ⏳ Vistas pendientes de conectar
