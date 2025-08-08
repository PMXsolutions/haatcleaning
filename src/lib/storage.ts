import Cookies from "js-cookie";

const storageUtil = {
  getItem: (name: string) => Cookies.get(name) || null,
  setItem: (name: string, value: string) => Cookies.set(name, value),
  removeItem: (name: string) => Cookies.remove(name),
};

export default storageUtil;