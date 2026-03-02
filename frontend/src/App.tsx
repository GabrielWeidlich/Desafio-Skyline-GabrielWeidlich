import React, { useState, useEffect } from 'react'
import { Plus, X, Calendar, Flag, Edit2, Save, Check } from 'lucide-react'
import axios from 'axios'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = '/api'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editingData, setEditingData] = useState<{ title: string; description: string; dueDate?: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    dueDate: ''
  })

  // Carregar tarefas do backend
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_BASE_URL}/tasks`)
      if (response.data.success) {
        setTasks(response.data.data)
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return

    try {
      setLoading(true)
      const payload = {
        title: newTask.title,
        description: newTask.description || undefined,
        priority: newTask.priority,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
      }

      const response = await axios.post(`${API_BASE_URL}/tasks`, payload)

      if (response.data.success) {
        setTasks([...tasks, response.data.data])
        setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
        setShowNewTaskModal(false)
      }
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      setLoading(true)
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, {
        completed: !task.completed
      })

      if (response.data.success) {
        setTasks(tasks.map(t => 
          t.id === id ? { ...t, completed: !t.completed } : t
        ))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      setLoading(true)
      const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`)

      if (response.data.success) {
        setTasks(tasks.filter(task => task.id !== id))
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setLoading(false)
    }
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setEditingData({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''
    })
  }

  const saveEdit = async (id: string, updates: Partial<Task>) => {
    try {
      setLoading(true)
      const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, updates)

      if (response.data.success) {
        setTasks(tasks.map(task => 
          task.id === id ? response.data.data : task
        ))
      }
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveAndCloseEdit = async () => {
    if (editingTask && editingData) {
      const payload = {
        title: editingData.title,
        description: editingData.description || undefined,
        dueDate: editingData.dueDate ? new Date(editingData.dueDate) : undefined
      }
      await saveEdit(editingTask, payload)
      setEditingTask(null)
      setEditingData(null)
    }
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditingData(null)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-500'
      case 'HIGH': return 'text-orange-500'
      case 'MEDIUM': return 'text-yellow-500'
      case 'LOW': return 'text-green-500'
      default: return 'text-neutral-500'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'Urgente'
      case 'HIGH': return 'Alta'
      case 'MEDIUM': return 'Média'
      case 'LOW': return 'Baixa'
      default: return priority
    }
  }

  const getDueDateColor = (dueDate: Date | undefined) => {
    if (!dueDate) return 'text-neutral-500'
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'text-red-500' // Vencida
    if (diffDays === 0) return 'text-orange-500' // Vence hoje
    if (diffDays === 1) return 'text-yellow-500' // Vence amanhã
    return 'text-neutral-500' // Longo prazo
  }

  const formatDueDate = (dueDate: Date | undefined) => {
    if (!dueDate) return ''
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Amanhã'
    if (diffDays === -1) return 'Ontem'
    if (diffDays > 0 && diffDays <= 7) return `Em ${diffDays} dias`
    if (diffDays < 0) return `Há ${Math.abs(diffDays)} dias`
    
    return due.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      {/* Header */}
      <header className="bg-neutral-800 border-b border-neutral-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-neutral-100">Skyline Tasks</h1>
            <button
              onClick={() => setShowNewTaskModal(true)}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-900 hover:bg-blue-700 disabled:bg-neutral-900 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>Nova tarefa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading && tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-neutral-500 text-lg mb-4">Carregando tarefas...</div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-neutral-500 text-lg mb-4">Nenhuma tarefa ainda</div>
            <div className="text-neutral-600">Clique em "Nova tarefa" para começar</div>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map(task => (
              <div
                key={task.id}
                className="bg-neutral-800 rounded-lg p-4 flex items-center gap-4 hover:bg-neutral-750 transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskComplete(task.id)}
                    disabled={loading}
                    className="sr-only"
                  />
                  <div
                    onClick={() => !loading && toggleTaskComplete(task.id)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
                      task.completed 
                        ? 'bg-blue-900 border-blue-900' 
                        : 'border-neutral-500 hover:border-neutral-400'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-500'}`}
                  >
                    {task.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  {editingTask === task.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingData?.title || ''}
                        onChange={(e) => setEditingData({ ...editingData!, title: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                          } else if (e.key === 'Escape') {
                            cancelEdit()
                          }
                        }}
                        className="w-full px-2 py-1 bg-neutral-700 border border-neutral-900 rounded text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <textarea
                        value={editingData?.description || ''}
                        onChange={(e) => setEditingData({ ...editingData!, description: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            cancelEdit()
                          }
                        }}
                        className="w-full px-2 py-1 bg-neutral-700 border border-neutral-900 rounded text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                        placeholder="Descrição (opcional)"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={saveAndCloseEdit}
                          disabled={loading || !editingData?.title.trim()}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-900 hover:bg-blue-700 disabled:bg-neutral-900 disabled:cursor-not-allowed text-white text-sm rounded transition-colors"
                        >
                          <Check size={14} />
                          <span>Confirmar</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1 bg-neutral-900 hover:bg-neutral-500 text-neutral-300 text-sm rounded transition-colors"
                        >
                          <X size={14} />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={`font-medium ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-100'}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm mt-1 ${task.completed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-xs">
                          <Flag size={12} className={getPriorityColor(task.priority)} />
                          <span className={getPriorityColor(task.priority)}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 text-xs ${getDueDateColor(task.dueDate)}`}>
                            <Calendar size={12} />
                            <span>{formatDueDate(task.dueDate)}</span>
                          </div>
                        )}
                        <div className="text-xs text-neutral-500">
                          Criado em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingTask === task.id ? (
                    <>
                      <button
                        onClick={() => cancelEdit()}
                        className="text-neutral-500 hover:text-neutral-300 transition-colors"
                        title="Cancelar"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(task)}
                        disabled={loading}
                        className="text-neutral-500 hover:text-blue-400 transition-colors disabled:opacity-50"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        disabled={loading}
                        className="text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Excluir"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-neutral-100">Nova tarefa</h2>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-neutral-400 hover:text-neutral-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-900 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o título da tarefa"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-900 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Adicione uma descrição (opcional)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Prioridade
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' })}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-900 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">
                  Data de vencimento
                </label>
                <input
                  type="datetime-local"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-700 border border-neutral-900 rounded-lg text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-900 text-neutral-300 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim() || loading}
                className="flex-1 px-4 py-2 bg-blue-900 hover:bg-blue-700 disabled:bg-neutral-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                {loading ? 'Criando...' : 'Criar tarefa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
