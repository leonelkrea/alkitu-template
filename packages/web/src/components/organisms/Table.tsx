import React, { useState, useMemo } from 'react';
import Typography from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import Checkbox from '../atoms/Checkbox';
import Avatar from '../atoms/Avatar';
import Chip from '../atoms/Chip';
import FormField from '../molecules/FormField';
import IconButton from '../molecules/IconButton';

// Types for different cell renderers
export interface BaseCellRenderer {
  type: string;
}

export interface TextCellRenderer extends BaseCellRenderer {
  type: 'text';
  variant?: 'p' | 'h1' | 'h2' | 'h3' | 'h4';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'medium' | 'bold' | 'regular';
  color?: 'inherit' | 'primary' | 'muted' | 'error' | 'success' | 'warning';
  truncate?: boolean;
  maxLines?: number;
}

export interface BadgeCellRenderer extends BaseCellRenderer {
  type: 'badge';
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  mapping?: Record<string, { variant: string; label?: string }>;
}

export interface ChipCellRenderer extends BaseCellRenderer {
  type: 'chip';
  variant?: 'filled' | 'outlined';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: (value: any, record: any) => void;
  mapping?: Record<string, { color: string; label?: string }>;
}

export interface AvatarCellRenderer extends BaseCellRenderer {
  type: 'avatar';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'circle' | 'square';
  showName?: boolean;
  showStatus?: boolean;
  fallbackField?: string;
  statusField?: string;
}

export interface ButtonCellRenderer extends BaseCellRenderer {
  type: 'button';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  onClick: (value: any, record: any, index: number) => void;
  disabled?: boolean | ((record: any) => boolean);
  loading?: boolean | ((record: any) => boolean);
  tooltip?: string | ((record: any) => string);
}

export interface IconCellRenderer extends BaseCellRenderer {
  type: 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'inherit' | 'primary' | 'muted' | 'error' | 'success' | 'warning';
  mapping?: Record<string, { icon: string; color?: string; tooltip?: string }>;
  clickable?: boolean;
  onClick?: (value: any, record: any, index: number) => void;
}

export interface LinkCellRenderer extends BaseCellRenderer {
  type: 'link';
  href?: string | ((record: any) => string);
  target?: '_blank' | '_self';
  external?: boolean;
  color?: 'primary' | 'inherit';
  underline?: boolean;
  onClick?: (value: any, record: any, index: number) => void;
}

export interface DateCellRenderer extends BaseCellRenderer {
  type: 'date';
  format?: 'short' | 'medium' | 'long' | 'relative' | 'custom';
  customFormat?: string;
  showTime?: boolean;
  relative?: boolean;
}

export interface NumberCellRenderer extends BaseCellRenderer {
  type: 'number';
  format?: 'decimal' | 'currency' | 'percentage';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  prefix?: string;
  suffix?: string;
}

export interface ProgressCellRenderer extends BaseCellRenderer {
  type: 'progress';
  max?: number;
  showValue?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export interface TagsCellRenderer extends BaseCellRenderer {
  type: 'tags';
  maxVisible?: number;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md';
  colors?: string[];
}

export interface CustomCellRenderer extends BaseCellRenderer {
  type: 'custom';
  render: (value: any, record: any, index: number) => React.ReactNode;
}

export type CellRenderer =
  | TextCellRenderer
  | BadgeCellRenderer
  | ChipCellRenderer
  | AvatarCellRenderer
  | ButtonCellRenderer
  | IconCellRenderer
  | LinkCellRenderer
  | DateCellRenderer
  | NumberCellRenderer
  | ProgressCellRenderer
  | TagsCellRenderer
  | CustomCellRenderer;

export interface TableColumn {
  key: string;
  title: string;
  dataIndex?: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  render?: CellRenderer;
  className?: string;
}

export interface TableAction {
  key: string;
  label: string;
  icon: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  onClick: (record: any, index: number) => void;
  disabled?: boolean | ((record: any) => boolean);
  hidden?: boolean | ((record: any) => boolean);
  tooltip?: string;
}

export interface TableProps {
  data: any[];
  columns: TableColumn[];
  loading?: boolean;
  selectable?: boolean;
  expandable?: {
    expandedRowRender: (record: any, index: number) => React.ReactNode;
    rowExpandable?: (record: any) => boolean;
  };
  actions?: TableAction[];
  rowActions?: {
    items: TableAction[];
    trigger?: 'click' | 'hover' | 'always';
    maxVisible?: number;
  };
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    pageSizeOptions?: number[];
  };
  filters?: {
    searchPlaceholder?: string;
    searchFields?: string[];
    quickFilters?: Array<{
      key: string;
      label: string;
      type?: 'select' | 'multiselect' | 'date' | 'daterange';
      options?: Array<{ value: string; label: string }>;
    }>;
    advancedFilters?: boolean;
  };
  sorting?: {
    defaultSort?: { column: string; direction: 'asc' | 'desc' };
    multiSort?: boolean;
  };
  styling?: {
    size?: 'sm' | 'md' | 'lg';
    bordered?: boolean;
    striped?: boolean;
    hoverable?: boolean;
    compact?: boolean;
  };
  onSort?: (
    column: string,
    direction: 'asc' | 'desc',
    multiSort?: Array<{ column: string; direction: 'asc' | 'desc' }>,
  ) => void;
  onSearch?: (query: string, fields?: string[]) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSelect?: (selectedKeys: string[], selectedRecords: any[]) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onRowClick?: (record: any, index: number) => void;
  onRowDoubleClick?: (record: any, index: number) => void;
  onExpand?: (expanded: boolean, record: any, index: number) => void;
  className?: string;
}

const Table: React.FC<TableProps> = ({
  data,
  columns,
  loading = false,
  selectable = false,
  expandable,
  actions = [],
  rowActions,
  pagination,
  filters,
  sorting,
  styling = { size: 'md', hoverable: true },
  onSort,
  onSearch,
  onFilter,
  onSelect,
  onPageChange,
  onRowClick,
  onRowDoubleClick,
  onExpand,
  className = '',
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string>(
    sorting?.defaultSort?.column || '',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    sorting?.defaultSort?.direction || 'asc',
  );
  const [multiSort, setMultiSort] = useState<
    Array<{ column: string; direction: 'asc' | 'desc' }>
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Cell renderer functions
  const renderCell = (
    column: TableColumn,
    value: any,
    record: any,
    index: number,
  ): React.ReactNode => {
    if (!column.render) {
      return (
        <Typography variant="p" size="sm">
          {value}
        </Typography>
      );
    }

    const renderer = column.render;

    switch (renderer.type) {
      case 'text':
        const textRenderer = renderer as TextCellRenderer;
        const size = textRenderer.size || 'md';
        // Map unsupported color values to allowed ones for Typography
        let color: 'primary' | 'muted' | 'inherit' = 'inherit';
        switch (textRenderer.color) {
          case 'primary':
          case 'muted':
          case 'inherit':
            color = textRenderer.color;
            break;
          default:
            color = 'primary';
        }
        return (
          <Typography
            variant={textRenderer.variant || 'p'}
            size={size}
            weight={textRenderer.weight || 'regular'}
            color={color}
            className={`${textRenderer.truncate ? 'truncate' : ''} ${
              textRenderer.maxLines ? `line-clamp-${textRenderer.maxLines}` : ''
            }`}
          >
            {value}
          </Typography>
        );

      case 'badge':
        const badgeRenderer = renderer as BadgeCellRenderer;
        const badgeConfig = badgeRenderer.mapping?.[value] || {
          variant: badgeRenderer.variant || 'neutral',
        };
        // Map unsupported variant values to allowed ones for Badge
        let badgeVariant:
          | 'primary'
          | 'secondary'
          | 'success'
          | 'warning'
          | 'error'
          | 'neutral' = 'neutral';
        switch (badgeConfig.variant) {
          case 'primary':
          case 'secondary':
          case 'success':
          case 'warning':
          case 'error':
          case 'neutral':
            badgeVariant = badgeConfig.variant;
            break;
          default:
            badgeVariant = 'neutral';
        }
        return (
          <Badge variant={badgeVariant} size={badgeRenderer.size}>
            {badgeConfig.label || value}
          </Badge>
        );

      case 'chip':
        const chipRenderer = renderer as ChipCellRenderer;
        const chipConfig = chipRenderer.mapping?.[value] || {
          color: chipRenderer.color || 'neutral',
        };
        // Normalize variant for Chip
        let normalizedChipVariant: string = chipRenderer.variant as string;
        if (
          normalizedChipVariant === 'filled' ||
          normalizedChipVariant === 'outlined' ||
          !normalizedChipVariant
        ) {
          normalizedChipVariant = 'default';
        }
        let chipVariant:
          | 'default'
          | 'primary'
          | 'secondary'
          | 'success'
          | 'warning'
          | 'error'
          | 'neutral' = 'default';
        switch (normalizedChipVariant) {
          case 'default':
          case 'primary':
          case 'secondary':
          case 'success':
          case 'warning':
          case 'error':
          case 'neutral':
            chipVariant = normalizedChipVariant as typeof chipVariant;
            break;
          default:
            chipVariant = 'default';
        }
        return (
          <Chip
            variant={chipVariant}
            size={chipRenderer.size}
            removable={chipRenderer.removable}
            onRemove={
              chipRenderer.onRemove
                ? () => chipRenderer.onRemove!(value, record)
                : undefined
            }
          >
            {chipConfig.label || value}
          </Chip>
        );

      case 'avatar':
        const avatarRenderer = renderer as AvatarCellRenderer;
        return (
          <div className="flex items-center space-x-2">
            <Avatar
              src={typeof value === 'object' ? value.src : value}
              fallback={record[avatarRenderer.fallbackField || 'name']}
              size={avatarRenderer.size}
              shape={avatarRenderer.shape}
              status={
                avatarRenderer.showStatus
                  ? record[avatarRenderer.statusField || 'status']
                  : undefined
              }
            />
            {avatarRenderer.showName && (
              <Typography variant="p" size="sm">
                {record[avatarRenderer.fallbackField || 'name']}
              </Typography>
            )}
          </div>
        );

      case 'button':
        const buttonRenderer = renderer as ButtonCellRenderer;
        const isDisabled =
          typeof buttonRenderer.disabled === 'function'
            ? buttonRenderer.disabled(record)
            : buttonRenderer.disabled;
        const isLoading =
          typeof buttonRenderer.loading === 'function'
            ? buttonRenderer.loading(record)
            : buttonRenderer.loading;
        const tooltip =
          typeof buttonRenderer.tooltip === 'function'
            ? buttonRenderer.tooltip(record)
            : buttonRenderer.tooltip;

        return (
          <Button
            variant={buttonRenderer.variant}
            size={buttonRenderer.size}
            icon={buttonRenderer.icon as any}
            iconPosition={buttonRenderer.iconPosition}
            disabled={isDisabled}
            loading={isLoading}
            onClick={() => buttonRenderer.onClick(value, record, index)}
            title={tooltip}
          >
            {value}
          </Button>
        );

      case 'icon':
        const iconRenderer = renderer as IconCellRenderer;
        const iconConfig = iconRenderer.mapping?.[value] || {
          icon: value,
          color: iconRenderer.color,
          tooltip: '',
        };

        const IconComponent = (
          <Icon
            name={iconConfig.icon as any}
            size={iconRenderer.size}
            color={(iconConfig.color as any) || iconRenderer.color}
          />
        );

        return iconRenderer.clickable ? (
          <button
            onClick={() => iconRenderer.onClick?.(value, record, index)}
            className="hover:opacity-70 transition-opacity"
          >
            {IconComponent}
          </button>
        ) : (
          IconComponent
        );

      case 'link':
        const linkRenderer = renderer as LinkCellRenderer;
        const href =
          typeof linkRenderer.href === 'function'
            ? linkRenderer.href(record)
            : linkRenderer.href || '#';

        return (
          <a
            href={href}
            target={linkRenderer.target}
            onClick={(e) => {
              if (linkRenderer.onClick) {
                e.preventDefault();
                linkRenderer.onClick(value, record, index);
              }
            }}
            className={`
              transition-colors hover:opacity-70
              ${linkRenderer.color === 'primary' ? 'text-primary' : ''}
              ${linkRenderer.underline ? 'underline' : ''}
            `}
          >
            <Typography variant="p" size="sm">
              {value}
            </Typography>
            {linkRenderer.external && (
              <Icon name="ExternalLink" size="xs" className="ml-1 inline" />
            )}
          </a>
        );

      case 'date':
        const dateRenderer = renderer as DateCellRenderer;
        const date = new Date(value);
        let formattedDate = '';

        switch (dateRenderer.format) {
          case 'short':
            formattedDate = date.toLocaleDateString('es-ES');
            break;
          case 'medium':
            formattedDate = date.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });
            break;
          case 'long':
            formattedDate = date.toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            break;
          case 'relative':
            const now = new Date();
            const diffTime = now.getTime() - date.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) formattedDate = 'Hoy';
            else if (diffDays === 1) formattedDate = 'Ayer';
            else if (diffDays < 7) formattedDate = `Hace ${diffDays} días`;
            else formattedDate = date.toLocaleDateString('es-ES');
            break;
          case 'custom':
            // For custom format, you'd need a date formatting library
            formattedDate = date.toLocaleDateString('es-ES');
            break;
          default:
            formattedDate = date.toLocaleDateString('es-ES');
        }

        if (dateRenderer.showTime) {
          formattedDate +=
            ' ' +
            date.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            });
        }

        return (
          <Typography variant="p" size="sm">
            {formattedDate}
          </Typography>
        );

      case 'number':
        const numberRenderer = renderer as NumberCellRenderer;
        const numValue = parseFloat(value);
        let formattedNumber = '';

        switch (numberRenderer.format) {
          case 'currency':
            formattedNumber = new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: numberRenderer.currency || 'EUR',
              minimumFractionDigits: numberRenderer.minimumFractionDigits,
              maximumFractionDigits: numberRenderer.maximumFractionDigits,
            }).format(numValue);
            break;
          case 'percentage':
            formattedNumber = new Intl.NumberFormat('es-ES', {
              style: 'percent',
              minimumFractionDigits: numberRenderer.minimumFractionDigits,
              maximumFractionDigits: numberRenderer.maximumFractionDigits,
            }).format(numValue / 100);
            break;
          default:
            formattedNumber = new Intl.NumberFormat('es-ES', {
              minimumFractionDigits: numberRenderer.minimumFractionDigits,
              maximumFractionDigits: numberRenderer.maximumFractionDigits,
            }).format(numValue);
        }

        return (
          <Typography variant="p" size="sm">
            {numberRenderer.prefix || ''}
            {formattedNumber}
            {numberRenderer.suffix || ''}
          </Typography>
        );

      case 'progress':
        const progressRenderer = renderer as ProgressCellRenderer;
        const progressValue = parseFloat(value);
        const maxValue = progressRenderer.max || 100;
        const percentage = (progressValue / maxValue) * 100;

        return (
          <div className="flex items-center space-x-2">
            <div
              className={`
              flex-1 bg-neutral-200 rounded-full overflow-hidden
              ${progressRenderer.size === 'sm' ? 'h-1' : 'h-2'}
            `}
            >
              <div
                className={`
                  h-full transition-all duration-300
                  ${
                    progressRenderer.color === 'success'
                      ? 'bg-success'
                      : progressRenderer.color === 'warning'
                        ? 'bg-warning'
                        : progressRenderer.color === 'error'
                          ? 'bg-error'
                          : 'bg-primary'
                  }
                `}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            {progressRenderer.showValue && (
              <Typography
                variant="p"
                size="xs"
                color="muted"
                className="min-w-[3rem] text-right"
              >
                {progressValue}/{maxValue}
              </Typography>
            )}
          </div>
        );

      case 'tags':
        const tagsRenderer = renderer as TagsCellRenderer;
        const tags = Array.isArray(value) ? value : [value];
        const maxVisible = tagsRenderer.maxVisible || 3;
        const visibleTags = tags.slice(0, maxVisible);
        const hiddenCount = tags.length - maxVisible;

        return (
          <div className="flex items-center space-x-1 flex-wrap">
            {visibleTags.map((tag, tagIndex) => {
              const colorIndex = tagIndex % (tagsRenderer.colors?.length || 1);
              const color = tagsRenderer.colors?.[colorIndex] || 'neutral';
              // Normalize variant for TagsCellRenderer
              let normalizedTagVariant: string = tagsRenderer.variant as string;
              if (
                normalizedTagVariant === 'filled' ||
                normalizedTagVariant === 'outlined' ||
                !normalizedTagVariant
              ) {
                normalizedTagVariant = 'default';
              }
              let tagVariant:
                | 'default'
                | 'primary'
                | 'secondary'
                | 'success'
                | 'warning'
                | 'error'
                | 'neutral' = 'default';
              switch (normalizedTagVariant) {
                case 'default':
                case 'primary':
                case 'secondary':
                case 'success':
                case 'warning':
                case 'error':
                case 'neutral':
                  tagVariant = normalizedTagVariant as typeof tagVariant;
                  break;
                default:
                  tagVariant = 'default';
              }
              return (
                <Chip
                  key={tagIndex}
                  variant={tagVariant}
                  size={tagsRenderer.size}
                >
                  {tag}
                </Chip>
              );
            })}
            {hiddenCount > 0 && (
              <Typography variant="p" size="xs" color="muted">
                +{hiddenCount}
              </Typography>
            )}
          </div>
        );

      case 'custom':
        const customRenderer = renderer as CustomCellRenderer;
        return customRenderer.render(value, record, index);

      default:
        return (
          <Typography variant="p" size="sm">
            {value}
          </Typography>
        );
    }
  };

  // Rest of the component logic remains the same as before...
  // (handleSort, handleSearch, etc.)

  const handleSort = (column: string) => {
    const col = columns.find((col) => col.key === column);
    if (!col?.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortColumn === column && sortDirection === 'asc') {
      direction = 'desc';
    }

    setSortColumn(column);
    setSortDirection(direction);

    if (sorting?.multiSort) {
      const newMultiSort = multiSort.filter((sort) => sort.column !== column);
      newMultiSort.push({ column, direction });
      setMultiSort(newMultiSort);
      onSort?.(column, direction, newMultiSort);
    } else {
      onSort?.(column, direction);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query, filters?.searchFields);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const newFilters = { ...activeFilters, [filterKey]: value };
    if (!value) {
      delete newFilters[filterKey];
    }
    setActiveFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedKeys = checked
      ? data.map((_, index) => index.toString())
      : [];
    setSelectedKeys(newSelectedKeys);

    if (onSelect) {
      const selectedRecords = checked ? [...data] : [];
      onSelect(newSelectedKeys, selectedRecords);
    }
  };

  const handleSelectRow = (index: number, checked: boolean) => {
    const key = index.toString();
    const newSelectedKeys = checked
      ? [...selectedKeys, key]
      : selectedKeys.filter((k) => k !== key);

    setSelectedKeys(newSelectedKeys);

    if (onSelect) {
      const selectedRecords = newSelectedKeys
        .map((k) => data[parseInt(k)])
        .filter(Boolean);
      onSelect(newSelectedKeys, selectedRecords);
    }
  };

  const handleExpandRow = (index: number) => {
    const key = index.toString();
    const newExpandedRows = expandedRows.includes(key)
      ? expandedRows.filter((k) => k !== key)
      : [...expandedRows, key];

    setExpandedRows(newExpandedRows);

    if (onExpand) {
      const isExpanding = !expandedRows.includes(key);
      onExpand(isExpanding, data[index], index);
    }
  };

  // Calculate pagination
  const currentPage = pagination?.page || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = pagination?.total || data.length;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    onPageChange?.(page, pageSize);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPageChange?.(1, newPageSize);
  };

  // Get pagination info
  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, total);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Get table size classes
  const getSizeClasses = () => {
    switch (styling?.size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  const getCellPadding = () => {
    switch (styling?.size) {
      case 'sm':
        return 'px-3 py-2';
      case 'lg':
        return 'px-6 py-4';
      default:
        return 'px-4 py-3';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with search and filters */}
      {(filters?.searchPlaceholder || filters?.quickFilters) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Search */}
          {filters?.searchPlaceholder && (
            <div className="flex-1 max-w-md">
              <FormField
                label=""
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={filters.searchPlaceholder}
              />
            </div>
          )}

          {/* Quick Filters */}
          {filters?.quickFilters && (
            <div className="flex items-center space-x-4">
              {filters.quickFilters.map((filter) => (
                <div key={filter.key} className="min-w-[150px]">
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-input-background text-foreground text-sm"
                  >
                    <option value="">{filter.label}</option>
                    {filter.options?.map((option) => (
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
        <div className="flex items-center justify-between p-4 bg-accent/30 border border-border rounded-lg">
          <Typography variant="p" size="sm" weight="medium">
            {selectedKeys.length} elemento{selectedKeys.length !== 1 ? 's' : ''}{' '}
            seleccionado{selectedKeys.length !== 1 ? 's' : ''}
          </Typography>
          <div className="flex items-center space-x-2">
            <IconButton
              icon="Download"
              size="sm"
              variant="outline"
              tooltip="Exportar seleccionados"
            >
              Exportar
            </IconButton>
            <IconButton
              icon="Trash2"
              size="sm"
              variant="destructive"
              tooltip="Eliminar seleccionados"
            >
              Eliminar
            </IconButton>
          </div>
        </div>
      )}

      {/* Table */}
      <div
        className={`
        bg-card border border-border rounded-lg overflow-hidden
        ${getSizeClasses()}
      `}
      >
        <div className="overflow-x-auto">
          <table
            className={`
            w-full
            ${styling?.striped ? 'table-striped' : ''}
            ${styling?.bordered ? 'table-bordered' : ''}
          `}
          >
            {/* Header */}
            <thead className="bg-accent/20 border-b border-border">
              <tr>
                {selectable && (
                  <th className={`w-12 ${getCellPadding()} text-left`}>
                    <Checkbox
                      id="select-all"
                      checked={
                        selectedKeys.length === data.length && data.length > 0
                      }
                      indeterminate={
                        selectedKeys.length > 0 &&
                        selectedKeys.length < data.length
                      }
                      onChange={handleSelectAll}
                    />
                  </th>
                )}

                {expandable && (
                  <th className={`w-12 ${getCellPadding()} text-left`}>
                    {/* Empty header for expand column */}
                  </th>
                )}

                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`
                      ${getCellPadding()} 
                      ${
                        column.align === 'center'
                          ? 'text-center'
                          : column.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                      }
                      ${column.width || ''} 
                      ${column.className || ''}
                    `}
                  >
                    {column.sortable ? (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="flex items-center space-x-2 hover:text-primary transition-colors group"
                      >
                        <Typography variant="p" size="sm" weight="medium">
                          {column.title}
                        </Typography>
                        <div className="flex flex-col">
                          <Icon
                            name="ChevronUp"
                            size="xs"
                            color={
                              sortColumn === column.key &&
                              sortDirection === 'asc'
                                ? 'primary'
                                : 'muted'
                            }
                          />
                          <Icon
                            name="ChevronDown"
                            size="xs"
                            color={
                              sortColumn === column.key &&
                              sortDirection === 'desc'
                                ? 'primary'
                                : 'muted'
                            }
                          />
                        </div>
                      </button>
                    ) : (
                      <Typography variant="p" size="sm" weight="medium">
                        {column.title}
                      </Typography>
                    )}
                  </th>
                ))}

                {(actions.length > 0 || rowActions) && (
                  <th className={`w-32 ${getCellPadding()} text-right`}>
                    <Typography variant="p" size="sm" weight="medium">
                      Acciones
                    </Typography>
                  </th>
                )}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (expandable ? 1 : 0) +
                      (actions.length > 0 || rowActions ? 1 : 0)
                    }
                    className={`${getCellPadding()} py-8 text-center`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <Typography variant="p" size="sm" color="muted">
                        Cargando datos...
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (selectable ? 1 : 0) +
                      (expandable ? 1 : 0) +
                      (actions.length > 0 || rowActions ? 1 : 0)
                    }
                    className={`${getCellPadding()} py-8 text-center`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon name="FileX" size="lg" color="muted" />
                      <Typography variant="p" color="muted">
                        No hay datos disponibles
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((record, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className={`
                        border-b border-border transition-colors
                        ${styling?.hoverable ? 'hover:bg-accent/50' : ''}
                        ${selectedKeys.includes(index.toString()) ? 'bg-accent/30' : ''}
                        ${styling?.striped && index % 2 === 1 ? 'bg-accent/10' : ''}
                        ${onRowClick ? 'cursor-pointer' : ''}
                      `}
                      onClick={() => onRowClick?.(record, index)}
                      onDoubleClick={() => onRowDoubleClick?.(record, index)}
                    >
                      {selectable && (
                        <td className={getCellPadding()}>
                          <Checkbox
                            id={`select-${index}`}
                            checked={selectedKeys.includes(index.toString())}
                            onChange={(checked) =>
                              handleSelectRow(index, checked)
                            }
                          />
                        </td>
                      )}

                      {expandable && (
                        <td className={getCellPadding()}>
                          {(!expandable.rowExpandable ||
                            expandable.rowExpandable(record)) && (
                            <IconButton
                              icon={
                                expandedRows.includes(index.toString())
                                  ? 'ChevronDown'
                                  : 'ChevronRight'
                              }
                              iconOnly
                              size="sm"
                              variant="ghost"
                              onClick={() => handleExpandRow(index)}
                            />
                          )}
                        </td>
                      )}

                      {columns.map((column) => {
                        const dataIndex = column.dataIndex || column.key;
                        const value = record[dataIndex];

                        return (
                          <td
                            key={column.key}
                            className={`
                              ${getCellPadding()}
                              ${
                                column.align === 'center'
                                  ? 'text-center'
                                  : column.align === 'right'
                                    ? 'text-right'
                                    : 'text-left'
                              }
                              ${column.className || ''}
                            `}
                          >
                            {renderCell(column, value, record, index)}
                          </td>
                        );
                      })}

                      {(actions.length > 0 || rowActions) && (
                        <td className={getCellPadding()}>
                          <div className="flex items-center justify-end space-x-1">
                            {/* Static actions */}
                            {actions.slice(0, 2).map((action) => {
                              const isDisabled =
                                typeof action.disabled === 'function'
                                  ? action.disabled(record)
                                  : action.disabled;
                              const isHidden =
                                typeof action.hidden === 'function'
                                  ? action.hidden(record)
                                  : action.hidden;

                              if (isHidden) return null;

                              return (
                                <IconButton
                                  key={action.key}
                                  icon={action.icon as any}
                                  iconOnly
                                  size="sm"
                                  variant={action.variant || 'ghost'}
                                  tooltip={action.tooltip || action.label}
                                  disabled={isDisabled}
                                  onClick={() => action.onClick(record, index)}
                                />
                              );
                            })}

                            {/* Row actions */}
                            {rowActions && (
                              <>
                                {rowActions.items
                                  .slice(0, rowActions.maxVisible || 2)
                                  .map((action) => {
                                    const isDisabled =
                                      typeof action.disabled === 'function'
                                        ? action.disabled(record)
                                        : action.disabled;
                                    const isHidden =
                                      typeof action.hidden === 'function'
                                        ? action.hidden(record)
                                        : action.hidden;

                                    if (isHidden) return null;

                                    return (
                                      <IconButton
                                        key={action.key}
                                        icon={action.icon as any}
                                        iconOnly
                                        size="sm"
                                        variant={action.variant || 'ghost'}
                                        tooltip={action.tooltip || action.label}
                                        disabled={isDisabled}
                                        onClick={() =>
                                          action.onClick(record, index)
                                        }
                                      />
                                    );
                                  })}

                                {rowActions.items.length >
                                  (rowActions.maxVisible || 2) && (
                                  <IconButton
                                    icon="MoreHorizontal"
                                    iconOnly
                                    size="sm"
                                    variant="ghost"
                                    tooltip="Más acciones"
                                    onClick={() => handleExpandRow(index)}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Expanded row */}
                    {expandable && expandedRows.includes(index.toString()) && (
                      <tr className="bg-accent/20">
                        <td
                          colSpan={
                            columns.length +
                            (selectable ? 1 : 0) +
                            (expandable ? 1 : 0) +
                            (actions.length > 0 || rowActions ? 1 : 0)
                          }
                          className={getCellPadding()}
                        >
                          {expandable.expandedRowRender(record, index)}
                        </td>
                      </tr>
                    )}

                    {/* Expanded row for additional actions */}
                    {rowActions &&
                      expandedRows.includes(index.toString()) &&
                      rowActions.items.length >
                        (rowActions.maxVisible || 2) && (
                        <tr className="bg-accent/20">
                          <td
                            colSpan={
                              columns.length +
                              (selectable ? 1 : 0) +
                              (expandable ? 1 : 0) +
                              1
                            }
                            className={getCellPadding()}
                          >
                            <div className="flex items-center space-x-2">
                              <Typography
                                variant="p"
                                size="sm"
                                weight="medium"
                                className="mr-4"
                              >
                                Acciones adicionales:
                              </Typography>
                              {rowActions.items
                                .slice(rowActions.maxVisible || 2)
                                .map((action) => {
                                  const isDisabled =
                                    typeof action.disabled === 'function'
                                      ? action.disabled(record)
                                      : action.disabled;
                                  const isHidden =
                                    typeof action.hidden === 'function'
                                      ? action.hidden(record)
                                      : action.hidden;

                                  if (isHidden) return null;

                                  return (
                                    <Button
                                      key={action.key}
                                      variant={action.variant || 'outline'}
                                      size="sm"
                                      icon={action.icon as any}
                                      iconPosition="left"
                                      disabled={isDisabled}
                                      onClick={() =>
                                        action.onClick(record, index)
                                      }
                                    >
                                      {action.label}
                                    </Button>
                                  );
                                })}
                            </div>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Typography variant="p" size="sm" color="muted">
              Mostrando {startRecord} - {endRecord} de {total} registros
            </Typography>

            {pagination.showSizeChanger && (
              <div className="flex items-center space-x-2">
                <Typography variant="p" size="sm" color="muted">
                  Filas por página:
                </Typography>
                <select
                  value={pageSize}
                  onChange={(e) =>
                    handlePageSizeChange(parseInt(e.target.value))
                  }
                  className="px-2 py-1 border border-border rounded text-sm bg-input-background"
                >
                  {(pagination.pageSizeOptions || [10, 25, 50, 100]).map(
                    (size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <IconButton
              icon="ChevronLeft"
              iconOnly
              size="sm"
              variant="outline"
              tooltip="Página anterior"
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage === 1 ? 'opacity-50 pointer-events-none' : ''
              }
            />

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}

            <IconButton
              icon="ChevronRight"
              iconOnly
              size="sm"
              variant="outline"
              tooltip="Página siguiente"
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? 'opacity-50 pointer-events-none'
                  : ''
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
