import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react'; // Adicionado useCallback
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { coroinhasData } from '../../src/data/coroinhas';
import { StorageService } from '../../src/services/StorageService';

export default function TelaCoroinhas() {
  const router = useRouter();
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função para buscar os dados atualizados do banco
  const buscarDados = async () => {
    setCarregando(true);
    const dadosSalvos = await StorageService.listarCoroinhas(coroinhasData);
    setLista(dadosSalvos);
    setCarregando(false);
  };

  // FOCO: Sempre que você entrar nesta tela, ela busca os pesos novos
  useFocusEffect(
    useCallback(() => {
      buscarDados();
    }, [])
  );

  const getCorNivel = (nivel) => {
    if (nivel === 4) return '#443131'; 
    if (nivel === 3) return '#792baa'; 
    if (nivel === 2) return '#295aaa'; 
    return '#b5b8b8'; 
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.infoRow}>
        <Text style={styles.nome}>{item.nome}</Text>
        <View style={[styles.badgeNivel, { backgroundColor: getCorNivel(item.nivel) }]}>
          <Text style={styles.textoNivel}>Nível {item.nivel}</Text>
        </View>
      </View>
      
      <View style={styles.detalhesRow}>
        <Text style={styles.local}>
          <Ionicons name="location-outline" size={14} color="#666" /> 
          {item.local === 'M' ? ' Matriz' : item.local}
        </Text>
        <Text style={[styles.peso, item.peso > 0 ? {color: '#20B2AA', fontWeight: 'bold'} : {}]}>
          Peso: {item.peso}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnVoltar}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>Lista de Coroinhas</Text>
          <Text style={styles.contador}>{lista.length} cadastrados</Text>
        </View>
      </View>

      {carregando ? (
        <View style={styles.containerCarregando}>
          <ActivityIndicator size="large" color="#20B2AA" />
          <Text style={{marginTop: 10, color: '#666'}}>Atualizando pesos...</Text>
        </View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFB' },
  header: { marginTop: 40, marginBottom: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' },
  btnVoltar: { marginRight: 15 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  contador: { color: '#20B2AA', fontWeight: 'bold' },
  lista: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  nome: { fontSize: 18, fontWeight: '600', color: '#333' },
  badgeNivel: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  textoNivel: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  detalhesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  local: { color: '#666', fontSize: 14 },
  peso: { color: '#999', fontSize: 14 },
  containerCarregando: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});