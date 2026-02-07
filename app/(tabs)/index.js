import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // Importante para navegar
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  const reiniciarMes = () => {
    Alert.alert(
      "Reiniciar Mês",
      "Isso zerará os pesos de todos os coroinhas. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sim, Reiniciar", onPress: () => console.log("Pesos zerados!") }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.saudacao}>Controle de Escalas</Text>
          <Text style={styles.subtitulo}>Paróquia Santa Maria</Text>
        </View>

        <Text style={styles.tituloSecao}>Menu Principal</Text>
        
        <View style={styles.gridMenu}>
          {/* Botão para a tela que já criamos de Missas/Escala */}
          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push('/missas')}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="calendar-outline" size={30} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Ver Missas</Text>
          </TouchableOpacity>

          {/* Botão que futuramente terá o cadastro de nova missa no banco */}
          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push('/missas')}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="add-circle-outline" size={30} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Nova Missa</Text>
          </TouchableOpacity>

          {/* Botão para a tela de Coroinhas */}
          <TouchableOpacity style={styles.itemMenu} onPress={() => router.push('/coroinhas')}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="people-outline" size={30} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Coroinhas</Text>
          </TouchableOpacity>

          {/* Botão Reiniciar Mês */}
          <TouchableOpacity style={styles.itemMenu} onPress={reiniciarMes}>
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
  header: { marginBottom: 30, marginTop: 20, alignItems: 'center' },
  saudacao: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 16, color: '#20B2AA', fontWeight: '500' },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20 },
  gridMenu: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemMenu: { 
    width: '47%', 
    backgroundColor: 'white', 
    paddingVertical: 25, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginBottom: 20, 
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10
  },
  circuloIcone: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  textoMenu: { fontWeight: 'bold', color: '#444', fontSize: 14 }
});