import React, { useState } from 'react';
import Typography from '../atoms/Typography';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import Avatar from '../atoms/Avatar';
import Chip from '../atoms/Chip';
import FormFieldMobile from '../molecules/FormFieldMobile';
import IconButtonMobile from '../molecules/IconButtonMobile';
import Card from '../molecules/Card';

// Simplified types for mobile
export interface TableMobileColumn {
  key: string;
  title: string;
  dataIndex?: string;
  render?: 'text' | 'badge' | 'avatar' | 'chip' | 'date' | 'number' | 'custom';
  renderConfig?: any;
  renderCustom?: (value: any, record: any, index: number) => React.ReactNode;
  primary?: boolean; // Mark as primary field for mobile
  secondary?: boolean; // Mark as secondary field for mobile
  hidden?: boolean; // Hide on mobile
}

export interface TableMobileAction {
  key: string;
  label: string;
  icon: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  onClick: (record: any, index: number) => void;
  disabled?: boolean | ((record: any) => boolean);
  hidden?: boolean | ((record: any) => boolean);
}

export interface TableMobileProps {
  data: any[];
  columns: TableMobileColumn[];
  loading?: boolean;
  selectable?: boolean;
  actions?: TableMobileAction[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    showLoadMore?: boolean;
  };
  filters?: {
    searchPlaceholder?: string;
    searchFields?: string[];
    quickFilters?: Array<{
      key: string;
      label: string;
      options: Array<{ value: string; label: string }>;
    }>;
  };
  onSearch?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSelect?: (selectedKeys: string[], selectedRecords: any[]) => void;
  onLoadMore?: () => void;
  onRowClick?: (record: any, index: number) => void;
  className?: string;
}

const TableMobile: React.FC<TableMobileProps> = ({
  data,
  columns,
  loading = false,
  selectable = false,
  actions = [],
  pagination,
  filters,
  onSearch,
  onFilter,
  onSelect,
  onLoadMore,
  onRowClick,
  className = ''
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  // Get primary columns (main display fields)
  const primaryColumns = columns.filter(col => col.primary && !col.hidden);
  const secondaryColumns = columns.filter(col => col.secondary && !col.hidden);
  const visibleColumns = columns.filter(col => !col.hidden);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    if (!value) {
      delete newFilters[filterKey];
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const key = index.toString();
    const newSelectedKeys = checked 
      ? [...selectedKeys, key]
      : selectedKeys.filter(k => k !== key);
    
    setSelectedKeys(newSelectedKeys);
    
    if (onSelect) {
      const selectedRecords = newSelectedKeys.map(k => data[parseInt(k)]).filter(Boolean);
      onSelect(newSelectedKeys, selectedRecords);
    }
  };

  const renderCellValue = (column: TableMobileColumn, value: any, record: any, index: number) => {
    if (column.renderCustom) {
      return column.renderCustom(value, record, index);
    }

    switch (column.render) {
      case 'badge':
        return (
          <Badge variant={column.renderConfig?.variant || 'neutral'} size="sm">
            {value}
          </Badge>
        );
      
      case 'avatar':
        return (
          <Avatar
            src={value}
            fallback={record[column.renderConfig?.fallbackField || 'name']}
            size="sm"
          />
        );
      
      case 'chip':
        return (
          <Chip
            variant={column.renderConfig?.variant || 'filled'}
            color={column.renderConfig?.color || 'neutral'}
            size="sm"
          >
            {value}
          </Chip>
        );
      
      case 'date':
        return (
          <Typography variant="p" size="sm" color="muted">
            {new Date(value).toLocaleDateString('es-ES')}
          </Typography>
        );
      
      case 'number':
        return (
          <Typography variant="p" size="sm" weight="medium">
            {typeof value === 'number' ? value.toLocaleString('es-ES') : value}
          </Typography>
        );
      
      default:
        return (
          <Typography variant="p" size="sm">
            {value}
          </Typography>
        );
    }
  };

  const getVisibleActions = (record: any) => {
    return actions.filter(action => {
      if (typeof action.hidden === 'function') {
        return !action.hidden(record);
      }
      return !action.hidden;
    });
  };

  const isActionDisabled = (action: TableMobileAction, record: any) => {
    if (typeof action.disabled === 'function') {
      return action.disabled(record);
    }
    return action.disabled;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filters */}
      {filters && (
        <div className="space-y-3">
          {filters.searchPlaceholder && (
            <FormFieldMobile
              label=""
              placeholder={filters.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          )}
          
          {filters.quickFilters && (
            <div className="space-y-2">
              {filters.quickFilters.map((filter) => (
                <div key={filter.key}>
                  <Typography variant="p" size="sm" weight="medium" className="mb-1">
                    {filter.label}
                  </Typography>
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-base min-h-11"
                  >
                    <option value="">Todos</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected items actions */}
      {selectable && selectedKeys.length > 0 && (
        <div className="bg-accent/30 border border-border rounded-lg p-3">
          <div className="flex items-center justify-between">
            <Typography variant="p" size="sm" weight="medium">
              {selectedKeys.length} seleccionado{selectedKeys.length !== 1 ? 's' : ''}
            </Typography>
            <div className="flex space-x-2">
              <IconButtonMobile
                icon="Download"
                size="sm"
                variant="outline"
                label="Exportar"
                showLabel={false}
              />
              <IconButtonMobile
                icon="Trash2"
                size="sm"
                variant="destructive"
                label="Eliminar"
                showLabel={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Cards List */}
      <div className="space-y-3">
        {data.map((record, index) => (
          <Card
            key={index}
            variant="vertical"
            title=""
            onClick={() => onRowClick?.(record, index)}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="p-4 space-y-3">
              {/* Selection checkbox */}
              {selectable && (
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`select-${index}`}
                    checked={selectedKeys.includes(index.toString())}
                    onChange={(e) => handleSelectRow(index, e.target.checked)}
                    className="h-5 w-5 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor={`select-${index}`} className="ml-2 text-sm text-muted-foreground">
                    Seleccionar
                  </label>
                </div>
              )}

              {/* Primary Information */}
              <div className="space-y-2">
                {primaryColumns.map((column) => {
                  const value = record[column.dataIndex || column.key];
                  return (
                    <div key={column.key} className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <Typography variant="p" size="xs" color="muted" className="mb-1">
                          {column.title}
                        </Typography>
                        {renderCellValue(column, value, record, index)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secondary Information */}
              {secondaryColumns.length > 0 && (
                <div className="border-t border-border pt-3 space-y-2">
                  {secondaryColumns.map((column) => {
                    const value = record[column.dataIndex || column.key];
                    return (
                      <div key={column.key} className="flex items-center justify-between">
                        <Typography variant="p" size="xs" color="muted">
                          {column.title}:
                        </Typography>
                        <div className="ml-2">
                          {renderCellValue(column, value, record, index)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              {getVisibleActions(record).length > 0 && (
                <div className="border-t border-border pt-3 flex flex-wrap gap-2">
                  {getVisibleActions(record).map((action) => (
                    <Button
                      key={action.key}
                      variant={action.variant || 'outline'}
                      size="sm"
                      icon={action.icon as any}
                      disabled={isActionDisabled(action, record)}
                      onClick={(e) => {
                        e.stopPropagation();
                        action.onClick(record, index);
                      }}
                      className="touch-manipulation"
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Load More / Pagination */}
      {pagination && (
        <div className="text-center py-4">
          {pagination.showLoadMore && onLoadMore ? (
            <Button
              variant="outline"
              size="lg"
              onClick={onLoadMore}
              disabled={loading}
              loading={loading}
              className="w-full touch-manipulation"
            >
              Cargar más
            </Button>
          ) : (
            <div className="space-y-2">
              <Typography variant="p" size="sm" color="muted">
                Página {pagination.page} de {Math.ceil(pagination.total / pagination.pageSize)}
              </Typography>
              <Typography variant="p" size="xs" color="muted">
                {pagination.total} elementos en total
              </Typography>
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <Typography variant="p" size="sm" color="muted">
              Cargando...
            </Typography>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && data.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Database" size="lg" color="muted" />
          </div>
          <Typography variant="h3" weight="medium" className="mb-2">
            No hay datos
          </Typography>
          <Typography variant="p" color="muted">
            No se encontraron elementos para mostrar
          </Typography>
        </div>
      )}
    </div>
  );
};

export default TableMobile;