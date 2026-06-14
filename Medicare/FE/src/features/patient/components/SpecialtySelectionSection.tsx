import React, { useMemo } from 'react';
import { MEDICAL_SPECIALTIES } from '../constants/medicalSpecialties';
import { AiSymptomAnalysis } from '../types';
import SpecialtyCard from './SpecialtyCard';

interface SpecialtySelectionSectionProps {
  selectedSpecialtyId: string | null;
  aiAnalysis: AiSymptomAnalysis | null;
  onSelect: (specialtyId: string) => void;
}

const SpecialtySelectionSection: React.FC<SpecialtySelectionSectionProps> = ({
  selectedSpecialtyId,
  aiAnalysis,
  onSelect,
}) => {
  const recommendedNames = useMemo(() => {
    const names = new Set<string>();
    if (aiAnalysis?.suggestedSpecialty) names.add(aiAnalysis.suggestedSpecialty);
    if (aiAnalysis?.alternativeSpecialty) names.add(aiAnalysis.alternativeSpecialty);
    return names;
  }, [aiAnalysis]);

  const sortedSpecialties = useMemo(
    () =>
      [...MEDICAL_SPECIALTIES].sort((a, b) => {
        const aRecommended = recommendedNames.has(a.name) ? 0 : 1;
        const bRecommended = recommendedNames.has(b.name) ? 0 : 1;
        return aRecommended - bRecommended;
      }),
    [recommendedNames],
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-2">
      {sortedSpecialties.map((specialty) => (
        <SpecialtyCard
          key={specialty.id}
          specialty={specialty}
          isSelected={selectedSpecialtyId === specialty.id}
          isRecommended={recommendedNames.has(specialty.name)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default SpecialtySelectionSection;
