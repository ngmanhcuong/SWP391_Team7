import { Badge } from '../../../components/ui';

const StatCards = ({ stats = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ id, label, value, trend, trendType, icon: Icon, iconBg }) => (
        <div
          key={id}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
            <Badge variant={trendType}>{trend}</Badge>
          </div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
          <p
            className="mt-1 text-2xl font-bold text-blue-700 sm:text-3xl"
            style={{ fontFamily: 'Lexend' }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
