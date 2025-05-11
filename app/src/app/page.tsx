import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to <span className="text-primary">To-Do</span> App
        </h1>
        <p className="text-lg text-center mb-8">
          A simple and effective way to manage your tasks
        </p>
        <div className="flex gap-4 mb-12">
          <Button variant="default" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {/* Task Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Create, edit, and organize your tasks with ease
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Tasks
              </Button>
            </CardFooter>
          </Card>

          {/* Categories Card */}
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>
                Group tasks into custom categories
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Manage Categories
              </Button>
            </CardFooter>
          </Card>

          {/* Priority Levels Card */}
          <Card>
            <CardHeader>
              <CardTitle>Priority Levels</CardTitle>
              <CardDescription>
                Set task priorities from low to high
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Set Priorities
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
