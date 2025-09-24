import { Navbar } from '../components/Navbar';
import { Feed } from '../components/Feed';
import { 
  Search, 
  Play, 
  Users, 
  MoreHorizontal,
  Calendar,
  Clock,
  Bookmark,
  ChevronDown,
  Gift
} from 'lucide-react';

const SidebarLeft = () => {
  const menuItems = [
    { icon: <div className="w-9 h-9 bg-blue-600 rounded-full"></div>, label: 'John Doe', isProfile: true },
    { icon: <Play className="w-5 h-5 text-red-600" />, label: 'Watch' },
    { icon: <Calendar className="w-5 h-5 text-blue-600" />, label: 'Events' },
    { icon: <Users className="w-5 h-5 text-blue-600" />, label: 'Friends' },
    { icon: <Clock className="w-5 h-5 text-blue-600" />, label: 'Memories' },
    { icon: <Bookmark className="w-5 h-5 text-purple-600" />, label: 'Saved' },
    { icon: <ChevronDown className="w-5 h-5 text-gray-600" />, label: 'See More' }
  ];

  const shortcuts = [
    'React Developers Community',
    'Web Development Tips',
    'JavaScript Masters',
    'Design Inspiration'
  ];

  return (
    <div className="fixed left-0 top-14 w-80 h-screen bg-white pt-4 overflow-y-auto hidden lg:block">
      <div className="px-4 space-y-2">
        {menuItems.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            {item.isProfile ? item.icon : (
              <div className="flex items-center justify-center w-9 h-9 bg-gray-100 rounded-lg">
                {item.icon}
              </div>
            )}
            <span className="text-gray-800 font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-semibold">Your Shortcuts</h3>
        </div>
        <div className="space-y-2">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
              <span className="text-gray-800">{shortcut}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};





const SidebarRight = () => {
  const birthdays = [
    { name: 'Alice Johnson', avatar: 'bg-pink-400' },
    { name: 'Bob Smith', avatar: 'bg-green-400' }
  ];

  const contacts = [
    { name: 'Emma Wilson', online: true, avatar: 'bg-purple-400' },
    { name: 'Mike Chen', online: true, avatar: 'bg-blue-400' },
    { name: 'Sarah Davis', online: false, avatar: 'bg-red-400' },
    { name: 'Alex Kim', online: true, avatar: 'bg-yellow-400' },
    { name: 'Lisa Garcia', online: false, avatar: 'bg-indigo-400' },
    { name: 'Tom Wilson', online: true, avatar: 'bg-green-400' },
    { name: 'Jenny Park', online: false, avatar: 'bg-pink-400' },
    { name: 'Chris Lee', online: true, avatar: 'bg-orange-400' }
  ];

  return (
    <div className="fixed right-0 top-14 w-80 h-screen bg-white pt-4 overflow-y-auto hidden xl:block">
      {/* Sponsored */}
      <div className="px-4 mb-6">
        <h3 className="text-gray-600 font-semibold mb-3">Sponsored</h3>
        <div className="space-y-3">
          <div className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex-shrink-0"></div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-900">Learn React Development</h4>
              <p className="text-xs text-gray-500">reactcourse.com</p>
              <p className="text-xs text-gray-600 mt-1">Master React with hands-on projects</p>
            </div>
          </div>
          <div className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex-shrink-0"></div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-gray-900">Web Design Tools</h4>
              <p className="text-xs text-gray-500">designtools.io</p>
              <p className="text-xs text-gray-600 mt-1">Professional design made simple</p>
            </div>
          </div>
        </div>
      </div>

      {/* Birthdays */}
      <div className="px-4 mb-6">
        <h3 className="text-gray-600 font-semibold mb-3">Birthdays</h3>
        <div className="space-y-2">
          {birthdays.map((person, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <Gift className="w-5 h-5 text-pink-500" />
              <span className="text-sm text-gray-700">
                <strong>{person.name}</strong> and 2 others have birthdays today
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contacts */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-600 font-semibold">Contacts</h3>
          <div className="flex space-x-2">
            <Search className="w-4 h-4 text-gray-500 cursor-pointer" />
            <MoreHorizontal className="w-4 h-4 text-gray-500 cursor-pointer" />
          </div>
        </div>
        <div className="space-y-2">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="relative">
                <div className={`w-8 h-8 ${contact.avatar} rounded-full`}></div>
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm text-gray-800">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const LandingPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <SidebarLeft />
      <Feed />
      <SidebarRight />
    </div>
  );
};

export default LandingPage;