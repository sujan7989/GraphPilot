import { Link, useLocation } from 'react-router-dom';
import { Activity, Network, AlertTriangle, MessageSquare, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/explorer', label: 'Graph Explorer', icon: Network },
    { path: '/impact', label: 'Impact Analysis', icon: Activity },
    { path: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { path: '/assistant', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <nav className="bg-white border-b border-[#e5e5e5] sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] p-2 rounded-lg">
              <Network className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#171717] tracking-tight">GraphPilot</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          {/* Mobile menu button - could be expanded later */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-[#f5f5f5]">
              <Network className="h-5 w-5 text-[#525252]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
