"use client";

import { Layout } from "@/components/layout/Layout";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/supabase/categories";
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

// Define types for our category objects
interface Category {
  id: string;
  name: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

// Define the type for a new category
type NewCategory = {
  name: string;
  color: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<NewCategory>({
    name: "",
    color: "#3B82F6", // Default blue color
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories on initial page load
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCategories();
      setCategories(data || []);
    } catch (err) {
      setError(`Error fetching categories: ${(err as Error).message}`);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await createCategory(newCategory);
      setCategories([...categories, created]);
      setNewCategory({ name: "", color: "#3B82F6" });
    } catch (err) {
      setError(`Error creating category: ${(err as Error).message}`);
      console.error("Error creating category:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const updated = await updateCategory(editingCategory.id, {
        name: editingCategory.name,
        color: editingCategory.color,
      });
      setCategories(
        categories.map((cat) => (cat.id === updated.id ? updated : cat))
      );
      setEditingCategory(null);
    } catch (err) {
      setError(`Error updating category: ${(err as Error).message}`);
      console.error("Error updating category:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      setError(`Error deleting category: ${(err as Error).message}`);
      console.error("Error deleting category:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Category Management</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create new category form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Category</CardTitle>
            </CardHeader>
            <form onSubmit={handleCreateCategory}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Category Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="color"
                      type="color"
                      value={newCategory.color}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          color: e.target.value,
                        })
                      }
                      className="w-16 h-10 p-1"
                    />
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ backgroundColor: newCategory.color }}
                    ></div>
                    <span>{newCategory.color}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Category"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Edit category form (only shown when editing) */}
          {editingCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Category</CardTitle>
              </CardHeader>
              <form onSubmit={handleUpdateCategory}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Category Name</Label>
                    <Input
                      id="edit-name"
                      placeholder="Enter category name"
                      value={editingCategory.name}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-color">Category Color</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="edit-color"
                        type="color"
                        value={editingCategory.color}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            color: e.target.value,
                          })
                        }
                        className="w-16 h-10 p-1"
                      />
                      <div
                        className="w-10 h-10 rounded-full"
                        style={{ backgroundColor: editingCategory.color }}
                      ></div>
                      <span>{editingCategory.color}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingCategory(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>

        {/* List of categories */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Categories</h2>
        {loading && !categories.length ? (
          <div>Loading categories...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCategory(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {!categories.length && !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No categories found. Create your first category above.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
