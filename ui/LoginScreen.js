import { useState } from "react";
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from "axios";
import AppButton from './AppButton';

// schermata di login: onLogin = funzione chiamata con il token quando il login va bene
export default function LoginScreen({onLogin}) {
    // quello che l'utente scrive nelle due caselle
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Mac (MAMP)
    // const LOGIN_URL = "http://10.10.52.212:8888/API/login.php";
    // Windows (Laragon, PC casa)
    // const LOGIN_URL = "http://192.168.1.38/SocialDema/API/login.php";
    // Windows (Laragon, questo PC)
    const LOGIN_URL = "http://10.10.53.243/SocialDema/API/login.php";

    // mando username e password all'api
    function handleLogin() {
        // se manca qualcosa non chiamo nemmeno l'api
        if (!username || !password) {
            alert('Inserisci username e password');
            return;
        }
        axios
            .post(LOGIN_URL, {username: username, password: password})
            .then((response) => {
                // l'api risponde con il token (firma.payload, valido 1 ora) se il login è giusto
                if (response.data.token) {
                    onLogin(response.data.token);
                } else {
                    alert('Risposta del server non valida');
                }
            })
            .catch((error) => {
                // l'api risponde con un errore se username o password sono sbagliati
                if (error.response) {
                    alert(error.response.data.Error);
                } else {
                    alert('Impossibile contattare il server');
                }
            });
    }

    return(
        <SafeAreaView style={styles.loginContainer}>
            <Text style={styles.title}>SocialDema</Text>
            <Text style={styles.subtitle}>Accedi per continuare</Text>
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
                <AppButton title="Login" onPress={handleLogin} />
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
