# ☁️ Ativar login na nuvem (Firebase) — ~5 minutos

O app já tem todo o código de login e sincronização pronto. Falta só criar um
projeto grátis no Firebase e colar a configuração. Enquanto isso não é feito, o
app funciona 100% local (o progresso fica salvo no aparelho + backup manual).

## Passo a passo

1. **Criar projeto:** acesse <https://console.firebase.google.com> → **Adicionar
   projeto** → dê um nome (ex.: `estudo-pmgo`) → pode desativar o Google Analytics.

2. **Ativar login:** menu **Criação → Authentication → Começar**. Ative:
   - **E-mail/senha**
   - **Google** (escolha um e-mail de suporte)

3. **Criar banco:** menu **Criação → Firestore Database → Criar banco** →
   **modo de produção** → escolha a região (ex.: `southamerica-east1`).
   Depois abra a aba **Regras** e cole exatamente isto → **Publicar**:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /pmgo_usuarios/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

4. **Pegar a configuração:** **Configurações do projeto** (engrenagem) →
   **Seus apps** → **Web `</>`** → registre o app → copie o objeto
   `firebaseConfig` (apiKey, authDomain, projectId, etc.).

5. **Colar no app:** edite o arquivo **`js/firebase-config.js`** e substitua os
   `"COLE_AQUI"` pelos valores do seu `firebaseConfig`.
   *(Pode editar direto pelo GitHub: abra o arquivo → lápis ✏️ → cole → Commit.)*

6. **Autorizar o domínio (para o login com Google):**
   **Authentication → Settings → Domínios autorizados → Adicionar domínio** →
   `josehenriquevct.github.io`.

Pronto! Em **Perfil → Conta** vai aparecer o login. Ao entrar (e-mail/senha ou
Google), o progresso sincroniza automaticamente e nunca se perde.

## É seguro colocar a config no repositório público?

Sim. A `apiKey` do Firebase para Web **não é uma senha** — é só um identificador
público. A segurança vem das **regras do Firestore** (cada usuário só acessa os
próprios dados) e do **login**. Isso é o uso padrão e recomendado pelo Google.
