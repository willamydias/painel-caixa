import { Property, FilterState, KPIStats } from '@/types/property';

export function filterAndSortProperties(
  properties: Property[],
  filters: FilterState
): Property[] {
  return properties
    .filter((p) => {
      // 1. Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase();
        const matchId = p.id.toLowerCase().includes(q);
        const matchEnd = p.endereco.toLowerCase().includes(q);
        const matchBairro = p.bairro.toLowerCase().includes(q);
        const matchRA = (p.cidade_satelite || '').toLowerCase().includes(q);
        const matchTipo = p.tipo.toLowerCase().includes(q);
        const matchLeiloeiro = (p.site_leiloeiro_clean || '').toLowerCase().includes(q);
        if (!matchId && !matchEnd && !matchBairro && !matchRA && !matchTipo && !matchLeiloeiro) return false;
      }

      // 2. Cidade Satélite (RA)
      if (filters.cidadeSatelite && filters.cidadeSatelite !== 'Todos' && filters.cidadeSatelite !== '') {
        const cs = (p.cidade_satelite || 'Brasília').toLowerCase();
        if (cs !== filters.cidadeSatelite.toLowerCase()) return false;
      }

      // 3. Bairro / Setor Específico
      if (filters.bairro !== 'Todos' && filters.bairro !== '') {
        if (p.bairro.toUpperCase() !== filters.bairro.toUpperCase()) return false;
      }

      // 4. Modalidade
      if (filters.modalidade !== 'Todos' && filters.modalidade !== '') {
        if (!p.modalidade.toLowerCase().includes(filters.modalidade.toLowerCase())) {
          return false;
        }
      }

      // 5. Leiloeiro Filter (Domain clean)
      if (filters.leiloeiro !== 'Todos' && filters.leiloeiro !== '') {
        const cleanL = (p.site_leiloeiro_clean || 'caixa').toLowerCase();
        if (cleanL !== filters.leiloeiro.toLowerCase()) {
          return false;
        }
      }

      // 6. FGTS Only
      if (filters.fgtsOnly && p.fgts !== 'Sim') {
        return false;
      }

      // 7. Minimum Desconto %
      if (filters.minDescontoPct > 0 && p.desconto_pct < filters.minDescontoPct) {
        return false;
      }

      // 8. Max Preco Num
      if (filters.maxPrecoNum > 0 && p.valor_minimo_num > filters.maxPrecoNum) {
        return false;
      }

      // 9. Veredicto Filter
      if (filters.veredictoFilter !== 'Todos' && filters.veredictoFilter !== '') {
        if (!p.veredicto.toLowerCase().includes(filters.veredictoFilter.toLowerCase())) {
          return false;
        }
      }

      // 10. Selected Date Filter (from AuctionCalendar)
      if (filters.selectedDate) {
        const d1 = p.data_1 ? p.data_1.split(' ')[0] : '';
        const d2 = p.data_2 ? p.data_2.split(' ')[0] : '';
        if (d1 !== filters.selectedDate && d2 !== filters.selectedDate) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'score':
          return b.score - a.score;
        case 'desconto':
          return b.desconto_pct - a.desconto_pct;
        case 'preco_asc':
          return a.valor_minimo_num - b.valor_minimo_num;
        case 'preco_desc':
          return b.valor_minimo_num - a.valor_minimo_num;
        case 'data':
          return (a.data_1 || '').localeCompare(b.data_1 || '');
        default:
          return b.score - a.score;
      }
    });
}

export function calculateKPIs(allProps: Property[], filteredProps: Property[]): KPIStats {
  const totalCount = allProps.length;
  const filteredCount = filteredProps.length;

  const vendasDiretasCount = filteredProps.filter(
    (p) => p.modalidade.includes('Venda Direta') || p.modalidade.includes('Compra Direta')
  ).length;

  const sumPreco = filteredProps.reduce((acc, p) => acc + (p.valor_minimo_num || 0), 0);
  const ticketMedio = filteredCount > 0 ? sumPreco / filteredCount : 0;

  const sumDesconto = filteredProps.reduce((acc, p) => acc + (p.desconto_pct || 0), 0);
  const descontoMedio = filteredCount > 0 ? sumDesconto / filteredCount : 0;

  const novidadesHojeCount = filteredProps.filter((p) => p.score >= 80).length;

  return {
    totalCount,
    filteredCount,
    vendasDiretasCount,
    ticketMedio,
    descontoMedio,
    novidadesHojeCount,
  };
}
