# SocialDema

## Stato del problema da verificare

L'applicazione restituisce più volte:

```text
AxiosError: Request failed with status code 401
```

Il problema più probabile è l'autenticazione tra app React Native e API PHP:

1. `API/login.php` restituisce un token solo quando username e password sono corretti.
2. La schermata `ui/LoginScreen.js` al momento stampa la risposta, ma non salva il token ricevuto e non lo passa alla schermata principale.
3. `ui/HomeScreen.js` prova a leggere `EXPO_PUBLIC_API_TOKEN`. Se la variabile non è configurata oppure contiene un token scaduto/errato, `messages.php` riceve una richiesta senza un token valido e risponde `401`.
4. Il token deve essere inviato nell'header HTTP esatto:

   ```http
   Authorization: Bearer <token>
   ```

Nella prossima sessione verificare quindi il flusso completo: login riuscito, salvataggio del token, invio del token a `messages.php` e validazione PHP. È preferibile usare `expo-secure-store` invece di una variabile pubblica nell'ambiente dell'app.

## Avvio su Windows

Installare Node.js e Git, poi eseguire dalla cartella `SocialDema`:

```powershell
npm install
npx expo start
```

La repository si può clonare normalmente; `node_modules` non deve essere copiato o committato.

## Controlli di rete

Gli endpoint attuali usano l'indirizzo:

```text
http://10.10.52.212:8888/API/
```

Il dispositivo Windows o il telefono devono:

- essere nella stessa rete del computer che esegue il server PHP;
- poter raggiungere `10.10.52.212`;
- avere il backend avviato sulla porta `8888`;
- usare l'IP corretto se la rete assegna un nuovo indirizzo al server.

Se l'indirizzo non è raggiungibile, il problema normalmente appare come errore di rete o timeout, non come `401`.

## Controlli backend

Verificare che:

- `API/login.php` usi il database corretto e trovi l'utente;
- username e password siano valide;
- `API/functions.php` usi la stessa chiave per generare e validare il token;
- il token non sia scaduto;
- il server PHP esponga correttamente l'header `Authorization`.

Per diagnosticare una risposta, controllare anche il corpo JSON restituito dall'API: può contenere `No Token Provided` oppure `Invalid Token`.

## Prossimi passi consigliati

1. Modificare `LoginScreen` per chiamare una callback dopo il login e consegnarle `response.data.token`.
2. Salvare il token con `SecureStore.setItemAsync`.
3. Leggere il token all'avvio dell'app e usarlo in `HomeScreen`.
4. Inviare sempre `Authorization: Bearer <token>` alle API protette.
5. Eliminare il token al logout.
6. Aggiungere un messaggio visibile per credenziali errate o token scaduto.

