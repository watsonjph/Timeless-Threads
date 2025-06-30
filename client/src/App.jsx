import React from 'react'
import './App.css'

function App() {
  return (
    <div className="App">
      {/* Simple Header */}
      <header className="bg-custom-dark shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-custom-cream">Hydronet Billing System</h1>
            <nav className="space-x-4">
              <a href="#" className="text-custom-cream hover:text-custom-mint px-3 py-2 rounded-md text-sm font-medium">Login</a>
              <a href="#" className="bg-custom-mint text-custom-dark px-4 py-2 rounded-md text-sm font-medium hover:bg-custom-medium hover:text-custom-cream">Sign Up</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-custom-cream">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-custom-dark sm:text-5xl md:text-6xl">
                <span className="block">Hydronet</span>
                <span className="block text-custom-medium">Billing System</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-custom-dark sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Streamline your billing process, track payments, and manage client records with ease.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-custom-cream bg-custom-medium hover:bg-custom-dark md:py-4 md:text-lg md:px-10">
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-custom-mint py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-custom-dark sm:text-4xl">
                Temporary Landing Page
              </h2>
              <p className="mt-4 text-lg text-custom-dark">
                -- Change styling --
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-custom-dark">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-custom-cream">
              &copy; 2024 Hydronet Consultants Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App 