(() => {
  const STORAGE_KEY = 'jncos_inquiries_v1';
  const STATUS_KEY = 'jncos_inquiry_status_v1';
  const RUNTIME_VERSION = '20260812-0115';
  const basePath = window.JNCOS_BASE_PATH || (location.hostname.endsWith('github.io') ? '/jncos' : '');

  const firebaseConfig = window.JNCOS_FIREBASE_CONFIG || {
    apiKey: 'AIzaSyC-QT7LqvH4qXwhZDHDyyzV4r1y8rZTLcM',
    authDomain: 'jncostech.firebaseapp.com',
    projectId: 'jncostech',
    storageBucket: 'jncostech.firebasestorage.app',
    messagingSenderId: '629672019213',
    appId: '1:629672019213:web:c2c0d5699fb65ce848dc44'
  };

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
  const merge = (local, cloud) => {
    const map = new Map();
    [...local, ...cloud].forEach((item) => {
      const n = normalize(item);
      map.set(n.id, { ...(map.get(n.id) || {}), ...n });
    });
    return [...map.values()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  };

  let firebasePromise = null;
  const getFirebase = () => firebasePromise ||= Promise.all([
    import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js')
  ]).then(([appMod, fsMod]) => {
    const app = appMod.getApps().length ? appMod.getApps()[0] : appMod.initializeApp(firebaseConfig);
    return { db: fsMod.getFirestore(app), fs: fsMod, app };
  });

  const normalizeFirebaseError = (error) => {
    const out = new Error(error?.message || 'Firebase could not save the inquiry.');
    out.code = error?.code || 'firestore/unknown';
    out.details = {
      host: location.hostname,
      projectId: firebaseConfig.projectId,
      runtimeVersion: RUNTIME_VERSION
    };
    return out;
  };

  const cleanForFirestore = (value) => {
    if (value === undefined) return null;
    if (value === null) return null;
    if (Array.isArray(value)) return value.map(cleanForFirestore);
    if (typeof value === 'object') {
      const out = {};
      Object.entries(value).forEach(([key, val]) => {
        if (val !== undefined) out[key] = cleanForFirestore(val);
      });
      return out;
    }
    return value;
  };

  window.JNCOSInquiryStore = {
    get mode() { return 'firestore+local'; },
    get diagnostics() {
      return {
        host: location.hostname,
        mode: 'direct-firestore+local',
        projectId: firebaseConfig.projectId,
        runtimeVersion: RUNTIME_VERSION
      };
    },

    async create(payload) {
      const item = normalize(payload);
      const previous = listLocal();
      const cloudPayload = cleanForFirestore({
        ...item,
        createdAtISO: item.createdAt,
        submittedPage: location.pathname,
        submittedHost: location.hostname,
        updatedAtISO: new Date().toISOString()
      });

      try {
        const { db, fs } = await getFirebase();
        await fs.setDoc(fs.doc(db, 'inquiries', item.id), cloudPayload);
        writeLocal([item, ...previous.filter((x) => x.id !== item.id)]);
        window.JNCOS_INQUIRY_LAST_RESULT = {
          ok: true,
          id: item.id,
          collection: 'inquiries',
          host: location.hostname,
          runtimeVersion: RUNTIME_VERSION
        };
        return item;
      } catch (error) {
        const normalized = normalizeFirebaseError(error);
        window.JNCOS_INQUIRY_LAST_RESULT = {
          ok: false,
          code: normalized.code,
          message: normalized.message,
          host: location.hostname,
          projectId: firebaseConfig.projectId,
          runtimeVersion: RUNTIME_VERSION
        };
        console.error('[JNCOS Inquiry Firestore]', window.JNCOS_INQUIRY_LAST_RESULT, error);
        throw normalized;
      }
    },

    async list() {
      const statuses = statusMap();
      const local = listLocal().map((item) => ({
        ...item,
        status: statuses[item.id] || item.status || 'New'
      }));
      try {
        const { db, fs } = await getFirebase();
        const snap = await fs.getDocs(fs.query(fs.collection(db, 'inquiries'), fs.limit(1000)));
        const cloud = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        return merge(local, cloud);
      } catch (_) {
        return local;
      }
    },

    async get(id) {
      return (await this.list()).find((item) => item.id === id) || null;
    },

    async setStatus(id, status) {
      const statuses = statusMap();
      statuses[id] = status;
      localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      const { db, fs } = await getFirebase();
      await fs.setDoc(fs.doc(db, 'inquiries', id), {
        status,
        updatedAtISO: new Date().toISOString()
      }, { merge: true });
      return true;
    },

    async remove(id) {
      writeLocal(listLocal().filter((item) => item.id !== id));
      const statuses = statusMap();
      delete statuses[id];
      localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
      const { db, fs } = await getFirebase();
      await fs.deleteDoc(fs.doc(db, 'inquiries', id));
      return true;
    },

    async clear() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STATUS_KEY);
    }
  };

  const loadTraffic = () => {
    if (window.JNCOSVisitorStore) {
      window.JNCOSVisitorStore.trackPageView?.();
      return;
    }
    const existing = document.querySelector('script[data-inquiry-visitor-runtime]');
    if (existing) return;
    const script = document.createElement('script');
    script.src = `${basePath}/assets/js/visitor-store.js?v=${RUNTIME_VERSION}`;
    script.setAttribute('data-inquiry-visitor-runtime', '');
    script.onload = () => window.JNCOSVisitorStore?.trackPageView?.();
    document.head.appendChild(script);
  };
  loadTraffic();
})();
