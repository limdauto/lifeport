const STORAGE_KEY = 'lifeport_admin_secret';

export function getAdminSecret(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STORAGE_KEY);
}

export function setAdminSecret(secret: string): void {
  sessionStorage.setItem(STORAGE_KEY, secret);
}

export function clearAdminSecret(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
