(() => {
  const STORAGE_KEY = 'jncos_visits_v1';
  const VISITOR_KEY = 'jncos_visitor_id_v1';
  const SESSION_KEY = 'jncos_session_id_v1';
  const TOTAL_COUNTED_KEY = 'jncos_traffic_total_counted_v2';
  const DAY_COUNTED_KEY = 'jncos_traffic_day_counted_v2';
  const SESSION_COUNTED_KEY = 'jncos_traffic_session_counted_v2';
  const basePath = window.JNCOS_BASE_PATH || (location.hostname.endsWith('github.io') ? '/jncos' : '');
  const safeParse = (value, fallback) => { try { return JSON.parse(value); } catch (_) { return fallback; } };
  const uid = (prefix) => window.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const visitorId = localStorage.getItem(VISITOR_KEY) || uid('visitor');
  localStorage.setItem(VISITOR_KEY, visitorId);
  const sessionId = sessionStorage.getItem(SESSION_KEY) || uid('session');
  sessionStorage.setItem(SESSION_KEY, sessionId);
  const localList = () => safeParse(localStorage.getItem(STORAGE_KEY), []);
  const writeLocal = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 1500)));

  const indiaDate = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Kolkata', year:'numeric', month:'2-digit', day:'2-digit' }).formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value || '';
    return `${get('year')}-${get('month')}-${get('day')}`;
  };

  const merge = (local, cloud) => {
    const map = new Map();
    [...local, ...cloud].forEach((item) => {
      if (item?.id) map.set(item.id, { ...(map.get(item.id) || {}), ...item });
    });
    return [...map.values()].sort((a,b) => new Date(b.lastSeen || b.createdAt || 0) - new Date(a.lastSeen || a.createdAt || 0));
  };

  const loadScript = (src, key) => new Promise((resolve) => {
    if (window[key]) return resolve();
    const existing = document.querySelector(`script[data-loader="${key}"]`);
    if (existing) { existing.addEventListener('load', resolve, { once:true }); return; }
    const script = document.createElement('script');
    script.src = `${basePath}${src}`;
    script.setAttribute('data-loader', key);
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });

  let backendPromise;
  const ensureBackend = () => backendPromise ||= (async () => {
    if (!window.JNCOS_FIREBASE_CONFIG) await loadScript('/assets/js/firebase-config.js?v=20260811-2150', 'JNCOS_FIREBASE_CONFIG');
    if (!window.JNCOSCloudStore) await loadScript('/assets/js/cloud-store.js?v=20260811-2150', 'JNCOSCloudStore');
  })();

  const localStats = () => {
    const visits = localList();
    const today = indiaDate();
    const now = new Date();
    const since = new Date(now.getTime() - 6 * 86400000);
    const days = [];
    for (let i=6;i>=0;i--) days.push(indiaDate(new Date(now.getTime()-i*86400000)));
    const unique = (rows) => new Set(rows.map((v) => v.visitorId || v.id)).size;
    const todayRows = visits.filter((v) => v.date === today);
    const weekRows = visits.filter((v) => v.date && v.date >= indiaDate(since));
    const daily = days.map((date) => ({
      date,
      visitors:unique(visits.filter((v)=>v.date===date)),
      sessions:visits.filter((v)=>v.date===date).length,
      pageViews:visits.filter((v)=>v.date===date).reduce((sum,v)=>sum+(Number(v.pageViews)||0),0)
    }));
    return {
      todayVisitors:unique(todayRows),
      weekVisitors:unique(weekRows),
      totalVisitors:unique(visits),
      totalSessions:visits.length,
      pageViews:visits.reduce((sum,v)=>sum+(Number(v.pageViews)||0),0),
      daily,
      recent:visits.slice(0,20),
      source:'local'
    };
  };

  const aggregateStats = async () => {
    await ensureBackend();
    if (!window.JNCOSCloudStore?.configured) return null;

    const [dayRows, summary] = await Promise.all([
      window.JNCOSCloudStore.list('trafficDays', 400),
      window.JNCOSCloudStore.get('trafficSummary', 'total')
    ]);

    if (!summary && !dayRows.length) return null;

    const today = indiaDate();
    const now = new Date();
    const days = [];
    for (let i=6;i>=0;i--) days.push(indiaDate(new Date(now.getTime()-i*86400000)));
    const byDate = new Map(dayRows.map((row) => [row.date || row.id, row]));
    const daily = days.map((date) => {
      const row = byDate.get(date) || {};
      return {
        date,
        visitors:Number(row.visitors)||0,
        sessions:Number(row.sessions)||0,
        pageViews:Number(row.pageViews)||0
      };
    });

    return {
      todayVisitors:Number(byDate.get(today)?.visitors)||0,
      weekVisitors:daily.reduce((sum,row)=>sum+row.visitors,0),
      totalVisitors:Number(summary?.visitors)||0,
      totalSessions:Number(summary?.sessions)||0,
      pageViews:Number(summary?.pageViews)||0,
      daily,
      recent:[],
      source:'firestore-aggregate'
    };
  };

  const trackPageView = async () => {
    if (/\/admin\/?(?:index\.html)?$/i.test(location.pathname)) return;
    await ensureBackend();

    const now = new Date().toISOString();
    const dateKey = indiaDate();
    const list = localList();
    const existing = list.find((item) => item.id === sessionId);
    const params = new URLSearchParams(location.search);
    const record = existing ? {
      ...existing,
      lastSeen:now,
      date:dateKey,
      pageViews:(Number(existing.pageViews)||0)+1,
      currentPage:location.pathname
    } : {
      id:sessionId,
      visitorId,
      sessionId,
      type:'visit',
      createdAt:now,
      firstSeen:now,
      lastSeen:now,
      date:dateKey,
      pageViews:1,
      landingPage:location.pathname,
      currentPage:location.pathname,
      referrer:document.referrer || '',
      utmSource:params.get('utm_source') || '',
      utmMedium:params.get('utm_medium') || '',
      utmCampaign:params.get('utm_campaign') || '',
      language:navigator.language || '',
      device:/Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    };

    writeLocal([record, ...list.filter((item) => item.id !== sessionId)]);

    const firstTotalVisit = localStorage.getItem(TOTAL_COUNTED_KEY) !== '1';
    const firstVisitToday = localStorage.getItem(DAY_COUNTED_KEY) !== dateKey;
    const firstPageThisSession = sessionStorage.getItem(SESSION_COUNTED_KEY) !== sessionId;

    const [rawResult, aggregateResult] = await Promise.all([
      window.JNCOSCloudStore?.put?.('visits', sessionId, record),
      window.JNCOSCloudStore?.incrementTraffic?.(
        dateKey,
        {
          visitors:firstVisitToday ? 1 : 0,
          sessions:firstPageThisSession ? 1 : 0,
          pageViews:1
        },
        {
          visitors:firstTotalVisit ? 1 : 0,
          sessions:firstPageThisSession ? 1 : 0,
          pageViews:1
        }
      )
    ]);

    if (aggregateResult?.ok) {
      if (firstTotalVisit) localStorage.setItem(TOTAL_COUNTED_KEY, '1');
      if (firstVisitToday) localStorage.setItem(DAY_COUNTED_KEY, dateKey);
      if (firstPageThisSession) sessionStorage.setItem(SESSION_COUNTED_KEY, sessionId);
    }

    return { record, rawResult, aggregateResult };
  };

  window.JNCOSVisitorStore = {
    get mode() { return window.JNCOSCloudStore?.configured ? 'firestore+local' : 'local'; },
    trackPageView,
    async list() {
      await ensureBackend();
      return merge(localList(), await window.JNCOSCloudStore?.list?.('visits',1500) || []);
    },
    async stats() {
      const aggregate = await aggregateStats();
      return aggregate || localStats();
    }
  };
})();
