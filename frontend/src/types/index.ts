export interface Cliente {
  id: number;
  nome: string;
}

export interface Barbeiro {
  id: number;
  nome: string;

  percentual_comissao?: number;
}

export interface Servico {
  id: number;
  nome: string;

  preco?: number;
}

export interface Agendamento {
  id: number;

  cliente: Cliente;
  barbeiro: Barbeiro;
  servico: Servico;

  dataHora: string;

  cliente_nome: string;
  barbeiro_nome: string;
  servico_nome: string;

  servico_preco?: number;

  barbeiro_comissao?: number;
}