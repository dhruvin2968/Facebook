import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Check, Calendar, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthday: {
      month: '',
      day: '',
      year: ''
    },
    gender: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('birthday.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        birthday: {
          ...prev.birthday,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.birthday.month || !formData.birthday.day || !formData.birthday.year) {
      newErrors.birthday = 'Please provide your complete birth date';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  // const handleSubmit = () => {
  //   if (validateStep2()) {
  //     setIsLoading(true);
  //     // Simulate registration process
  //     setTimeout(() => {
  //       setIsLoading(false);
  //       alert('Registration successful! Welcome to Facebook! (Demo)');
  //     }, 2000);
  //   }
  // };
  const handleSubmit = async () => {
  if (validateStep2()) {
    setIsLoading(true);
    const { day, month, year } = formData.birthday;
    const formattedBirthday = new Date(`${year}-${month}-${day}`);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        body: JSON.stringify({ ...formData, birthday: formattedBirthday })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful ✅");
          navigate("/login")
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <button className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {step === 2 ? 'Back' : 'Back to start'}
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Create a new account' : 'About you'}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === 1 
                ? "It's quick and easy." 
                : 'Help people discover your account by using the name you go by in everyday life.'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && (
                    <div className="flex items-center mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
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
                  placeholder="New password"
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
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

              {/* Confirm Password Input */}
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 mt-6"
              >
                Next
              </button>

              {/* Terms */}
              <div className="text-xs text-gray-500 mt-4">
                By clicking Sign Up, you agree to our{' '}
                <div className="text-blue-600 hover:underline">Terms</div>,{' '}
                <div className="text-blue-600 hover:underline">Data Policy</div> and{' '}
                <div className="text-blue-600 hover:underline">Cookie Policy</div>.
                You may receive SMS notifications from us and can opt out at any time.
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Birthday Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Birthday <Calendar className="w-4 h-4 inline ml-1" />
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative">
                    <select
                      name="birthday.month"
                      value={formData.birthday.month}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="">Month</option>
                      {months.map((month, index) => (
                        <option key={month} value={index + 1}>{month}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      name="birthday.day"
                      value={formData.birthday.day}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="">Day</option>
                      {Array.from({length: 31}, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      name="birthday.year"
                      value={formData.birthday.year}
                      onChange={handleChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="">Year</option>
                      {Array.from({length: 100}, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                {errors.birthday && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.birthday}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  This won't be part of your public profile. Learn more about why we ask for your birthday.
                </p>
              </div>

              {/* Gender Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Female', 'Male', 'Custom'].map((gender) => (
                    <label key={gender} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`border-2 rounded-lg p-3 text-center transition-all ${
                        formData.gender === gender
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <span className="text-sm font-medium">{gender}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.gender}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Already have account */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-medium">
                Log In
              </a>
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <div className="text-sm text-blue-800">
              <div className="font-medium">Your privacy matters</div>
              <div>We use your information to help create a better experience for you. Learn more in our{' '}
                <div className="underline hover:no-underline">Data Policy</div>.
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-800 mb-3">What you'll get:</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500" />
              <span>Connect with friends and family</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500" />
              <span>Share photos and videos</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500" />
              <span>Stay updated with news and events</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500" />
              <span>Join communities and groups</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;