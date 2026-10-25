import {View, TextInput, StyleSheet} from 'react-native';
import {useState} from "react";
import AppButton from './AppButton';

// casella di testo + bottone per scrivere un nuovo messaggio
// inputLabel = testo guida, buttonLabel = scritta del bottone, postButton = funzione chiamata con il testo
export default function InputAndButton({inputLabel, buttonLabel, postButton}) {
    // userText = quello che l'utente sta scrivendo
    const [userText, setUserText] = useState('');

    const handleSend = () => {
        // trim toglie gli spazi: non invio messaggi vuoti
        if (userText.trim()) {
            postButton(userText.trim());
            // svuoto la casella dopo l'invio
            setUserText('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={inputLabel}
                placeholderTextColor="#6B7280"
                style={styles.textInput}
                value={userText}
                onChangeText={setUserText}
            />
            <AppButton title={buttonLabel} onPress={handleSend} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    textInput: {
        backgroundColor: '#F3F4F8',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 10,
        color: '#1F2937',
    },
});
