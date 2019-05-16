export function updateUserSettings(key: string, options: {}): void {
  const settings = JSON.parse(localStorage.getItem(key) || '{}');
  localStorage.setItem(key, JSON.stringify({ ...settings, ...options }));
}

export function getUserSettings(key: string): {} {
  return JSON.parse(localStorage.getItem(key) || '{}');
}
