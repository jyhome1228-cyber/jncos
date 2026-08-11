(() => {
  const STORAGE_KEY = 'jncos_inquiries_v1';
  const STATUS_KEY = 'jncos_inquiry_status_v1';
  const RUNTIME_VERSION = '20260812-0132-rest';
  const FIREBASE_PROJECT_ID = 'jncostech';
  const FIREBASE_API_KEY = 'AIzaSyC-QT7LqvH4qXwhZDHDyyzV4r1y8rZTLcM';

  const safeParse = (value, fallback) => {
    try { return JSON.parse(value); } catch (_) { return fallback; }
  };

  const listLocal = () => safeParse(localStorage.getItem(STORAGE_KEY), []);
  const writeLocal = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const statusMap = () => safeParse(localStorage.getItem(STATUS_KEY), {});
  const uid = () => window.crypto?.randomUUID?.() || `jnc-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const normalize = (record) => ({
    id: record.id || uid(),
    type: 'inquiry',
    createdAt: record.createdAt || record.createdAtISO || new Date().toISOString(),
    status: record.status || 'New',
    ...record
  });

  const plainData = (value) => JSON.parse(JSON.stringify(value, (_key, val) => val === undefined ? null : val));

  const toFirestoreValue = (value) => {
    if (value === null || value === undefined) return { nullValue: null };
    if (typeof value === 'string') return { stringValue: value };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') {
      return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    }
    if (Array.isArray(value)) {
      return { arrayValue: { values: value.map(toFirestoreValue) } };
    }
    if (typeof value === 'object') {
      return { mapValue: { fields: toFirestoreFields(value) } };
    }
    return { stringValue: String(value) };
  };

  const toFirestoreFields = (object) => {
    const fields = {};
    Object.entries(object || {}).forEach(([key, value]) => {
      fields[key] = toFirestoreValue(value);
    });
    return fields;
  };

  const createViaRest = async (item) => {
    const payload = plainData({
      ...item,
      createdAtISO: item.createdAt,
      submittedPage: location.pathname,
      submittedHost: location.hostname,
      updatedAtISO: new Date().toISOString()
    });

    const endpoint = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(FIREBASE_PROJECT_ID)}/databases/(default)/documents/inquiries?documentId=${encodeURIComponent(item.id)}&key=${encodeURIComponent(FIREBASE_API_KEY)}`;

    const response = await fetch(endpoint, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(payload) })
    });

    let body = null;
    try { body = await response.json(); } catch (_) {}

    if (!response.ok) {
      const status = body?.error?.status || `HTTP_${response.status}`;
      const message = body?.error?.message || `Firestore REST request failed with HTTP ${response.status}.`;
      const error = new Error(message);
      error.code = `firestore/${String(status).toLowerCase().replace(/_/g, '-')}`;
      error.httpStatus = response.status;
      error.response = body;
      throw error;
    }

    return body;
  };

  window.JNCOSInquiryStore = {
    get mode() { return 'firestore-rest+local'; },
    get diagnostics() {
      return {
        host: location.hostname,
        mode: 'firestore-rest+local',
        projectId: FIREBASE_PROJECT_ID,
        runtimeVersion: RUNTIME_VERSION,
        lastResult: window.JNCOS_INQUIRY_LAST_RESULT || null
      };
    },

    async create(payload) {
      const item = normalize(payload);
      const previous = listLocal();

      try {
        const cloud = await createViaRest(item);
        writeLocal([item, ...previous.filter((x) => x.id !== item.id)]);
        window.JNCOS_INQUIRY_LAST_RESULT = {
          ok: true,
          id: item.id,
          collection: 'inquiries',
          host: location.hostname,
          transport: 'firestore-rest',
          runtimeVersion: RUNTIME_VERSION,
          cloudName: cloud?.name || ''
        };
        return item;
      } catch (error) {
        window.JNCOS_INQUIRY_LAST_RESULT = {
          ok: false,
          code: error?.code || 'firestore/rest-error',
          message: error?.message || 'Unknown Firestore REST error.',
          httpStatus: error?.httpStatus || 0,
          host: location.hostname,
          projectId: FIREBASE_PROJECT_ID,
          transport: 'firestore-rest',
          runtimeVersion: RUNTIME_VERSION,
          response: error?.response || null
        };
        console.error('[JNCOS Inquiry Firestore REST]', window.JNCOS_INQUIRY_LAST_RESULT, error);
        throw error;
      }
    },

    async list() {
      const statuses = statusMap();
      return listLocal()
        .map((item) => ({ ...item, status: statuses[item.id] || item.status || 'New' }))
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    },

    async get(id) {
      return (await this.list()).find((item) => item.id === id) || null;
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
