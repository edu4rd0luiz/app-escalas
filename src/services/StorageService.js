import AsyncStorage from '@react-native-async-storage/async-storage';

const MISSAS_KEY = '@minhas_missas';
const COROINHAS_KEY = '@meus_coroinhas';

export const StorageService = {
  // --- LÓGICA DE MISSAS (HISTÓRICO) ---

  // Remove um coroinha específico da lista
  removerCoroinha: async (id) => {
    try {
      const listaAtual = await StorageService.listarCoroinhas([]);
      const novaLista = listaAtual.filter(c => c.id !== id);
      await AsyncStorage.setItem('@meus_coroinhas', JSON.stringify(novaLista));
      return novaLista;
    } catch (e) {
      console.error("Erro ao remover coroinha", e);
      return null;
    }
  },

  adicionarCoroinha: async (novoCoroinha) => {
  try {
    const listaAtual = await StorageService.listarCoroinhas([]);
    const novaLista = [...listaAtual, novoCoroinha];
    await AsyncStorage.setItem('@meus_coroinhas', JSON.stringify(novaLista));
    return novaLista;
  } catch (e) {
    console.error("Erro ao salvar coroinha", e);
  }
},

  // Remove uma única missa pelo ID ou Index
  removerMissa: async (index) => {
    try {
      const historico = await StorageService.listarMissas();
      // Remove o item daquela posição específica
      historico.splice(index, 1); 
      await AsyncStorage.setItem(MISSAS_KEY, JSON.stringify(historico));
      return historico;
    } catch (e) {
      console.error("Erro ao remover missa", e);
      return null;
    }
  },

  salvarMissa: async (novaMissa) => {
    try {
      const historicoAtual = await StorageService.listarMissas();
      const novoHistorico = [novaMissa, ...historicoAtual];
      await AsyncStorage.setItem(MISSAS_KEY, JSON.stringify(novoHistorico));
    } catch (e) {
      console.error("Erro ao salvar missa no storage", e);
    }
  },

  listarMissas: async () => {
    try {
      const dados = await AsyncStorage.getItem(MISSAS_KEY);
      return dados ? JSON.parse(dados) : [];
    } catch (e) {
      console.error("Erro ao buscar histórico", e);
      return [];
    }
  },

  // --- LÓGICA DE COROINHAS (PESOS E DADOS) ---

  // Salva a lista de coroinhas (útil para quando o peso aumenta após uma escala)
  salvarCoroinhas: async (lista) => {
    try {
      await AsyncStorage.setItem(COROINHAS_KEY, JSON.stringify(lista));
    } catch (e) {
      console.error("Erro ao salvar coroinhas", e);
    }
  },

  // Busca coroinhas salvos. Se não houver nenhum, usa a lista inicial do arquivo.
  listarCoroinhas: async (dadosIniciais) => {
    try {
      const dados = await AsyncStorage.getItem(COROINHAS_KEY);
      return dados ? JSON.parse(dados) : dadosIniciais;
    } catch (e) {
      return dadosIniciais;
    }
  },

  // --- REINICIAR MÊS (LIMPA TUDO) ---

  reiniciarMesCompleto: async (dadosAtuais) => {
    try {
      // 1. Apaga o histórico de missas
      await AsyncStorage.removeItem(MISSAS_KEY);
      
      // 2. Zera os pesos de todos os coroinhas da lista
      const coroinhasZerados = dadosAtuais.map(coroinha => ({
        ...coroinha,
        peso: 0
      }));
      
      // 3. Salva a lista com pesos zerados no Storage
      await AsyncStorage.setItem(COROINHAS_KEY, JSON.stringify(coroinhasZerados));
      
      return coroinhasZerados;
    } catch (e) {
      console.error("Erro ao reiniciar mês", e);
    }
  }
};