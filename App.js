import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import HomeScreen from './ui/HomeScreen';
import LoginScreen from "./ui/LoginScreen";

// salvo un valore nella memoria sicura del telefono
// await = "aspetta che il salvataggio sia finito, poi vai avanti" (si usa solo dentro una funzione async)
async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

// leggo un valore dalla memoria sicura, se non c'è restituisce null
async function getValueFor(key) {
  let result = await SecureStore.getItemAsync(key);
  return result;
}

export default function App() {
  // se token è null l'utente non è autenticato
  const [token, setToken] = useState(null);

  // all'avvio leggo il token salvato (se c'è)
  // [] = "non dipendo da niente, eseguimi solo una volta all'inizio"
  useEffect(() => {
    getValueFor('token').then(result => setToken(result));
  }, []);

  // il login è andato bene: salvo il token e lo metto nello stato, così App si ridisegna e mostra la home
  async function handleLogin(newToken) {
    await save('token', newToken);
    setToken(newToken);
  }

  // cancello il token salvato e torno al login
  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    setToken(null);
  }

  if (token) {
    // passo alla home il token (serve per chiamare l'API) e la funzione per uscire
    return (
        <HomeScreen token={token} onLogout={handleLogout}></HomeScreen>
    );
  } else {
    // passo al login la funzione per "avvisare" App che il login è andato bene
    return (
        <LoginScreen onLogin={handleLogin}></LoginScreen>
    );
  }
}

// cosa succede all'avvio dell'app:
// 1. App parte con token = null, quindi disegna il login
// 2. subito dopo useEffect legge la memoria del telefono
// 3. se trova un token chiama setToken, App si ridisegna e mostra la home
