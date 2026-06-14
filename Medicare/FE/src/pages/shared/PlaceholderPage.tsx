import React from 'react';
import { Card } from '../../components/ui';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => (
  <div className="max-w-3xl">
    <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Lexend' }}>{title}</h1>
    <p className="text-gray-500 dark:text-slate-400 mb-6">{description}</p>
    <Card>
      <p className="text-sm text-gray-600 dark:text-slate-300">
        Trang này đang được phát triển. Nội dung sẽ được bổ sung trong các sprint tiếp theo.
      </p>
    </Card>
  </div>
);

export default PlaceholderPage;
