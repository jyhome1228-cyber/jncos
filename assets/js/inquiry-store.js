(() => {
  const STORAGE_KEY = 'jncos_inquiries_v1';
  const STATUS_KEY = 'jncos_inquiry_status_v1';
  const RUNTIME_VERSION = '20260812-0128';

  const firebaseConfig = {
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

  // Keep Inquiry on exactly the same Firebase client path as the working Contact form.
  // Do not load Firestore Lite or a second named Firebase app here.
  let firebasePromise = null;
  const getFirebase = () => firebasePromise ||= Promise.all([
    import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js')
  ]).then(([appMod, fsMod]) => {
    const apps = appMod.getApps();
    const app = apps.length ? apps[0] : appMod.initializeApp(firebaseConfig);
    const db = fsMod.getFirestore(app);
    return { db, fs: fsMod, app };
  });

  const plainData = (value) => JSON.parse(JSON.stringify(value, (_key, val) => val === undefined ? null : val));

  const normalizeFirebaseError = (error) => {
    const rawCode = error?.code || '';
    const rawMessage = error?.message || String(error || 'Unknown Firebase error');
    const out = new Error(rawMessage);
    out.code = rawCode || 'firestore/unknown';
    out.name = error?.name || 'FirebaseError';
    out.details = {
      host: location.hostname,
      projectId: firebaseConfig.projectId,
      runtimeVersion: RUNTIME_VERSION,
      originalName: error?.name || '',
      originalCode: rawCode,
      originalMessage: rawMessage
    };
    return out;
  };

  window.JNCOSInquiryStore = {
    get mode() { return 'firestore+local'; },
    get diagnostics() {
      return {
        host: location.hostname,
        mode: 'standard-firestore+local',
        projectId: firebaseConfig.projectId,
        runtimeVersion: RUNTIME_VERSION,
        lastResult: window.JNCOS_INQUIRY_LAST_RESULT || null
      };
    },

    async create(payload) {
      const item = normalize(payload);
      const previous = listLocal();
      const cloudPayload = plainData({
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
          transport: 'standard-firestore',
          runtimeVersion: RUNTIME_VERSION
        };
        return item;
      } catch (error) {
        const normalized = normalizeFirebaseError(error);
        window.JNCOS_INQUIRY_LAST_RESULT = {
          ok: false,
          code: normalized.code,
          name: normalized.name,
          message: normalized.message,
          details: normalized.details
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
})();