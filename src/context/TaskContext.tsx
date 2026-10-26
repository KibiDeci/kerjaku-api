import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Task {
  id: number
  text: string
  done: boolean
  category: "Kuliah" | "Pribadi" | "Lainnya"
}

interface TaskContextType {
  tasks: Task[]
  addTask: (text: string, category: Task["category"]) => void
  toggleTask: (id: number) => void
  deleteTask: (id: number) => void
  clearCompleted: () => void
  clearAll: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const STORAGE_KEY = "ionic-todo-tasks"

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const addTask = (text: string, category: Task["category"]) => {
    const trimmed = text.trim()
    if (trimmed === "") return
    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed, done: false, category }])
  }

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.done))
  }

  const clearAll = () => setTasks([])

  return <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, clearCompleted, clearAll }}>{children}</TaskContext.Provider>
}

export const useTasks = () => {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error("useTasks harus dipakai di dalam TaskProvider")
  return ctx
}
