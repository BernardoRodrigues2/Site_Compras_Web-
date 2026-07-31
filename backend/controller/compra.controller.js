const Usuario = require('../models/Usuario')
const Produto = require('../models/Produto')
const Compra = require('../models/Compra')


const cadastrar = async (req, res) => {
    const valores = req.body
    if (!valores.idUsuario || !valores.idProduto || !valores.tipoMovimento || 
        !valores.quantidadeMovimentada || !valores.formaPagamento || 
        !valores.statusCompra || !valores.dataCompra) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
    }

    try {
        const produto = await Produto.findByPk(valores.idProduto)        
        if (!produto) {
            return res.status(404).json({ message: "Produto não encontrado!" })
        }

        const usuario = await Usuario.findByPk(valores.idUsuario)        
        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado!" })
        }
        
        let novaQuantidade = produto.qtdeEstoque
        const precoUnit = produto.preco

        if (valores.tipoMovimento === 'ENTRADA') {
            novaQuantidade += valores.quantidadeMovimentada
        } 
        else if (valores.tipoMovimento === 'SAIDA') {
            if (produto.qtdeEstoque < valores.quantidadeMovimentada) {
                return res.status(400).json({ message: "Quantidade insuficiente no estoque para esta saída!" })
            }
            novaQuantidade -= valores.quantidadeMovimentada
        } 
        else {
            return res.status(400).json({ message: "Tipo de Movimentação Inválida! Use ENTRADA ou SAIDA." })
        }

        const desconto = valores.descontoAplicado || 0.00
        const valorBruto = valores.quantidadeMovimentada * precoUnit
        const valorDesconto = valorBruto * (desconto / 100)
        const precoFinalCalculado = valorBruto - valorDesconto

        await produto.update({ qtdeEstoque: novaQuantidade })
        
        const compra = await Compra.create({
            idUsuario: valores.idUsuario,
            idProduto: valores.idProduto,
            tipoMovimento: valores.tipoMovimento,
            quantidadeMovimentada: valores.quantidadeMovimentada,
            precoUnitario: precoUnit,
            descontoAplicado: desconto,
            precoFinal: precoFinalCalculado,
            formaPagamento: valores.formaPagamento,
            statusCompra: valores.statusCompra,
            dataCompra: valores.dataCompra
        })

        res.status(201).json(compra)        
        
    } catch (err) {
        console.error('Erro ao registrar a Compra:', err)
        res.status(500).json({ message: "Erro ao registrar a Compra" })
    }    
}

const listar = async (req, res) => {
    try {
        const dados = await Compra.findAll({
            include: [
                { model: Usuario, as: 'usuarioCompra' },
                { model: Produto, as: 'produtoCompra' }
            ]
        })
        res.status(200).json(dados)
    } catch (err) {
        console.error('Não foi possível listar o histórico de Compras', err)
        res.status(500).json({ message: 'Não foi possível listar o histórico de Compras' })
    }
}

module.exports = { cadastrar, listar };
