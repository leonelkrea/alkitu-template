'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  loading?: boolean;
  showItemsPerPage?: boolean;
  showFirstLast?: boolean;
  showPageInfo?: boolean;
  className?: string;
  disabled?: boolean;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  loading = false,
  showItemsPerPage = true,
  showFirstLast = true,
  showPageInfo = true,
  className,
  disabled = false,
}: PaginationProps) {
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsChanging(true);
    } else {
      const timer = setTimeout(() => setIsChanging(false), 150);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handlePageChange = (page: number) => {
    if (page === currentPage || disabled || loading) return;
    setIsChanging(true);
    onPageChange(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    if (disabled || loading || !onItemsPerPageChange) return;
    setIsChanging(true);
    onItemsPerPageChange(parseInt(value));
  };

  // Generate page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage <= delta + 3) {
        // Current page is near the beginning
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('ellipsis');
        }
      } else if (currentPage >= totalPages - delta - 2) {
        // Current page is near the end
        if (totalPages > 5) {
          pages.push('ellipsis');
        }
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages - 1; i++) {
          pages.push(i);
        }
      } else {
        // Current page is in the middle
        pages.push('ellipsis');
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
      }
      
      // Always show last page (if more than 1 page)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={cn(
      'flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4',
      className
    )}>
      {/* Items per page selector */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Items per page:</p>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
            disabled={disabled || loading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="top">
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Page info */}
      {showPageInfo && totalItems > 0 && (
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {isChanging && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          <span>
            Showing {startItem} to {endItem} of {totalItems} results
          </span>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-1">
          {/* First page */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1 || disabled || loading}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
          )}

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || disabled || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {visiblePages.map((page, index) => (
              page === 'ellipsis' ? (
                <div key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  disabled={disabled || loading}
                  className="h-8 w-8 p-0"
                >
                  {page}
                </Button>
              )
            ))}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || disabled || loading}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>

          {/* Last page */}
          {showFirstLast && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || disabled || loading}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for pagination state management
export function usePagination(initialItemsPerPage = 20) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const resetToFirstPage = () => setCurrentPage(1);

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage: handleItemsPerPageChange,
    resetToFirstPage,
  };
}
