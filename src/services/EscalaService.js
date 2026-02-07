// src/services/EscalaService.js
import { coroinhasData } from '../data/coroinhas';

const REGRAS_NIVEL = {
  "Turiferário": 4,
  "Librífero": 3,
  "Ceroferário": 2,
  "Cruciferário": 2,
  "Credência": 1,
  "Audífero": 1,
  "Naviculário": 1
};

export class EscalaService {
  static gerarEscala(missa) {
    const { configuracao, requisitos } = missa;

    // 1. FILTRAR: Quem pode servir hoje?
    let disponiveis = [...coroinhasData].filter(coroinha => {
      // Se não for fim de semana, só quem é da Matriz ("M")
      if (!configuracao.isFimDeSemana) {
        return coroinha.local === "M";
      }
      return true; // Fim de semana todos participam
    });

    // 2. ORDENAR: Fila de prioridade pelo peso (Menor peso primeiro)
    disponiveis.sort((a, b) => a.peso - b.peso);

    // 3. PREPARAR O RETORNO: Objeto de saída
    const escalaGerada = {
      id: missa.id,
      titulo: configuracao.titulo,
      data: configuracao.data,
      CoroinhasEscalados: []
    };

    // Criamos um Set para garantir que um coroinha não seja escalado 2x na mesma missa
    const idsJaEscalados = new Set();

    // 4. ESCALAR: Processar cada requisito (do nível mais alto para o mais baixo)
    // Ordenamos os requisitos para garantir que N4 seja preenchido antes do N1
    const requisitosOrdenados = [...requisitos].sort((a, b) => b.nivelMinimo - a.nivelMinimo);

    requisitosOrdenados.forEach(req => {
      // Para cada unidade da quantidade solicitada (ex: se numCero for 2, roda 2 vezes)
      for (let i = 0; i < req.quantidade; i++) {
        
        // Busca o primeiro da fila (menor peso) que tenha nível suficiente e não esteja escalado
        const escolhido = disponiveis.find(c => 
          c.nivel >= req.nivelMinimo && !idsJaEscalados.has(c.id)
        );

        if (escolhido) {
          // Adiciona à lista final
          escalaGerada.CoroinhasEscalados.push({
            id: escolhido.id,
            nome: escolhido.nome,
            funcao: req.funcao
          });

          // Marca como escalado para o motor não pegar ele de novo nesta missa
          idsJaEscalados.add(escolhido.id);

          // SOMA PESO: Incrementa o peso do coroinha original no banco (simulação)
          escolhido.peso += 1; 
        } else {
          // Caso não encontre ninguém apto para a função
          escalaGerada.CoroinhasEscalados.push({
            id: null,
            nome: "VAGA NÃO PREENCHIDA",
            funcao: req.funcao
          });
        }
      }
    });

    return escalaGerada;
  }
}