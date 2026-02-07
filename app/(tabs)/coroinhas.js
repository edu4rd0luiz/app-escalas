import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { coroinhasData } from '../../src/data/coroinhas';

export default function TelaCoroinhas() {
  // Função interna para dar cor aos níveis
  const getCorNivel = (nivel) => {
    if (nivel === 4) return '#443131'; 
    if (nivel === 3) return '#792baa'; 
    if (nivel === 2) return '#295aaa'; 
    return '#b5b8b8'; 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Nossos Coroinhas</Text>
        <Text style={styles.contador}>{coroinhasData.length} cadastrados</Text>
      </View>

      <FlatList
        data={coroinhasData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.local}>
                Local: {
                  item.local === 'M' ? 'Matriz' : 
                  item.local === 'S' ? 'Sítio' : 
                  item.local === 'CG' ? 'CG' : 
                  item.local === 'SO' ? 'Soledade' : item.local
                }
              </Text>
            </View>
            <View style={[styles.badgeNivel, { backgroundColor: getCorNivel(item.nivel) }]}>
              <Text style={styles.textoNivel}>Nível {item.nivel}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFB', paddingHorizontal: 20 },
  header: { marginTop: 40, marginBottom: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  contador: { color: '#20B2AA', fontWeight: 'bold' },
  card: { 
    backgroundColor: 'white', 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 10,
    elevation: 2
  },
  nome: { fontSize: 14, fontWeight: 'bold', color: '#444' },
  local: { fontSize: 12, color: '#888' },
  badgeNivel: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  textoNivel: { color: 'white', fontWeight: 'bold', fontSize: 12 }
});