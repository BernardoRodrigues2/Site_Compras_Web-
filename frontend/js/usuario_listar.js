let divResposta = document.getElementById('resposta')
let botaoCarregarUsuarios = document.getElementById('btn_listar')

botaoCarregarUsuarios.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('http://localhost:3000/usuario')
    .then(res => res.json())
    .then(listaDeUsuarios => {
        divResposta.innerHTML = ''
        divResposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(listaDeUsuarios)}
            </table>
        `
    })
    .catch((err) => {
        console.error('Erro ao listar os dados', err)
    })
})

function criarTbody(listaDeUsuarios) {
    let conteudoTabela = '<tbody>'
    listaDeUsuarios.forEach(usuarioAtual => {
        conteudoTabela += `<tr>`
        conteudoTabela += `<td>${usuarioAtual.codUsuario}</td>`
        conteudoTabela += `<td>${usuarioAtual.nome} ${usuarioAtual.sobrenome || ''}</td>`
        conteudoTabela += `<td>${usuarioAtual.email}</td>`
        conteudoTabela += `<td>${usuarioAtual.telefone || ''}</td>`
        conteudoTabela += `</tr>`
    })
    conteudoTabela += `</tbody>`
    return conteudoTabela
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
