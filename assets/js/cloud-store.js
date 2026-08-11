(() => {
  const config = window.JNCOS_FIREBASE_CONFIG || {};
  const configured = Boolean(config.apiKey && config.projectId && config.appId);
  const FIREBASE_VERSION = '12.17.1';
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

  const normalizeError = (error) => ({
    ok: false,
    code: error?.code || 'firestore/unknown',
    message: error?.message || 'Unknown Firestore error'
  });

  const getClient = async () => {
    if (!configured) return null;
    if (!clientPromise) {
      clientPromise = (async () => {
        const [{ initializeApp, getApps }, firestore] = await Promise.all([
          import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
          import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`)
        ]);
        const app = getApps().length ? getApps()[0] : initializeApp(config);
        return { db: firestore.getFirestore(app), fs: firestore, app };
      })().catch((error) => {
        console.warn('[JNCOS] Firebase initialization failed.', { firebaseVersion:FIREBASE_VERSION, error });
        return null;
      });
    }
    return clientPromise;
  };

  const withClient = async (handler) => {
    const client = await getClient();
    if (!client) return { ok:false, code:'firebase/not-initialized', message:'Firebase could not be initialized.' };
    try { return await handler(client); }
    catch (error) {
      console.warn('[JNCOS] Firestore request failed.', error);
      return normalizeError(error);
    }
  };

  const counter = (value) => Math.max(0, Math.min(1, Number(value) || 0));

  window.JNCOSCloudStore = {
    configured,
    mode: configured ? 'firestore' : 'local',
    firebaseVersion: FIREBASE_VERSION,
    getClient,
    async ping() {
      return withClient(async ({ db, fs }) => {
        await fs.getDoc(fs.doc(db, '__jncos_health__', 'connection'));
        return { ok:true, projectId:config.projectId };
      });
    },
    async put(collectionName, id, payload) {
      return withClient(async ({ db, fs }) => {
        const ref = fs.doc(db, collectionName, id);
        await fs.setDoc(ref, {
          ...payload,
          id,
          updatedAtISO: new Date().toISOString()
        });
        return { ok:true, id, collection:collectionName };
      });
    },
    async update(collectionName, id, patch) {
      return withClient(async ({ db, fs }) => {
        await fs.setDoc(fs.doc(db, collectionName, id), {
          ...patch,
          updatedAtISO: new Date().toISOString()
        }, { merge:true });
        return { ok:true, id, collection:collectionName };
      });
    },
    async remove(collectionName, id) {
      return withClient(async ({ db, fs }) => {
        await fs.deleteDoc(fs.doc(db, collectionName, id));
        return { ok:true, id, collection:collectionName };
      });
    },
    async get(collectionName, id) {
      const result = await withClient(async ({ db, fs }) => {
        const snapshot = await fs.getDoc(fs.doc(db, collectionName, id));
        return { ok:true, item:snapshot.exists() ? normalizeValue({ id:snapshot.id, ...snapshot.data() }) : null };
      });
      return result?.ok ? result.item : null;
    },
    async list(collectionName, max = 1000) {
      const result = await withClient(async ({ db, fs }) => {
        const q = fs.query(fs.collection(db, collectionName), fs.limit(max));
        const snapshot = await fs.getDocs(q);
        return { ok:true, items:snapshot.docs.map((doc) => normalizeValue({ id:doc.id, ...doc.data() })) };
      });
      return result?.ok ? result.items : [];
    },
    async incrementTraffic(dateKey, dayDelta = {}, totalDelta = {}) {
      return withClient(async ({ db, fs }) => {
        const dayRef = fs.doc(db, 'trafficDays', dateKey);
        const totalRef = fs.doc(db, 'trafficSummary', 'total');
        const batch = fs.writeBatch(db);
        const now = new Date().toISOString();

        batch.set(dayRef, {
          date: dateKey,
          visitors: fs.increment(counter(dayDelta.visitors)),
          sessions: fs.increment(counter(dayDelta.sessions)),
          pageViews: fs.increment(counter(dayDelta.pageViews)),
          updatedAtISO: now
        }, { merge:true });

        batch.set(totalRef, {
          scope: 'total',
          visitors: fs.increment(counter(totalDelta.visitors)),
          sessions: fs.increment(counter(totalDelta.sessions)),
          pageViews: fs.increment(counter(totalDelta.pageViews)),
          updatedAtISO: now
        }, { merge:true });

        await batch.commit();
        return { ok:true, date:dateKey };
      });
    }
  };
})();
