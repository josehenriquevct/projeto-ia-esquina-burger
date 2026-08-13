/* =========================================================================
   CONFIGURAÇÃO DO FIREBASE
   -------------------------------------------------------------------------
   COLE AQUI a configuração do SEU projeto Firebase:
     Console do Firebase → Configurações do projeto (engrenagem) →
     "Seus apps" → app Web → Configuração do SDK → copie o objeto.

   Enquanto os valores estiverem como "COLE_AQUI", o app funciona normalmente,
   só SEM login na nuvem (progresso fica salvo apenas no aparelho).
   ========================================================================= */
const FIREBASE_CONFIG = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};

/* Ativa a nuvem só quando a configuração foi realmente preenchida. */
const FIREBASE_ENABLED = !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey.indexOf("COLE_AQUI") === -1);
