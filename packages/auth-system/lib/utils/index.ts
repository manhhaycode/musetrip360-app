import { StateStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

export const popupWindow = (url: string, title: string, w: number, h: number) => {
  const left = screen.width / 2 - w / 2;
  const top = screen.height / 2 - h / 2;
  return window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  );
};

export const cookiesStorage: StateStorage = {
  getItem: (name: string) => {
    return Cookies.get(name) ?? null;
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 1 });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  },
};

export default cookiesStorage;
