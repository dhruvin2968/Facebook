import React from 'react';
import { useNavigate } from "react-router-dom";
const StartPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <h1 className="text-6xl lg:text-7xl font-bold text-blue-600 mb-6">
              facebook
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-800 leading-relaxed">
              Connect with friends and the world around you on Facebook.
            </p>
          </div>
          
          <div className="space-y-4 text-lg text-gray-700 hidden lg:block">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>See photos and updates from friends in News Feed</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Share what's new in your life on your Timeline</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Find more of what you're looking for with Facebook Search</span>
            </div>
          </div>
        </div>

        {/* Right Side - Action Cards */}
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
              Welcome to Facebook
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Join millions of people who share their stories every day
            </p>
            
            <div className="space-y-4">
              <button onClick={() => navigate("/login")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105">
                Log In to Your Account
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>
              
              <button
      onClick={() => navigate("/register")}
      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105"
    >
      Create New Account
    </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">2.9B+</div>
                <div className="text-sm text-gray-600">Monthly Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">180+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">100+</div>
                <div className="text-sm text-gray-600">Languages</div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-800 mb-4">What you can do:</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Share photos and videos</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-gray-700">Connect with friends and family</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                </div>
                <span className="text-gray-700">Join communities and groups</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center space-x-6 text-sm text-gray-600">
            <div className="hover:underline">English (US)</div>
            <div className="hover:underline">Español</div>
            <div className="hover:underline">Français</div>
            <div className="hover:underline">العربية</div>
            <div className="hover:underline">Português</div>
            <div className="hover:underline">Italiano</div>
            <div className="hover:underline">Deutsch</div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            Facebook © 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartPage;