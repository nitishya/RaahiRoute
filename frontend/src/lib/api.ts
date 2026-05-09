const API_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function fetchTrips() {
  const res = await fetch(`${API_URL}/trips`, {
    headers: { ...getAuthHeader() }
  });
  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error('Failed to fetch trips');
  return res.json();
}

export async function createTrip(data: any) {
  const res = await fetch(`${API_URL}/trips`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Failed to create trip');
  }
  return res.json();
}

export async function register(data: any) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Registration failed');
  return result;
}

export async function login(data: any) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Login failed');
  return result;
}

export async function fetchRecommendations(tripId: string) {
  const res = await fetch(`${API_URL}/trips/${tripId}/recommendations`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function fetchItinerary(tripId: string) {
  const res = await fetch(`${API_URL}/trips/${tripId}/itinerary`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error('Failed to fetch itinerary');
  return res.json();
}
