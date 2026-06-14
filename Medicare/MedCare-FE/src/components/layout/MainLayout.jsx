import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import FloatingChatButton from './FloatingChatButton';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <Header />
      <main className="ml-64 min-h-screen pt-16">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      <FloatingChatButton />
    </div>
  );
};

export default MainLayout;
