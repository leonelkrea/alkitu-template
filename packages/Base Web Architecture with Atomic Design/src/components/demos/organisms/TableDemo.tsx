import React, { useState } from 'react';
import Typography from '../../atoms/Typography';
import Table, { TableColumn, TableAction } from '../../organisms/Table';
import TableMobile, { TableMobileColumn, TableMobileAction } from '../../organisms/TableMobile';
import Button from '../../atoms/Button';
import { useIsMobile } from '../../../../components/ui/use-mobile';

const TableDemo: React.FC = () => {
  const isMobile = useIsMobile();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [selectedExample, setSelectedExample] = useState<'basic' | 'advanced' | 'complex'>('basic');

  // Sample data
  const generateSampleData = (count: number = 50) => {
    const statuses = ['active', 'inactive', 'pending', 'suspended'];
    const roles = ['admin', 'user', 'moderator', 'guest'];
    const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
    const priorities = ['high', 'medium', 'low'];
    const tags = ['javascript', 'react', 'typescript', 'node.js', 'python', 'design', 'ux', 'api'];

    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      name: `Usuario ${index + 1}`,
      email: `usuario${index + 1}@ejemplo.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      salary: 30000 + Math.floor(Math.random() * 70000),
      progress: Math.floor(Math.random() * 100),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
      tags: tags.slice(0, 2 + Math.floor(Math.random() * 3)),
      projects: Math.floor(Math.random() * 10) + 1,
      score: Math.random(),
      website: `https://portfolio-${index + 1}.com`,
      phone: `+34 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 900) + 100}`,
      verified: Math.random() > 0.3,
      contract: Math.random() > 0.5 ? 'permanent' : 'temporary'
    }));
  };

  const sampleData = generateSampleData();

  // Basic table columns
  const basicColumns: TableColumn[] = [
    {
      key: 'name',
      title: 'Nombre',
      sortable: true,
      render: {
        type: 'text',
        weight: 'medium'
      }
    },
    {
      key: 'email',
      title: 'Email',
      render: {
        type: 'link',
        href: (record) => `mailto:${record.email}`,
        color: 'primary'
      }
    },
    {
      key: 'status',
      title: 'Estado',
      sortable: true,
      render: {
        type: 'badge',
        mapping: {
          'active': { variant: 'success', label: 'Activo' },
          'inactive': { variant: 'neutral', label: 'Inactivo' },
          'pending': { variant: 'warning', label: 'Pendiente' },
          'suspended': { variant: 'error', label: 'Suspendido' }
        }
      }
    },
    {
      key: 'joinDate',
      title: 'Fecha de registro',
      sortable: true,
      render: {
        type: 'date',
        format: 'medium'
      }
    }
  ];

  // Advanced table columns
  const advancedColumns: TableColumn[] = [
    {
      key: 'user',
      title: 'Usuario',
      width: 'w-64',
      render: {
        type: 'avatar',
        size: 'sm',
        showName: true,
        showStatus: true,
        statusField: 'status'
      }
    },
    {
      key: 'role',
      title: 'Rol',
      sortable: true,
      render: {
        type: 'chip',
        variant: 'filled',
        mapping: {
          'admin': { color: 'error', label: 'Administrador' },
          'user': { color: 'primary', label: 'Usuario' },
          'moderator': { color: 'warning', label: 'Moderador' },
          'guest': { color: 'neutral', label: 'Invitado' }
        }
      }
    },
    {
      key: 'salary',
      title: 'Salario',
      align: 'right',
      sortable: true,
      render: {
        type: 'number',
        format: 'currency',
        currency: 'EUR'
      }
    },
    {
      key: 'progress',
      title: 'Progreso',
      render: {
        type: 'progress',
        showValue: true,
        color: 'primary'
      }
    },
    {
      key: 'lastActive',
      title: 'Última actividad',
      render: {
        type: 'date',
        format: 'relative'
      }
    }
  ];

  // Complex table columns
  const complexColumns: TableColumn[] = [
    {
      key: 'user',
      title: 'Usuario',
      width: 'w-72',
      render: {
        type: 'custom',
        render: (value, record) => (
          <div className="flex items-center space-x-3">
            <img
              src={record.avatar}
              alt={record.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <Typography variant="p" size="sm" weight="medium">
                  {record.name}
                </Typography>
                {record.verified && (
                  <div className="w-4 h-4 bg-success rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <Typography variant="p" size="xs" color="muted">
                {record.email}
              </Typography>
            </div>
          </div>
        )
      }
    },
    {
      key: 'department',
      title: 'Departamento',
      sortable: true,
      render: {
        type: 'chip',
        variant: 'outlined'
      }
    },
    {
      key: 'priority',
      title: 'Prioridad',
      render: {
        type: 'icon',
        mapping: {
          'high': { icon: 'AlertTriangle', color: 'error', tooltip: 'Prioridad alta' },
          'medium': { icon: 'AlertCircle', color: 'warning', tooltip: 'Prioridad media' },
          'low': { icon: 'Info', color: 'success', tooltip: 'Prioridad baja' }
        },
        clickable: true,
        onClick: (value, record) => alert(`Prioridad ${value} para ${record.name}`)
      }
    },
    {
      key: 'tags',
      title: 'Habilidades',
      render: {
        type: 'tags',
        maxVisible: 2,
        variant: 'filled',
        size: 'sm',
        colors: ['primary', 'secondary', 'success', 'warning']
      }
    },
    {
      key: 'score',
      title: 'Puntuación',
      align: 'center',
      render: {
        type: 'number',
        format: 'percentage',
        maximumFractionDigits: 1
      }
    },
    {
      key: 'contract',
      title: 'Tipo contrato',
      render: {
        type: 'button',
        variant: 'outline',
        size: 'sm',
        onClick: (value, record) => alert(`Contrato ${value} de ${record.name}`),
        tooltip: (record) => `Ver detalles del contrato de ${record.name}`
      }
    }
  ];

  // Actions
  const tableActions: TableAction[] = [
    {
      key: 'edit',
      label: 'Editar',
      icon: 'Edit',
      variant: 'outline',
      onClick: (record) => alert(`Editando ${record.name}`),
      tooltip: 'Editar usuario'
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: 'Trash2',
      variant: 'destructive',
      onClick: (record) => alert(`Eliminando ${record.name}`),
      disabled: (record) => record.role === 'admin',
      tooltip: 'Eliminar usuario'
    },
    {
      key: 'view',
      label: 'Ver detalles',
      icon: 'Eye',
      variant: 'ghost',
      onClick: (record) => alert(`Viendo detalles de ${record.name}`)
    },
    {
      key: 'contact',
      label: 'Contactar',
      icon: 'Mail',
      variant: 'secondary',
      onClick: (record) => window.open(`mailto:${record.email}`),
      hidden: (record) => !record.verified
    }
  ];

  const handlePageChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleSearch = (query: string) => {
    console.log('Buscando:', query);
  };

  const handleFilter = (filters: Record<string, any>) => {
    console.log('Filtros aplicados:', filters);
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    console.log('Ordenando:', column, direction);
  };

  const handleSelect = (selectedKeys: string[], selectedRecords: any[]) => {
    console.log('Seleccionados:', selectedKeys, selectedRecords);
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const getCurrentColumns = () => {
    switch (selectedExample) {
      case 'basic':
        return basicColumns;
      case 'advanced':
        return advancedColumns;
      case 'complex':
        return complexColumns;
      default:
        return basicColumns;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-4">
        <Typography variant="h3">Enhanced Table Component</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-blue-900 mb-2">
              ✨ Nuevas funcionalidades
            </Typography>
            <Typography variant="p" size="sm" className="text-blue-800">
              • <strong>Múltiples tipos de celda:</strong> texto, badges, chips, avatares, botones, iconos, fechas, números, progreso<br/>
              • <strong>Renderizado personalizado:</strong> sistema flexible de renderizado por columna<br/>
              • <strong>Acciones inteligentes:</strong> condicionales, tooltips, estados dinámicos<br/>
              • <strong>Filtros avanzados:</strong> búsqueda, filtros rápidos, filtros múltiples<br/>
              • <strong>Estilos configurables:</strong> tamaños, bordes, hover, striped
            </Typography>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <Typography variant="p" weight="medium" className="text-green-900 mb-2">
              🎯 Tipos de celda soportados
            </Typography>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
              <div>• Text & Typography</div>
              <div>• Badges & Status</div>
              <div>• Chips & Tags</div>
              <div>• Avatars & Images</div>
              <div>• Buttons & Actions</div>
              <div>• Icons & Indicators</div>
              <div>• Links & URLs</div>
              <div>• Dates & Times</div>
              <div>• Numbers & Currency</div>
              <div>• Progress Bars</div>
              <div>• Tag Lists</div>
              <div>• Custom Renderers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Example selector */}
      <div className="flex items-center space-x-4">
        <Typography variant="p" weight="medium">
          Ejemplos:
        </Typography>
        <div className="flex space-x-2">
          <Button
            variant={selectedExample === 'basic' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedExample('basic')}
          >
            Básico
          </Button>
          <Button
            variant={selectedExample === 'advanced' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedExample('advanced')}
          >
            Avanzado
          </Button>
          <Button
            variant={selectedExample === 'complex' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedExample('complex')}
          >
            Complejo
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon="RefreshCw"
          onClick={simulateLoading}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Recargar'}
        </Button>
      </div>

      {/* Basic Example */}
      {selectedExample === 'basic' && (
        <div className="space-y-4">
          <Typography variant="h4">Tabla Básica</Typography>
          <Typography variant="p" size="sm" color="muted">
            Tabla simple con texto, enlaces, badges y fechas. Incluye ordenación y paginación básica.
          </Typography>
          
          <Table
            data={sampleData.slice(0, 20)}
            columns={basicColumns}
            loading={loading}
            selectable
            actions={tableActions.slice(0, 2)}
            pagination={{
              page: currentPage,
              pageSize: 5,
              total: 20,
              showSizeChanger: true
            }}
            filters={{
              searchPlaceholder: 'Buscar usuarios...',
              quickFilters: [
                {
                  key: 'status',
                  label: 'Estado',
                  options: [
                    { value: 'active', label: 'Activo' },
                    { value: 'inactive', label: 'Inactivo' },
                    { value: 'pending', label: 'Pendiente' }
                  ]
                }
              ]
            }}
            styling={{
              size: 'md',
              hoverable: true,
              bordered: true
            }}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            onSelect={handleSelect}
          />
        </div>
      )}

      {/* Advanced Example */}
      {selectedExample === 'advanced' && (
        <div className="space-y-4">
          <Typography variant="h4">Tabla Avanzada</Typography>
          <Typography variant="p" size="sm" color="muted">
            Incluye avatares con estado, chips con colores, números formateados, barras de progreso y fechas relativas.
          </Typography>
          
          <Table
            data={sampleData.slice(0, 25)}
            columns={advancedColumns}
            loading={loading}
            selectable
            expandable={{
              expandedRowRender: (record) => (
                <div className="p-4 bg-accent/10 rounded">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Typography variant="p" size="sm" weight="medium" color="muted">
                        Teléfono:
                      </Typography>
                      <Typography variant="p" size="sm">
                        {record.phone}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="medium" color="muted">
                        Proyectos:
                      </Typography>
                      <Typography variant="p" size="sm">
                        {record.projects}
                      </Typography>
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="medium" color="muted">
                        Website:
                      </Typography>
                      <a href={record.website} className="text-primary text-sm hover:underline">
                        {record.website}
                      </a>
                    </div>
                    <div>
                      <Typography variant="p" size="sm" weight="medium" color="muted">
                        Verificado:
                      </Typography>
                      <Typography variant="p" size="sm">
                        {record.verified ? 'Sí' : 'No'}
                      </Typography>
                    </div>
                  </div>
                </div>
              ),
              rowExpandable: (record) => record.verified
            }}
            rowActions={{
              items: tableActions,
              maxVisible: 2,
              trigger: 'hover'
            }}
            pagination={{
              page: currentPage,
              pageSize: pageSize,
              total: 25,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 15, 25]
            }}
            filters={{
              searchPlaceholder: 'Buscar por nombre o email...',
              searchFields: ['name', 'email'],
              quickFilters: [
                {
                  key: 'role',
                  label: 'Rol',
                  options: [
                    { value: 'admin', label: 'Administrador' },
                    { value: 'user', label: 'Usuario' },
                    { value: 'moderator', label: 'Moderador' }
                  ]
                },
                {
                  key: 'department',
                  label: 'Departamento',
                  options: [
                    { value: 'Engineering', label: 'Ingeniería' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Sales', label: 'Ventas' }
                  ]
                }
              ]
            }}
            sorting={{
              defaultSort: { column: 'name', direction: 'asc' },
              multiSort: true
            }}
            styling={{
              size: 'md',
              hoverable: true,
              striped: true
            }}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            onSelect={handleSelect}
            onRowClick={(record) => console.log('Clicked:', record.name)}
          />
        </div>
      )}

      {/* Complex Example */}
      {selectedExample === 'complex' && (
        <div className="space-y-4">
          <Typography variant="h4">Tabla Compleja</Typography>
          <Typography variant="p" size="sm" color="muted">
            Ejemplo completo con renderizadores personalizados, iconos interactivos, listas de tags, botones condicionales y múltiples tipos de datos.
          </Typography>
          
          <Table
            data={sampleData}
            columns={complexColumns}
            loading={loading}
            selectable
            expandable={{
              expandedRowRender: (record) => (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Typography variant="p" weight="medium">
                        Información de contacto
                      </Typography>
                      <div className="space-y-2">
                        <div>
                          <Typography variant="p" size="sm" color="muted">Email:</Typography>
                          <Typography variant="p" size="sm">{record.email}</Typography>
                        </div>
                        <div>
                          <Typography variant="p" size="sm" color="muted">Teléfono:</Typography>
                          <Typography variant="p" size="sm">{record.phone}</Typography>
                        </div>
                        <div>
                          <Typography variant="p" size="sm" color="muted">Website:</Typography>
                          <a href={record.website} className="text-primary text-sm hover:underline">
                            {record.website}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Typography variant="p" weight="medium">
                        Información laboral
                      </Typography>
                      <div className="space-y-2">
                        <div>
                          <Typography variant="p" size="sm" color="muted">Salario:</Typography>
                          <Typography variant="p" size="sm">
                            {new Intl.NumberFormat('es-ES', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            }).format(record.salary)}
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="p" size="sm" color="muted">Proyectos:</Typography>
                          <Typography variant="p" size="sm">{record.projects}</Typography>
                        </div>
                        <div>
                          <Typography variant="p" size="sm" color="muted">Tipo de contrato:</Typography>
                          <Typography variant="p" size="sm" className="capitalize">
                            {record.contract === 'permanent' ? 'Permanente' : 'Temporal'}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Typography variant="p" weight="medium">
                        Métricas
                      </Typography>
                      <div className="space-y-2">
                        <div>
                          <Typography variant="p" size="sm" color="muted">Progreso:</Typography>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-neutral-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${record.progress}%` }}
                              />
                            </div>
                            <Typography variant="p" size="sm">{record.progress}%</Typography>
                          </div>
                        </div>
                        <div>
                          <Typography variant="p" size="sm" color="muted">Puntuación:</Typography>
                          <Typography variant="p" size="sm">
                            {(record.score * 100).toFixed(1)}%
                          </Typography>
                        </div>
                        <div>
                          <Typography variant="p" size="sm" color="muted">Estado:</Typography>
                          <Typography variant="p" size="sm" className="capitalize">
                            {record.status === 'active' ? 'Activo' : 
                             record.status === 'inactive' ? 'Inactivo' : 
                             record.status === 'pending' ? 'Pendiente' : 'Suspendido'}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Typography variant="p" weight="medium" className="mb-2">
                      Todas las habilidades ({record.tags.length})
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {record.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }}
            rowActions={{
              items: [
                ...tableActions,
                {
                  key: 'promote',
                  label: 'Promover',
                  icon: 'TrendingUp',
                  variant: 'secondary',
                  onClick: (record) => alert(`Promoviendo a ${record.name}`),
                  disabled: (record) => record.role === 'admin',
                  hidden: (record) => record.status !== 'active'
                },
                {
                  key: 'archive',
                  label: 'Archivar',
                  icon: 'Archive',
                  variant: 'ghost',
                  onClick: (record) => alert(`Archivando a ${record.name}`)
                }
              ],
              maxVisible: 3,
              trigger: 'always'
            }}
            pagination={{
              page: currentPage,
              pageSize: pageSize,
              total: sampleData.length,
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: [10, 25, 50, 100]
            }}
            filters={{
              searchPlaceholder: 'Buscar usuarios por cualquier campo...',
              searchFields: ['name', 'email', 'department', 'tags'],
              quickFilters: [
                {
                  key: 'status',
                  label: 'Estado',
                  options: [
                    { value: 'active', label: 'Activo' },
                    { value: 'inactive', label: 'Inactivo' },
                    { value: 'pending', label: 'Pendiente' },
                    { value: 'suspended', label: 'Suspendido' }
                  ]
                },
                {
                  key: 'department',
                  label: 'Departamento',
                  options: [
                    { value: 'Engineering', label: 'Ingeniería' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Sales', label: 'Ventas' },
                    { value: 'HR', label: 'RRHH' },
                    { value: 'Finance', label: 'Finanzas' }
                  ]
                },
                {
                  key: 'priority',
                  label: 'Prioridad',
                  options: [
                    { value: 'high', label: 'Alta' },
                    { value: 'medium', label: 'Media' },
                    { value: 'low', label: 'Baja' }
                  ]
                }
              ]
            }}
            sorting={{
              defaultSort: { column: 'name', direction: 'asc' },
              multiSort: true
            }}
            styling={{
              size: 'md',
              hoverable: true,
              bordered: true,
              compact: false
            }}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onSort={handleSort}
            onSelect={handleSelect}
            onRowClick={(record) => console.log('Clicked:', record.name)}
            onRowDoubleClick={(record) => alert(`Editando ${record.name}`)}
          />
        </div>
      )}

      {/* Documentation */}
      <div className="space-y-6">
        <Typography variant="h3">Tipos de renderizadores de celda</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              type: 'text',
              title: 'Texto',
              description: 'Renderizado de texto con opciones de tipografía, truncado y colores.',
              example: 'Typography variants, weights, colors'
            },
            {
              type: 'badge',
              title: 'Badges',
              description: 'Etiquetas de estado con mapeo de valores y variantes.',
              example: 'Status: Active, Inactive, Pending'
            },
            {
              type: 'chip',
              title: 'Chips',
              description: 'Chips removibles con colores y variantes personalizables.',
              example: 'Tags: React, TypeScript, Node.js'
            },
            {
              type: 'avatar',
              title: 'Avatares',
              description: 'Avatares con imágenes, fallbacks, estados y nombres.',
              example: 'User avatars with status indicators'
            },
            {
              type: 'button',
              title: 'Botones',
              description: 'Botones interactivos con estados, tooltips y acciones.',
              example: 'Action buttons: Edit, Delete, View'
            },
            {
              type: 'icon',
              title: 'Iconos',
              description: 'Iconos con mapeo, colores y acciones clickeables.',
              example: 'Priority: High, Medium, Low icons'
            },
            {
              type: 'link',
              title: 'Enlaces',
              description: 'Enlaces con URLs dinámicas, targets y estilos.',
              example: 'Email links, external websites'
            },
            {
              type: 'date',
              title: 'Fechas',
              description: 'Formatos de fecha: corto, medio, largo, relativo.',
              example: 'Hace 2 días, 15/12/2024'
            },
            {
              type: 'number',
              title: 'Números',
              description: 'Números con formato: decimal, moneda, porcentaje.',
              example: '€50,000, 85.5%, 1,234.56'
            },
            {
              type: 'progress',
              title: 'Progreso',
              description: 'Barras de progreso con valores, colores y tamaños.',
              example: 'Progress: 75/100 with visual bar'
            },
            {
              type: 'tags',
              title: 'Listas de Tags',
              description: 'Múltiples tags con límite visual y colores.',
              example: 'Skills: JS, React, +3 more'
            },
            {
              type: 'custom',
              title: 'Personalizado',
              description: 'Renderizadores completamente personalizados.',
              example: 'Complex user card with avatar + info'
            }
          ].map((renderer) => (
            <div key={renderer.type} className="border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <Typography variant="p" weight="medium">
                  {renderer.title}
                </Typography>
              </div>
              <Typography variant="p" size="sm" color="muted" className="mb-2">
                {renderer.description}
              </Typography>
              <Typography variant="p" size="xs" className="text-primary bg-primary/10 px-2 py-1 rounded">
                {renderer.example}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* Features summary */}
      <div className="space-y-6">
        <Typography variant="h3">Funcionalidades completas</Typography>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Typography variant="h4">Renderizado y datos</Typography>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>12 tipos de renderizadores de celda</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Mapeo dinámico de valores</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Formateadores de fecha y número</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Renderizadores condicionales</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Soporte para datos anidados</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <Typography variant="h4">Interactividad</Typography>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Acciones por fila con estados</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Filas expandibles con contenido custom</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Selección múltiple con acciones</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Ordenación múltiple</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-success rounded-full"></div>
                <span>Filtros avanzados y búsqueda</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableDemo;