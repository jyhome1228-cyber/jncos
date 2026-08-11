(() => {
  const STORAGE_KEY = 'jncos_inquiries_v1';
  const STATUS_KEY = 'jncos_inquiry_status_v1';
  const RUNTIME_VERSION = '20260812-0042';
  const basePath = window.JNCOS_BASE_PATH || (location.hostname.endsWith('github.io') ? '/jncos' : '');
  const safeParse = (value, fallback) => { try { return JSON.parse(value); } catch (_) { return fallback; } };
  const listLocal = () => safeParse(localStorage.getItem(STORAGE_KEY), []);
  const writeLocal = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const statusMap = () => safeParse(localStorage.getItem(STATUS_KEY), {});
  const uid = () => window.crypto?.randomUUID?.() || `jnc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const normalize = (record) => ({ id:record.id || uid(), type:'inquiry', createdAt:record.createdAt || record.createdAtISO || new Date().toISOString(), status:record.status || 'New', ...record });
  const merge = (local, cloud) => { const map=new Map(); [...local,...cloud].forEach((item)=>{ const n=normalize(item); map.set(n.id,{...(map.get(n.id)||{}),...n}); }); return [...map.values()].sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0)); };
  const withVersion = (src) => `${basePath}${src}${src.includes('?') ? '&' : '?'}v=${RUNTIME_VERSION}`;
  const loadScript = (src,key) => new Promise((resolve) => {
    if(window[key]) return resolve();
    const existing=document.querySelector(`script[data-loader="${key}"]`);
    if(existing){ existing.addEventListener('load',resolve,{once:true}); existing.addEventListener('error',resolve,{once:true}); return; }
    const script=document.createElement('script');
    script.src=withVersion(src);
    script.setAttribute('data-loader',key);
    script.onload=resolve;
    script.onerror=resolve;
    document.head.appendChild(script);
  });
  let backendPromise;
  const ensureBackend = () => backendPromise ||= (async()=>{
    if(!window.JNCOS_FIREBASE_CONFIG) await loadScript('/assets/js/firebase-config.js','JNCOS_FIREBASE_CONFIG');
    if(!window.JNCOSCloudStore) await loadScript('/assets/js/cloud-store.js','JNCOSCloudStore');
  })();
  const cloudError = (result) => {
    const error=new Error(result?.message || 'Cloud sync failed.');
    error.code=result?.code || 'firestore/unknown';
    error.details={ host:location.hostname, projectId:window.JNCOS_FIREBASE_CONFIG?.projectId || '', result };
    return error;
  };

  window.JNCOSInquiryStore = {
    get mode(){ return window.JNCOSCloudStore?.configured ? 'firestore+local' : 'local'; },
    get diagnostics(){ return { host:location.hostname, mode:this.mode, projectId:window.JNCOS_FIREBASE_CONFIG?.projectId || '', configured:!!window.JNCOSCloudStore?.configured, runtimeVersion:RUNTIME_VERSION }; },
    async create(payload){
      await ensureBackend();
      const item=normalize(payload);
      const previous=listLocal();
      writeLocal([item,...previous.filter((x)=>x.id!==item.id)]);
      if(window.JNCOSCloudStore?.configured){
        const result=await window.JNCOSCloudStore.put('inquiries',item.id,{...item,createdAtISO:item.createdAt});
        if(!result?.ok){
          writeLocal(previous);
          console.error('[JNCOS Inquiry Cloud Save]', { host:location.hostname, projectId:window.JNCOS_FIREBASE_CONFIG?.projectId || '', code:result?.code, message:result?.message });
          throw cloudError(result);
        }
      }
      return item;
    },
    async list(){
      await ensureBackend();
      const statuses=statusMap();
      const local=listLocal().map((item)=>({...item,status:statuses[item.id]||item.status||'New'}));
      const cloud=await window.JNCOSCloudStore?.list?.('inquiries',1000)||[];
      return merge(local,cloud);
    },
    async get(id){ return (await this.list()).find((item)=>item.id===id)||null; },
    async setStatus(id,status){
      await ensureBackend();
      const statuses=statusMap(); statuses[id]=status; localStorage.setItem(STATUS_KEY,JSON.stringify(statuses));
      if(window.JNCOSCloudStore?.configured){ const result=await window.JNCOSCloudStore.update('inquiries',id,{status}); if(!result?.ok) throw cloudError(result); }
      return true;
    },
    async remove(id){
      await ensureBackend();
      writeLocal(listLocal().filter((item)=>item.id!==id));
      const statuses=statusMap(); delete statuses[id]; localStorage.setItem(STATUS_KEY,JSON.stringify(statuses));
      if(window.JNCOSCloudStore?.configured){ const result=await window.JNCOSCloudStore.remove('inquiries',id); if(!result?.ok) throw cloudError(result); }
      return true;
    },
    async clear(){ localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(STATUS_KEY); }
  };
})();
