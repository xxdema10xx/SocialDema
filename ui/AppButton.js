import {Text, TouchableOpacity, StyleSheet} from 'react-native';

// variant: 'primary' (pieno), 'outline' (bordo), 'text' (solo testo), 'danger' (testo rosso)
// bottone riutilizzabile: title = testo, onPress = cosa fare al tocco, style = stili extra (opzionale)
export default function AppButton({title, onPress, variant = 'primary', style}) {
    return (
        // styles[variant] sceglie lo stile in base alla variante, activeOpacity = trasparenza mentre lo premi
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.base, styles[variant], style]}
        >
            <Text style={[styles.label, labelStyles[variant]]}>{title}</Text>
        </TouchableOpacity>
    );
}

// stili del bottone: base vale per tutte le varianti, le altre si aggiungono sopra
const styles = StyleSheet.create({
    base: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    primary: {
        backgroundColor: '#4F46E5',
    },
    outline: {
        borderWidth: 1,
        borderColor: '#4F46E5',
    },
    text: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    danger: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    label: {
        fontWeight: '600',
        fontSize: 15,
    },
});

// colore della scritta per ogni variante
const labelStyles =StyleSheet.create({
    primary: {color: 'white'},
    outline: {color: '#4F46E5'},
    text: {color: '#4F46E5'},
    danger: {color: '#DC2626'},
});
