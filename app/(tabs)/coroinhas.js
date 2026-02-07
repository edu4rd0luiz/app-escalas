import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator, Alert, FlatList, Modal, SafeAreaView,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { coroinhasData } from '../../src/data/coroinhas';
import { StorageService } from '../../src/services/StorageService';

export default function TelaCoroinhas() {
  const router = useRouter();
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);

  // Estados do Formulário de Cadastro
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState(1);
  const [local, setLocal] = useState('M');
  const [coral, setCoral] = useState('FC');
  const [disponibilidade, setDisponibilidade] = useState('Sábado');

  const buscarDados = async () => {
    setCarregando(true);
    const dadosSalvos = await StorageService.listarCoroinhas(coroinhasData);
    setLista(dadosSalvos);
    setCarregando(false);
  };

  useFocusEffect(
    useCallback(() => {
      buscarDados();
    }, [])
  );

  const salvarNovoCoroinha = async () => {
    if (!nome.trim()) return Alert.alert("Ops!", "O nome é obrigatório.");

    const novo = {
      id: Date.now(),
      nome: nome.trim(),
      nivel,
      local,
      coral,
      disponibilidade,
      peso: 0
    };

    Alert.alert("Confirmar", `Deseja cadastrar ${nome}?`, [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sim, Salvar", 
        onPress: async () => {
          await StorageService.adicionarCoroinha(novo);
          setModalVisivel(false);
          setNome(''); // Limpa o nome para o próximo
          buscarDados(); // Atualiza a lista na tela
        } 
      }
    ]);
  };

  // Componente interno para as opções fechadas (Botões)
  const SeletorOpcoes = ({ label, opcoes, valorAtual, setValor }) => (
    <View style={styles.secaoForm}>
      <Text style={styles.labelForm}>{label}</Text>
      <View style={styles.rowOpcoes}>
        {opcoes.map(op => (
          <TouchableOpacity 
            key={op.id} 
            style={[styles.btnOpcao, valorAtual === op.id && styles.btnAtivo]}
            onPress={() => setValor(op.id)}
          >
            <Text style={[styles.txtOpcao, valorAtual === op.id && styles.txtAtivo]}>{op.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

// Função para excluir coroinha com confirmação
  const excluirCoroinha = (coroinha) => {
    Alert.alert(
      "Excluir Coroinha",
      `Tem certeza que deseja remover ${coroinha.nome} da lista?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            const novaLista = await StorageService.removerCoroinha(coroinha.id);
            if (novaLista) setLista(novaLista);
          } 
        }
      ]
    );
  };

const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* O cardCorpo coloca o conteúdo e a lixeira lado a lado */}
      <View style={styles.cardCorpo}> 
        
        {/* O flex: 1 faz os textos ocuparem todo o espaço da esquerda */}
        <View style={{ flex: 1 }}>
          <View style={styles.infoRow}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.badgeNivel}>Nível {item.nivel}</Text>
          </View>
          <View style={styles.detalhesRow}>
            <Text style={styles.tag}>{item.local} • {item.coral} • {item.disponibilidade}</Text>
            <Text style={[styles.peso, item.peso > 0 && {color: '#20B2AA', fontWeight: 'bold'}]}>
              Peso: {item.peso}
            </Text>
          </View>
        </View>

        {/* Botão de Excluir */}
        <TouchableOpacity 
          style={styles.btnExcluir} 
          onPress={() => excluirCoroinha(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#FFCDD2" />
        </TouchableOpacity>
        
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
        <View style={{flex: 1, marginLeft: 15}}>
          <Text style={styles.titulo}>Coroinhas</Text>
          <Text style={styles.contador}>{lista.length} cadastrados</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisivel(true)} style={styles.btnMais}>
          <Ionicons name="person-add" size={24} color="#20B2AA" />
        </TouchableOpacity>
      </View>

      {carregando ? (
        <View style={styles.containerCarregando}><ActivityIndicator size="large" color="#20B2AA" /></View>
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.lista}
        />
      )}

      {/* POP-UP (MODAL) DE CADASTRO */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Novo Coroinha</Text>
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <Ionicons name="close-circle" size={30} color="#CCC" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.labelForm}>Nome Completo</Text>
              <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite o nome..." />

              <SeletorOpcoes label="Local" valorAtual={local} setValor={setLocal} 
                opcoes={[{id:'M', label:'Matriz'}, {id:'SO', label:'Soledade'}, {id:'Sítio', label:'Sítio'}, {id:'CG', label:'CG'}]} />

              <SeletorOpcoes label="Coral" valorAtual={coral} setValor={setCoral} 
                opcoes={[{id:'FC', label:'Filhos/Cord.'}, {id:'C', label:'Cordeirinhos'}, {id:'G', label:'Gêmeas'}]} />

              <SeletorOpcoes label="Nível" valorAtual={nivel} setValor={setNivel} 
                opcoes={[{id:1, label:'1'}, {id:2, label:'2'}, {id:3, label:'3'}, {id:4, label:'4'}]} />

              <SeletorOpcoes label="Disponibilidade" valorAtual={disponibilidade} setValor={setDisponibilidade} 
                opcoes={[{id:'Sábado', label:'Sáb'}, {id:'Dom M', label:'Dom M'}, {id:'Dom N', label:'Dom N'}]} />

              <TouchableOpacity style={styles.btnSalvar} onPress={salvarNovoCoroinha}>
                <Text style={styles.txtSalvar}>CADASTRAR COROINHA</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFB' },
  header: { marginTop: 40, padding: 20, flexDirection: 'row', alignItems: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  contador: { color: '#20B2AA', fontWeight: 'bold' },
  btnMais: { backgroundColor: '#E0F2F1', padding: 10, borderRadius: 12 },
  lista: { paddingHorizontal: 20, paddingBottom: 20 },
  cardCorpo: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  btnExcluir: { 
    padding: 10, 
    marginLeft: 10 
  },
  // Certifique-se que o card não tenha padding interno excessivo que atrapalhe o botão
  card: { 
    backgroundColor: 'white', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 10, 
    elevation: 2 
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  nome: { fontSize: 17, fontWeight: '600' },
  badgeNivel: { fontSize: 12, color: '#666' },
  detalhesRow: { flexDirection: 'row', justifyContent: 'space-between' },
  tag: { fontSize: 12, color: '#999' },
  peso: { fontSize: 13, color: '#666' },
  containerCarregando: { flex: 1, justifyContent: 'center' },
  
  // Estilos do Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, height: '85%', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitulo: { fontSize: 22, fontWeight: 'bold', color: '#20B2AA' },
  labelForm: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#F0F5F5', padding: 12, borderRadius: 10, fontSize: 16 },
  rowOpcoes: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btnOpcao: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#DDD' },
  btnAtivo: { backgroundColor: '#20B2AA', borderColor: '#20B2AA' },
  txtOpcao: { color: '#666' },
  txtAtivo: { color: 'white', fontWeight: 'bold' },
  btnSalvar: { backgroundColor: '#20B2AA', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 30, marginBottom: 20 },
  txtSalvar: { color: 'white', fontWeight: 'bold' }
});