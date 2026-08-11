(() => {
  const STORAGE_KEY = 'jncos_inquiries_v1';
  const STATUS_KEY = 'jncos_inquiry_status_v1';
  const safeParse = (value, fallback) => { try { return JSON.parse(value); } catch (_) { return fallback; } };
  const listLocal = () => safeParse(localStorage.getItem(STORAGE_KEY), []);
  const writeLocal = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const statusMap = () => safeParse(localStorage.getItem(STATUS_KEY), {});
  const uid = () => window.crypto?.randomUUID?.() || `jnc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const normalize = (record) => ({ id: record.id || uid(), type: 'inquiry', createdAt: record.createdAt || record.createdAtISO || new Date().toISOString(), status: record.status || 'New', ...record });
  const merge = (local, cloud) => {
    const map = new Map();
    [...local, ...cloud].forEach((item) => { const n = normalize(item); map.set(n.id, { ...(map.get(n.id) || {}), ...n }); });
    return [...map.values()].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  };

  window.JNCOSInquiryStore = {
    get mode() { return window.JNCOSCloudStore?.configured ? 'firestore+local' : 'local'; },
    async create(payload) {
      const item = normalize(payload);
      writeLocal([item, ...listLocal().filter((x) => x.id !== item.id)]);
      await window.JNCOSCloudStore?.put?.('inquiries', item.id, { ...item, createdAtISO: item.createdAt });
      return item;
    },
    async list() {
      const statuses = statusMap();
      const local = listLocal().map((item) => ({ ...item, status: statuses[item.id] || item.status || 'New' }));
      const cloud = await window.JNCOSCloudStore?.list?.('inquiries', 1000) || [];
      return merge(local, cloud);
    },
    async get(id) { return (await this.list()).find((item) => item.id === id) || null; },
    async setStatus(id, status) {
      const statuses = statusMap(); statuses[id] = status; localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      await window.JNCOSCloudStore?.update?.('inquiries', id, { status });
      return true;
    },
    async remove(id) {
      writeLocal(listLocal().filter((item) => item.id !== id));
      const statuses = statusMap(); delete statuses[id]; localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      await window.JNCOSCloudStore?.remove?.('inquiries', id);
      return true;
    },
    async clear() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STATUS_KEY);
    }
  };
})();
