'use client';

import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminHeaderProps {
  user: User;
  onLogout: () => void;
}

export default function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#a08efe] to-[#7a66ff] flex items-center justify-center text-white font-bold text-lg">
              BE
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">Beyond Estates Admin</h1>
              <p className="text-sm text-gray-500">Property Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name || user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-3 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                View Site
              </Link>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


