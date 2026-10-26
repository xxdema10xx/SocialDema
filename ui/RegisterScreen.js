import { useState } from "react";
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from "axios";
import AppButton from './AppButton';

// messaggi corrispondenti agli errorCode restituiti da register.php
const ERROR_MESSAGES = {
    '1': 'Compila tutti i campi',
    '2': 'Username già in uso',
    '3': 'Le password non coincidono',
};

// schermata di registrazione: onRegistered = funzione chiamata quando la registrazione va a buon fine, onBackToLogin = torna al login
export default function RegisterScreen({onRegistered, onBackToLogin}) {
    // quello che l'utente scrive nelle caselle
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');

    // Mac (MAMP)
    // const REGISTER_URL = "http://10.10.52.212:8888/API/register.php";
    // Windows (Laragon, PC casa)
    // const REGISTER_URL = "http://192.168.1.38/SocialDema/API/register.php";
    // Windows (Laragon, questo PC)
    const REGISTER_URL = "http://10.10.53.243/SocialDema/API/register.php";

    // mando username e password all'api
    function handleRegister() {
        // se manca qualcosa non chiamo nemmeno l'api
        if (!username || !password || !password2) {
            alert('Inserisci username e password');
            return;
        }
        axios
            .post(REGISTER_URL, {username: username, password: password, password2: password2})
            .then((response) => {
                const errorCode = response.data.errorCode;
                if (!errorCode) {
                    // registrazione andata bene: torno al login
                    alert('Registrazione completata, ora puoi accedere');
                    onRegistered();
                } else {
                    alert(ERROR_MESSAGES[errorCode] || 'Errore durante la registrazione');
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Impossibile contattare il server');
            });
    }

    return(
        <SafeAreaView style={styles.loginContainer}>
            <Text style={styles.title}>SocialDema</Text>
            <Text style={styles.subtitle}>Crea un nuovo account</Text>
            <View style={styles.loginBox}>
                <TextInput
                    placeholder="Username"
                    placeholderTextColor="#6B7280"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#6B7280"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    placeholder="Ripeti password"
                    placeholderTextColor="#6B7280"
                    value={password2}
                    onChangeText={setPassword2}
                    secureTextEntry
                    style={styles.input}
                />
                <AppButton title="Registrati" onPress={handleRegister} />
                <AppButton title="Hai già un account? Accedi" variant="text" onPress={onBackToLogin} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F3F4F8',
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: '#4F46E5',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 24,
    },
    loginBox: {
        width: '85%',
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        backgroundColor: '#F3F4F8',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        color: '#1F2937',
    },
});
