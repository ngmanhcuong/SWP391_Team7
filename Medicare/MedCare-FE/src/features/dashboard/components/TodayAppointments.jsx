import { Calendar, Stethoscope, FlaskConical, MoreVertical } from 'lucide-react';
import { Badge, Button } from '../../../components/ui';

const typeIcons = {
  checkup: Stethoscope,
  lab: FlaskConical,
  consult: Calendar,
};

const TodayAppointments = ({ appointments = [] }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
          Lịch hẹn hôm nay
        </h3>
        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Xem tất cả
        </button>
      </div>

      <div>
        {appointments.map((item, index) => {
          const Icon = typeIcons[item.type] || Calendar;

          return (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-6 py-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <Icon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500">{item.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.statusType}>{item.status}</Badge>
                <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TodayAppointments;
