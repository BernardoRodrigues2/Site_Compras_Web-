const Usuario = require('../models/Usuario')

const cargaLote = (req, res) => {
    const payloadUsuarios = req.body

    if (!payloadUsuarios || payloadUsuarios.length === 0) {
        return res.status(400).json({ message: 'Nenhum dado válido foi enviado para a carga em lote de usuários!' })
    }

    const listaConvertidaUsuarios = []

    for (let i = 0; i < payloadUsuarios.length; i++) {
        const item = payloadUsuarios[i]

        listaConvertidaUsuarios.push({
            nome: item.nome || item.firstName,
            sobrenome: item.sobrenome || item.lastName,
            idade: item.idade || item.age,
            email: item.email,
            telefone: item.telefone || item.phone,
            endereco: item.endereco || (item.address ? item.address.address : ''),
            cidade: item.cidade || (item.address ? item.address.city : ''),
            estado: item.estado || (item.address ? item.address.state : '')
        })
    }

    Usuario.bulkCreate(listaConvertidaUsuarios)
        .then(() => {
            res.status(201).json({ message: 'Carga em lote de usuários realizada com sucesso no banco!' })
        })
        .catch((err) => {
            console.error('Erro no bulkCreate de usuários:', err)
            res.status(500).json({ message: 'Erro ao salvar os usuários em lote no banco de dados' })
        })
}

const cadastrar = async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body)
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario })
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err)
        res.status(500).json({ message: 'Erro ao cadastrar usuário' })
    }
}

const listar = async (req, res) => {
    try {
        const resultadoConsulta = await Usuario.findAll()
        res.status(200).json(resultadoConsulta)
    } catch (err) {
        console.error('Não foi possível listar os Usuários', err)
        res.status(500).json({ message: 'Não foi possível listar os Usuários' })
    }
}

const consultar = async (req, res) => {
    const id = req.params.id
    try {
        const resultadoConsulta = await Usuario.findByPk(id)
        if (!resultadoConsulta) {
            res.status(404).json({ message: 'Usuário não encontrado!' })
        } else {
            res.status(200).json(resultadoConsulta)
        }
    } catch (err) {
        console.error('Não foi possível encontrar o Usuário', err)
        res.status(500).json({ message: 'Não foi possível encontrar o Usuário' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const dadosEnviados = req.body
    try {
        let resultadoConsulta = await Usuario.findByPk(id)
        if (!resultadoConsulta) {
            res.status(404).json({ message: 'Usuário não encontrado no banco de dados!' })
        } else {
            await Usuario.update(dadosEnviados, { where: { codUsuario: id } })
            resultadoConsulta = await Usuario.findByPk(id)
            res.status(200).json(resultadoConsulta)
        }
    } catch (err) {
        console.error('Não foi possível atualizar o Usuário', err)
        res.status(500).json({ message: 'Não foi possível atualizar o Usuário' })
    }
}

const apagar = async (req, res) => {
    const id = req.params.id
    try {
        const resultadoConsulta = await Usuario.findByPk(id)
        if (!resultadoConsulta) {
            res.status(404).json({ message: 'Usuário não encontrado no banco de dados!' })
        } else {
            await Usuario.destroy({ where: { codUsuario: id } })
            res.status(200).json({ message: 'Usuário excluído com sucesso!' })
        }
    } catch (err) {
        console.error('Não foi possível excluir o Usuário', err)
        res.status(500).json({ message: 'Não foi possível excluir o Usuário' })
    }
}

module.exports = { cargaLote, cadastrar, listar, consultar, atualizar, apagar };
