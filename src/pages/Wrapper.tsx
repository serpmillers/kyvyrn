// still gotta improve the UI and add a few features here and there

import { useState } from 'react'
import { invoke } from "@tauri-apps/api/core";
import UrlInput from '../components/UrlInput'

interface AppDetails {
  id: string
  url: string
  name: string
  description: string
  createdAt: Date
}

function Wrapper() {
  const [url, setUrl] = useState('')
  const [apps, setApps] = useState<AppDetails[]>([])
  const [showDetailsForm, setShowDetailsForm] = useState(false)
  const [appName, setAppName] = useState('')
  const [appDescription, setAppDescription] = useState('')

  const handleGenerate = () => {
    if (!url) return
    setShowDetailsForm(true)
  }

  const handleSaveApp = () => {
    if (!appName.trim()) return

    const newApp: AppDetails = {
      id: Date.now().toString(),
      url,
      name: appName.trim(),
      description: appDescription.trim(),
      createdAt: new Date()
    }

    setApps(prev => [...prev, newApp])
    setUrl('')
    setAppName('')
    setAppDescription('')
    setShowDetailsForm(false)
  }

  const handleCancel = () => {
    setShowDetailsForm(false)
    setAppName('')
    setAppDescription('')
  }

  const handleLaunch = async (appUrl: string) => {
    await invoke("open_app_window", {
      label: `app-${Date.now()}`,
      url: appUrl,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Native App Maker</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Create New App</h2>

            {!showDetailsForm ? (
              <>
                <UrlInput value={url} onChange={setUrl} />
                <button
                  onClick={handleGenerate}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                >
                  Generate App
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="appName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    App Name
                  </label>
                  <input
                    type="text"
                    id="appName"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="My Awesome App"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    id="appDescription"
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    placeholder="A brief description of your app"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveApp}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Save App
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Apps List Section */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Your Apps ({apps.length})</h2>

            {apps.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No apps created yet. Generate your first app!
              </p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {apps.map((app) => (
                  <div key={app.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{app.url}</p>
                    {app.description && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{app.description}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Created: {app.createdAt.toLocaleDateString()}
                    </p>
                    <div className="mt-2 space-x-2">
                      <button
                        onClick={() => handleLaunch(app.url)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                      >
                        Launch App
                      </button>
                      <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm">
                        Download AppImage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Wrapper