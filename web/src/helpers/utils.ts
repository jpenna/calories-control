export function updateUserSettings(key: string, options: {}): void {
  const settings = JSON.parse(localStorage.getItem(key) || '{}');
  localStorage.setItem(key, JSON.stringify({ ...settings, ...options }));
}

export function getUserSettings(key: string): {} {
  return JSON.parse(localStorage.getItem(key) || '{}');
}

export function jwtDecode(token: string): { exp: number } {
  const [, payload] = token.split('.');
  return JSON.parse(window.atob(payload));
}

export function isAuthenticated(): boolean {
  if (!localStorage.token) return false;
  const token = jwtDecode(localStorage.token);
  return token.exp * 1000 > Date.now();
}
