import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState, useEffect} from 'react';
import axios from 'axios';
import InputAndButton from './InputAndButton';
import Message from './Message';
import AppButton from './AppButton';

// Mac (MAMP)
// const MESSAGES_URL = 'http://10.10.52.212:8888/API/messages.php';
// Windows (Laragon, PC casa)
// const MESSAGES_URL = 'http://192.168.1.38/SocialDema/API/messages.php';
// const CREATE_URL = 'http://192.168.1.38/SocialDema/API/create_message.php';
// const DELETE_URL = 'http://192.168.1.38/SocialDema/API/delete_message.php';
// Windows (Laragon, questo PC)
const MESSAGES_URL = 'http://10.10.53.243/SocialDema/API/messages.php';
const CREATE_URL = 'http://10.10.53.243/SocialDema/API/create_message.php';
const DELETE_URL = 'http://10.10.53.243/SocialDema/API/delete_message.php';
const UPDATE_URL = 'http://10.10.53.243/SocialDema/API/update_message.php';
// schermata principale: token = serve per chiamare l'api, onLogout = funzione per uscire
export default function HomeScreen({token, onLogout}) {
  // lista dei messaggi mostrati, all'inizio ci sono quelli di prova
  const [messages, setMessages] = useState([
    /*
    {
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
    }
    */
  ]);

  // chiedo all'api di eliminare il messaggio con quell'id
  function handleDelete(id) {
    axios
      .post(DELETE_URL, {post_id: id}, {
        headers: {Authorization: 'Bearer ' + token},
      })
      .then(() => {
        // il messaggio è stato eliminato dal database: lo tolgo anche dalla lista che ho già
        setMessages(prev => prev.filter(message => message.id !== id));
      })
      .catch((error) => {
        alert('Impossibile eliminare il messaggio');
        console.error(error);
      });
  }

  // mando il testo modificato all'api, che lo salva nel database
  function handleEdit(id, newText) {
    axios
      .post(UPDATE_URL, {post_id: id, user_message: newText}, {
        headers: {Authorization: 'Bearer ' + token},
      })
      .then(() => {
        // il messaggio è stato aggiornato nel database: lo aggiorno anche nella lista che ho già
        setMessages(prev => prev.map(message =>
          message.id === id ? {...message, text: newText} : message
        ));
      })
      .catch((error) => {
        alert('Impossibile modificare il messaggio');
        console.error(error);
      });
  }

  // mando il nuovo messaggio all'api, che lo salva nel database
  function handlePost(text) {
    axios
      .post(CREATE_URL, {user_message: text}, {
        headers: {Authorization: 'Bearer ' + token},
      })
      .then((response) => {
        // il messaggio è nel database: lo aggiungo in cima alla lista che ho già (i post sono ordinati dal più recente)
        // l'api non manda l'id del messaggio, uso il più alto che c'è già nella lista + 1 (se la lista è vuota parto da 1)
        setMessages(prev => [{
          id: prev.length ? Math.max(...prev.map(message => message.id)) + 1 : 1,
          text: response.data.content,
          date: response.data.creation_date,
          name: response.data.username,
          canEdit: true,
          canDelete: true,
        }, ...prev]);
      })
      .catch((error) => {
        alert('Impossibile inviare il messaggio');
        console.error(error);
      });
  }

  // scarico i messaggi dal database e li metto nella lista
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

      // chi sono io e che ruolo ho: serve per decidere se posso modificare/eliminare i post altrui
      const myUserId = response.data.current_user?.id;
      const myRole = response.data.current_user?.role;
      const canEditAny = myRole === 'SuperAdmin' || myRole === 'Moderatore';
      const canDeleteAny = myRole === 'SuperAdmin';

      // adatto i nomi dei campi dell'api a quelli usati dall'app
      setMessages(response.data.items.map(message => {
        const isMine = message.user_id === myUserId;
        return {
          id: message.id,
          name: message.username,
          text: message.content,
          date: message.creation_date,
          canEdit: isMine || canEditAny,
          canDelete: isMine || canDeleteAny,
        };
      }));
    } catch (error) {
      console.error('Errore durante il caricamento dei messaggi:', error);
    }
  }

  // appena si entra in HomeScreen (cioè subito dopo il login) carico i messaggi
  useEffect(() => {
    loadPosts();
  }, []);

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
            canEdit={item.canEdit}
            canDelete={item.canDelete}
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
    backgroundColor: '#F3F4F8',
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
    color: '#4F46E5',
  },
  textUser: {
    fontSize: 14,
    color: '#6B7280',
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
    color: '#1F2937',
  },
  list: {
    flex: 1,
  },
});
