// src/components/FilterChips.tsx

import React from 'react';
import Chip from './Chip';

interface FilterChipsProps {
 
  selectedLocation: string;
  selectedIndustry: string;
  selectedClientType: string;
  selectedOrientation: string;
  selectedStatus: string;
  selectedBillboardType: string;
  dateRange: string;
  onRemoveFilter: (filter: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({

  selectedLocation,
  selectedIndustry,
  selectedClientType,
  selectedOrientation,
  selectedStatus,
  selectedBillboardType,
  dateRange,
  onRemoveFilter,
}) => {
  return (
    <div className="flex flex-wrap ">
    
      {dateRange && (
        <Chip label={`Date: ${dateRange}`} onDelete={() => onRemoveFilter('Date')} icon={'Calendar'} />
      )}
      {selectedLocation && (
        <Chip label={`Location: ${selectedLocation}`} onDelete={() => onRemoveFilter('Location')} icon={'User'} />
      )}
       {selectedIndustry && (
        <Chip label={`Industry: ${selectedIndustry}`} onDelete={() => onRemoveFilter('Industry')} icon={'Check'} />
      )}
       {selectedClientType && (
        <Chip label={`Client Type: ${selectedClientType}`} onDelete={() => onRemoveFilter('ClientType')} icon={'User'} />
      )}
       {selectedBillboardType && (
        <Chip label={`Billboard Type: ${selectedBillboardType}`} onDelete={() => onRemoveFilter('BillboardType')} icon={'User'} />
      )}
       {selectedOrientation && (
        <Chip label={`Orientation: ${selectedOrientation}`} onDelete={() => onRemoveFilter('Orientation')} icon={'User'} />
      )}
       {selectedStatus && (
        <Chip label={`Status: ${selectedStatus}`} onDelete={() => onRemoveFilter('Status')} icon={'User'} />
      )}
    </div>
  );
};

export default FilterChips;

