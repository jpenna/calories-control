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

export function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth,
  );
}

export function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight,
  );
}

export function setFirstTime(date: Date) {
  const modDate = new Date(date);
  modDate.setHours(0);
  modDate.setMinutes(0);
  modDate.setSeconds(0);
  return modDate;
}

export function setLastTime(date: Date) {
  const modDate = new Date(date);
  modDate.setHours(23);
  modDate.setMinutes(59);
  modDate.setSeconds(59);
  return modDate;
}

// Change parameter
export function discardTimezone(date: Date | string): string {
  return date.toString().replace(/(\.| GMT).*/, '');
}

export function getDayString(date: Date): string {
  let aDate = new Date(date);
  if (typeof date !== 'string') {
    aDate = new Date(discardTimezone(aDate));
  }
  return aDate.toISOString().split('T')[0];
}

export function timeBetween(date: Date, start: Date, end: Date): boolean {
  const dateNum = date.getTime();
  const startNum = start.getTime();
  const endNum = end.getTime();
  return dateNum >= startNum && dateNum <= endNum;
}
