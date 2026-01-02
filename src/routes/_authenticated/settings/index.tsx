import { createFileRoute } from '@tanstack/react-router'
import { usePreferencesStore } from '@/stores/preferences-store'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const {
    theme,
    defaultView,
    showCompletedTasks,
    focusDuration,
    setTheme,
    setDefaultView,
    setShowCompletedTasks,
    setFocusDuration,
  } = usePreferencesStore()

  return (
    <div className="container max-w-2xl py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-8">
        {/* Appearance */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Theme</label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color scheme
                </p>
              </div>
              <select
                value={theme}
                onChange={(e) =>
                  setTheme(e.target.value as 'light' | 'dark' | 'system')
                }
                className="h-9 rounded-md border border-input bg-background px-3"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </section>

        {/* Task preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Default View</label>
                <p className="text-sm text-muted-foreground">
                  Where to go after signing in
                </p>
              </div>
              <select
                value={defaultView}
                onChange={(e) =>
                  setDefaultView(e.target.value as 'inbox' | 'today' | 'calendar')
                }
                className="h-9 rounded-md border border-input bg-background px-3"
              >
                <option value="inbox">Inbox</option>
                <option value="today">Today</option>
                <option value="calendar">Calendar</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Show Completed Tasks</label>
                <p className="text-sm text-muted-foreground">
                  Display completed tasks in task lists
                </p>
              </div>
              <button
                onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                className={`w-11 h-6 rounded-full transition-colors ${
                  showCompletedTasks ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    showCompletedTasks ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* Focus preferences */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Focus Mode</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium">Default Duration</label>
                <p className="text-sm text-muted-foreground">
                  Default focus session length
                </p>
              </div>
              <select
                value={focusDuration}
                onChange={(e) => setFocusDuration(Number(e.target.value))}
                className="h-9 rounded-md border border-input bg-background px-3"
              >
                <option value={15}>15 minutes</option>
                <option value={25}>25 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
              </select>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Integrations</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Zapier</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with 5,000+ apps
                  </p>
                </div>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 border border-input bg-background hover:bg-accent">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
