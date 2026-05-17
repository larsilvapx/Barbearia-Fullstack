export interface Cliente{
    id: number;
    nome: string;
}

export interface Barbeiro{
    id: number;
    nome: string;
}

export interface Servico{
    id: number;
    nome: string;
}

export interface Agendamento{
    id: number;
    cliente: Cliente;
    barbeiro: Barbeiro;
    servico: Servico;
    dataHora: string;

    cliente_nome: string;
    barbeiro_nome: string;
    servico_nome: string;

    servico_preco: number;
}