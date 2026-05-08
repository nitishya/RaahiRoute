import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TripCard from '../components/TripCard';
import { Trip } from '../types/trip';

const mockTrip: Trip = {
  id: '1',
  destination: 'Paris, France',
  budget: 1500,
  startDate: '2026-06-01T00:00:00.000Z',
  endDate: '2026-06-10T00:00:00.000Z',
  createdAt: '2026-05-08T00:00:00.000Z',
  userId: 'user-1',
};

describe('TripCard', () => {
  it('renders trip details correctly', () => {
    render(<TripCard trip={mockTrip} />);
    
    expect(screen.getByText('Paris, France')).toBeInTheDocument();
    expect(screen.getByText('$1,500')).toBeInTheDocument();
    // Use a more flexible matcher for dates as formatting might vary slightly by locale in test env
    expect(screen.getByText(/Jun 1, 2026/)).toBeInTheDocument();
    expect(screen.getByText(/Jun 10, 2026/)).toBeInTheDocument();
  });

  it('has a "View Details" button', () => {
    render(<TripCard trip={mockTrip} />);
    expect(screen.getByText('View Details')).toBeInTheDocument();
  });
});
