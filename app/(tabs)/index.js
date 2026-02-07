import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones que já vem no Expo
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header de Boas Vindas */}
        <View style={styles.header}>
          <Text style={styles.saudacao}>Olá, Coordenador!</Text>
          <Text style={styles.subtitulo}>Paróquia Santa Maria</Text>
        </View>

        {/* Card de Próxima Missa (Destaque) */}
        <View style={styles.cardDestaque}>
          <Text style={styles.labelDestaque}>PRÓXIMA MISSA</Text>
          <Text style={styles.tituloMissa}>Missa de Domingo</Text>
          <Text style={styles.dataMissa}>08 de Fevereiro às 19h</Text>
          <TouchableOpacity style={styles.botaoQuickEscala}>
            <Text style={styles.textoBotaoBranco}>VER ESCALA ATUAL</Text>
          </TouchableOpacity>
        </View>

        {/* Menu de Atalhos */}
        <Text style={styles.tituloSecao}>Gerenciamento</Text>
        
        <View style={styles.gridMenu}>
          <TouchableOpacity style={styles.itemMenu}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="calendar" size={28} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemMenu}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="add-circle" size={28} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Nova Missa</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemMenu}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="people" size={28} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Coroinhas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemMenu}>
            <View style={[styles.circuloIcone, {backgroundColor: '#E0F2F1'}]}>
              <Ionicons name="settings" size={28} color="#20B2AA" />
            </View>
            <Text style={styles.textoMenu}>Ajustes</Text>
          </TouchableOpacity>
        </View>

        {/* Espaço Coroinhas (Resumo rápido) */}
        <View style={styles.secaoCoroinhas}>
          <View style={styles.headerSecao}>
            <Text style={styles.tituloSecao}>Coroinhas Ativos</Text>
            <TouchableOpacity><Text style={styles.verTodos}>Ver todos</Text></TouchableOpacity>
          </View>
          
          <View style={styles.miniCard}>
            <Text style={styles.nomeMiniCard}>Amós</Text>
            <Text style={styles.nivelMiniCard}>Nível 4</Text>
          </View>
          <View style={styles.miniCard}>
            <Text style={styles.nomeMiniCard}>Débora</Text>
            <Text style={styles.nivelMiniCard}>Nível 4</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FBFB' },
  scrollContent: { padding: 20 },
  header: { marginBottom: 25, marginTop: 10 },
  saudacao: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subtitulo: { fontSize: 16, color: '#20B2AA', fontWeight: '500' },
  cardDestaque: { 
    backgroundColor: '#20B2AA', 
    padding: 20, 
    borderRadius: 20, 
    elevation: 5,
    shadowColor: '#20B2AA',
    shadowOpacity: 0.3,
    shadowRadius: 10
  },
  labelDestaque: { color: '#E0F2F1', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  tituloMissa: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  dataMissa: { color: 'white', fontSize: 16, marginBottom: 15, opacity: 0.9 },
  botaoQuickEscala: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 10, alignItems: 'center' },
  textoBotaoBranco: { color: 'white', fontWeight: 'bold' },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 25, marginBottom: 15 },
  gridMenu: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  itemMenu: { width: '47%', backgroundColor: 'white', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15, elevation: 2 },
  circuloIcone: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  textoMenu: { fontWeight: '600', color: '#444' },
  secaoCoroinhas: { marginTop: 10 },
  headerSecao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  verTodos: { color: '#20B2AA', fontWeight: '600' },
  miniCard: { backgroundColor: 'white', padding: 15, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderWidth: 1, borderColor: '#E0F2F1' },
  nomeMiniCard: { fontWeight: 'bold', color: '#333' },
  nivelMiniCard: { color: '#666', fontSize: 12 }
});
