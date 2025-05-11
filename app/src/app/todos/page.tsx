"use client";

import { Layout } from "@/components/layout/Layout";
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/supabase/tasks";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define types for our task objects
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Define the type for a new task
type NewTask = Omit<Task, "id" | "created_at" | "updated_at">;

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getAllTasks();
        setTasks(data || []);
        setError(null);
      } catch (err: any) {
        setError(`Error fetching tasks: ${err.message}`);
        console.error("Failed to fetch tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Create a new task
  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const createdTask = await createTask(newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
      });
      setError(null);
    } catch (err: any) {
      setError(`Error creating task: ${err.message}`);
      console.error("Failed to create task:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update a task
  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      setLoading(true);
      const updated = await updateTask(editingTask.id, editingTask);
      setTasks(
        tasks.map((task) => (task.id === editingTask.id ? updated : task))
      );
      setEditingTask(null);
      setError(null);
    } catch (err: any) {
      setError(`Error updating task: ${err.message}`);
      console.error("Failed to update task:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id: string) => {
    try {
      setLoading(true);
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      setError(null);
    } catch (err: any) {
      setError(`Error deleting task: ${err.message}`);
      console.error("Failed to delete task:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold">Tasks</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Task creation form */}
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <form onSubmit={handleCreateTask}>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTask.description || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTask.status}
                    onValueChange={(value: string) =>
                      setNewTask({ ...newTask, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: string) =>
                      setNewTask({ ...newTask, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Task list */}
        <h2 className="text-2xl font-semibold mt-6">Your Tasks</h2>
        {loading && !tasks.length ? <p>Loading tasks...</p> : null}

        {tasks.length === 0 && !loading ? (
          <p className="text-muted-foreground">
            No tasks yet. Create your first task above!
          </p>
        ) : (
          <div className="grid gap-4 mt-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  {editingTask && editingTask.id === task.id ? (
                    <form onSubmit={handleUpdateTask} className="space-y-4">
                      <div>
                        <Label htmlFor={`edit-title-${task.id}`}>Title</Label>
                        <Input
                          id={`edit-title-${task.id}`}
                          value={editingTask.title}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-description-${task.id}`}>
                          Description
                        </Label>
                        <Input
                          id={`edit-description-${task.id}`}
                          value={editingTask.description || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditingTask({
                              ...editingTask,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`edit-status-${task.id}`}>
                            Status
                          </Label>
                          <Select
                            value={editingTask.status}
                            onValueChange={(value: string) =>
                              setEditingTask({ ...editingTask, status: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">
                                In Progress
                              </SelectItem>
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`edit-priority-${task.id}`}>
                            Priority
                          </Label>
                          <Select
                            value={editingTask.priority}
                            onValueChange={(value: string) =>
                              setEditingTask({
                                ...editingTask,
                                priority: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setEditingTask(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingTask(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="flex mt-2 space-x-4 text-sm">
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Status:</span>
                          <span
                            className={`${
                              task.status === "completed"
                                ? "text-green-600"
                                : task.status === "in-progress"
                                ? "text-blue-600"
                                : "text-orange-600"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">Priority:</span>
                          <span
                            className={`${
                              task.priority === "high"
                                ? "text-red-600"
                                : task.priority === "medium"
                                ? "text-amber-600"
                                : "text-slate-600"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
