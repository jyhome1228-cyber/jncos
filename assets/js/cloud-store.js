(() => {
  const config = window.JNCOS_FIREBASE_CONFIG || {};
  const configured = Boolean(config.apiKey && config.projectId && config.appId);
  let clientPromise = null;

  const normalizeValue = (value) => {
    if (value == null) return value;
    if (Array.isArray(value)) return value.map(normalizeValue);
    if (typeof value === 'object') {
      if (typeof value.toDate === 'function') return value.toDate().toISOString();
      const out = {};
      Object.entries(value).forEach(([key, val]) => { out[key] = normalizeValue(val); });
      return out;
    }
    return value;
  };

  const getClient = async () => {
    if (!configured) return null;
    if (!clientPromise) {
      clientPromise = (async () => {
        const [{ initializeApp, getApps }, firestore] = await Promise.all([
          import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js'),
          import('https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js')
        ]);
        const app = getApps().length ? getApps()[0] : initializeApp(config);
        return { db: firestore.getFirestore(app), fs: firestore, app };
      })().catch((error) => {
        console.warn('[JNCOS] Firebase initialization failed. Local backup remains active.', error);
        return null;
      });
    }
    return clientPromise;
  };

  const withClient = async (handler, fallback = null) => {
    const client = await getClient();
    if (!client) return fallback;
    try { return await handler(client); }
    catch (error) {
      console.warn('[JNCOS] Firestore request failed. Local backup remains active.', error);
      return fallback;
    }
  };

  window.JNCOSCloudStore = {
    configured,
    mode: configured ? 'firestore' : 'local',
    getClient,
    async ping() {
      return withClient(async ({ db, fs }) => {
        await fs.getDoc(fs.doc(db, '__jncos_health__', 'connection'));
        return { ok: true, projectId: config.projectId };
      }, { ok: false, projectId: config.projectId || '' });
    },
    async put(collectionName, id, payload) {
      return withClient(async ({ db, fs }) => {
        const ref = fs.doc(db, collectionName, id);
        await fs.setDoc(ref, {
          ...payload,
          id,
          updatedAt: fs.serverTimestamp(),
          updatedAtISO: new Date().toISOString()
        }, { merge: true });
        return true;
      }, false);
    },
    async update(collectionName, id, patch) {
      return withClient(async ({ db, fs }) => {
        await fs.setDoc(fs.doc(db, collectionName, id), {
          ...patch,
          updatedAt: fs.serverTimestamp(),
          updatedAtISO: new Date().toISOString()
        }, { merge: true });
        return true;
      }, false);
    },
    async remove(collectionName, id) {
      return withClient(async ({ db, fs }) => {
        await fs.deleteDoc(fs.doc(db, collectionName, id));
        return true;
      }, false);
    },
    async list(collectionName, max = 1000) {
      return withClient(async ({ db, fs }) => {
        const q = fs.query(fs.collection(db, collectionName), fs.limit(max));
        const snapshot = await fs.getDocs(q);
        return snapshot.docs.map((doc) => normalizeValue({ id: doc.id, ...doc.data() }));
      }, []);
    }
  };
})();
