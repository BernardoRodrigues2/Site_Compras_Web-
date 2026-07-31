let resposta = document.getElementById('resposta')
let btn_buscar = document.getElementById('btn_buscar')
let btn_atualizar = document.getElementById('btn_atualizar')
let usuarioId = null

btn_buscar.addEventListener('click', (e) => {
    e.preventDefault()
    
    const id = document.getElementById('id').value

    if (!id) {
        resposta.innerHTML = '<p>Por favor, informe o ID do Usuário!</p>'
        return
    }

    fetch(`http://localhost:3000/usuario/${id}`)
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''

        if (dados.message) {
            resposta.innerHTML = `<p>${dados.message}</p>`
            return
        }
        
        usuarioId = dados.codUsuario
        document.getElementById('nome').value = dados.nome
        document.getElementById('sobrenome').value = dados.sobrenome || ''
        document.getElementById('email').value = dados.email
        document.getElementById('telefone').value = dados.telefone || ''
        
        document.getElementById('form_atualizar').style.display = 'flex'
    })
    .catch((err) => {
        console.error('Erro ao buscar os dados', err)
        resposta.innerHTML = '<p>Erro ao tentar buscar o usuário.</p>'
    })
})

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()
    
    if (!usuarioId) {
        resposta.innerHTML = '<p>Busque um usuário antes de atualizar.</p>'
        return
    }

    const usuarioAtualizado = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value
    }

    fetch(`http://localhost:3000/usuario/${usuarioId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioAtualizado)
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''

        if (dados.message) {
            resposta.innerHTML = `<p>${dados.message}</p>`
            return
        }

        let dadosArr = Array.isArray(dados) ? dados : [dados]

        resposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dadosArr)}
            </table>
        `
        document.getElementById('form_atualizar').style.display = 'none'
        usuarioId = null
    })
    .catch((err) => {
        console.error('Erro ao atualizar os dados', err)
        resposta.innerHTML = '<p>Erro ao tentar atualizar o usuário.</p>'
    })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codUsuario}</td>`
        corpo += `<td>${el.nome} ${el.sobrenome || ''}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.telefone || ''}</td>`
        corpo += `</tr>`
    })
    corpo += `</tbody>`
    return corpo
}

function criarThead() {
    return `
        <thead>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
            </tr>
        </thead>
    `
}
