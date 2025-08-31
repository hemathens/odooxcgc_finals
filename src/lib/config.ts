// Centralized API configuration for frontend
// API_ORIGIN is the scheme+host (and optional port) where the backend runs
// API_BASE_URL is the full base including the /api prefix used by most endpoints

export const API_ORIGIN = (import.meta as any)?.env?.VITE_API_ORIGIN?.replace(/\/$/, '') || 'http://localhost:8000';
export const API_BASE_URL = `${API_ORIGIN}/api`;

