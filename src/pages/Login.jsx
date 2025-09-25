import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email or phone number is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const handleSubmit = () => {
  //   if (validateForm()) {
  //     setIsLoading(true);
  //     // Simulate login process
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       alert('Login successful! (Demo)');
  //     }, 1500);
  //   }
  // };
  const handleSubmit = async () => {
  if (validateForm()) {
    setIsLoading(true);
    try {
      const res = await fetch("https://facebook-backend-f4m6.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        
        alert("Login success 🎉");
        navigate("/home")
        console.log("User:", data.user);
        localStorage.setItem('userId', data.user._id);
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <h1 className="text-6xl lg:text-7xl font-bold text-blue-600 mb-6">
              facebook
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-800 leading-relaxed">
              Facebook helps you connect and share with the people in your life.
            </p>
          </div>
          
          {/* Social Proof */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Sarah joined Facebook</div>
                    <div className="text-xs text-gray-500">2 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Mike shared a photo</div>
                    <div className="text-xs text-gray-500">5 minutes ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Emma updated status</div>
                    <div className="text-xs text-gray-500">8 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <button className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to start
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Log in to Facebook</h2>
              <p className="text-gray-600 mt-2">Enter your details to access your account</p>
            </div>

            <div className="space-y-4">
              {/* Email/Phone Input */}
              <div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address or phone number"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Log In'
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <div className="text-blue-600 hover:text-blue-700 text-sm hover:underline">
                  Forgotten password?
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Create Account Button */}
              <button
                onClick={() => alert('Create account clicked!')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Create new account
              </button>
            </div>

            {/* Additional Options */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center space-y-2 text-sm text-gray-600">
                <div>
                  <div className="hover:underline">Create a Page</div>
                  {' '}for a celebrity, brand or business.
                </div>
                <div className="flex justify-center space-x-4 text-xs">
                  <div className="hover:underline">Terms</div>
                  <div className="hover:underline">Privacy Policy</div>
                  <div className="hover:underline">Cookies</div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="text-sm text-blue-800">
                <div className="font-medium">Security tip:</div>
                <div>Never share your password with anyone. Facebook will never ask for your password via email or phone.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;