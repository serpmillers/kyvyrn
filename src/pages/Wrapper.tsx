// still gotta improve the UI and add a few features here and there

import { useState } from 'react'
import UrlInput from '../components/UrlInput'

function Wrapper() {
  const [url, setUrl] = useState('')
  const [appImageUrl, setAppImageUrl] = useState<string | null>(null)

  const handleGenerate = () => {
    if (!url) return
    // Simulate AppImage generation (since I'm learning how tauri works right now)
    const fileContent = `Generated AppImage for URL: ${url}\nThis is a fake AppImage file.`
    const blob = new Blob([fileContent], { type: 'application/octet-stream' })
    const blobUrl = URL.createObjectURL(blob)
    setAppImageUrl(blobUrl)
  }

  const handleDownload = () => {
    if (!appImageUrl) return
    const link = document.createElement('a')
    link.href = appImageUrl
    link.download = 'app.AppImage'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Native App Maker</h1>
        <UrlInput value={url} onChange={setUrl} />
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          Generate App
        </button>
        {appImageUrl && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h2 className="text-lg font-semibold mb-2 text-green-800">AppImage Ready!</h2>
            <p className="text-sm text-green-700 mb-4">
              Your native app has been generated as an AppImage file.
            </p>
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Download AppImage
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wrapper