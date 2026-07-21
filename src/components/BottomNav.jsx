import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, CircleUserRound, Search } from 'lucide-react';
import { cn } from '../utils/cn';
import { useAuthStore } from '../store/useAuthStore';

export function BottomNav() {
  const { token } = useAuthStore();
  const location = useLocation();

  const tabs = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Explore', icon: Compass, path: '/category/all' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Orders', icon: ShoppingBag, path: '/my-orders' },
    { name: 'Profile', icon: CircleUserRound, path: token ? '/dashboard' : '/login' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-brand-orange backdrop-blur-lg rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.2)] pb-safe z-50 transition-all">
      <div className="flex justify-around items-center h-[72px] px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.name === 'Explore'
            ? location.pathname.startsWith('/category')
            : tab.name === 'Profile'
            ? location.pathname === '/profile' || location.pathname === '/dashboard' || location.pathname === '/my-addresses'
            : location.pathname === tab.path || (tab.name === 'Orders' && location.pathname.startsWith('/my-orders'));

          return (
            <NavLink key={tab.name} to={tab.path}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full space-y-1.5 transition-all duration-300 relative',
                isActive ? 'text-white -translate-y-1' : 'text-white/70 hover:text-white'
              )}>
              <div className={cn(
                "p-1.5 rounded-full transition-all duration-300", 
                isActive ? "bg-white text-brand-orange shadow-sm" : "bg-transparent"
              )}>
                <Icon className={cn('w-5 h-5 transition-transform duration-300', isActive ? 'scale-110' : '')} strokeWidth={isActive ? 2.5 : 1.5} />
              </div>
              <span className={cn(
                "text-[10px] font-bold transition-all duration-300",
                isActive ? "opacity-100" : "opacity-80"
              )}>{tab.name}</span>
              {isActive && (
                <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full"></div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
