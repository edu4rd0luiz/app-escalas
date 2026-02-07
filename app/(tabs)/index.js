import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StorageService } from '../../src/services/StorageService';
// Importamos os dados iniciais para saber quem resetar
import { coroinhasData } from '../../src/data/coroinhas';

export default function Home() {
  const router = useRouter();

  const handleReiniciarMês = () => {
    Alert.alert(
      "Reiniciar Mês",
      "Deseja limpar o histórico e ZERAR os pesos de todos os coroinhas?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, Reiniciar", 
          style: "destructive", 
          onPress: async () => {
            // Chamamos a nova função que zera tudo
            const coroinhasAtuais = await StorageService.listarCoroinhas(coroinhasData);
            await StorageService.reiniciarMesCompleto(coroinhasAtuais);
            
            Alert.alert("Sucesso", "Histórico apagado e pesos zerados!");
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.saudacao}>Olá, Coordenador!</Text>
          <Text style={styles.subtitulo}>Paróquia Santa Maria</Text>
        </View>

        <Text style={styles.tituloSecao}>Gerenciamento</Text>
        
        <View style={styles.gridMenu}>
          {/* Botão Nova Missa */}
          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push('/missas')}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="add-circle-outline" size={30} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Nova Missa</Text>
          </TouchableOpacity>

          {/* Botão Coroinhas */}
          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push('/coroinhas')}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="people-outline" size={30} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Coroinhas</Text>
          </TouchableOpacity>

          {/* Botão Histórico */}
          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push('/historico')}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="list-outline" size={30} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Histórico</Text>
          </TouchableOpacity>

          {/* Botão Reiniciar Mês */}
          <TouchableOpacity style={styles.itemMenu} onPress={handleReiniciarMês}>
            <View style={[styles.circuloIcone, {backgroundColor: '#FFEBEE'}]}>
              <Ionicons name="refresh-circle-outline" size={30} color="#FF5252" />
            </View>
            <Text style={styles.textoMenu}>Reiniciar Mês</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFB' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 30, marginTop: 20 },
  saudacao: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 16, color: '#20B2AA' },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  gridMenu: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemMenu: { 
    width: '47%', 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginBottom: 20, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  circuloIcone: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  textoMenu: { fontWeight: '600', color: '#444' }
});