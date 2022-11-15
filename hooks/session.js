const getSessionStorage = (name) => {
  return sessionStorage.getItem(name);
};

const setSessionStorage = (name, val) => {
  sessionStorage.setItem(name, val);
  return val;
};

const clearAllSessionStorage = () => {
  return sessionStorage.clear();
};

export { getSessionStorage, setSessionStorage, clearAllSessionStorage };
