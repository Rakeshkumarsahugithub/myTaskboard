'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Dashboard from '@/components/Dashboard';
import TaskBoard from '@/components/TaskBoard';

export default function Home() {
  const { user, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication forms if user is not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">TaskBoard</h1>
            <p className="text-gray-600">Organize your life, one task at a time</p>
          </div>
          
          {showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
          )}
        </div>
      </div>
    );
  }

  // Show task board if a board is selected
  if (selectedBoard) {
    return (
      <TaskBoard 
        board={selectedBoard} 
        onBack={() => setSelectedBoard(null)} 
      />
    );
  }

  // Show dashboard with all boards
  return (
    <Dashboard onBoardSelect={setSelectedBoard} />
  );
}
