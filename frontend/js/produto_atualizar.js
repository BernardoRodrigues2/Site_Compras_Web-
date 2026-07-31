let resposta = document.getElementById('resposta')
let btn_buscar = document.getElementById('btn_buscar')
let btn_atualizar = document.getElementById('btn_atualizar')
let produtoId = null

btn_buscar.addEventListener('click', (e) => {
    e.preventDefault()
    
    const id = document.getElementById('id').value

    if (!id) {
        resposta.innerHTML = '<p>Por favor, informe o ID do Produto!</p>'
        return
    }

    fetch(`http://localhost:3000/produto/${id}`)
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''

        if (dados.message) {
            resposta.innerHTML = `<p>${dados.message}</p>`
            return
        }
        
        produtoId = dados.codProduto
        document.getElementById('nome').value = dados.nome
        document.getElementById('categoria').value = dados.categoria
        document.getElementById('quantidade').value = dados.qtdeEstoque
        document.getElementById('precoUnit').value = dados.preco
        
        document.getElementById('form_atualizar').style.display = 'flex'
    })
    .catch((err) => {
        console.error('Erro ao buscar os dados', err)
        resposta.innerHTML = '<p>Erro ao tentar buscar o produto.</p>'
    })
})

btn_atualizar.addEventListener('click', (e) => {
    e.preventDefault()
    
    if (!produtoId) {
        resposta.innerHTML = '<p>Busque um produto antes de atualizar.</p>'
        return
    }

    const produtoAtualizado = {
        nome: document.getElementById('nome').value,
        categoria: document.getElementById('categoria').value,
        qtdeEstoque: parseInt(document.getElementById('quantidade').value),
        preco: parseFloat(document.getElementById('precoUnit').value)
    }

    fetch(`http://localhost:3000/produto/${produtoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produtoAtualizado)
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
        produtoId = null
    })
    .catch((err) => {
        console.error('Erro ao atualizar os dados', err)
        resposta.innerHTML = '<p>Erro ao tentar atualizar o produto.</p>'
    })
})

function criarTbody(dados) {
    let corpo = '<tbody>'
    dados.forEach(el => {
        corpo += `<tr>`
        corpo += `<td>${el.codProduto}</td>`
        corpo += `<td>${el.nome}</td>`
        corpo += `<td>${el.categoria}</td>`
        corpo += `<td>R$ ${parseFloat(el.preco).toFixed(2)}</td>`
        corpo += `<td>${el.qtdeEstoque}</td>`
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
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
            </tr>
        </thead>
    `
}
