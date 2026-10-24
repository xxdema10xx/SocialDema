import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from './theme';

// variant: 'primary' (pieno), 'outline' (bordo), 'text' (solo testo), 'danger' (testo rosso)
export default function AppButton({title, onPress, variant = 'primary', style}) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.base, styles[variant], style]}
        >
            <Text style={[styles.label, labelStyles[variant]]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    primary: {
        backgroundColor: colors.primary,
    },
    outline: {
        borderWidth: 1,
        borderColor: colors.primary,
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

const labelStyles = StyleSheet.create({
    primary: {color: 'white'},
    outline: {color: colors.primary},
    text: {color: colors.primary},
    danger: {color: colors.danger},
});
