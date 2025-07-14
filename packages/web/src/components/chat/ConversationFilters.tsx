import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConversationStatus } from '@prisma/client';

interface ConversationFiltersProps {
  onApplyFilters: (filters: any) => void;
}

export function ConversationFilters({ onApplyFilters }: ConversationFiltersProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ConversationStatus | '' | undefined>(undefined);

  const handleApply = () => {
    onApplyFilters({
      search: search || undefined,
      status: status || undefined,
    });
  };

  return (
    <div className="flex space-x-4 mb-6">
      <Input
        placeholder="Search by email, name, or content..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1"
      />
      <Select onValueChange={(value: ConversationStatus | '') => setStatus(value === '' ? undefined : value)} value={status || ''}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          {Object.values(ConversationStatus).map(s => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={handleApply}>Apply Filters</Button>
    </div>
  );
}
