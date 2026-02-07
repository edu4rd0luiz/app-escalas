import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StorageService } from '../../src/services/StorageService';

export default function TelaHistorico() {
  const [lista, setLista] = useState([]);
  const [itemExpandido, setItemExpandido] = useState(null);
  const router = useRouter();

  const carregarDados = async () => {
    const dados = await StorageService.listarMissas();
    setLista(dados);
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const confirmarLimpezaGeral = () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja apagar TODAS as missas e ZERAR os pesos?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Limpar Tudo", 
          style: "destructive", 
          onPress: async () => {
            const coroinhasIniciais = require('../../src/data/coroinhas').coroinhasData;
            await StorageService.reiniciarMesCompleto(coroinhasIniciais);
            setLista([]); 
            Alert.alert("Sucesso", "O histórico foi esvaziado.");
          } 
        }
      ]
    );
  };

  const excluirUmaMissa = (index) => {
    Alert.alert(
      "Excluir Registro",
      "Deseja remover esta missa do histórico?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            const novaLista = await StorageService.removerMissa(index);
            if (novaLista) setLista(novaLista);
          } 
        }
      ]
    );
  };

  const alternarExpandir = (index) => {
    setItemExpandido(itemExpandido === index ? null : index);
  };

  const renderItem = ({ item, index }) => {
    const estaAberto = itemExpandido === index;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeaderContainer}>
          <TouchableOpacity 
            style={styles.cardHeader} 
            onPress={() => alternarExpandir(index)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.data}>{item.data}</Text>
              <Text style={styles.missaNome}>{item.titulo}</Text>
            </View>
            <Ionicons name={estaAberto ? "chevron-up" : "chevron-down"} size={20} color="#20B2AA" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.btnExcluirIndividual} 
            onPress={() => excluirUmaMissa(index)}
          >
            <Ionicons name="trash-outline" size={18} color="#FF5252" />
          </TouchableOpacity>
        </View>

        {estaAberto && (
          <View style={styles.detalhes}>
            <View style={styles.divisor} />
            <Text style={styles.subtitulo}>Escalados:</Text>
            {item.CoroinhasEscalados?.map((coroinha, idx) => (
              <View key={idx} style={styles.linhaCoroinha}>
                <Text style={styles.funcao}>{coroinha.funcao}:</Text>
                <Text style={styles.nomeCoroinha}>{coroinha.nome}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPrincipal}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.tituloPagina}>Histórico</Text>
        </View>

        {lista.length > 0 && (
          <TouchableOpacity onPress={confirmarLimpezaGeral} style={styles.botaoLixeiraGeral}>
            <Ionicons name="trash" size={24} color="#FF5252" />
          </TouchableOpacity>
        )}
      </View>

      {lista.length === 0 ? (
        <View style={styles.containerVazio}>
          <Ionicons name="calendar-outline" size={60} color="#CCC" />
          <Text style={styles.textoVazio}>Nenhuma missa no histórico.</Text>
        </View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFB' },
  headerPrincipal: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20, 
    marginTop: 20 
  },
  tituloPagina: { fontSize: 24, fontWeight: 'bold', marginLeft: 15, color: '#333' },
  botaoLixeiraGeral: { padding: 5 },
  card: { backgroundColor: 'white', borderRadius: 15, marginBottom: 12, elevation: 3, overflow: 'hidden' },
  cardHeaderContainer: { flexDirection: 'row', alignItems: 'center' },
  cardHeader: { flex: 1, padding: 15, flexDirection: 'row', alignItems: 'center' },
  btnExcluirIndividual: { padding: 15, justifyContent: 'center', alignItems: 'center' },
  data: { color: '#20B2AA', fontWeight: 'bold', fontSize: 13 },
  missaNome: { fontSize: 18, fontWeight: '600', color: '#444' },
  detalhes: { padding: 15, backgroundColor: '#F0FDFD' },
  divisor: { height: 1, backgroundColor: '#E0F2F1', marginBottom: 10 },
  subtitulo: { fontSize: 14, fontWeight: 'bold', color: '#008B8B', marginBottom: 8 },
  linhaCoroinha: { flexDirection: 'row', marginBottom: 5 },
  funcao: { fontWeight: 'bold', color: '#555', width: 100 },
  nomeCoroinha: { color: '#333', flex: 1 },
  containerVazio: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
  textoVazio: { marginTop: 10, fontSize: 16 }
});