import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NotificationBadge } from '../notification-badge';

describe('NotificationBadge', () => {
  it('should render nothing when count is 0 and showZero is false', () => {
    const { container } = render(<NotificationBadge count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render badge when count is 0 and showZero is true', () => {
    render(<NotificationBadge count={0} showZero={true} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render correct count for single digit', () => {
    render(<NotificationBadge count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should render correct count for double digits', () => {
    render(<NotificationBadge count={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render "99+" for counts over 99', () => {
    render(<NotificationBadge count={150} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('should have correct aria-label', () => {
    render(<NotificationBadge count={7} />);
    const badge = screen.getByLabelText('7 unread notifications');
    expect(badge).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<NotificationBadge count={1} className="custom-class" />);
    const badge = screen.getByText('1');
    expect(badge).toHaveClass('custom-class');
  });

  it('should have correct default styling', () => {
    render(<NotificationBadge count={1} />);
    const badge = screen.getByText('1');
    expect(badge).toHaveClass(
      'absolute',
      '-top-1',
      '-right-1',
      'h-5',
      'w-5',
      'rounded-full',
      'bg-red-500',
      'text-white',
      'text-xs',
      'font-medium',
      'flex',
      'items-center',
      'justify-center'
    );
  });

  it('should have animation classes', () => {
    render(<NotificationBadge count={1} />);
    const badge = screen.getByText('1');
    expect(badge).toHaveClass('animate-in', 'fade-in-0', 'zoom-in-75', 'duration-200');
  });

  it('should adjust width for counts > 9', () => {
    render(<NotificationBadge count={25} />);
    const badge = screen.getByText('25');
    expect(badge).toHaveClass('w-6', 'px-1');
  });
});