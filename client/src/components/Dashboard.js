// components/Dashboard.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseURL } from '../common/SummaryApi';
import SummaryApi from '../common/SummaryApi';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '../components/ui/card';
import {
  ArrowUpRight, ArrowDownRight, Users, Package, DollarSign,
  ShoppingCart, ChevronUp, ChevronDown, BarChart3
} from 'lucide-react';
import { format as formatDate, startOfDay, startOfWeek, startOfMonth, subDays, subWeeks, subMonths } from 'date-fns';

const currency = 'XAF';
const api = axios.create({ baseURL, withCredentials: true });

function sum(arr, sel = (x) => x) { return arr.reduce((a, x) => a + sel(x), 0); }
function safeNumber(n) { const v = Number(n); return Number.isFinite(v) ? v : 0; }
function formatCurrency(n) {
  try {
    return n.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 0 });
  } catch { return `${n} ${currency}`; }
}
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item);
    acc[k] ||= [];
    acc[k].push(item);
    return acc;
  }, {});
}
function ordersToRevenuePoints(orders) {
  return orders.map((o) => ({
    createdAt: new Date(o.createdAt),
    totalAmt: safeNumber(o.totalAmt || o.subTotalAmt || 0),
    profit: Math.round(safeNumber(o.totalAmt || 0) * 0.35),
  }));
}
function bucketizeByRange(data, range) {
  let periods = 12;
  let labelFormat = 'MMM';
  let getBucketStart;
  if (range === 'daily') {
    periods = 7; labelFormat = 'EEE'; getBucketStart = (d) => startOfDay(d);
  } else if (range === 'weekly') {
    periods = 12; labelFormat = 'MMM dd'; getBucketStart = (d) => startOfWeek(d, { weekStartsOn: 1 });
  } else {
    periods = 12; labelFormat = 'MMM'; getBucketStart = (d) => startOfMonth(d);
  }
  const buckets = [];
  const now = new Date();
  for (let i = periods - 1; i >= 0; i--) {
    if (range === 'daily') buckets.push(startOfDay(subDays(now, i)));
    else if (range === 'weekly') buckets.push(startOfWeek(subWeeks(now, i), { weekStartsOn: 1 }));
    else buckets.push(startOfMonth(subMonths(now, i)));
  }
  const grouped = groupBy(data, (pt) => getBucketStart(pt.createdAt).toISOString());
  return buckets.map((start) => {
    const key = start.toISOString();
    const points = grouped[key] || [];
    const revenue = sum(points, (p) => safeNumber(p.totalAmt));
    const profit = sum(points, (p) => safeNumber(p.profit));
    const expenses = Math.max(0, revenue - profit);
    return {
      name: formatDate(start, labelFormat),
      revenue,
      profit,
      expenses,
    };
  });
}
function salesSeriesFromOrders(orders, range) {
  const salesPoints = orders.map((o) => ({
    createdAt: new Date(o.createdAt),
    online: o.payment_status && o.payment_status !== 'CASH ON DELIVERY' ? safeNumber(o.totalAmt || 0) : 0,
    inStore: o.payment_status === 'CASH ON DELIVERY' ? safeNumber(o.totalAmt || 0) : 0,
  }));
  const buckets = bucketizeByRange(
    salesPoints.map((p) => ({ createdAt: p.createdAt, totalAmt: p.online + p.inStore, profit: 0 })),
    range
  );
  let periods = range === 'daily' ? 7 : 12;
  const now = new Date();
  const getStart =
    range === 'daily' ? (d) => startOfDay(d) :
    range === 'weekly' ? (d) => startOfWeek(d, { weekStartsOn: 1 }) :
    (d) => startOfMonth(d);
  const bucketStarts = [];
  for (let i = periods - 1; i >= 0; i--) {
    if (range === 'daily') bucketStarts.push(startOfDay(subDays(now, i)));
    else if (range === 'weekly') bucketStarts.push(startOfWeek(subWeeks(now, i), { weekStartsOn: 1 }));
    else bucketStarts.push(startOfMonth(subMonths(now, i)));
  }
  const grouped = groupBy(salesPoints, (p) => getStart(p.createdAt).toISOString());
  return bucketStarts.map((start, idx) => {
    const key = start.toISOString();
    const items = grouped[key] || [];
    return {
      name: buckets[idx]?.name || formatDate(start, range === 'daily' ? 'EEE' : range === 'weekly' ? 'MMM dd' : 'MMM'),
      online: sum(items, (x) => x.online),
      inStore: sum(items, (x) => x.inStore),
    };
  });
}
function categoryDistributionFromProducts(products) {
  const grouped = groupBy(products, (p) => {
    const c = p.category;
    if (Array.isArray(c) && c.length > 0) return c[0]?.name || 'Other';
    if (typeof c === 'object' && c?.name) return c.name;
    return 'Other';
  });
  const entries = Object.entries(grouped).map(([name, arr]) => ({ name, value: arr.length }));
  entries.sort((a, b) => b.value - a.value);
  return entries.slice(0, 5);
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalSales: 0,
    totalProfit: 0,
    revenueGrowth: 0,
    salesGrowth: 0,
    profitGrowth: 0,
    userGrowth: 0,
    productGrowth: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [timeRange, setTimeRange] = useState('weekly');

  const fetchAdminDashboard = async () => {
    const { data } = await api.get('/api/admin/dashboard');
    return data?.data;
  };
  const fetchProducts = async () => {
    const { data } = await api({
      url: SummaryApi.getProduct.url,
      method: SummaryApi.getProduct.method,
      data: { page: 1, limit: 500 },
    });
    return data?.data || [];
  };
  const fetchOrders = async () => {
    const { data } = await api({
      url: SummaryApi.getOrderItems.url,
      method: SummaryApi.getOrderItems.method,
    });
    return data?.data || [];
  };

  const generateUserActivity = () => {
    const periods = 24;
    return Array.from({ length: periods }).map((_, i) => ({
      name: `${i}:00`,
      active: Math.floor(Math.random() * 100) + 20,
    }));
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        let adminData = null;
        try {
          adminData = await fetchAdminDashboard();
        } catch {
          adminData = null;
        }

        const [products, orders] = await Promise.all([
          fetchProducts(),
          fetchOrders(),
        ]);

        if (!mounted) return;

        setCategoryDistribution(categoryDistributionFromProducts(products));

        const recent = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((o) => ({
            id: o.orderId || o._id,
            customer: o.contact_info?.name || 'Customer',
            amount: safeNumber(o.totalAmt || o.subTotalAmt || 0),
            status: o.payment_status || 'Processing',
            date: formatDate(new Date(o.createdAt), 'MMM dd, yyyy HH:mm'),
          }));
        setRecentOrders(recent);

        const map = new Map();
        for (const o of orders) {
          const items = Array.isArray(o.products) ? o.products : [];
          for (const it of items) {
            const key = String(it.productId || it.product_details?.name || Math.random());
            const prev = map.get(key) || { name: it.product_details?.name || 'Product', sales: 0, revenue: 0 };
            prev.sales += safeNumber(it.quantity || 1);
            prev.revenue += safeNumber(it.price || it.product_details?.price || 0) * safeNumber(it.quantity || 1);
            map.set(key, prev);
          }
        }
        const tops = Array.from(map.values()).sort((a, b) => b.sales - a.sales).slice(0, 5).map((p) => ({
          ...p,
          growth: Math.round((Math.random() * 20 - 5) * 10) / 10,
        }));
        setTopProducts(tops);

        setUserActivity(generateUserActivity());

        if (adminData) {
          const { totals, growth, series } = adminData;
          setStats({
            totalProducts: safeNumber(totals.totalProducts),
            totalUsers: safeNumber(totals.totalUsers),
            totalRevenue: safeNumber(totals.totalRevenue),
            totalSales: safeNumber(totals.totalSalesUnits),
            totalProfit: safeNumber(totals.totalProfit),
            revenueGrowth: Math.round(safeNumber(growth.revenueGrowth) * 10) / 10,
            salesGrowth: Math.round(safeNumber(growth.salesGrowth) * 10) / 10,
            profitGrowth: Math.round(safeNumber(growth.profitGrowth) * 10) / 10,
            userGrowth: Math.round(safeNumber(growth.userGrowth) * 10) / 10,
            productGrowth: Math.round(safeNumber(growth.productGrowth) * 10) / 10,
          });

          const monthlyRevenue = series.revenueByMonth.map((m) => ({
            name: m.label.split(' ')[0],
            revenue: m.value,
            profit: Math.round(m.value * 0.35),
            expenses: Math.max(0, m.value - Math.round(m.value * 0.35)),
          }));

          const orderPoints = ordersToRevenuePoints(orders);
          const revenueSeries = timeRange === 'monthly'
            ? monthlyRevenue
            : bucketizeByRange(orderPoints, timeRange);

          const salesSeries = salesSeriesFromOrders(orders, timeRange);

          setRevenueData(revenueSeries);
          setSalesData(salesSeries);
        } else {
          const orderPoints = ordersToRevenuePoints(orders);
          const revenueSeries = bucketizeByRange(orderPoints, timeRange);
          const salesSeries = salesSeriesFromOrders(orders, timeRange);

          const totalRevenue = sum(orderPoints, (p) => p.totalAmt);
          const totalProfit = sum(orderPoints, (p) => p.profit);
          const totalSales = sum(orders, (o) => {
            const items = Array.isArray(o.products) ? o.products : [];
            return sum(items, (it) => safeNumber(it.quantity || 1));
          });

          const last = revenueSeries[revenueSeries.length - 1] || { revenue: 0, profit: 0 };
          const prev = revenueSeries[revenueSeries.length - 2] || { revenue: 0, profit: 0 };
          const revenueGrowth = prev.revenue ? ((last.revenue - prev.revenue) / prev.revenue) * 100 : (last.revenue > 0 ? 100 : 0);
          const profitGrowth = prev.profit ? ((last.profit - prev.profit) / prev.profit) * 100 : (last.profit > 0 ? 100 : 0);

          const lastSales = salesSeries[salesSeries.length - 1] || { online: 0, inStore: 0 };
          const prevSales = salesSeries[salesSeries.length - 2] || { online: 0, inStore: 0 };
          const lastSalesTotal = safeNumber(lastSales.online + lastSales.inStore);
          const prevSalesTotal = safeNumber(prevSales.online + prevSales.inStore);
          const salesGrowth = prevSalesTotal ? ((lastSalesTotal - prevSalesTotal) / prevSalesTotal) * 100 : (lastSalesTotal > 0 ? 100 : 0);

          setStats({
            totalProducts: products.length,
            totalUsers: 0,
            totalRevenue,
            totalSales,
            totalProfit,
            revenueGrowth: Math.round(revenueGrowth * 10) / 10,
            salesGrowth: Math.round(salesGrowth * 10) / 10,
            profitGrowth: Math.round(profitGrowth * 10) / 10,
            userGrowth: 0,
            productGrowth: 0,
          });

          setRevenueData(revenueSeries);
          setSalesData(salesSeries);
        }
      } catch (err) {
        console.error('Error loading dashboard', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[75vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Admin'}!</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <select
            className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center" onClick={() => window.print()}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{stats.totalProducts.toLocaleString()}</div>
                <div className={`flex items-center text-sm ${stats.productGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.productGrowth >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {Math.abs(stats.productGrowth)}% from last month
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <div className={`flex items-center text-sm ${stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.userGrowth >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {Math.abs(stats.userGrowth)}% from last month
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                <div className={`flex items-center text-sm ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.revenueGrowth >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {Math.abs(stats.revenueGrowth)}% from last period
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-2xl font-bold">{stats.totalSales.toLocaleString()}</div>
                <div className={`flex items-center text-sm ${stats.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.salesGrowth >= 0 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {Math.abs(stats.salesGrowth)}% from last period
                </div>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue, profit, and expenses breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" />
                  <Area type="monotone" dataKey="expenses" stroke="#f59e0b" fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Sales Distribution</CardTitle>
            <CardDescription>Online vs In-store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="online" name="Online" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="inStore" name="In-Store" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-64 w-full max-w-md">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Hourly active users (sample)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userActivity} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="active" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 text-blue-600 font-medium">{order.id}</td>
                      <td className="py-3 px-2">{order.customer}</td>
                      <td className="py-3 px-2">{formatCurrency(order.amount)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'CASH ON DELIVERY' ? 'bg-amber-100 text-amber-800' :
                            'bg-gray-100 text-gray-800'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-500 text-sm">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View all orders →</button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>By sales volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-md h-10 w-10 flex items-center justify-center mr-3">
                      <Package className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                    <p className={`text-sm flex items-center justify-end ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.growth >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                      {Math.abs(product.growth)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Profit Analysis & Forecast</CardTitle>
          <CardDescription>Historical profit with short-term forecast</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  ...revenueData.map((item) => ({ ...item, type: 'Historical' })),
                  ...[1, 2, 3].map((period, i) => {
                    const lastDataPoint = revenueData[revenueData.length - 1] || { profit: 0 };
                    const growth = 1 + Math.random() * 0.08;
                    return {
                      name: `Forecast ${period}`,
                      profit: Math.round(lastDataPoint.profit * Math.pow(growth, i + 1)),
                      type: 'Forecast',
                    };
                  }),
                ]}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{ strokeWidth: 2 }} activeDot={{ r: 8 }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;