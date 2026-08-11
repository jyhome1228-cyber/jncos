(() => {
  const STORAGE_KEY = 'jncos_contacts_v1';
  const STATUS_KEY = 'jncos_contact_status_v1';
  const basePath = window.JNCOS_BASE_PATH || (location.hostname.endsWith('github.io') ? '/jncos' : '');
  const safeParse = (value, fallback) => { try { return JSON.parse(value); } catch (_) { return fallback; } };
  const localList = () => safeParse(localStorage.getItem(STORAGE_KEY), []);
  const writeLocal = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const statusMap = () => safeParse(localStorage.getItem(STATUS_KEY), {});
  const uid = () => window.crypto?.randomUUID?.() || `contact-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const normalize = (record) => ({ id: record.id || uid(), type: 'contact', createdAt: record.createdAt || record.createdAtISO || new Date().toISOString(), status: record.status || 'New', ...record });
  const merge = (local, cloud) => { const map = new Map(); [...local, ...cloud].forEach((item) => { const n = normalize(item); map.set(n.id, { ...(map.get(n.id) || {}), ...n }); }); return [...map.values()].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); };
  const loadScript = (src, key) => new Promise((resolve) => {
    if (window[key]) return resolve();
    const existing = document.querySelector(`script[data-loader="${key}"]`);
    if (existing) { existing.addEventListener('load', resolve, { once:true }); return; }
    const script = document.createElement('script'); script.src = `${basePath}${src}`; script.setAttribute('data-loader', key); script.onload = resolve; script.onerror = resolve; document.head.appendChild(script);
  });
  let backendPromise;
  const ensureBackend = () => backendPromise ||= (async () => {
    if (!window.JNCOS_FIREBASE_CONFIG) await loadScript('/assets/js/firebase-config.js', 'JNCOS_FIREBASE_CONFIG');
    if (!window.JNCOSCloudStore) await loadScript('/assets/js/cloud-store.js', 'JNCOSCloudStore');
  })();

  window.JNCOSContactStore = {
    get mode() { return window.JNCOSCloudStore?.configured ? 'firestore+local' : 'local'; },
    async create(payload) {
      await ensureBackend();
      const item = normalize(payload);
      writeLocal([item, ...localList().filter((x) => x.id !== item.id)]);
      await window.JNCOSCloudStore?.put?.('contacts', item.id, { ...item, createdAtISO: item.createdAt });
      return item;
    },
    async list() {
      await ensureBackend();
      const statuses = statusMap();
      const local = localList().map((item) => ({ ...item, status: statuses[item.id] || item.status || 'New' }));
      const cloud = await window.JNCOSCloudStore?.list?.('contacts', 1000) || [];
      return merge(local, cloud);
    },
    async setStatus(id, status) {
      await ensureBackend();
      const statuses = statusMap(); statuses[id] = status; localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      await window.JNCOSCloudStore?.update?.('contacts', id, { status }); return true;
    },
    async remove(id) {
      await ensureBackend();
      writeLocal(localList().filter((item) => item.id !== id));
      const statuses = statusMap(); delete statuses[id]; localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      await window.JNCOSCloudStore?.remove?.('contacts', id); return true;
    }
  };
})();
