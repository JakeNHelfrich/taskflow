import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/projects/')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div className="container max-w-4xl py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
          New Project
        </button>
      </div>

      {/* Projects grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Empty state */}
        <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-lg">
          <p className="text-lg mb-2">No projects yet</p>
          <p className="text-sm mb-4">
            Create projects to organize your tasks
          </p>
          <button className="text-sm text-primary hover:underline">
            + Create your first project
          </button>
        </div>
      </div>
    </div>
  )
}
