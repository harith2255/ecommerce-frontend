import { AdminLayout } from '../../components/AdminLayout';
import { Package, Users, ShoppingBag, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import { useState,useEffect} from 'react';
import { fetchAdminDashboard } from '../../services/AdminServices';


interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  items:any[];
  createdAt: string;
}
interface Product {
  id: string;
  status:'active' | 'inactive';
}

interface User {
  id: string;
  role: 'admin' | 'customer';
  name: string;
}

export function AdminDashboard() {

  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [order,setOrders] = useState<Order[]>([]);
  const [products,setProducts] = useState<Product[]>([]);
  const [users,setUsers] = useState<User[]>([]);
 const [loading,setLoading]=useState(true);
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await fetchAdminDashboard(token);
        setOrders(data.orders);
        setProducts(data.products);
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [token]);

  const totalRevenue = order.reduce((sum, order) => sum + order.total, 0);
  const activeProducts = products.filter(product => product.status === 'active').length;
  const pendingOrders = order.filter(order => order.status === 'pending').length;

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
      change: `${activeProducts} active`
    },
    {
      label: 'Total Orders',
      value: order.length,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      change: `${pendingOrders} pending`
    },
    {
      label: 'Total Users',
      value: users.length,
      icon: Users,
      color: 'bg-orange-500',
      change: `${users.filter(u => u.role === 'customer').length} customers`
    },
  ];

  const recentOrders = order.slice(0, 5);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'neutral';
    }
  };

  // loading
  if (loading){
    return (
      <AdminLayout title="Dashboard Overview">
        <p className='text-gray-600'>Loading data...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard Overview">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => {
                const user = users.find(u => u.id === order.userId);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user?.name || 'Guest'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{order.items.length} items</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {recentOrders.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
