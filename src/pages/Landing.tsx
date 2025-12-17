// Demo landing page for the Native App Maker application, will make it better later

interface LandingProps {
  onGetStarted: () => void
}

function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Native App Maker
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform any website into a native mobile app with just a few clicks.
          No coding required!
        </p>
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Easy URL input</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Instant app generation</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Download ready-to-use files</span>
          </div>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Landing