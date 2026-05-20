'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ========== CLIENTES ==========

export async function getClientes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getCliente(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createCliente(formData) {
  const supabase = await createClient()
  
  const cliente = {
    tipo_pessoa: formData.tipo_pessoa,
    cnpj: formData.cnpj || null,
    razao_social: formData.razao_social || null,
    nome_fantasia: formData.nome_fantasia || null,
    cpf: formData.cpf || null,
    nome: formData.nome || null,
    apelido: formData.apelido || null,
    telefone: formData.telefone || null,
    telefones_adicionais: formData.telefones_adicionais || [],
    email: formData.email || null,
    emails_adicionais: formData.emails_adicionais || [],
    cep: formData.cep || null,
    logradouro: formData.logradouro || null,
    numero: formData.numero || null,
    complemento: formData.complemento || null,
    bairro: formData.bairro || null,
    cidade: formData.cidade || null,
    estado: formData.estado || null,
    inscricao_estadual: formData.inscricao_estadual || null,
    inscricao_municipal: formData.inscricao_municipal || null,
    observacoes: formData.observacoes || null,
  }
  
  const { data, error } = await supabase
    .from('clientes')
    .insert(cliente)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/clientes')
  return data
}

export async function updateCliente(id, formData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('clientes')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/clientes')
  return data
}

export async function searchClientes(query) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('ativo', true)
    .or(`razao_social.ilike.%${query}%,nome.ilike.%${query}%,cnpj.ilike.%${query}%,cpf.ilike.%${query}%,nome_fantasia.ilike.%${query}%`)
    .limit(10)
  
  if (error) throw error
  return data
}

// ========== CATEGORIAS ==========

export async function getCategorias() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('ativo', true)
    .order('nome')
  
  if (error) throw error
  return data
}

export async function createCategoria(nome, descricao = null) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categorias')
    .insert({ nome, descricao })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ========== PRODUTOS ==========

export async function getProdutos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('produtos')
    .select(`
      *,
      categoria:categorias(id, nome)
    `)
    .eq('ativo', true)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getProduto(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('produtos')
    .select(`
      *,
      categoria:categorias(id, nome)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createProduto(formData) {
  const supabase = await createClient()
  
  const produto = {
    nome: formData.nome,
    codigo: formData.codigo || null,
    descricao: formData.descricao || null,
    unidade_medida: formData.unidade_medida || 'UN',
    venda_multiplos: formData.venda_multiplos || 1,
    categoria_id: formData.categoria_id || null,
    moeda: formData.moeda || 'BRL',
    preco_minimo: formData.preco_minimo || 0,
    preco_tabela: formData.preco_tabela || 0,
    preco_custo: formData.preco_custo || 0,
    peso_bruto: formData.peso_bruto || null,
    peso_liquido: formData.peso_liquido || null,
    largura: formData.largura || null,
    altura: formData.altura || null,
    profundidade: formData.profundidade || null,
    estoque_atual: formData.estoque_atual || 0,
    estoque_minimo: formData.estoque_minimo || 0,
    imagem_url: formData.imagem_url || null,
    marca: formData.marca || null,
    ncm: formData.ncm || null,
    origem: formData.origem || null,
  }
  
  const { data, error } = await supabase
    .from('produtos')
    .insert(produto)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/produtos')
  return data
}

export async function updateProduto(id, formData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('produtos')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/produtos')
  return data
}

export async function searchProdutos(query) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('produtos')
    .select(`
      *,
      categoria:categorias(id, nome)
    `)
    .eq('ativo', true)
    .or(`nome.ilike.%${query}%,codigo.ilike.%${query}%`)
    .limit(10)
  
  if (error) throw error
  return data
}

// ========== REPRESENTADAS ==========

export async function getRepresentadas() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('representadas')
    .select('*')
    .eq('ativo', true)
    .order('nome')
  
  if (error) throw error
  return data
}

export async function createRepresentada(formData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('representadas')
    .insert(formData)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// ========== PEDIDOS ==========

export async function getPedidos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      cliente:clientes(id, tipo_pessoa, razao_social, nome, nome_fantasia),
      representada:representadas(id, nome)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getPedido(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      cliente:clientes(*),
      representada:representadas(*),
      itens:itens_pedido(
        *,
        produto:produtos(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createPedido(formData) {
  const supabase = await createClient()
  
  const pedido = {
    cliente_id: formData.cliente_id,
    representada_id: formData.representada_id || null,
    tipo_pedido: formData.tipo_pedido || 'Venda',
    vendedor_nome: formData.vendedor_nome || null,
    contato_cliente: formData.contato_cliente || null,
    condicao_pagamento: formData.condicao_pagamento || null,
    forma_pagamento: formData.forma_pagamento || null,
    valor_frete: formData.valor_frete || 0,
    transportadora: formData.transportadora || null,
    endereco_entrega: formData.endereco_entrega || 'principal',
    observacoes: formData.observacoes || null,
    informacoes_adicionais: formData.informacoes_adicionais || null,
    status: 'Rascunho',
  }
  
  const { data, error } = await supabase
    .from('pedidos')
    .insert(pedido)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/pedidos')
  return data
}

export async function updatePedido(id, formData) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('pedidos')
    .update({
      ...formData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/pedidos')
  return data
}

export async function addItemPedido(pedidoId, item) {
  const supabase = await createClient()
  
  const subtotal = (item.quantidade * item.preco_unitario) - (item.desconto_valor || 0)
  
  const { data, error } = await supabase
    .from('itens_pedido')
    .insert({
      pedido_id: pedidoId,
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      preco_unitario: item.preco_unitario,
      desconto_percentual: item.desconto_percentual || 0,
      desconto_valor: item.desconto_valor || 0,
      subtotal,
      observacao: item.observacao || null,
    })
    .select(`
      *,
      produto:produtos(*)
    `)
    .single()
  
  if (error) throw error
  
  // Atualizar total do pedido
  await recalcularTotalPedido(pedidoId)
  
  revalidatePath('/pedidos')
  return data
}

export async function removeItemPedido(itemId, pedidoId) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('itens_pedido')
    .delete()
    .eq('id', itemId)
  
  if (error) throw error
  
  // Atualizar total do pedido
  await recalcularTotalPedido(pedidoId)
  
  revalidatePath('/pedidos')
}

async function recalcularTotalPedido(pedidoId) {
  const supabase = await createClient()
  
  // Buscar todos os itens do pedido
  const { data: itens } = await supabase
    .from('itens_pedido')
    .select('subtotal')
    .eq('pedido_id', pedidoId)
  
  const subtotal = itens?.reduce((acc, item) => acc + Number(item.subtotal), 0) || 0
  
  // Buscar pedido para pegar frete e desconto
  const { data: pedido } = await supabase
    .from('pedidos')
    .select('valor_frete, desconto_valor')
    .eq('id', pedidoId)
    .single()
  
  const valorTotal = subtotal + Number(pedido?.valor_frete || 0) - Number(pedido?.desconto_valor || 0)
  
  await supabase
    .from('pedidos')
    .update({
      subtotal,
      valor_total: valorTotal,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pedidoId)
}

// ========== DASHBOARD ==========

export async function getDashboardData(mes, ano) {
  const supabase = await createClient()
  
  const inicioMes = new Date(ano, mes - 1, 1).toISOString().split('T')[0]
  const fimMes = new Date(ano, mes, 0).toISOString().split('T')[0]
  
  // Vendas do mês
  const { data: pedidosMes } = await supabase
    .from('pedidos')
    .select('valor_total, data_emissao')
    .gte('data_emissao', inicioMes)
    .lte('data_emissao', fimMes)
    .in('status', ['Aprovado', 'Faturado', 'Enviado', 'Entregue'])
  
  const vendidoNoMes = pedidosMes?.reduce((acc, p) => acc + Number(p.valor_total), 0) || 0
  
  // Clientes ativos
  const { count: totalClientes } = await supabase
    .from('clientes')
    .select('*', { count: 'exact', head: true })
    .eq('ativo', true)
  
  // Clientes positivados (com pedido no mês)
  const { data: clientesPedidoMes } = await supabase
    .from('pedidos')
    .select('cliente_id')
    .gte('data_emissao', inicioMes)
    .lte('data_emissao', fimMes)
  
  const clientesPositivados = new Set(clientesPedidoMes?.map(p => p.cliente_id)).size
  
  // Dados diários para o gráfico
  const diasNoMes = new Date(ano, mes, 0).getDate()
  const vendasDiarias = []
  
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const data = new Date(ano, mes - 1, dia)
    const dataStr = data.toISOString().split('T')[0]
    const vendaDia = pedidosMes?.filter(p => p.data_emissao === dataStr)
      .reduce((acc, p) => acc + Number(p.valor_total), 0) || 0
    
    vendasDiarias.push({
      dia,
      diaSemana: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][data.getDay()],
      valor: vendaDia,
    })
  }
  
  return {
    vendidoNoMes,
    totalClientes: totalClientes || 0,
    clientesPositivados,
    vendasDiarias,
  }
}
