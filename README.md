# SocialDema

App React Native (Expo SDK 58) che si collega a un backend PHP (cartella `API/`, database MySQL `itsumbria_coding`). Progetto di corso ITS: il codice deve restare semplice e vicino a quello mostrato dal prof (`useState`, `useEffect`, `SecureStore`).

## Come funziona

- `App.js` tiene lo stato `token`. All'avvio legge il token da `SecureStore` (`useEffect`). Se c'è mostra `HomeScreen`, altrimenti `LoginScreen`.
- `save` e `getValueFor` sono le funzioni dell'esempio del prof. `handleLogin` salva il token, `handleLogout` lo cancella.
- `ui/LoginScreen.js` fa la POST a `login.php`. Se va bene chiama `onLogin(response.data.token)`, altrimenti mostra un `alert` con l'errore del server.
- `ui/HomeScreen.js` riceve `token` e `onLogout`:
  - **Scarica** (`loadPosts`): GET a `messages.php` con `Authorization: Bearer <token>`. Se la risposta non contiene `items` mostra un `alert` con quello che è arrivato.
  - **Invia** (`handlePost`): POST a `create_message.php` con `{user_message: testo}`, poi ricarica la lista.
  - **Elimina** (`handleDelete`): POST a `delete_message.php` con `{post_id: id}`, poi ricarica la lista (cancellazione "soft": scrive `deletion_date`, e si possono eliminare solo i propri messaggi).
  - **Modifica** (`handleEdit`): funziona solo nello stato locale. Sul server non esiste un endpoint di modifica, e premendo Scarica la modifica sparisce.
- `ui/Message.js` è la card del messaggio (nome, `#id`, testo, Modifica/Elimina in basso a sinistra, data in basso a destra).
- `ui/theme.js` (palette indaco) e `ui/AppButton.js` (pulsante con varianti `primary`, `outline`, `text`, `danger`) sono usati in tutte le schermate.

## Avvio

```powershell
npm install
npx expo start -c
```

Expo Go sul telefono deve supportare SDK 58. Telefono e PC devono stare nella stessa rete.

## Indirizzi del backend

Gli URL sono scritti direttamente in `ui/LoginScreen.js` (`LOGIN_URL`) e in `ui/HomeScreen.js` (`MESSAGES_URL`, `CREATE_URL`, `DELETE_URL`). Ora puntano a Laragon su Windows:

```text
http://192.168.1.38/SocialDema/API/
```

Se l'IP del PC cambia (rete di casa/scuola), va aggiornato in tutti e quattro i punti. Per il Mac (MAMP) c'è l'indirizzo `http://10.10.52.212:8888/API/` lasciato come commento in `LoginScreen` e `MESSAGES_URL`; `CREATE_URL` e `DELETE_URL` non hanno la versione Mac.

## Note sul backend PHP

- Il token è `base64(json) . hmac_sha256`, chiave `miki1234`, scade dopo un'ora, ma `validateToken` non controlla la scadenza.
- Il telefono manda l'header in minuscolo (`authorization`) e `getallheaders()` distingue le maiuscole: per questo `messages.php`, `create_message.php` e `delete_message.php` ora usano `array_change_key_case(getallheaders(), CASE_LOWER)`. **`user_info.php` ha ancora il problema** (non è usato dall'app).
- Senza header `Authorization` PHP stampa un avviso HTML prima del JSON, quindi axios riceve testo e non un oggetto.
- `messages.php` restituisce 10 messaggi per pagina (`?page=N`), solo quelli con `deletion_date` NULL, dal più recente. L'app scarica sempre la pagina 1.
- Gli errori di login arrivano come HTTP 401 (password) o 404 (username) con il campo `Error`.

## Da fare / idee

- Modifica: manca `update_message.php`; poi collegare `handleEdit`.
- Scaricare i messaggi in automatico all'avvio (`useEffect` in `HomeScreen`), come fa il progetto di riferimento di Giorgia.
- Gestire il token scaduto: se `messages.php` risponde `Invalid Token`, chiamare `onLogout()`.
- Paginazione (`?page=`) per vedere più di 10 messaggi.
- Togliere i 5 messaggi finti con cui parte `HomeScreen` e il nome fisso `Utente: Dema` nell'intestazione (si può usare `user_info.php`).
- Mettere gli URL in un solo file (`config.js` con `API_URL`).
- Rimettere uno stato `loading` in `App.js` se dà fastidio il lampo del login all'avvio (è stato tolto perché il prof non lo ha fatto fare).

## Riassunto per la prossima sessione

Lavoro fatto in questa sessione:

1. Aggiornato Expo da SDK 54 a 58 (`expo`, `react`, `react-native`, `expo-secure-store`, `expo-status-bar`, nuovo `expo-splash-screen`). Rimossi da `app.json` `newArchEnabled` e `android.edgeToEdgeEnabled`; lo splash ora è un plugin.
2. Login collegato alla home con `useState` + `useEffect` + `SecureStore` (nomi dell'esempio del prof). Confrontato con il repo di Giorgia (`GiorgiaMilazzo/EsameReactNative`): struttura molto simile; `handleLogin` e l'`alert` degli errori sono scritti come il suo `Login.js`.
3. Nuova interfaccia: palette indaco, card per i messaggi, `SafeAreaView` (`react-native-safe-area-context`), pulsante `AppButton`.
4. Aggiunta la modifica dei messaggi (locale).
5. Codice semplificato (`loadPosts` usa direttamente i campi `items`, `username`, `content`, `creation_date`).
6. Risolto "Cannot read property 'map' of undefined" al Scarica: era l'header `Authorization` in minuscolo, sistemato nei PHP.
7. Invia ed Elimina collegati al database; l'id del messaggio è visibile nella card.

Preferenze emerse dall'utente: spiegare il piano prima di modificare, codice semplice da capire (poche righe, niente controlli superflui), nomi come nell'esempio del prof, commit e push solo quando lo chiede, messaggi e risposte in italiano. `.idea/` resta non tracciata di proposito (cartella di PhpStorm). Python non è installato su questo PC: per le modifiche ai file usare gli strumenti Edit/Write.
