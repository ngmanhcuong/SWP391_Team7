import React, { useMemo, useState } from 'react';
import { Download, Eye, EyeOff, RefreshCw, SlidersHorizontal, Star } from 'lucide-react';
import { Avatar, Card } from '../../components/ui';
import Button from '../../components/ui/Button';
import { ReviewRatingFilter, useAdminReviews } from '../../features/admin/hooks';
import { SectionStatCard } from './AdminDoctorsPage';

const selectClass =
  'px-3 py-2 text-sm border rounded-lg outline-none bg-white text-gray-700 border-gray-200 focus:border-[#1a56db] focus:ring-2 focus:ring-[#1a56db]/10 transition-all';

const PAGE_SIZE = 10;

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <span className="inline-flex items-center gap-0.5">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={index < rating ? 'text-amber-400' : 'text-gray-300'}
        fill={index < rating ? '#fbbf24' : 'none'}
      />
    ))}
  </span>
);

export const AdminFeedbackPage: React.FC = () => {
  const {
    reviews,
    stats,
    total,
    departments,
    department,
    setDepartment,
    rating,
    setRating,
    date,
    setDate,
    setReviewStatus,
    refreshReviews,
    resetFilters,
  } = useAdminReviews();

  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return reviews.slice(start, start + PAGE_SIZE);
  }, [page, reviews]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="mb-1 text-2xl font-bold text-[#1a56db]" style={{ fontFamily: 'Lexend' }}>
            Quản lý đánh giá từ bệnh nhân
          </h1>
          <p className="text-gray-500 dark:text-slate-400">
            Theo dõi và quản lý phản hồi thực tế của bệnh nhân từ dữ liệu đang lưu trong hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Download size={16} />}>
            Xuất báo cáo
          </Button>
          <Button leftIcon={<RefreshCw size={16} />} onClick={() => refreshReviews()}>
            Làm mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <SectionStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <Card padding="sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600">
            <SlidersHorizontal size={16} />
            Bộ lọc:
          </span>

          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">Tất cả khoa</option>
            {departments.map((item: string) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={rating}
            onChange={(event) => {
              setRating(
                event.target.value === 'all' ? 'all' : (Number(event.target.value) as ReviewRatingFilter),
              );
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="all">Tất cả số sao</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} sao
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
            className={selectClass}
          />

          <button
            type="button"
            onClick={() => {
              resetFilters();
              setPage(1);
            }}
            className="ml-auto text-sm font-medium text-[#1a56db] hover:underline"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500 dark:border-slate-700 dark:text-slate-400">
                <th className="px-5 py-3 font-medium">Bệnh nhân</th>
                <th className="px-5 py-3 font-medium">Bác sĩ / Khoa</th>
                <th className="px-5 py-3 font-medium">Đánh giá</th>
                <th className="px-5 py-3 font-medium">Nội dung</th>
                <th className="px-5 py-3 font-medium">Ngày</th>
                <th className="px-5 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {pageItems.map((review) => (
                <tr key={review.id} className="align-top hover:bg-gray-50/60 dark:hover:bg-slate-700/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={review.anonymous ? 'Ẩn danh' : review.patientName} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-800 dark:text-slate-100">
                          {review.patientName}
                        </p>
                        <p className="truncate text-xs text-gray-400">{review.patientCode}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-700 dark:text-slate-200">{review.doctorName}</p>
                    <p className="text-xs text-gray-400">{review.department}</p>
                  </td>

                  <td className="px-5 py-4">
                    <StarRating rating={review.rating} />
                  </td>

                  <td className="max-w-xs px-5 py-4">
                    <p
                      className={`line-clamp-2 ${
                        review.flagged ? 'font-medium text-red-500' : 'text-gray-600 dark:text-slate-300'
                      } ${review.status === 'hidden' ? 'opacity-60' : ''}`}
                    >
                      {review.content}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-4 text-gray-500 dark:text-slate-400">
                    {review.date}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-blue-50 hover:text-[#1a56db]"
                      >
                        <Eye size={16} />
                      </button>

                      {review.status === 'hidden' ? (
                        <button
                          type="button"
                          onClick={() => setReviewStatus(review.id, 'visible')}
                          title="Hiện lại"
                          className="rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                        >
                          <EyeOff size={16} />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setReviewStatus(review.id, 'hidden')}
                          title="Ẩn đánh giá"
                          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                        >
                          <EyeOff size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pageItems.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">Không có đánh giá phù hợp.</div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 p-4 dark:border-slate-700">
          <p className="text-sm text-gray-500">
            Hiển thị {pageItems.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} - {(page - 1) * PAGE_SIZE + pageItems.length} của {total.toLocaleString('vi-VN')} đánh giá
          </p>
          <CompactPagination currentPage={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </Card>
    </div>
  );
};

interface CompactPaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export const CompactPagination: React.FC<CompactPaginationProps> = ({ currentPage, totalPages, onChange }) => {
  const pages: (number | 'ellipsis')[] = [];
  const head = [1, 2, 3].filter((value) => value <= totalPages);
  pages.push(...head);
  if (totalPages > 4) pages.push('ellipsis');
  if (totalPages > 3) pages.push(totalPages);

  const cellClass = (active: boolean) =>
    `min-w-[34px] h-[34px] rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-[#1a56db] text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onChange(currentPage - 1)}
        className="h-[34px] rounded-lg px-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
      >
        ‹
      </button>

      {pages.map((value, index) =>
        value === 'ellipsis' ? (
          <span key={`e-${index}`} className="px-1 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={cellClass(value === currentPage)}
          >
            {value}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onChange(currentPage + 1)}
        className="h-[34px] rounded-lg px-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
};

export default AdminFeedbackPage;
