(() => {
  const STORAGE_KEY = 'jncos_visits_v1';
  const VISITOR_KEY = 'jncos_visitor_id_v1';
  const SESSION_KEY = 'jncos_session_id_v1';
  const safeParse = (value, fallback) => { try { return JSON.parse(value); } catch (_) { return fallback; } };
  const uid = (prefix) => window.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const visitorId = localStorage.getItem(VISITOR_KEY) || uid('visitor');
  localStorage.setItem(VISITOR_KEY, visitorId);
  const sessionId = sessionStorage.getItem(SESSION_KEY) || uid('session');
  sessionStorage.setItem(SESSION_KEY, sessionId);

  const localList = () => safeParse(localStorage.getItem(STORAGE_KEY), []);
  const writeLocal = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 1500)));
  const indiaDate = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year:'numeric', month:'2-digit', day:'2-digit' }).formatToParts(date);
    const get = (type) => parts.find((p) => p.type === type)?.value || '';
    return `${get('year')}-${get('month')}-${get('day')}`;
  };
  const merge = (local, cloud) => {
    const map = new Map();
    [...local, ...cloud].forEach((item) => { if (item?.id) map.set(item.id, { ...(map.get(item.id) || {}), ...item }); });
    return [...map.values()].sort((a,b) => new Date(b.lastSeen || b.createdAt || 0) - new Date(a.lastSeen || a.createdAt || 0));
  };

  const trackPageView = async () => {
    if (/\/admin\/?(?:index\.html)?$/i.test(location.pathname)) return;
    const now = new Date().toISOString();
    const list = localList();
    const existing = list.find((item) => item.id === sessionId);
    const params = new URLSearchParams(location.search);
    const record = existing ? {
      ...existing,
      lastSeen: now,
      date: indiaDate(),
      pageViews: (Number(existing.pageViews) || 0) + 1,
      currentPage: location.pathname
    } : {
      id: sessionId,
      visitorId,
      sessionId,
      type: 'visit',
      createdAt: now,
      firstSeen: now,
      lastSeen: now,
      date: indiaDate(),
      pageViews: 1,
      landingPage: location.pathname,
      currentPage: location.pathname,
      referrer: document.referrer || '',
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      language: navigator.language || '',
      device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
    };
    writeLocal([record, ...list.filter((item) => item.id !== sessionId)]);
    await window.JNCOSCloudStore?.put?.('visits', sessionId, record);
    return record;
  };

  window.JNCOSVisitorStore = {
    get mode() { return window.JNCOSCloudStore?.configured ? 'firestore+local' : 'local'; },
    trackPageView,
    async list() {
      const local = localList();
      const cloud = await window.JNCOSCloudStore?.list?.('visits', 1500) || [];
      return merge(local, cloud);
    },
    async stats() {
      const visits = await this.list();
      const today = indiaDate();
      const now = new Date();
      const since = new Date(now.getTime() - 6 * 86400000);
      const days = [];
      for (let i = 6; i >= 0; i--) days.push(indiaDate(new Date(now.getTime() - i * 86400000)));
      const unique = (rows) => new Set(rows.map((v) => v.visitorId || v.id)).size;
      const todayRows = visits.filter((v) => v.date === today);
      const weekRows = visits.filter((v) => v.date && v.date >= indiaDate(since));
      const daily = days.map((date) => ({
        date,
        visitors: unique(visits.filter((v) => v.date === date)),
        sessions: visits.filter((v) => v.date === date).length,
        pageViews: visits.filter((v) => v.date === date).reduce((sum, v) => sum + (Number(v.pageViews) || 0), 0)
      }));
      return {
        todayVisitors: unique(todayRows),
        weekVisitors: unique(weekRows),
        totalVisitors: unique(visits),
        totalSessions: visits.length,
        pageViews: visits.reduce((sum, v) => sum + (Number(v.pageViews) || 0), 0),
        daily,
        recent: visits.slice(0, 20)
      };
    }
  };
})();
