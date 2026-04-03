import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar,
  Loader
} from 'lucide-react'
import { getDashboardSummary, getMonthlyTrends, getCategoryBreakdown } from '../services/transactionService'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec489a']
  
  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    setLoading(true)
    try {
      const [summaryRes, monthlyRes, categoryRes] = await Promise.all([
        getDashboardSummary(),
        getMonthlyTrends(),
        getCategoryBreakdown()
      ])
      setSummary(summaryRes)
      setMonthlyData(monthlyRes)
      setCategoryData(categoryRes)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            ${value?.toLocaleString() || '0'}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
  
  // Custom label for pie chart that adapts to screen size
  const renderCustomLabel = ({ name, percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius + (isMobile ? 15 : 25)
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    const percentage = (percent * 100).toFixed(0)
    
    // On mobile, only show label if percentage is significant (> 8%)
    if (isMobile && percentage < 8) {
      return null
    }
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#888" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isMobile ? 10 : 12}
        className="text-gray-600 dark:text-gray-400"
      >
        {isMobile ? `${percentage}%` : `${name} ${percentage}%`}
      </text>
    )
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-12 h-12 animate-spin text-primary-500" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Income" 
          value={summary?.total_income} 
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard 
          title="Total Expenses" 
          value={summary?.total_expense} 
          icon={TrendingDown}
          color="bg-red-500"
        />
        <StatCard 
          title="Net Balance" 
          value={summary?.net_balance} 
          icon={Wallet}
          color="bg-blue-500"
        />
        <StatCard 
          title="Total Transactions" 
          value={summary?.total_transactions} 
          icon={Calendar}
          color="bg-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Breakdown</h2>
          
          {/* Category List for Mobile (Alternative view) */}
          {isMobile && categoryData.length > 0 && (
            <div className="mb-4 space-y-2">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${item.value?.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      ({((item.value / categoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pie Chart - Adjust for mobile */}
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={!isMobile}
                label={renderCustomLabel}
                outerRadius={isMobile ? 70 : 80}
                innerRadius={isMobile ? 30 : 40}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={isMobile ? 2 : 3}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => {
                  const total = categoryData.reduce((sum, cat) => sum + cat.value, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return [`$${value.toLocaleString()} (${percentage}%)`, name]
                }}
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: isMobile ? '10px' : '12px'
                }}
              />
              {/* Show legend on mobile instead of labels */}
              {isMobile && (
                <Legend 
                  layout="horizontal" 
                  align="center" 
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                  formatter={(value, entry, index) => (
                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      {value}
                    </span>
                  )}
                />
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income vs Expense Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: 'none',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="income" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Dashboard