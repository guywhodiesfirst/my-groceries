import { useEffect, useState } from 'react';
import { ProductsApi } from '../../api/ProductsApi.js';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await ProductsApi.getStats();
      setStats(data);
    };
    fetchStats().then();
  }, []);

  return (
    <div className="analytics-content">
      {stats ? (
        <>
          <h3>Monthly Orders: {stats.monthly_orders}</h3>
          <h3>Monthly Sales: ${stats.monthly_sales.toFixed(2)}</h3>
          <h3>Total Orders: {stats.total_orders}</h3>
          <h3>Total Sales: ${stats.total_sales.toFixed(2)}</h3>
        </>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );
}
