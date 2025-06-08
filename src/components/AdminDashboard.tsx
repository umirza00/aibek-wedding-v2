import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { LogOut, Save, Edit3, Plus, Trash2, Eye, Settings, Home, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface WebContent {
  id: string
  section: string
  key: string
  value: string
  type: 'text' | 'image' | 'json'
  created_at?: string
  updated_at?: string
}

interface WeddingSettings {
  id: string
  couple_names: string
  wedding_date: string
  ceremony_location: string
  reception_location: string
  hashtag: string
  created_at?: string
  updated_at?: string
}

interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'user'
  created_at?: string
  updated_at?: string
}

interface DatabaseStatus {
  connection: boolean
  tables: {
    web_content: boolean
    wedding_settings: boolean
    user_roles: boolean
  }
  operations: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  
  // State management
  const [content, setContent] = useState<WebContent[]>([])
  const [weddingSettings, setWeddingSettings] = useState<WeddingSettings[]>([])
  const [userRoles, setUserRoles] = useState<UserRole[]>([])
  
  // UI state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('web_content')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  
  // Form state
  const [newWebContent, setNewWebContent] = useState<Partial<WebContent>>({
    section: '',
    key: '',
    value: '',
    type: 'text'
  })
  
  const [newWeddingSettings, setNewWeddingSettings] = useState<Partial<WeddingSettings>>({
    couple_names: '',
    wedding_date: '',
    ceremony_location: '',
    reception_location: '',
    hashtag: ''
  })

  // Diagnostics state
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connection: false,
    tables: {
      web_content: false,
      wedding_settings: false,
      user_roles: false
    },
    operations: {
      create: false,
      read: false,
      update: false,
      delete: false
    }
  })
  
  const [apiLogs, setApiLogs] = useState<Array<{
    timestamp: string
    operation: string
    table: string
    status: 'success' | 'error'
    message: string
    data?: any
  }>>([])

  // Logging utility
  const logApiCall = (operation: string, table: string, status: 'success' | 'error', message: string, data?: any) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      operation,
      table,
      status,
      message,
      data
    }
    
    setApiLogs(prev => [logEntry, ...prev.slice(0, 49)]) // Keep last 50 logs
    console.log(`[ADMIN CRUD] ${operation.toUpperCase()} ${table}:`, logEntry)
  }

  // Database diagnostics
  const runDiagnostics = async () => {
    console.log('🔍 Running comprehensive database diagnostics...')
    
    const newStatus: DatabaseStatus = {
      connection: false,
      tables: {
        web_content: false,
        wedding_settings: false,
        user_roles: false
      },
      operations: {
        create: false,
        read: false,
        update: false,
        delete: false
      }
    }

    try {
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('web_content')
        .select('count')
        .limit(1)

      if (!connectionError) {
        newStatus.connection = true
        logApiCall('CONNECTION_TEST', 'supabase', 'success', 'Database connection successful')
      } else {
        logApiCall('CONNECTION_TEST', 'supabase', 'error', connectionError.message)
      }

      // Test each table
      const tables = ['web_content', 'wedding_settings', 'user_roles']
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1)

          if (!error) {
            newStatus.tables[table as keyof typeof newStatus.tables] = true
            logApiCall('TABLE_TEST', table, 'success', `Table ${table} accessible`)
          } else {
            logApiCall('TABLE_TEST', table, 'error', error.message)
          }
        } catch (err) {
          logApiCall('TABLE_TEST', table, 'error', `Table ${table} test failed: ${err}`)
        }
      }

      // Test CRUD operations on web_content
      try {
        // Test CREATE
        const testItem = {
          section: 'test_section',
          key: 'test_key',
          value: 'test_value',
          type: 'text' as const
        }

        const { data: createData, error: createError } = await supabase
          .from('web_content')
          .insert([testItem])
          .select()

        if (!createError && createData) {
          newStatus.operations.create = true
          logApiCall('CREATE_TEST', 'web_content', 'success', 'CREATE operation successful')

          const testId = createData[0].id

          // Test READ
          const { data: readData, error: readError } = await supabase
            .from('web_content')
            .select('*')
            .eq('id', testId)

          if (!readError && readData) {
            newStatus.operations.read = true
            logApiCall('READ_TEST', 'web_content', 'success', 'READ operation successful')
          }

          // Test UPDATE
          const { error: updateError } = await supabase
            .from('web_content')
            .update({ value: 'updated_test_value' })
            .eq('id', testId)

          if (!updateError) {
            newStatus.operations.update = true
            logApiCall('UPDATE_TEST', 'web_content', 'success', 'UPDATE operation successful')
          }

          // Test DELETE (cleanup)
          const { error: deleteError } = await supabase
            .from('web_content')
            .delete()
            .eq('id', testId)

          if (!deleteError) {
            newStatus.operations.delete = true
            logApiCall('DELETE_TEST', 'web_content', 'success', 'DELETE operation successful')
          }
        } else {
          logApiCall('CREATE_TEST', 'web_content', 'error', createError?.message || 'CREATE failed')
        }
      } catch (err) {
        logApiCall('CRUD_TEST', 'web_content', 'error', `CRUD test failed: ${err}`)
      }

    } catch (err) {
      logApiCall('DIAGNOSTICS', 'general', 'error', `Diagnostics failed: ${err}`)
    }

    setDbStatus(newStatus)
    console.log('✅ Diagnostics complete:', newStatus)
  }

  // Enhanced data fetching with error handling
  const fetchWebContent = async () => {
    try {
      logApiCall('FETCH', 'web_content', 'success', 'Starting fetch operation')
      
      const { data, error } = await supabase
        .from('web_content')
        .select('*')
        .order('section', { ascending: true })
        .order('key', { ascending: true })

      if (error) {
        throw error
      }

      setContent(data || [])
      logApiCall('FETCH', 'web_content', 'success', `Fetched ${data?.length || 0} records`)
    } catch (error: any) {
      logApiCall('FETCH', 'web_content', 'error', error.message, error)
      console.error('Error fetching web content:', error)
    }
  }

  const fetchWeddingSettings = async () => {
    try {
      logApiCall('FETCH', 'wedding_settings', 'success', 'Starting fetch operation')
      
      const { data, error } = await supabase
        .from('wedding_settings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setWeddingSettings(data || [])
      logApiCall('FETCH', 'wedding_settings', 'success', `Fetched ${data?.length || 0} records`)
    } catch (error: any) {
      logApiCall('FETCH', 'wedding_settings', 'error', error.message, error)
      console.error('Error fetching wedding settings:', error)
    }
  }

  const fetchUserRoles = async () => {
    try {
      logApiCall('FETCH', 'user_roles', 'success', 'Starting fetch operation')
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setUserRoles(data || [])
      logApiCall('FETCH', 'user_roles', 'success', `Fetched ${data?.length || 0} records`)
    } catch (error: any) {
      logApiCall('FETCH', 'user_roles', 'error', error.message, error)
      console.error('Error fetching user roles:', error)
    }
  }

  // Enhanced CRUD operations
  const handleSaveWebContent = async (item: WebContent) => {
    setSaving(item.id)
    try {
      logApiCall('UPDATE', 'web_content', 'success', `Starting update for item ${item.id}`)
      
      const currentItem = content.find(c => c.id === item.id)
      if (!currentItem) {
        throw new Error('Item not found in current state')
      }

      const updateData = {
        section: currentItem.section,
        key: currentItem.key,
        value: currentItem.value,
        type: currentItem.type,
        updated_at: new Date().toISOString()
      }

      logApiCall('UPDATE', 'web_content', 'success', 'Sending update request', updateData)

      const { data, error } = await supabase
        .from('web_content')
        .update(updateData)
        .eq('id', currentItem.id)
        .select()

      if (error) {
        throw error
      }

      logApiCall('UPDATE', 'web_content', 'success', 'Update successful', data)
      
      setEditingItem(null)
      await fetchWebContent() // Refresh data
      
    } catch (error: any) {
      logApiCall('UPDATE', 'web_content', 'error', error.message, error)
      console.error('Error saving web content:', error)
      alert(`Failed to save changes: ${error.message}`)
    } finally {
      setSaving(null)
    }
  }

  const handleAddWebContent = async () => {
    if (!newWebContent.section || !newWebContent.key || !newWebContent.value) {
      alert('Please fill in all required fields')
      return
    }

    try {
      logApiCall('CREATE', 'web_content', 'success', 'Starting create operation', newWebContent)
      
      const { data, error } = await supabase
        .from('web_content')
        .insert([{
          section: newWebContent.section,
          key: newWebContent.key,
          value: newWebContent.value,
          type: newWebContent.type || 'text'
        }])
        .select()

      if (error) {
        throw error
      }

      logApiCall('CREATE', 'web_content', 'success', 'Create successful', data)
      
      setNewWebContent({ section: '', key: '', value: '', type: 'text' })
      setShowAddForm(false)
      await fetchWebContent()
      
    } catch (error: any) {
      logApiCall('CREATE', 'web_content', 'error', error.message, error)
      console.error('Error adding web content:', error)
      alert(`Failed to add content: ${error.message}`)
    }
  }

  const handleDeleteWebContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      logApiCall('DELETE', 'web_content', 'success', `Starting delete for item ${id}`)
      
      const { error } = await supabase
        .from('web_content')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      logApiCall('DELETE', 'web_content', 'success', 'Delete successful')
      await fetchWebContent()
      
    } catch (error: any) {
      logApiCall('DELETE', 'web_content', 'error', error.message, error)
      console.error('Error deleting web content:', error)
      alert(`Failed to delete item: ${error.message}`)
    }
  }

  // Wedding settings CRUD
  const handleAddWeddingSettings = async () => {
    if (!newWeddingSettings.couple_names || !newWeddingSettings.wedding_date) {
      alert('Please fill in required fields')
      return
    }

    try {
      logApiCall('CREATE', 'wedding_settings', 'success', 'Starting create operation', newWeddingSettings)
      
      const { data, error } = await supabase
        .from('wedding_settings')
        .insert([newWeddingSettings])
        .select()

      if (error) {
        throw error
      }

      logApiCall('CREATE', 'wedding_settings', 'success', 'Create successful', data)
      
      setNewWeddingSettings({
        couple_names: '',
        wedding_date: '',
        ceremony_location: '',
        reception_location: '',
        hashtag: ''
      })
      setShowAddForm(false)
      await fetchWeddingSettings()
      
    } catch (error: any) {
      logApiCall('CREATE', 'wedding_settings', 'error', error.message, error)
      console.error('Error adding wedding settings:', error)
      alert(`Failed to add wedding settings: ${error.message}`)
    }
  }

  // Content update utilities
  const updateWebContent = (id: string, field: keyof WebContent, value: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        [field]: value,
        updated_at: new Date().toISOString()
      } : item
    ))
    logApiCall('LOCAL_UPDATE', 'web_content', 'success', `Updated ${field} for item ${id}`, { field, value })
  }

  const updateWeddingSettings = (id: string, field: keyof WeddingSettings, value: string) => {
    setWeddingSettings(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        [field]: value,
        updated_at: new Date().toISOString()
      } : item
    ))
    logApiCall('LOCAL_UPDATE', 'wedding_settings', 'success', `Updated ${field} for item ${id}`, { field, value })
  }

  // Utility functions
  const formatValue = (value: string, type: string) => {
    if (type === 'json') {
      try {
        return JSON.stringify(JSON.parse(value), null, 2)
      } catch {
        return value
      }
    }
    return value
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleViewSite = () => {
    navigate('/')
  }

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchWebContent(),
          fetchWeddingSettings(),
          fetchUserRoles()
        ])
        
        // Run diagnostics on first load
        await runDiagnostics()
      } catch (error) {
        console.error('Error initializing data:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const sections = [...new Set(content.map(item => item.section))]
  const filteredContent = activeTab === 'web_content' 
    ? content 
    : activeTab === 'wedding_settings'
    ? weddingSettings
    : userRoles

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-violet-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-sm">Content Management System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDiagnostics(!showDiagnostics)}
                className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
                  showDiagnostics 
                    ? 'bg-violet-500 text-white' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Diagnostics
              </button>
              <button
                onClick={runDiagnostics}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Test DB
              </button>
              <button
                onClick={handleViewSite}
                className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Diagnostics Panel */}
        {showDiagnostics && (
          <div className="mb-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-violet-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Database Diagnostics</h3>
            
            {/* Status Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className={`p-4 rounded-xl ${dbStatus.connection ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className="flex items-center">
                  {dbStatus.connection ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  )}
                  <span className="font-medium">Connection</span>
                </div>
              </div>
              
              {Object.entries(dbStatus.tables).map(([table, status]) => (
                <div key={table} className={`p-4 rounded-xl ${status ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-center">
                    {status ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    )}
                    <span className="font-medium text-sm">{table}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* CRUD Operations Status */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {Object.entries(dbStatus.operations).map(([operation, status]) => (
                <div key={operation} className={`p-3 rounded-xl ${status ? 'bg-green-100' : 'bg-red-100'}`}>
                  <div className="flex items-center">
                    {status ? (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                    <span className="font-medium text-sm uppercase">{operation}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* API Logs */}
            <div className="max-h-64 overflow-y-auto">
              <h4 className="font-medium text-gray-700 mb-2">Recent API Calls</h4>
              <div className="space-y-2">
                {apiLogs.slice(0, 10).map((log, index) => (
                  <div key={index} className={`p-3 rounded-lg text-sm ${
                    log.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {log.operation} - {log.table}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className={log.status === 'success' ? 'text-green-700' : 'text-red-700'}>
                      {log.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {['web_content', 'wedding_settings', 'user_roles'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-violet-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-violet-100'
                }`}
              >
                {tab.replace('_', ' ').toUpperCase()} ({
                  tab === 'web_content' ? content.length :
                  tab === 'wedding_settings' ? weddingSettings.length :
                  userRoles.length
                })
              </button>
            ))}
          </div>

          {/* Add New Content Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New {activeTab.replace('_', ' ')}
          </button>
        </div>

        {/* Add New Content Form */}
        {showAddForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 border border-violet-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Add New {activeTab.replace('_', ' ')}
            </h3>
            
            {activeTab === 'web_content' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Section"
                    value={newWebContent.section || ''}
                    onChange={(e) => setNewWebContent(prev => ({ ...prev, section: e.target.value }))}
                    className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Key"
                    value={newWebContent.key || ''}
                    onChange={(e) => setNewWebContent(prev => ({ ...prev, key: e.target.value }))}
                    className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  <select
                    value={newWebContent.type || 'text'}
                    onChange={(e) => setNewWebContent(prev => ({ ...prev, type: e.target.value as 'text' | 'image' | 'json' }))}
                    className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  >
                    <option value="text">Text</option>
                    <option value="image">Image</option>
                    <option value="json">JSON</option>
                  </select>
                  <button
                    onClick={handleAddWebContent}
                    disabled={!newWebContent.section || !newWebContent.key || !newWebContent.value}
                    className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>
                <textarea
                  placeholder="Value"
                  value={newWebContent.value || ''}
                  onChange={(e) => setNewWebContent(prev => ({ ...prev, value: e.target.value }))}
                  rows={newWebContent.type === 'json' ? 6 : 3}
                  className="w-full px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                />
              </div>
            )}

            {activeTab === 'wedding_settings' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Couple Names"
                  value={newWeddingSettings.couple_names || ''}
                  onChange={(e) => setNewWeddingSettings(prev => ({ ...prev, couple_names: e.target.value }))}
                  className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <input
                  type="date"
                  placeholder="Wedding Date"
                  value={newWeddingSettings.wedding_date || ''}
                  onChange={(e) => setNewWeddingSettings(prev => ({ ...prev, wedding_date: e.target.value }))}
                  className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Ceremony Location"
                  value={newWeddingSettings.ceremony_location || ''}
                  onChange={(e) => setNewWeddingSettings(prev => ({ ...prev, ceremony_location: e.target.value }))}
                  className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Reception Location"
                  value={newWeddingSettings.reception_location || ''}
                  onChange={(e) => setNewWeddingSettings(prev => ({ ...prev, reception_location: e.target.value }))}
                  className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Hashtag"
                  value={newWeddingSettings.hashtag || ''}
                  onChange={(e) => setNewWeddingSettings(prev => ({ ...prev, hashtag: e.target.value }))}
                  className="px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddWeddingSettings}
                  disabled={!newWeddingSettings.couple_names || !newWeddingSettings.wedding_date}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Wedding Settings
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content List */}
        <div className="space-y-6">
          {activeTab === 'web_content' && content.map((item) => (
            <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    {editingItem === item.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                          type="text"
                          value={item.section}
                          onChange={(e) => updateWebContent(item.id, 'section', e.target.value)}
                          className="px-4 py-2 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          placeholder="Section"
                        />
                        <input
                          type="text"
                          value={item.key}
                          onChange={(e) => updateWebContent(item.id, 'key', e.target.value)}
                          className="px-4 py-2 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                          placeholder="Key"
                        />
                        <select
                          value={item.type}
                          onChange={(e) => updateWebContent(item.id, 'type', e.target.value)}
                          className="px-4 py-2 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                          <option value="text">Text</option>
                          <option value="image">Image</option>
                          <option value="json">JSON</option>
                        </select>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium capitalize">
                          {item.section}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                          {item.key}
                        </span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium uppercase">
                          {item.type}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {editingItem === item.id ? (
                      <>
                        <button
                          onClick={() => handleSaveWebContent(item)}
                          disabled={saving === item.id}
                          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          {saving === item.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingItem(item.id)}
                          className="flex items-center px-4 py-2 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteWebContent(item.id)}
                          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Value Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Value
                  </label>
                  {editingItem === item.id ? (
                    <textarea
                      value={formatValue(item.value, item.type)}
                      onChange={(e) => updateWebContent(item.id, 'value', e.target.value)}
                      rows={item.type === 'json' ? 10 : 4}
                      className="w-full px-4 py-3 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none font-mono text-sm"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                        {formatValue(item.value, item.type)}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="mt-4 text-xs text-gray-500 flex justify-between">
                  <span>ID: {item.id}</span>
                  {item.updated_at && (
                    <span>Last updated: {new Date(item.updated_at).toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'wedding_settings' && weddingSettings.map((item) => (
            <div key={item.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-200 overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Couple Names</label>
                    {editingItem === item.id ? (
                      <input
                        type="text"
                        value={item.couple_names}
                        onChange={(e) => updateWeddingSettings(item.id, 'couple_names', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800">{item.couple_names}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wedding Date</label>
                    {editingItem === item.id ? (
                      <input
                        type="date"
                        value={item.wedding_date}
                        onChange={(e) => updateWeddingSettings(item.id, 'wedding_date', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-violet-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-800">{item.wedding_date}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  {editingItem === item.id ? (
                    <>
                      <button
                        onClick={() => {
                          // Save wedding settings logic here
                          setEditingItem(null)
                        }}
                        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingItem(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="flex items-center px-4 py-2 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No content found</h3>
            <p className="text-gray-500">
              No content has been added yet. Click "Add New {activeTab.replace('_', ' ')}" to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard