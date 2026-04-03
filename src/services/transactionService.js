import api from './api'

export const getTransactions = async (params = {}) => {
  const queryParams = new URLSearchParams()
  if (params.type) queryParams.append('type', params.type)
  if (params.category) queryParams.append('category', params.category)
  if (params.start_date) queryParams.append('start_date', params.start_date)
  if (params.end_date) queryParams.append('end_date', params.end_date)
  if (params.page) queryParams.append('page', params.page)
  if (params.limit) queryParams.append('limit', params.limit)
  
  const response = await api.get(`/records?${queryParams}`)
  // Handle the response format from your backend
  const transactions = Array.isArray(response.data) ? response.data : []
  return { 
    transactions: transactions,
    total: transactions.length 
  }
}

export const createTransaction = async (data) => {
  // Remove description if it exists (your backend doesn't have it)
  const { description, ...cleanData } = data
  const response = await api.post('/records', cleanData)
  return response.data
}

export const updateTransaction = async (id, data) => {
  // Remove description if it exists
  const { description, ...cleanData } = data
  const response = await api.put(`/records/${id}`, cleanData)
  return response.data
}

export const deleteTransaction = async (id) => {
  await api.delete(`/records/${id}`)
}

export const getDashboardSummary = async (params = {}) => {
  const response = await api.get('/dashboard/summary')
  const data = response.data
  
  return {
    total_income: data.summary?.total_income || 0,
    total_expense: data.summary?.total_expense || 0,
    net_balance: data.summary?.net_balance || 0,
    total_transactions: (data.category_totals || []).reduce((sum, cat) => sum + (cat.total || 0), 0),
    category_breakdown: data.category_totals || [],
    recent_activity: data.recent_activity || [],
    monthly_trends: data.monthly_trends || {}
  }
}

export const getMonthlyTrends = async () => {
  const response = await api.get('/dashboard/summary')
  const monthlyData = response.data.monthly_trends || {}
  
  return Object.entries(monthlyData).map(([month, data]) => ({
    month: getMonthName(parseInt(month)),
    income: data.income || 0,
    expense: data.expense || 0
  }))
}

export const getCategoryBreakdown = async (params = {}) => {
  const response = await api.get('/dashboard/summary')
  const categories = response.data.category_totals || []
  
  return categories.map(cat => ({
    name: cat.category,
    value: cat.total
  }))
}

function getMonthName(monthNumber) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[monthNumber - 1]
}