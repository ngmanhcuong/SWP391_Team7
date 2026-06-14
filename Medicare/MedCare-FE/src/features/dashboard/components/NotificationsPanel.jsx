import { Button } from '../../../components/ui';

const NotificationsPanel = ({ notifications = [] }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
          Thông báo mới
        </h3>
      </div>

      <div className="space-y-3 p-4">
        {notifications.map(({ id, title, time, icon: Icon, iconBg, highlight }) => (
          <div
            key={id}
            className={`flex gap-3 rounded-xl p-3 ${highlight ? 'bg-blue-50' : 'bg-gray-50'}`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
              <Icon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm leading-5 text-gray-900">{title}</p>
              <p className="mt-1 text-xs text-gray-500">{time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-4">
        <Button variant="outline" className="w-full">
          Đánh dấu tất cả đã đọc
        </Button>
      </div>
    </section>
  );
};

export default NotificationsPanel;
