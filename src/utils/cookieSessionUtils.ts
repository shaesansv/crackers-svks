// Cookie and Session utilities for Sarguru Crackers

export const setCookie = (name: string, value: string, days: number = 30) => {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (err) {
    console.error('Failed to set cookie', err);
  }
};

export const getCookie = (name: string): string | null => {
  try {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
  } catch (err) {
    console.error('Failed to get cookie', err);
  }
  return null;
};

export const setSessionStorage = (key: string, value: any) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Failed to set session storage', err);
  }
};

export const getSessionStorage = (key: string): any => {
  try {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Failed to get session storage', err);
  }
  return null;
};

// Cart Quantities Helper
export const saveCartData = (quantities: Record<string, number>) => {
  const jsonStr = JSON.stringify(quantities);
  setCookie('sarguru_cart_quantities', jsonStr, 7);
  setSessionStorage('sarguru_cart_session', quantities);
};

export const loadCartData = (): Record<string, number> => {
  const sessionData = getSessionStorage('sarguru_cart_session');
  if (sessionData && typeof sessionData === 'object') {
    return sessionData;
  }
  const cookieDataStr = getCookie('sarguru_cart_quantities');
  if (cookieDataStr) {
    try {
      const parsed = JSON.parse(cookieDataStr);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // Ignore JSON parse error
    }
  }
  return {};
};

// Active Page Persistence Helper
export const saveActivePage = (page: string) => {
  setCookie('sarguru_active_page', page, 7);
  setSessionStorage('sarguru_active_page', page);
};

export const loadActivePage = (): string | null => {
  const sessionPage = getSessionStorage('sarguru_active_page');
  if (sessionPage && typeof sessionPage === 'string') {
    return sessionPage;
  }
  const cookiePage = getCookie('sarguru_active_page');
  if (cookiePage) {
    return cookiePage;
  }
  return null;
};
export interface SavedCustomerDetails {
  name: string;
  mobile: string;
  email: string;
  address: string;
  state: string;
  city: string;
}

export const saveCustomerDetails = (details: SavedCustomerDetails) => {
  const jsonStr = JSON.stringify(details);
  setCookie('sarguru_customer_details', jsonStr, 30);
  setSessionStorage('sarguru_customer_session', details);
};

export const loadCustomerDetails = (): SavedCustomerDetails | null => {
  const sessionData = getSessionStorage('sarguru_customer_session');
  if (sessionData && typeof sessionData === 'object') {
    return sessionData;
  }
  const cookieDataStr = getCookie('sarguru_customer_details');
  if (cookieDataStr) {
    try {
      const parsed = JSON.parse(cookieDataStr);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // Ignore error
    }
  }
  return null;
};
