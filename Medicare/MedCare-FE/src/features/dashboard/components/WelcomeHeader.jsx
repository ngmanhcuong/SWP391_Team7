import { Calendar } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

const getGreetingName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return parts[0] || 'bạn';
  return parts.slice(-2).join(' ');
};

const WelcomeHeader = ({ welcome }) => {
  const { user } = useAuth();

  if (!welcome) return null;

  const greetingName = getGreetingName(user?.fullName);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
          Chào buổi sáng, {greetingName}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{welcome.subtitle}</p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-sm">
        <Calendar className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-gray-800">{welcome.date}</span>
      </div>
    </div>
  );
};

export default WelcomeHeader;
