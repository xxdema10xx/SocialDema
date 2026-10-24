import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';
import axios from 'axios';
import InputAndButton from './InputAndButton';
import Message from './Message';
import AppButton from './AppButton';
import {colors} from './theme';

// Mac (MAMP)
// const MESSAGES_URL = 'http://10.10.52.212:8888/API/messages.php';
// Windows (Laragon)
const MESSAGES_URL = 'http://192.168.1.38/SocialDema/API/messages.php';
const CREATE_URL = 'http://192.168.1.38/SocialDema/API/create_message.php';
const DELETE_URL = 'http://192.168.1.38/SocialDema/API/delete_message.php';

export default function HomeScreen({token, onLogout}) {
  const [messages, setMessages] = useState([{
    id: 1,
    text: 'Ciao',
    date: 1779981508,
    name: 'Damiano'
  }, {
    id: 2,
    text: 'Daje',
    date: 1779981508,
    name: 'Francesco'
  }, {
    id: 3,
    text: 'NOOOOO!!!',
    date: 1779981508,
    name: 'Lorenzo'
  }, {
    id: 4,
    text: 'Non SObri0!',
    date: 1779981508,
    name: 'Alberto'
  }, {
    id: 5,
    text: 'Che magnata!',
    date: 1779981508,
    name: 'Marco'
  }]);

  function handleDelete(id) {
    axios
      .post(DELETE_URL, {post_id: id}, {
        headers: {Authorization: 'Bearer ' + token},
      })
      .then(() => {
        // il messaggio è stato eliminato dal database: ricarico la lista
        loadPosts();
      })
      .catch((error) => {
        alert('Impossibile eliminare il messaggio');
        console.error(error);
      });
  }

  function handleEdit(id, newText) {
    setMessages(prev => prev.map(message =>
      message.id === id ? {...message, text: newText} : message
    ));
  }

  function handlePost(text) {
    axios
      .post(CREATE_URL, {user_message: text}, {
        headers: {Authorization: 'Bearer ' + token},
      })
      .then(() => {
        // il messaggio è nel database: ricarico la lista
        loadPosts();
      })
      .catch((error) => {
        alert('Impossibile inviare il messaggio');
        console.error(error);
      });
  }

  async function loadPosts() {
    try {
      const response = await axios.get(MESSAGES_URL, {
        headers: {Authorization: 'Bearer ' + token},
      });

      // se il token manca o non è valido l'api non risponde con items
      if (!response.data.items) {
        alert('Risposta non valida: ' + JSON.stringify(response.data).slice(0, 300));
        return;
      }

      setMessages(response.data.items.map(message => ({
        id: message.id,
        name: message.username,
        text: message.content,
        date: message.creation_date,
      })));
    } catch (error) {
      console.error('Errore durante il caricamento dei messaggi:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>SocialDema</Text>
          <Text style={styles.textUser}>Utente: Dema</Text>
        </View>
        <AppButton title="Logout" variant="outline" onPress={onLogout} />
      </View>

      <InputAndButton buttonLabel="Invia" inputLabel="Scrivi qualcosa.." postButton={handlePost} />

      <View style={styles.feedHeader}>
        <Text style={styles.feedTitle}>Messaggi</Text>
        <AppButton title="Scarica" variant="text" onPress={loadPosts} />
      </View>

      <FlatList
        style={styles.list}
        data={messages}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <Message
            id={item.id}
            username={item.name}
            messageText={item.text}
            timeStamp={item.date}
            editButton="Modifica"
            deleteButton="Elimina"
            onDelete={() => handleDelete(item.id)}
            onEdit={newText => handleEdit(item.id, newText)}
          />
        )}
      />

      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  textUser: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  list: {
    flex: 1,
  },
});
