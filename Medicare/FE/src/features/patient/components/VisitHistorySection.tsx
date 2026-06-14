import React from 'react';
import { VisitRecord, LabResult } from '../types';
import VisitRecordCard from './VisitRecordCard';
import HealthRecordsEmptyState from './HealthRecordsEmptyState';

interface VisitHistorySectionProps {
  visits: VisitRecord[];
  labResults: LabResult[];
  onViewLabs?: (visitId: string) => void;
}

const VisitHistorySection: React.FC<VisitHistorySectionProps> = ({
  visits,
  labResults,
  onViewLabs,
}) => {
  if (visits.length === 0) {
    return <HealthRecordsEmptyState tab="visits" />;
  }

  return (
    <div className="space-y-4">
      {visits.map((visit) => (
        <VisitRecordCard
          key={visit.id}
          visit={visit}
          relatedLabs={labResults.filter((lab) => lab.visitId === visit.id)}
          onViewLabs={onViewLabs ? () => onViewLabs(visit.id) : undefined}
        />
      ))}
    </div>
  );
};

export default VisitHistorySection;
