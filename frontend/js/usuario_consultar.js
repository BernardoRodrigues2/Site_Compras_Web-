let resposta = document.getElementById('resposta')
let btn_consultar = document.getElementById('btn_consultar')

btn_consultar.addEventListener('click', (e) => {
    e.preventDefault()
    
    const codUsuario = document.getElementById('codUsuario').value

    fetch(`http://localhost:3000/usuario/${codUsuario}`)
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''

        if (!dados || dados.message) {
            resposta.innerHTML = `<p>${dados.message || 'Usuário não encontrado!'}</p>`
            return
        }

        let dadosArr = Array.isArray(dados) ? dados : [dados]

        resposta.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(dadosArr)}
            </table>
        `
    })
    .catch((err) => {
        console.error('Erro ao consultar os dados', err)
    })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codUsuario}</td>`
        corpo += `<td>${el.nome} ${el.sobrenome || ''}</td>`
        corpo += `<td>${el.email}</td>`
        corpo += `<td>${el.idade || ''}</td>`
        corpo += `<td>${el.telefone || ''}</td>`
        corpo += `<td>${el.endereco || ''} ${el.cidade || ''} ${el.estado || ''}</td>`
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
                <th>Idade</th>
                <th>Telefone</th>
                <th>Endereço</th>
            </tr>
        </thead>
    `
}
