import { Activity } from 'lucide-react';
import { Button } from '../../../components/ui';

const HealthReport = ({ report }) => {
  if (!report) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-[#1a56db] p-6 shadow-lg">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />

      <div className="relative space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Lexend' }}>
              {report.title}
            </h3>
            <p className="text-sm text-blue-100">{report.subtitle}</p>
          </div>
          <Activity className="h-6 w-6 text-blue-200" />
        </div>

        <div className="space-y-4">
          {report.metrics.map((metric) => (
            <div key={metric.label}>
              <div className="mb-2 flex items-end justify-between">
                <span className="text-sm text-blue-100">{metric.label}</span>
                <span className="text-sm font-medium text-white">{metric.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/20">
                <div
                  className="h-1.5 rounded-full bg-emerald-400"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <Button variant="secondary" className="w-full border-0">
          Tải xuống báo cáo chi tiết
        </Button>
      </div>
    </section>
  );
};

export default HealthReport;
