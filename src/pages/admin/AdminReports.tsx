import { DollarSign, TrendingUp, PackageSearch, Activity, FileText } from "lucide-react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { useEffect, useState, useMemo } from "react";
import { getProducts, getOrders } from "@/lib/api";
import type { Product } from "@/data/products";

const AdminReports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts().catch(err => {
        console.error('Failed to fetch products for reports:', err);
        return [];
      }), 
      getOrders().catch(err => {
        console.error('Failed to fetch orders for reports:', err);
        return [];
      })
    ])
      .then(([productsData, ordersData]) => {
        const pData = Array.isArray(productsData) ? productsData : (productsData && Array.isArray(productsData.products) ? productsData.products : []);
        const oData = Array.isArray(ordersData) ? ordersData : (ordersData && Array.isArray(ordersData.orders) ? ordersData.orders : []);
        setProducts(pData);
        setOrders(oData);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    totalProductsSold,
    topSellingProducts,
    orderStatusCounts
  } = useMemo(() => {
    let rev = 0;
    let productsSold = 0;
    const statusCounts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    const productSalesMap = new Map<string, { count: number; revenue: number }>();

    orders.forEach(order => {
      rev += (Number(order.subtotal) || 0) + (Number(order.packingCharge) || 0);
      const status = (order.status || 'pending').toLowerCase();
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      order.items?.forEach((item: any) => {
        const id = typeof item.product === 'object' ? (item.product?._id || item.product?.id) : item.product;
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        productsSold += qty;
        
        if (id) {
          const current = productSalesMap.get(id) || { count: 0, revenue: 0 };
          productSalesMap.set(id, {
            count: current.count + qty,
            revenue: current.revenue + (qty * price)
          });
        }
      });
    });

    const topSelling = [...products]
      .map(p => ({
        ...p,
        soldCount: productSalesMap.get(p._id || p.id || "")?.count || 0,
        revenue: productSalesMap.get(p._id || p.id || "")?.revenue || 0
      }))
      .filter(p => p.soldCount > 0)
      .sort((a, b) => b.revenue - a.revenue); // Sort by revenue by default for reports

    return {
      totalRevenue: rev,
      totalOrders: orders.length,
      averageOrderValue: orders.length > 0 ? rev / orders.length : 0,
      totalProductsSold: productsSold,
      topSellingProducts: topSelling,
      orderStatusCounts: statusCounts
    };
  }, [products, orders]);

  const fmt = (v: number) => new Intl.NumberFormat('en-IN').format(v || 0);
  const fmtCurrency = (v: number) => `₹${new Intl.NumberFormat('en-IN').format(Math.round(v || 0))}`;

  return (
    <>
      <AdminNavbar />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Reports &amp; Analytics
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Comprehensive overview of sales and product performance</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-5 glow-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-muted-foreground">Total Revenue</span>
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                      <DollarSign className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{fmtCurrency(totalRevenue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across {fmt(totalOrders)} orders</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 glow-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-muted-foreground">Total Orders</span>
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500">
                      <Activity className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{fmt(totalOrders)}</p>
                  <div className="flex gap-2 mt-1 text-xs">
                    <span className="text-green-500">{orderStatusCounts.delivered || 0} delivered</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-amber-500">{orderStatusCounts.pending || 0} pending</span>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 glow-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-muted-foreground">Avg Order Value</span>
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-500">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{fmtCurrency(averageOrderValue)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Revenue per order</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 glow-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-muted-foreground">Products Sold</span>
                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                      <PackageSearch className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{fmt(totalProductsSold)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total items purchased</p>
                </div>
              </div>

              {/* Product Sales Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h2 className="font-display font-bold text-lg">Product Sales Performance</h2>
                  <p className="text-sm text-muted-foreground">Breakdown of all products sold, sorted by revenue generated.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-6 py-4 font-semibold text-sm text-muted-foreground border-b border-border">Product Name</th>
                        <th className="px-6 py-4 font-semibold text-sm text-muted-foreground border-b border-border">Category</th>
                        <th className="px-6 py-4 font-semibold text-sm text-muted-foreground border-b border-border text-right">Units Sold</th>
                        <th className="px-6 py-4 font-semibold text-sm text-muted-foreground border-b border-border text-right">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {topSellingProducts.map((product) => (
                        <tr key={product._id || product.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover border border-border" />
                              <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">₹{product.price}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground capitalize">
                            {(typeof product.category === 'object' ? product.category?.name : product.category) || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right">
                            {fmt(product.soldCount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-primary font-bold text-right">
                            {fmtCurrency(product.revenue)}
                          </td>
                        </tr>
                      ))}
                      {topSellingProducts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                            No sales data available yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminReports;
