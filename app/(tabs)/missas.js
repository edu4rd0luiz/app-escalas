import { useState } from 'react';
import {
    Alert, Clipboard,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { EscalaService } from '../../src/services/EscalaService';

export default function TelaGerarEscala() {
  const [escala, setEscala] = useState(null);
  
  // Estados para o formulário
  const [titulo, setTitulo] = useState('Missa de Domingo');
  const [data, setData] = useState('08/02');
  const [quantidades, setQuantidades] = useState({
    Tur: '1', Lib: '1', Cero: '2', Cru: '1', Audi: '0', Navi: '0', Cred: '2'
  });

  const atualizarQuantidade = (funcao, valor) => {
    setQuantidades({ ...quantidades, [funcao]: valor.replace(/[^0-9]/g, '') });
  };

  const executarMotor = () => {
    const missaDigitada = {
      id: Date.now(),
      configuracao: { titulo, data, isFimDeSemana: true },
      requisitos: [
        { funcao: "Turiferário",  nivelMinimo: 4, quantidade: parseInt(quantidades.Tur) || 0 },
        { funcao: "Librífero",    nivelMinimo: 3, quantidade: parseInt(quantidades.Lib) || 0 },
        { funcao: "Ceroferário",  nivelMinimo: 2, quantidade: parseInt(quantidades.Cero) || 0 },
        { funcao: "Cruciferário", nivelMinimo: 2, quantidade: parseInt(quantidades.Cru) || 0 },
        { funcao: "Audífero",     nivelMinimo: 1, quantidade: parseInt(quantidades.Audi) || 0 },
        { funcao: "Naviculário",  nivelMinimo: 1, quantidade: parseInt(quantidades.Navi) || 0 },
        { funcao: "Credência",    nivelMinimo: 1, quantidade: parseInt(quantidades.Cred) || 0 }
      ]
    };

    const resultado = EscalaService.gerarEscala(missaDigitada);
    setEscala(resultado);
  };

  const copiarEscala = () => {
    if (!escala) return;
    let texto = `✨ *ESCALA: ${escala.titulo} (${escala.data})*\n\n`;
    escala.CoroinhasEscalados.forEach(item => {
      texto += `• ${item.funcao}: ${item.nome}\n`;
    });
    Clipboard.setString(texto);
    Alert.alert("Copiado!", "Escala pronta para o WhatsApp! ✅");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.tituloApp}>Cadastrar Missa</Text>
        </View>

        {/* Formulário de Cadastro */}
        <View style={styles.cardForm}>
          <TextInput 
            style={styles.inputGrande} 
            placeholder="Título da Missa" 
            value={titulo} 
            onChangeText={setTitulo} 
          />
          <TextInput 
            style={styles.inputGrande} 
            placeholder="Data (ex: 08/02)" 
            value={data} 
            onChangeText={setData} 
          />

          <Text style={styles.labelSecao}>Numero de coroinhas:</Text>
          <View style={styles.gradeInputs}>
            {Object.keys(quantidades).map((key) => (
              <View key={key} style={styles.itemInput}>
                <Text style={styles.labelInput}>{key}</Text>
                <TextInput 
                  style={styles.inputNumero} 
                  keyboardType="numeric"
                  value={quantidades[key]}
                  onChangeText={(v) => atualizarQuantidade(key, v)}
                />
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.botaoGerar} onPress={executarMotor}>
            <Text style={styles.textoBotao}>🔄 GERAR ESCALA</Text>
          </TouchableOpacity>
        </View>

        {/* Resultado */}
        {escala && (
          <View style={styles.resultadoContainer}>
            <TouchableOpacity style={styles.botaoCopiar} onPress={copiarEscala}>
              <Text style={styles.textoBotaoCopiar}>📋 COPIAR PARA WHATSAPP</Text>
            </TouchableOpacity>
            
            {escala.CoroinhasEscalados.map((item, index) => (
              <View key={index} style={styles.linhaLista}>
                <Text style={styles.textoLinha}>
                  <Text style={styles.labelFuncao}>{item.funcao}:</Text> {item.nome}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F8F8', paddingHorizontal: 20 },
  header: { marginTop: 20, marginBottom: 15, alignItems: 'center' },
  tituloApp: { fontSize: 24, fontWeight: 'bold', color: '#20B2AA' },
  cardForm: { backgroundColor: 'white', padding: 15, borderRadius: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  inputGrande: { borderBottomWidth: 1, borderBottomColor: '#20B2AA', marginBottom: 15, padding: 8, fontSize: 16 },
  labelSecao: { fontWeight: 'bold', color: '#008B8B', marginBottom: 10 },
  gradeInputs: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  itemInput: { width: '22%', alignItems: 'center', marginBottom: 10 },
  labelInput: { fontSize: 12, color: '#666', marginBottom: 4 },
  inputNumero: { backgroundColor: '#E0F2F1', width: '100%', textAlign: 'center', borderRadius: 8, padding: 8, fontWeight: 'bold' },
  botaoGerar: { backgroundColor: '#20B2AA', padding: 15, borderRadius: 12, alignItems: 'center' },
  textoBotao: { color: 'white', fontWeight: 'bold' },
  resultadoContainer: { marginTop: 20, paddingBottom: 40 },
  botaoCopiar: { backgroundColor: '#E0F2F1', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#20B2AA' },
  textoBotaoCopiar: { color: '#00695C', fontWeight: 'bold' },
  linhaLista: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  textoLinha: { fontSize: 16 },
  labelFuncao: { fontWeight: 'bold', color: '#20B2AA' }
});