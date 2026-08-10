(() => {
  const STORAGE_KEY = 'jncos_inquiries_v1';
  const STATUS_KEY = 'jncos_inquiry_status_v1';

  const safeParse = (value, fallback) => {
    try { return JSON.parse(value); } catch (_) { return fallback; }
  };

  const listLocal = () => safeParse(localStorage.getItem(STORAGE_KEY), []);
  const writeLocal = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const statusMap = () => safeParse(localStorage.getItem(STATUS_KEY), {});

  const uid = () => {
    if (window.crypto?.randomUUID) return crypto.randomUUID();
    return `jnc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const normalize = (record) => ({
    id: record.id || uid(),
    createdAt: record.createdAt || new Date().toISOString(),
    status: record.status || 'New',
    ...record,
  });

  window.JNCOSInquiryStore = {
    mode: 'local',
    async create(payload) {
      const item = normalize(payload);
      const items = listLocal();
      items.unshift(item);
      writeLocal(items);
      return item;
    },
    async list() {
      const statuses = statusMap();
      return listLocal().map((item) => ({ ...item, status: statuses[item.id] || item.status || 'New' }));
    },
    async get(id) {
      const items = await this.list();
      return items.find((item) => item.id === id) || null;
    },
    async setStatus(id, status) {
      const statuses = statusMap();
      statuses[id] = status;
      localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      return true;
    },
    async remove(id) {
      writeLocal(listLocal().filter((item) => item.id !== id));
      const statuses = statusMap();
      delete statuses[id];
      localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      return true;
    },
    async clear() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STATUS_KEY);
    }
  };
})();
