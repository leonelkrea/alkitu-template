import React, { useState } from 'react';
import Avatar from '../atoms/Avatar';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Typography from '../atoms/Typography';

export interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  menuItems?: {
    label: string;
    icon: string;
    onClick: () => void;
    variant?: 'default' | 'destructive';
  }[];
  showStatus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  menuItems = [],
  showStatus = true,
  size = 'md',
  className = '',
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const avatarSize = {
    sm: 'sm' as const,
    md: 'md' as const,
    lg: 'lg' as const,
  }[size];

  const defaultMenuItems = [
    {
      label: 'Ver perfil',
      icon: 'User',
      onClick: onProfileClick || (() => console.log('Ver perfil')),
    },
    {
      label: 'Configuración',
      icon: 'Settings',
      onClick: onSettingsClick || (() => console.log('Configuración')),
    },
    {
      label: 'Ayuda',
      icon: 'HelpCircle',
      onClick: () => console.log('Ayuda'),
    },
    {
      label: 'Cerrar sesión',
      icon: 'LogOut',
      onClick: onLogoutClick || (() => console.log('Cerrar sesión')),
      variant: 'destructive' as const,
    },
  ];

  const allMenuItems = menuItems.length > 0 ? menuItems : defaultMenuItems;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  // Configuración de padding según el tamaño para dar espacio al status dot
  const paddingConfig = {
    sm: 'p-2 pl-3',
    md: 'p-2 pl-4',
    lg: 'p-3 pl-5',
  }[size];

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        onClick={toggleMenu}
        className={`
          flex items-center space-x-3 hover:bg-accent rounded-lg overflow-visible relative
          ${paddingConfig}
        `}
      >
        {/* Contenedor con espacio extra para el status dot */}
        <div className="relative flex-shrink-0" style={{ padding: '3px' }}>
          <Avatar
            src={user.avatar}
            fallback={user.name}
            size={avatarSize}
            status={showStatus ? user.status : undefined}
          />
        </div>

        <div className="flex-1 text-left min-w-0">
          <Typography
            variant="p"
            size="sm"
            weight="medium"
            className="block truncate"
          >
            {user.name}
          </Typography>
          <Typography
            variant="p"
            size="xs"
            color="muted"
            className="block truncate"
          >
            {user.email}
          </Typography>
        </div>

        <Icon
          name={isOpen ? 'ChevronUp' : 'ChevronDown'}
          size="sm"
          color="muted"
          className="flex-shrink-0"
        />
      </Button>

      {isOpen && (
        <>
          {/* Overlay para cerrar el menú */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menú desplegable */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden">
            {allMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item.onClick)}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-200
                  ${
                    item.variant === 'destructive'
                      ? 'hover:bg-red-50 text-error'
                      : 'hover:bg-accent text-foreground'
                  }
                  ${index < allMenuItems.length - 1 ? 'border-b border-border' : ''}
                `}
              >
                <Icon
                  name={item.icon as any}
                  size="sm"
                  color={item.variant === 'destructive' ? 'error' : 'inherit'}
                />
                <Typography
                  variant="p"
                  size="sm"
                  color={item.variant === 'destructive' ? 'inherit' : 'inherit'}
                >
                  {item.label}
                </Typography>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
