(() => {
  const config = window.JNCOS_FIREBASE_CONFIG || {};
  const loginScreen = document.querySelector('[data-admin-login]');
  const appScreen = document.querySelector('[data-admin-app]');
  const loginForm = document.querySelector('[data-admin-login-form]');
  const emailInput = document.querySelector('[data-admin-email]');
  const passwordInput = document.querySelector('[data-admin-password]');
  const message = document.querySelector('[data-admin-login-message]');
  const logoutButton = document.querySelector('[data-admin-logout]');
  const resetButton = document.querySelector('[data-admin-reset]');
  const userLabel = document.querySelector('[data-admin-user]');

  const showMessage = (text, type = 'error') => {
    if (!message) return;
    message.textContent = text;
    message.dataset.type = type;
    message.hidden = !text;
  };

  const showLogin = () => {
    if (loginScreen) loginScreen.hidden = false;
    if (appScreen) appScreen.hidden = true;
    if (logoutButton) logoutButton.hidden = true;
    if (userLabel) userLabel.hidden = true;
  };

  const loadDashboard = () => {
    if (document.querySelector('script[data-admin-dashboard]')) return;
    const script = document.createElement('script');
    script.src = '../assets/js/admin.js';
    script.setAttribute('data-admin-dashboard', '');
    document.body.appendChild(script);
  };

  const showApp = (user) => {
    if (loginScreen) loginScreen.hidden = true;
    if (appScreen) appScreen.hidden = false;
    if (logoutButton) logoutButton.hidden = false;
    if (userLabel) {
      userLabel.hidden = false;
      userLabel.textContent = user.email || 'Admin';
    }
    window.JNCOS_ADMIN_READY = true;
    loadDashboard();
    window.dispatchEvent(new CustomEvent('jncos:admin-ready', { detail: { user } }));
  };

  const init = async () => {
    if (!config.apiKey || !config.projectId || !config.appId) {
      showLogin();
      showMessage('Firebase configuration is missing.', 'error');
      return;
    }

    try {
      const [{ initializeApp, getApps }, authMod, fsMod] = await Promise.all([
        import('https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js'),
        import('https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js'),
        import('https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js')
      ]);

      const app = getApps().length ? getApps()[0] : initializeApp(config);
      const auth = authMod.getAuth(app);
      const db = fsMod.getFirestore(app);

      const verifyAdmin = async (user) => {
        if (!user) {
          showLogin();
          return false;
        }
        try {
          const snapshot = await fsMod.getDoc(fsMod.doc(db, 'admins', user.uid));
          if (!snapshot.exists() || snapshot.data()?.active === false) {
            await authMod.signOut(auth);
            showLogin();
            showMessage('This account is signed in, but it is not registered as a JN COS TECH administrator.', 'error');
            return false;
          }
          showMessage('');
          showApp(user);
          return true;
        } catch (error) {
          console.error(error);
          showLogin();
          showMessage('Unable to verify administrator access. Check Firestore Rules and the admins collection.', 'error');
          return false;
        }
      };

      authMod.onAuthStateChanged(auth, verifyAdmin);

      loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = emailInput?.value.trim() || '';
        const password = passwordInput?.value || '';
        if (!email || !password) return;
        const submit = loginForm.querySelector('[type="submit"]');
        submit.disabled = true;
        submit.textContent = 'Signing in…';
        showMessage('');
        try {
          const credential = await authMod.signInWithEmailAndPassword(auth, email, password);
          await verifyAdmin(credential.user);
        } catch (error) {
          console.error(error);
          showMessage('Sign-in failed. Check the email/password and confirm this UID exists in the admins collection.', 'error');
        } finally {
          submit.disabled = false;
          submit.textContent = 'Sign In';
        }
      });

      logoutButton?.addEventListener('click', async () => {
        await authMod.signOut(auth);
        window.JNCOS_ADMIN_READY = false;
        location.reload();
      });

      resetButton?.addEventListener('click', async () => {
        const email = emailInput?.value.trim() || '';
        if (!email) {
          showMessage('Enter your admin email first.', 'info');
          emailInput?.focus();
          return;
        }
        try {
          await authMod.sendPasswordResetEmail(auth, email);
          showMessage('Password reset email sent.', 'success');
        } catch (error) {
          console.error(error);
          showMessage('Could not send the reset email. Check the account email.', 'error');
        }
      });
    } catch (error) {
      console.error(error);
      showLogin();
      showMessage('Firebase Authentication could not be initialized.', 'error');
    }
  };

  init();
})();
