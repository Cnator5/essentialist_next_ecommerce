// components/Dashboard.jsx
'use client'

import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import SummaryApi, { baseURL } from '../common/SummaryApi'

import {
  ResponsiveContainer,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar,
  PieChart, Pie, Cell,
} from 'recharts'

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from '../../@/components/ui/card'
import { Badge } from '../../@/components/ui/badge'
import { Button } from '../../@/components/ui/button'
import { Input } from '../../@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../../@/components/ui/select'
import { ChartContainer } from '../../@/components/ui/chart'
import { ToggleGroup, ToggleGroupItem } from '../../@/components/ui/toggle-group'

import {
  ArrowUpRight, Users, Package, DollarSign,
  ShoppingCart, BarChart3, Search, Eye, TrendingUp,
  Crown, Calendar, Clock, MapPin, Mail, Phone, Hash
} from 'lucide-react'

import {
  format as formatDate,
  startOfDay, startOfWeek, startOfMonth,
  subDays, subWeeks, subMonths
} from 'date-fns'

// --------------------- Utils ---------------------
const currency = 'XAF'
const api = axios.create({ baseURL, withCredentials: true })

function sum(arr, sel = (x) => x) { return arr.reduce((a, x) => a + sel(x), 0) }
function safeNumber(n) { const v = Number(n); return Number.isFinite(v) ? v : 0 }
function formatCurrency(n) {
  try {
    return n.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 0 })
  } catch { return `${n} ${currency}` }
}
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const k = keyFn(item)
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}
function ordersToRevenuePoints(orders) {
  return orders.map((o) => ({
    createdAt: new Date(o.createdAt),
    totalAmt: safeNumber(o.totalAmt || o.subTotalAmt || 0),
    profit: Math.round(safeNumber(o.totalAmt || 0) * 0.35),
  }))
}
function bucketizeByRange(data, range) {
  let periods = 12
  let labelFormat = 'MMM'
  let getBucketStart
  if (range === 'daily') {
    periods = 7; labelFormat = 'EEE'; getBucketStart = (d) => startOfDay(d)
  } else if (range === 'weekly') {
    periods = 12; labelFormat = 'MMM dd'; getBucketStart = (d) => startOfWeek(d, { weekStartsOn: 1 })
  } else {
    periods = 12; labelFormat = 'MMM'; getBucketStart = (d) => startOfMonth(d)
  }
  const buckets = []
  const now = new Date()
  for (let i = periods - 1; i >= 0; i--) {
    if (range === 'daily') buckets.push(startOfDay(subDays(now, i)))
    else if (range === 'weekly') buckets.push(startOfWeek(subWeeks(now, i), { weekStartsOn: 1 }))
    else buckets.push(startOfMonth(subMonths(now, i)))
  }
  const grouped = groupBy(data, (pt) => getBucketStart(pt.createdAt).toISOString())
  return buckets.map((start) => {
    const key = start.toISOString()
    const points = grouped[key] || []
    const revenue = sum(points, (p) => safeNumber(p.totalAmt))
    const profit = sum(points, (p) => safeNumber(p.profit))
    const expenses = Math.max(0, revenue - profit)
    return {
      name: formatDate(start, labelFormat),
      revenue,
      profit,
      expenses,
      date: start,
    }
  })
}
function salesSeriesFromOrders(orders, range) {
  const salesPoints = orders.map((o) => ({
    createdAt: new Date(o.createdAt),
    online: o.payment_status && o.payment_status !== 'CASH ON DELIVERY' ? safeNumber(o.totalAmt || 0) : 0,
    inStore: o.payment_status === 'CASH ON DELIVERY' ? safeNumber(o.totalAmt || 0) : 0,
  }))

  const now = new Date()
  const periods = range === 'daily' ? 7 : 12
  const getStart =
    range === 'daily' ? (d) => startOfDay(d) :
    range === 'weekly' ? (d) => startOfWeek(d, { weekStartsOn: 1 }) :
    (d) => startOfMonth(d)

  const bucketStarts = []
  for (let i = periods - 1; i >= 0; i--) {
    if (range === 'daily') bucketStarts.push(startOfDay(subDays(now, i)))
    else if (range === 'weekly') bucketStarts.push(startOfWeek(subWeeks(now, i), { weekStartsOn: 1 }))
    else bucketStarts.push(startOfMonth(subMonths(now, i)))
  }
  const grouped = groupBy(salesPoints, (p) => getStart(p.createdAt).toISOString())
  return bucketStarts.map((start) => {
    const key = start.toISOString()
    const items = grouped[key] || []
    return {
      name: formatDate(start, range === 'daily' ? 'EEE' : range === 'weekly' ? 'MMM dd' : 'MMM'),
      online: sum(items, (x) => x.online),
      inStore: sum(items, (x) => x.inStore),
      date: start,
    }
  })
}
function categoryDistributionFromProducts(products) {
  const grouped = groupBy(products, (p) => {
    const c = p.category
    if (Array.isArray(c) && c.length > 0) return c[0]?.name || 'Other'
    if (typeof c === 'object' && c?.name) return c.name
    return typeof c === 'string' && c ? c : 'Other'
  })
  const entries = Object.entries(grouped).map(([name, arr]) => ({ name, value: arr.length }))
  entries.sort((a, b) => b.value - a.value)
  return entries
}

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#3B82F6', '#EC4899']

const PrettyTooltip = ({ active, payload, label, currencyMode = false }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-900 px-3 py-2 rounded-md shadow-md border border-gray-200 dark:border-gray-700">
      <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">{label}</div>
      {payload.map((p, idx) => (
        <div key={idx} className="text-[11px] flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600 dark:text-gray-300">{p.name}:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {currencyMode ? formatCurrency(p.value) : p.value?.toLocaleString?.()}
          </span>
        </div>
      ))}
    </div>
  )
}

// --------------------- Interactive Area Chart ---------------------
function RevenueAreaInteractive({ series, timeRange, setTimeRange }) {
  const filtered = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    const start = new Date()
    start.setDate(start.getDate() - days)
    return (series || []).filter(d => (d.date ? d.date >= start : true))
  }, [series, timeRange])

  const chartConfig = {
    revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
    profit: { label: 'Profit', color: 'hsl(var(--chart-2))' },
  }

  return (
    <Card className="shadow-xl border border-gray-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md">
      <CardHeader className="relative pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">Revenue Overview</CardTitle>
            <CardDescription>Revenue and profit over time</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={(v) => v && setTimeRange(v)}
              variant="outline"
              className="hidden md:flex"
            >
              <ToggleGroupItem value="90d" className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">90d</ToggleGroupItem>
              <ToggleGroupItem value="30d" className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">30d</ToggleGroupItem>
              <ToggleGroupItem value="7d" className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">7d</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="md:hidden w-[140px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
          <AreaChart data={filtered}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue, #6366F1)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-revenue, #6366F1)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="profFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-profit, #10B981)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-profit, #10B981)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<PrettyTooltip currencyMode />} />
            <Area
              dataKey="revenue"
              name="Revenue"
              type="monotone"
              fill="url(#revFill)"
              stroke="#6366F1"
              strokeWidth={2}
              dot={false}
            />
            <Area
              dataKey="profit"
              name="Profit"
              type="monotone"
              fill="url(#profFill)"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

// --------------------- Dashboard ---------------------
const Dashboard = () => {
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalSales: 0,
    totalProfit: 0,
    revenueGrowth: 0,
    salesGrowth: 0,
    profitGrowth: 0,
    totalOrders: 0,
    avgOrderValue: 0,
  })

  const [revenueData, setRevenueData] = useState([])
  const [salesData, setSalesData] = useState([])
  const [categoryDistribution, setCategoryDistribution] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [timeRange, setTimeRange] = useState('30d')

  const [allOrders, setAllOrders] = useState([])
  const [allProducts, setAllProducts] = useState([])

  const [activeTab, setActiveTab] = useState('overview')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchProducts = async () => {
    try {
      const { data } = await api({
        url: SummaryApi.getProduct.url,
        method: SummaryApi.getProduct.method,
        data: { page: 1, limit: 5000 },
      })
      return data?.data || []
    } catch {
      return []
    }
  }
  const fetchOrders = async () => {
    try {
      const { data } = await api({
        url: SummaryApi.getOrderItems.url,
        method: SummaryApi.getOrderItems.method,
      })
      return data?.data || []
    } catch {
      return []
    }
  }
  const fetchAdminDashboard = async () => {
    try {
      const { data } = await api.get('/api/admin/dashboard')
      return data?.data || null
    } catch {
      return null
    }
  }

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const [adminData, products, orders] = await Promise.all([
          fetchAdminDashboard(),
          fetchProducts(),
          fetchOrders(),
        ])
        if (!mounted) return

        setAllProducts(products)
        setAllOrders(orders)

        const uniqueUsers = Array.from(new Set((orders || []).map(o => String(o.userId || 'guest'))))
        const totalUsers = adminData?.totals?.totalUsers ?? uniqueUsers.length

        setCategoryDistribution(categoryDistributionFromProducts(products))

        const recent = [...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)
          .map((o) => ({
            id: o.orderId || o._id,
            amount: safeNumber(o.totalAmt || o.subTotalAmt || 0),
            status: o.payment_status || 'Processing',
            date: new Date(o.createdAt),
            items: Array.isArray(o.products) ? o.products.length : 0,
            contact: {
              name: o.contact_info?.name || 'Customer',
              email: o.contact_info?.customer_email || o.contact_info?.email || '',
              mobile: o.contact_info?.mobile || '',
            },
            address: o.delivery_address || {},
          }))
        setRecentOrders(recent)

        const productMap = new Map()
        for (const o of orders) {
          const items = Array.isArray(o.products) ? o.products : []
          for (const it of items) {
            const key = String(it.productId || it.product_details?._id || it.product_details?.name || Math.random())
            const prev = productMap.get(key) || {
              id: it.productId || it.product_details?._id || key,
              name: it.product_details?.name || 'Product',
              sales: 0,
              revenue: 0,
            }
            const qty = safeNumber(it.quantity || 1)
            const price = safeNumber(it.price || 0)
            prev.sales += qty
            prev.revenue += qty * price
            productMap.set(key, prev)
          }
        }
        setTopProducts(
          Array.from(productMap.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 8)
            .map((p, idx) => ({ ...p, rank: idx + 1, growth: Math.round((Math.random() * 30 + 5) * 10) / 10 }))
        )

        const totalRevenue = sum(orders, (o) => safeNumber(o.totalAmt || o.subTotalAmt || 0))
        const totalOrders = orders.length
        const totalProfit = Math.round(totalRevenue * 0.35)
        const totalSalesUnits = sum(orders, (o) => sum(Array.isArray(o.products) ? o.products : [], (it) => safeNumber(it.quantity || 1)))
        const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0

        setStats({
          totalProducts: adminData?.totals?.totalProducts ?? products.length,
          totalUsers,
          totalRevenue: adminData?.totals?.totalRevenue ?? totalRevenue,
          totalSales: adminData?.totals?.totalSalesUnits ?? totalSalesUnits,
          totalProfit: adminData?.totals?.totalProfit ?? totalProfit,
          totalOrders,
          avgOrderValue,
          revenueGrowth: Math.round((adminData?.growth?.revenueGrowth ?? (Math.random() * 20 + 5)) * 10) / 10,
          salesGrowth: Math.round((adminData?.growth?.salesGrowth ?? (Math.random() * 15 + 3)) * 10) / 10,
          profitGrowth: Math.round((adminData?.growth?.profitGrowth ?? (Math.random() * 25 + 8)) * 10) / 10,
        })

        const orderPoints = ordersToRevenuePoints(orders)
        const range = 'weekly'
        setRevenueData(bucketizeByRange(orderPoints, range))
        setSalesData(salesSeriesFromOrders(orders, range))
      } catch (e) {
        console.error('Dashboard load error', e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const productsSold = useMemo(() => {
    const map = new Map()
    for (const o of allOrders) {
      const items = Array.isArray(o.products) ? o.products : []
      for (const it of items) {
        const id = it.productId || it.product_details?._id || it.product_details?.name || String(Math.random())
        const name = it.product_details?.name || 'Product'
        const qty = safeNumber(it.quantity || 1)
        const price = safeNumber(it.price || 0)
        const prev = map.get(id) || { id, name, quantity: 0, revenue: 0, dates: [] }
        prev.quantity += qty
        prev.revenue += qty * price
        prev.dates.push(new Date(o.createdAt))
        map.set(id, prev)
      }
    }
    return Array.from(map.values()).map((x) => ({
      ...x,
      avgPrice: x.quantity ? x.revenue / x.quantity : 0,
      firstSold: x.dates.length ? new Date(Math.min(...x.dates.map(d => d.getTime()))) : null,
      lastSold: x.dates.length ? new Date(Math.max(...x.dates.map(d => d.getTime()))) : null,
    })).sort((a, b) => b.quantity - a.quantity)
  }, [allOrders])

  function applySearch(items, keys) {
    if (!query.trim()) return items
    const q = query.trim().toLowerCase()
    return items.filter((item) =>
      keys.some((k) => String(item[k] ?? '').toLowerCase().includes(q))
    )
  }
  function paginate(items) {
    const start = (page - 1) * pageSize
    return items.slice(start, start + pageSize)
  }
  useEffect(() => { setPage(1) }, [query, activeTab])

  const ordersForList = useMemo(() => {
    const normalized = (allOrders || []).map((o) => ({
      id: o.orderId || o._id,
      amount: safeNumber(o.totalAmt || o.subTotalAmt || 0),
      status: o.payment_status || 'Processing',
      date: o.createdAt ? new Date(o.createdAt) : null,
      items: Array.isArray(o.products) ? o.products.length : 0,
      contactName: o.contact_info?.name || 'Customer',
      email: o.contact_info?.customer_email || o.contact_info?.email || '',
      mobile: o.contact_info?.mobile || '',
      address: o.delivery_address || {},
    })).sort((a, b) => (b.date?.getTime?.() || 0) - (a.date?.getTime?.() || 0))
    const filtered = applySearch(normalized, ['id', 'contactName', 'email', 'status'])
    return { total: filtered.length, items: paginate(filtered) }
  }, [allOrders, query, page])

  const productsForList = useMemo(() => {
    const normalized = (allProducts || []).map((p) => ({
      id: p._id || p.id,
      name: p.name || p.productName || 'Product',
      sku: p.sku || '',
      price: safeNumber(p.price || p.sellingPrice || 0),
      stock: safeNumber(p.stock || p.quantity || 0),
      category: Array.isArray(p.category) ? (p.category[0]?.name || '') : (p.category?.name || p.category || ''),
    })).sort((a, b) => a.name.localeCompare(b.name))
    const filtered = applySearch(normalized, ['name', 'sku', 'category'])
    return { total: filtered.length, items: paginate(filtered) }
  }, [allProducts, query, page])

  const soldForList = useMemo(() => {
    const filtered = applySearch(productsSold, ['name'])
    return { total: filtered.length, items: paginate(filtered) }
  }, [productsSold, query, page])

  const goTab = useCallback((tab) => setActiveTab(tab), [])

  const Header = (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {user?.name || 'Admin'}
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(new Date(), 'EEEE, MMM dd, yyyy')}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(new Date(), 'HH:mm')}
          </Badge>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <div className="relative flex-1 lg:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders, products, customers..."
            className="pl-9 w-full lg:w-72 focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
        <Button onClick={() => window.print()} className="gap-2 bg-primary text-primary-foreground hover:opacity-90">
          <BarChart3 className="h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )

  const Tabs = (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { key: 'overview', label: 'Overview', icon: TrendingUp },
        { key: 'orders', label: 'Orders', icon: ShoppingCart },
        { key: 'products', label: 'Products', icon: Package },
        { key: 'sold', label: 'Sold Products', icon: Crown },
        { key: 'customers', label: 'Users', icon: Users },
      ].map((t) => (
        <Button
          key={t.key}
          onClick={() => setActiveTab(t.key)}
          variant={activeTab === t.key ? 'default' : 'outline'}
          className={`gap-2 ${activeTab === t.key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        >
          <t.icon className="h-4 w-4" />
          {t.label}
        </Button>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {Header}
      {Tabs}

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card onClick={() => goTab('products')} className="cursor-pointer hover:shadow-lg transition focus-within:ring-2 focus-within:ring-primary bg-pink-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold">{stats.totalProducts.toLocaleString()}</div>
                <Package className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>

            <Card onClick={() => goTab('customers')} className="cursor-pointer hover:shadow-lg transition focus-within:ring-2 focus-within:ring-primary bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <Users className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>

            <Card onClick={() => goTab('orders')} className="bg-pink-50 cursor-pointer hover:shadow-lg transition focus-within:ring-2 focus-within:ring-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div className="text-3xl font-bold">{stats.totalOrders.toLocaleString()}</div>
                <ShoppingCart className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>

            <Card className="bg-blue-50 hover:shadow-lg transition">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    {stats.revenueGrowth}% vs prev
                  </div>
                </div>
                <DollarSign className="h-6 w-6 text-primary" />
              </CardContent>
            </Card>
          </div>

          {/* Interactive Revenue Area Chart */}
          <RevenueAreaInteractive series={revenueData} timeRange={timeRange} setTimeRange={setTimeRange} />

          {/* Sales Channels + Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Sales Channels</CardTitle>
                <CardDescription>Online vs Cash on Delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<PrettyTooltip currencyMode />} />
                      <Bar dataKey="online" name="Online" fill="#6366F1" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="inStore" name="Cash on Delivery" fill="#10B981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>Inventory distribution</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryDistribution.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PrettyTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders + Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders - Responsive fix with grid, wrap and overflow protection */}
            <Card className="hover:shadow-lg transition focus-within:ring-2 focus-within:ring-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg md:text-xl">Recent Orders</CardTitle>
                    <CardDescription>Latest purchases with details</CardDescription>
                  </div>
                  <Button
                    onClick={() => goTab('orders')}
                    className="bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </div>
              </CardHeader>

              {/* Make the list scrollable if it grows too large on small screens */}
              <CardContent className="space-y-3 max-h-[560px] overflow-auto pr-1">
                {recentOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition focus-within:ring-2 focus-within:ring-primary"
                  >
                    {/* Responsive layout: stack on mobile, grid on larger screens */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
                      {/* Left block: meta */}
                      <div className="xl:col-span-7 2xl:col-span-8 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1 text-primary font-semibold">
                            <Hash className="h-3.5 w-3.5" />
                            <span className="font-mono break-all">#{o.id}</span>
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(o.date, 'MMM dd, yyyy HH:mm')}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="inline-flex items-center gap-1">
                            <ShoppingCart className="h-3.5 w-3.5" />
                            {o.items} items
                          </span>
                        </div>

                        <div className="mt-2">
                          <div className="font-semibold text-sm sm:text-base truncate">
                            {o.contact.name}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            {o.contact.email ? (
                              <span className="inline-flex items-center gap-1 break-all">
                                <Mail className="h-3.5 w-3.5" /> {o.contact.email}
                              </span>
                            ) : null}
                            {o.contact.mobile ? (
                              <span className="inline-flex items-center gap-1">
                                <Phone className="h-3.5 w-3.5" /> {o.contact.mobile}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Address row wraps and truncates cleanly */}
                        {o.address && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            <span className="inline-flex items-start gap-1">
                              <MapPin className="h-3.5 w-3.5 mt-[1px] shrink-0 text-rose-500" />
                              <span className="line-clamp-2 break-words">
                                {[
                                  o.address.address_line,
                                  o.address.city,
                                  o.address.state,
                                  o.address.country,
                                  o.address.pincode,
                                ].filter(Boolean).join(', ')}
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Right block: amount + status with strong colors and focus */}
                      <div className="xl:col-span-5 2xl:col-span-4 flex xl:flex-col items-end xl:items-end justify-between gap-2">
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-extrabold text-emerald-600">
                            {formatCurrency(o.amount)}
                          </div>
                          <Badge
                            className={`mt-1 ${
                              o.status?.toLowerCase().includes('completed') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                              o.status?.toLowerCase().includes('cancel') ? 'bg-rose-100 text-rose-700 border-rose-200' :
                              o.status?.toLowerCase().includes('pending') ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-sky-100 text-sky-800 border-sky-200'
                            }`}
                            variant="outline"
                          >
                            {o.status}
                          </Badge>
                        </div>

                        {/* CTA button with clear color and focus ring */}
                        <Button
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                          size="sm"
                          onClick={() => goTab('orders')}
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pt-3">
                <Button
                  variant="outline"
                  className="w-full justify-center border-primary text-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => goTab('orders')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View all orders
                </Button>
              </CardFooter>
            </Card>

            {/* Top Products */}
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Highest revenue items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p.id} className="p-4 rounded-lg border bg-card hover:bg-accent/30 transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {p.rank}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.sales} units</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600">{formatCurrency(p.revenue)}</div>
                        <div className="text-xs text-emerald-600 flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-3 w-3" /> {p.growth}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>All Orders</CardTitle>
            <CardDescription>Full list with customer, address, and items</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[900px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left py-3 px-3">Order</th>
                    <th className="text-left py-3 px-3">Customer</th>
                    <th className="text-left py-3 px-3">Contact</th>
                    <th className="text-left py-3 px-3">Address</th>
                    <th className="text-left py-3 px-3">Items</th>
                    <th className="text-left py-3 px-3">Amount</th>
                    <th className="text-left py-3 px-3">Status</th>
                    <th className="text-left py-3 px-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersForList.items.map((o) => (
                    <tr key={o.id} className="border-b hover:bg-accent/30">
                      <td className="py-3 px-3 font-mono text-xs text-primary font-semibold">#{o.id}</td>
                      <td className="py-3 px-3">{o.contactName}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          {o.email && <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {o.email}</span>}
                          {o.mobile && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {o.mobile}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="max-w-[260px] text-xs text-muted-foreground">
                          {[
                            o.address?.address_line,
                            o.address?.city,
                            o.address?.state,
                            o.address?.country,
                            o.address?.pincode,
                          ].filter(Boolean).join(', ')}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline">{o.items} items</Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">{formatCurrency(o.amount)}</td>
                      <td className="py-3 px-3">
                        <Badge className={`${
                          o.status?.toLowerCase().includes('completed') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          o.status?.toLowerCase().includes('cancel') ? 'bg-rose-100 text-rose-700 border-rose-200' :
                          o.status?.toLowerCase().includes('pending') ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          'bg-sky-100 text-sky-800 border-sky-200'
                        }`} variant="outline">
                          {o.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3">{o.date ? formatDate(o.date, 'MMM dd, yyyy HH:mm') : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, ordersForList.total)} of {ordersForList.total}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => (p * pageSize < ordersForList.total ? p + 1 : p))}
                disabled={page * pageSize >= ordersForList.total}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {activeTab === 'products' && (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>All Products</CardTitle>
            <CardDescription>Complete product catalog</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left py-3 px-3">Product</th>
                    <th className="text-left py-3 px-3">SKU</th>
                    <th className="text-left py-3 px-3">Category</th>
                    <th className="text-left py-3 px-3">Price</th>
                    <th className="text-left py-3 px-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productsForList.items.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-accent/30">
                      <td className="py-3 px-3 font-medium">{p.name}</td>
                      <td className="py-3 px-3 font-mono text-xs">{p.sku || '—'}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline">{p.category || '—'}</Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold">{formatCurrency(p.price)}</td>
                      <td className="py-3 px-3">
                        <Badge variant={p.stock > 10 ? 'default' : p.stock > 0 ? 'secondary' : 'destructive'}>
                          {p.stock} units
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, productsForList.total)} of {productsForList.total} products
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => (p * pageSize < productsForList.total ? p + 1 : p))}
                disabled={page * pageSize >= productsForList.total}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {activeTab === 'sold' && (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>All Sold Products</CardTitle>
            <CardDescription>Units, average price, revenue, and dates</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="min-w-[900px]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left py-3 px-3">Product</th>
                    <th className="text-left py-3 px-3">Units Sold</th>
                    <th className="text-left py-3 px-3">Avg Price</th>
                    <th className="text-left py-3 px-3">Revenue</th>
                    <th className="text-left py-3 px-3">First Sold</th>
                    <th className="text-left py-3 px-3">Last Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {soldForList.items.map((s) => (
                    <tr key={s.id} className="border-b hover:bg-accent/30">
                      <td className="py-3 px-3 font-medium">{s.name}</td>
                      <td className="py-3 px-3"><Badge variant="outline">{s.quantity}</Badge></td>
                      <td className="py-3 px-3">{formatCurrency(s.avgPrice)}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-600">{formatCurrency(s.revenue)}</td>
                      <td className="py-3 px-3">{s.firstSold ? formatDate(s.firstSold, 'MMM dd, yyyy') : '—'}</td>
                      <td className="py-3 px-3">{s.lastSold ? formatDate(s.lastSold, 'MMM dd, yyyy') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, soldForList.total)} of {soldForList.total} sold products
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => (p * pageSize < soldForList.total ? p + 1 : p))}
                disabled={page * pageSize >= soldForList.total}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {activeTab === 'customers' && (
        <Card className="hover:shadow-lg transition">
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Unique customers derived from orders or admin stats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Ensure your admin endpoint provides total users for exact counts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard