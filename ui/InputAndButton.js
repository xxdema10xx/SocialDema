import {View, TextInput, StyleSheet} from 'react-native';
import {useState} from "react";
import AppButton from './AppButton';
import {colors, cardShadow} from './theme';

export default function InputAndButton({inputLabel, buttonLabel, postButton}) {
    const [userText, setUserText] = useState('');

    const handleSend = () => {
        if (userText.trim()) {
            postButton(userText.trim());
            setUserText('');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder={inputLabel}
                placeholderTextColor={colors.textSecondary}
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
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 12,
        gap: 8,
        ...cardShadow,
    },
    textInput: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
        color: colors.text,
    },
});
