/* =========================================================================
   CONFIGURAÇÃO DO FIREBASE — projeto "esquina-burger" (reaproveitado)
   -------------------------------------------------------------------------
   Os dados do Estudo PMGO ficam numa coleção SEPARADA (pmgo_usuarios), então
   não se misturam com o bot/PDV. A apiKey Web não é secreta (identificador
   público); a segurança vem das regras do Firestore + login.
   ========================================================================= */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCD9Ow0w2e9-7t9KEIlD9sb6kZYFbNvQ84",
  authDomain: "esquina-burger.firebaseapp.com",
  databaseURL: "https://esquina-burger-default-rtdb.firebaseio.com",
  projectId: "esquina-burger",
  storageBucket: "esquina-burger.firebasestorage.app",
  messagingSenderId: "81017075579",
  appId: "1:81017075579:web:34836122cf33945d1f2fde",
  measurementId: "G-691B9NSYE7"
};

/* Ativa a nuvem só quando a configuração foi realmente preenchida. */
const FIREBASE_ENABLED = !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey.indexOf("COLE_AQUI") === -1);
