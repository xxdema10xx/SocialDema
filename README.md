# SocialDema

App React Native (Expo SDK 58) che si collega a un backend PHP (cartella `API/`, database MySQL `itsumbria_coding`). Progetto di corso ITS: il codice deve restare semplice e vicino a quello mostrato dal prof (`useState`, `useEffect`, `SecureStore`, classe `TokenManager`). Tutti i file hanno commenti in italiano.

## Come funziona

- `App.js` tiene lo stato `token`. All'avvio legge il token da `SecureStore` (`useEffect`). Se c'è mostra `HomeScreen`, altrimenti `LoginScreen`. Non controlla la scadenza del token (un controllo `isExpired` è stato provato e poi tolto su richiesta).
- `save` e `getValueFor` sono le funzioni dell'esempio del prof (`key` = nome sotto cui salvo, `value` = dato). `handleLogin` salva il token, `handleLogout` lo cancella.
- `ui/LoginScreen.js` fa la POST a `login.php`. Se username o password sono vuoti mostra un `alert` senza chiamare l'API. Se va bene e la risposta contiene il token chiama `onLogin(response.data.token)`, altrimenti mostra un `alert` con l'errore del server.
- `ui/HomeScreen.js` riceve `token` e `onLogout`. La lista parte con 5 messaggi di prova (hardcodati) e viene mostrata **al contrario** (`[...messages].reverse()`), quindi l'ultimo messaggio è in cima:
  - **Scarica**: il pulsante c'è ma è vuoto (`onPress={() => {}}`). La funzione `loadPosts` (GET a `messages.php`, solo la prima pagina da 10) esiste ancora ma al momento non è chiamata da nessuna parte.
  - **Invia** (`handlePost`): POST a `create_message.php` con `{user_message: testo}`. Poi il messaggio viene aggiunto in fondo alla lista locale con testo, data e nome dalla risposta. L'API non manda l'id del messaggio, quindi l'app usa l'id più alto della lista + 1 (non è l'id del database).
  - **Elimina** (`handleDelete`): POST a `delete_message.php` con `{post_id: id}`, poi il messaggio viene tolto dalla lista locale (`filter`). Nel database è una cancellazione "soft" (scrive `deletion_date`, solo sui propri messaggi). Per i messaggi di prova e per quelli nuovi l'id non corrisponde al database, quindi può non cancellare nulla o colpire un altro messaggio con lo stesso numero.
  - **Modifica** (`handleEdit`): funziona solo nello stato locale, non viene salvata nel database.
- `ui/Message.js` è la card del messaggio (nome, `#id`, testo, Modifica/Elimina in basso a sinistra, data in basso a destra). `ui/InputAndButton.js` è la casella per scrivere un messaggio.
- `ui/AppButton.js` è il pulsante con varianti `primary`, `outline`, `text`, `danger`.
- I colori sono scritti direttamente in ogni file (palette indaco: `#F3F4F8` sfondo, `#FFFFFF` card, `#4F46E5` primario, `#1F2937` testo, `#6B7280` testo secondario, `#E5E7EB` bordi, `#DC2626` rosso). `ui/theme.js` è stato eliminato.

## Avvio

```bash
npm install
npx expo start -c
```

Expo Go sul telefono deve supportare SDK 58. Telefono e computer devono stare nella stessa rete.

## Indirizzi del backend

Gli URL sono scritti direttamente in `ui/LoginScreen.js` (`LOGIN_URL`) e in `ui/HomeScreen.js` (`MESSAGES_URL`, `CREATE_URL`, `DELETE_URL`). Ora puntano a Laragon su questo PC Windows:

```text
http://10.10.53.243/SocialDema/API/
```

L'IP del PC di casa (`192.168.1.38`) e quello del Mac con MAMP (`10.10.52.212:8888`) sono rimasti come commenti sopra la riga attiva, in tutti e quattro i punti. Se si torna a lavorare su un altro PC o rete, va scommentato l'indirizzo giusto (o controllato il nuovo IP, che può cambiare) e commentato quello attivo ora. Laragon su questo PC ha come root una junction (`C:\laragon\www`) che punta a `C:\Users\DamianoDeMattei\PhpstormProjects`, quindi `SocialDema/API/` è raggiungibile direttamente.

## Note sul backend PHP

- Il token lo gestisce la classe `API/tokenManager.php` (`TokenManager`): formato `firma.payload`, firma HMAC-SHA512 con chiave `abc123`, payload `{id, exp}` in base64, scade dopo 1 ora. `validate()` controlla firma e scadenza, `extractID()` ricava l'id utente.
- `login.php`, `messages.php`, `create_message.php` e `delete_message.php` usano `TokenManager`. `API/functions.php` (vecchio formato `payload.firma`, chiave `miki1234`) serve ormai solo a `user_info.php`.
- **`user_info.php` è rotto**: ha parentesi graffe sbilanciate, usa ancora il vecchio `validateToken` e legge l'header con la maiuscola. Non è usato dall'app e non è stato né commentato né sistemato.
- Il telefono manda l'header in minuscolo (`authorization`) e `getallheaders()` distingue le maiuscole: per questo gli endpoint usano `array_change_key_case(getallheaders(), CASE_LOWER)`.
- Senza header `Authorization` PHP stampa un avviso HTML prima del JSON, quindi axios riceve testo e non un oggetto.
- `messages.php` restituisce 10 messaggi per pagina (`?page=N`), solo quelli con `deletion_date` NULL, dal più recente, di tutti gli utenti.
- Gli errori di login arrivano come HTTP 401 (password) o 404 (username) con il campo `Error`.
- Sul PC Windows non c'è PHP, quindi le modifiche ai file PHP non sono state controllate con `php -l`. Su Mac farlo.

## Da fare / idee

- Modifica nel database: serve un endpoint (`edit_message.php`). Un primo tentativo rispondeva 401 ed è stato tolto su richiesta; da rifare controllando prima che il messaggio sia dell'utente e senza usare `rowCount()`, che vale 0 se il testo non cambia.
- Id vero del messaggio: far restituire a `create_message.php` l'id inserito (`lastInsertId`). `DbConnector` apre una connessione nuova a ogni `prepare`, quindi servirebbe un metodo apposta.
- Scaricare i messaggi dal database (pulsante "Scarica" ora vuoto, `loadPosts` inutilizzata).
- Gestire il token scaduto: ora, con un token vecchio di più di un'ora, l'app entra comunque in home e le chiamate rispondono `Invalid Token` (rimedio manuale: Logout).
- Paginazione (`?page=`) per vedere più di 10 messaggi.
- Sistemare o eliminare `user_info.php` e `functions.php`, e togliere il nome fisso `Utente: Dema` nell'intestazione.
- Mettere gli URL in un solo file (`config.js` con `API_URL`).

## Riassunto per la prossima sessione

Lavoro fatto nelle sessioni precedenti:

1. Aggiornato Expo da SDK 54 a 58. Login collegato alla home con `useState` + `useEffect` + `SecureStore` (nomi dell'esempio del prof). Interfaccia con card per i messaggi, `SafeAreaView` e `AppButton`. Invia ed Elimina collegati al database.

Lavoro fatto in questa sessione (commit `86838e0`, già in push su `main`):

1. Il login e gli endpoint dei messaggi ora usano `TokenManager` (la classe del prof). Ripulito `tokenManager.php` (due `echo` di debug e righe spurie in fondo al file).
2. `LoginScreen`: controllo dei campi vuoti e della presenza del token nella risposta.
3. Colori scritti dentro ogni file UI (stessa palette di prima), `theme.js` eliminato, perché il codice sembrasse più "primitivo" al prof.
4. Commenti in italiano in tutti i file PHP e JS (tranne `user_info.php` e `index.js`).
5. Home: messaggi di prova hardcodati rimessi, nuovi messaggi aggiunti alla lista locale senza ricaricare dal database, eliminazione che toglie dalla lista locale, ordine invertito (ultimo messaggio in cima), pulsante "Scarica" lasciato vuoto.
6. Provati e poi annullati su richiesta: salvataggio della modifica nel database (`edit_message.php`, dava 401), controllo `isExpired` all'avvio, caricamento automatico all'apertura, scaricamento di tutte le pagine.

Preferenze emerse dall'utente: spiegare il piano e chiedere consenso prima di modificare quando lo dice, codice semplice e "terra terra" da studente (poche righe, niente controlli superflui, commenti in italiano), nomi come nell'esempio del prof, commit e push solo quando lo chiede, risposte in italiano, e tornare indietro esattamente quando dice "ritorna a prima di X". `.idea/` resta non tracciata di proposito (cartella di PhpStorm). Python non è installato sul PC Windows, ma PHP sì (Laragon, `C:\laragon\bin\php\...\php.exe`) e MySQL è raggiungibile da riga di comando (`C:\laragon\bin\mysql\...\mysql.exe -h 127.0.0.1 -u root -proot`), utili per verificare query/token senza passare dal telefono. Sessione attuale di nuovo su PC Windows (non più Mac/MAMP), con un IP diverso da quello usato in precedenza (vedi "Indirizzi del backend").

Lavoro fatto in questa sessione (commit da `c53eaaf` a `a4533b6`, già in push su `main`):

1. **Ordine dei post**: `messages.php` ora ordina `DESC` (dal più recente), tolto il `.reverse()` lato frontend che compensava il vecchio ordine; `handlePost` aggiunge il nuovo messaggio in cima alla lista invece che in fondo.
2. **Fuso orario**: `create_message.php` e `messages.php` impostano `date_default_timezone_set('Europe/Rome')`. Senza, PHP interpretava i timestamp di MySQL (fuso `SYSTEM` = Europe/Rome) come UTC, con uno scarto di un'ora tra DB e app.
3. **Permessi per ruolo** (`users.role`: Utente / Moderatore / SuperAdmin) su modifica ed eliminazione: SuperAdmin fa tutto, Moderatore modifica i post di chiunque ma elimina solo i propri, Utente modifica/elimina solo i propri. Controllo fatto sia lato backend (`update_message.php`, `delete_message.php`) sia lato frontend (bottoni Modifica/Elimina nascosti quando non spettano, calcolati in `HomeScreen.js` da `current_user` restituito da `messages.php`). `update_message.php` ora salva davvero nel database (prima era solo nello stato locale).
4. **Bug di confronto id**: PDO restituisce `user_id` come stringa e `bindParam(':userId', $userId)` convertiva anche `$userId` in stringa per riferimento; il confronto `===` nel frontend falliva sempre sui post caricati dal server (solo quelli creati dal vivo in sessione mostravano i bottoni). Fix: cast `(int)` espliciti in `messages.php` prima di mandare la risposta.
5. **Registrazione utenti**: nuovo `API/register.php` (password con `password_hash`, ruolo di default `Utente`, errorCode 1/2/3 per campo vuoto / username già in uso / password diverse) e `ui/RegisterScreen.js`, collegata da un pulsante "Registrati" in `LoginScreen.js`; `App.js` sceglie tra login e registrazione con lo stato `authScreen`.
6. **Alert nativi**: tutti gli `alert()` del browser (non funzionano su nativo) sostituiti con `Alert.alert()` di `react-native`, in `LoginScreen`, `RegisterScreen` e `HomeScreen`.
7. Commenti aggiunti/aggiornati in `register.php`, `user_info.php` (segnato esplicitamente come endpoint superato, non sistemato), `messages.php`, `App.js`, `Message.js`.

Nota: le sezioni sopra ("Come funziona", "Da fare / idee") descrivono ancora lo stato precedente a questa sessione (messaggi di prova, modifica solo locale, pulsante "Scarica" vuoto, ecc.) — sono rimaste non aggiornate perché la richiesta era solo un riassunto della sessione, non una riscrittura del README.
