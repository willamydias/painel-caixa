export type ModalidadeVenda = 
  | 'Venda Direta Online'
  | 'Venda Online'
  | 'Licitação Aberta'
  | 'Leilão SFI'
  | 'Todos';

export type ClassificacaoScore = 'Excelente' | 'Boa' | 'Moderada' | 'Alerta';

export type VeredictoType = 'COMPRAR' | 'COMPRAR (Atenção)' | 'NÃO COMPRAR';

export type ColorPaletteKey =
  | 'azul_classico'
  | 'azul_royal'
  | 'carmim'
  | 'pastel'
  | 'citrico'
  | 'verde_vermelho';

export interface PropertyDocument {
  nome: string;
  url: string;
}

export interface Property {
  id: string;
  cidade_satelite?: string;
  bairro: string;
  logradouro_curto?: string;
  endereco: string;
  lat: number;
  lng: number;
  tipo: string;
  area: string;
  valor_avaliacao: string;
  valor_avaliacao_num: number;
  valor_minimo: string;
  valor_minimo_num: number;
  desconto_pct: number;
  veredicto: VeredictoType | string;
  fgts: 'Sim' | 'Não';
  has_photo: boolean;
  modalidade: string;
  data_1?: string;
  data_2?: string;
  url_caixa?: string;
  url_leiloeiro?: string;
  site_leiloeiro_nome?: string;
  site_leiloeiro_clean?: string;
  fotos_list?: string[];
  documentos_list?: PropertyDocument[];
  score: number;
  classificacao: ClassificacaoScore;
  ocupado?: boolean;
}

export interface FilterState {
  searchQuery: string;
  cidadeSatelite: string;
  bairro: string;
  modalidade: string;
  leiloeiro: string;
  fgtsOnly: boolean;
  minDescontoPct: number;
  maxPrecoNum: number;
  veredictoFilter: string;
  selectedDate: string | null;
  sortBy: 'score' | 'desconto' | 'preco_asc' | 'preco_desc' | 'data';
}

export interface KPIStats {
  totalCount: number;
  filteredCount: number;
  vendasDiretasCount: number;
  ticketMedio: number;
  descontoMedio: number;
  novidadesHojeCount: number;
}
