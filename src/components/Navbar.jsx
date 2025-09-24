import { 
  Home, 
  Search, 
  Bell, 
  MessageCircle, 
  Play, 
  ShoppingBag, 
  Users, 
  Menu,} from 'lucide-react';
export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left section */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold text-blue-600">facebook</div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Facebook"
                className="bg-gray-100 rounded-full pl-10 pr-4 py-2 w-60 text-sm focus:outline-none focus:bg-white focus:shadow-sm"
              />
            </div>
          </div>

          {/* Center navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Home className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Play className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 cursor-pointer">
              <ShoppingBag className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg hover:bg-gray-100 cursor-pointer">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2">
              <div className="bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200">
                <Menu className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200">
                <MessageCircle className="w-4 h-4 text-gray-700" />
              </div>
              <div className="bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200 relative">
                <Bell className="w-4 h-4 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </div>
            </div>
            <div className="w-8 h-8 bg-blue-600 rounded-full cursor-pointer"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};
