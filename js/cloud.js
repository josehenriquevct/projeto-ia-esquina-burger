/* =========================================================================
   NUVEM — login (Firebase Auth) + sincronização de progresso (Firestore)
   -------------------------------------------------------------------------
   Tudo é tolerante a falhas: se o Firebase não estiver carregado/configurado,
   o app segue funcionando 100% local (sem login).

   Estratégia de merge (NUNCA perder progresso): ao entrar, compara o progresso
   local com o da nuvem e fica com o de MAIOR XP; em empate, o mais recente.
   Depois, cada alteração é enviada para a nuvem automaticamente (debounce).
   ========================================================================= */
const Cloud = {
  _auth: null, _db: null, _user: null, _timer: null, _onAuth: null, _pronto: false, _sincronizando: false,

  disponivel() {
    return typeof firebase !== "undefined" &&
           typeof FIREBASE_ENABLED !== "undefined" && FIREBASE_ENABLED;
  },

  init(onAuth) {
    this._onAuth = onAuth;
    if (!this.disponivel()) return;
    try {
      if (!firebase.apps || !firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      this._auth = firebase.auth();
      this._db = firebase.firestore();
      try { this._auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL); } catch (e) {}
      this._pronto = true;
      this._auth.onAuthStateChanged((u) => {
        this._user = u || null;
        if (u) this._aoEntrar(u).then(() => { if (this._onAuth) this._onAuth(u); });
        else if (this._onAuth) this._onAuth(null);
      });
    } catch (e) { console.warn("Cloud.init falhou:", e); }
  },

  usuario() { return this._user; },
  logado() { return !!this._user; },

  cadastrar(email, senha) { return this._auth.createUserWithEmailAndPassword(email, senha); },
  entrar(email, senha) { return this._auth.signInWithEmailAndPassword(email, senha); },
  entrarGoogle() { return this._auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); },
  redefinirSenha(email) { return this._auth.sendPasswordResetEmail(email); },
  sair() { return this._auth.signOut(); },

  _score(d) { return (d && d.gamify && typeof d.gamify.xp === "number") ? d.gamify.xp : 0; },
  _merge(local, nuvem) {
    const sl = this._score(local), sn = this._score(nuvem);
    if (sn > sl) return nuvem;
    if (sl > sn) return local;
    return (nuvem._updatedAt || 0) >= (local._updatedAt || 0) ? nuvem : local;
  },

  async _aoEntrar(u) {
    if (!this._db) return;
    this._sincronizando = true;
    try {
      const ref = this._db.collection("pmgo_usuarios").doc(u.uid);
      const snap = await ref.get();
      const local = Store.carregar();
      let escolhido = local;
      if (snap.exists && snap.data() && snap.data().progresso) {
        let nuvem = null;
        try { nuvem = JSON.parse(snap.data().progresso); } catch (e) {}
        if (nuvem) escolhido = this._merge(local, nuvem);
      }
      escolhido._updatedAt = Date.now();
      Store.importarObjeto(escolhido);
      await ref.set({ progresso: JSON.stringify(escolhido), email: u.email || null, atualizadoEm: Date.now() }, { merge: true });
    } catch (e) {
      console.warn("Sincronização de entrada falhou:", e);
    } finally {
      this._sincronizando = false;
    }
  },

  /* Chamado pelo Store a cada salvamento (debounce 1,5s). */
  agendarSync() {
    if (!this._pronto || !this._user || this._sincronizando) return;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this._push(), 1500);
  },
  async _push() {
    if (!this._user || !this._db) return;
    try {
      const d = Store.carregar();
      d._updatedAt = Date.now();
      await this._db.collection("pmgo_usuarios").doc(this._user.uid)
        .set({ progresso: JSON.stringify(d), email: this._user.email || null, atualizadoEm: Date.now() }, { merge: true });
    } catch (e) { /* offline: tentará no próximo salvamento */ }
  },

  /* Traduz códigos de erro do Firebase para PT. */
  erroPt(e) {
    const c = (e && e.code) || "";
    const map = {
      "auth/invalid-email": "E-mail inválido.",
      "auth/missing-password": "Digite a senha.",
      "auth/weak-password": "Senha muito curta (mínimo 6 caracteres).",
      "auth/email-already-in-use": "Este e-mail já tem conta. Use 'Entrar'.",
      "auth/invalid-credential": "E-mail ou senha incorretos.",
      "auth/wrong-password": "Senha incorreta.",
      "auth/user-not-found": "Não achei conta com esse e-mail. Use 'Criar conta'.",
      "auth/too-many-requests": "Muitas tentativas. Aguarde um pouco.",
      "auth/popup-closed-by-user": "Login com Google cancelado.",
      "auth/network-request-failed": "Sem conexão. Tente novamente.",
    };
    return map[c] || (e && e.message) || "Erro ao entrar. Tente novamente.";
  },
};
