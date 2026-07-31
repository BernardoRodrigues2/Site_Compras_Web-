const Produto = require('../models/Produto')

const cargaLote = (req, res) => {
    const payloadProdutos = req.body

    if (!payloadProdutos || payloadProdutos.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote!' })
    }

    const listaConvertidaProdutos = []

    for (let i = 0; i < payloadProdutos.length; i++) {
        const item = payloadProdutos[i]

        listaConvertidaProdutos.push({
            nome: item.nome || item.title,
            descricao: item.descricao || item.description,
            categoria: item.categoria || item.category,
            preco: item.preco || item.price,
            desconto: item.desconto || item.discountPercentage,
            qtdeEstoque: item.qtdeEstoque || item.stock,
            marca: item.marca || item.brand,
            imagem: item.imagem || item.thumbnail
        })
    }

    Produto.bulkCreate(listaConvertidaProdutos)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de produtos realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de produtos:', err)
            res.status(500).json({ message: 'Erro ao salvar os produtos em lote no banco de dados' })
        })
}

const cadastrar = async (req, res) => {
    try {
        const produto = await Produto.create(req.body)
        res.status(201).json({ message: 'Produto cadastrado com sucesso!', produto })
    } catch (err) {
        console.error('Erro ao cadastrar produto:', err)
        res.status(500).json({ message: 'Erro ao cadastrar produto' })
    }
}

const listar = async (req, res) => {
    try {
        const resultadoConsulta = await Produto.findAll()
        res.status(200).json(resultadoConsulta)
    } catch (err) {
        console.error('Não foi possível listar os Produtos', err)
        res.status(500).json({ message: 'Não foi possível listar os Produtos' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const resultadoConsulta = await Produto.findByPk(id)
        if (!resultadoConsulta) {
            res.status(404).json({ message: 'Produto não encontrado!' })
        } else {
            res.status(200).json(resultadoConsulta)
        }
    } catch (err) {
        console.error('Não foi possível encontrar o Produto', err)
        res.status(500).json({ message: 'Não foi possível encontrar o Produto' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const dadosEnviados = req.body
    try {
        let resultadoConsulta = await Produto.findByPk(id)
        if (!resultadoConsulta) {
            res.status(404).json({ message: 'Produto não encontrado no banco de dados!' })
        } else {
            await Produto.update(dadosEnviados, { where: { codProduto: id } })
            resultadoConsulta = await Produto.findByPk(id)
            res.status(200).json(resultadoConsulta)
        }
    } catch (err) {
        console.error('Não foi possível atualizar o Produto', err)
        res.status(500).json({ message: 'Não foi possível atualizar o Produto' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const resultadoConsulta = await Produto.findByPk(id)
        if (!resultadoConsulta) {
            res.status(404).json({ message: 'Produto não encontrado no banco de dados!' })
        } else {
            await Produto.destroy({ where: { codProduto: id } })
            res.status(200).json({ message: 'Produto excluído com sucesso!' })
        }
    } catch (err) {
        console.error('Não foi possível excluir o Produto', err)
        res.status(500).json({ message: 'Não foi possível excluir o Produto' })
    }
}

module.exports = { cargaLote, cadastrar, listar, consultar, atualizar, apagar };
