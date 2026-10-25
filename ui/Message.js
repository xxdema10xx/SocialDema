import {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import AppButton from './AppButton';

// card di un singolo messaggio, con i bottoni per modificarlo ed eliminarlo
export default function Message({id, username, messageText, timeStamp, editButton, deleteButton, onDelete, onEdit}) {
    // il database dà la data in secondi, JavaScript la vuole in millisecondi
    const dateObj = new Date(timeStamp * 1000);
    // isEditing = true quando sto modificando il testo, editedText = testo che sto scrivendo
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(messageText);

    // passo il nuovo testo a chi mi ha creato (la home lo salva nel database) e chiudo la modifica
    function saveEdit() {
        onEdit(editedText);
        setIsEditing(false);
    }

    return (
        <View style={styles.card}>
            <Text style={styles.username}>{username} · #{id}</Text>

            {/* se sto modificando mostro la casella di testo, altrimenti il testo normale */}
            {isEditing ? (
                <TextInput
                    style={styles.input}
                    value={editedText}
                    onChangeText={setEditedText}
                    multiline
                    autoFocus
                />
            ) : (
                <Text style={styles.text}>{messageText}</Text>
            )}

            <View style={styles.footer}>
                <View style={styles.actions}>
                    {/* durante la modifica: Salva e Annulla, altrimenti: Modifica ed Elimina */}
                    {isEditing ? (
                        <>
                            <AppButton title="Salva" variant="text" onPress={saveEdit} />
                            <AppButton title="Annulla" variant="danger" onPress={() => setIsEditing(false)} />
                        </>
                    ) : (
                        <>
                            <AppButton title={editButton} variant="text" onPress={() => setIsEditing(true)} />
                            <AppButton title={deleteButton} variant="danger" onPress={onDelete} />
                        </>
                    )}
                </View>
                <Text style={styles.date}>{dateObj.toLocaleString()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    username: {
        marginBottom: 6,
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
    },
    date: {
        fontSize: 12,
        color: '#6B7280',
    },
    text: {
        fontSize: 15,
        color: '#1F2937',
    },
    input: {
        fontSize: 15,
        color: '#1F2937',
        backgroundColor: '#F3F4F8',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    actions: {
        flexDirection: 'row',
        marginLeft: -8,
    },
});
