// src/components/FilterChips.tsx

import React from 'react';
import Chip from './Chip';

interface FilterChipsProps {
 
  selectedRole: string;
  selectedStatus: string;
  selectedUser: string;
  dateRange: string;
  onRemoveFilter: (filter: string) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({

  selectedRole,
  selectedStatus,
  selectedUser,
  dateRange,
  onRemoveFilter,
}) => {
  return (
    <div className="flex flex-wrap ">
    
      {dateRange && (
        <Chip label={`Date: ${dateRange}`} onDelete={() => onRemoveFilter('Date')} icon={'Calendar'} />
      )}
      {selectedRole && (
        <Chip label={`Role: ${selectedRole}`} onDelete={() => onRemoveFilter('Role')} icon={'User'} />
      )}
       {selectedStatus && (
        <Chip label={`Status: ${selectedStatus}`} onDelete={() => onRemoveFilter('Status')} icon={'Check'} />
      )}
       {selectedUser && (
        <Chip label={`User: ${selectedUser}`} onDelete={() => onRemoveFilter('User')} icon={'User'} />
      )}
    </div>
  );
};

export default FilterChips;

