let boxResultado = document.getElementById('resposta')
let botaoAtualizarHist = document.getElementById('btn_listar')

botaoAtualizarHist.addEventListener('click', (e) => {
    e.preventDefault()

    fetch('http://localhost:3000/compra')
    .then(res => res.json())
    .then(listaMovimentos => {
        boxResultado.innerHTML = ''
        boxResultado.innerHTML += `
            <table>
                ${criarThead()}
                ${criarTbody(listaMovimentos)}
            </table>
        `
    })
    .catch((err) => {
        console.error('Erro ao listar os dados', err)
    })
})

function criarTbody(listaMovimentos) {
    let conteudoLinhas = '<tbody>'
    listaMovimentos.forEach(movimentoAtual => {
        let clienteVinculado = movimentoAtual.usuarioCompra ? movimentoAtual.usuarioCompra.nome : 'N/A'
        let produtoVinculado = movimentoAtual.produtoCompra ? movimentoAtual.produtoCompra.nome : 'N/A'
        let corDestaque = movimentoAtual.tipoMovimento === 'ENTRADA' ? '#10b981' : '#ef4444'

        conteudoLinhas += `<tr>`
        conteudoLinhas += `<td>${movimentoAtual.codCompra}</td>`
        conteudoLinhas += `<td>${new Date(movimentoAtual.dataCompra).toLocaleDateString('pt-BR')}</td>`
        conteudoLinhas += `<td>${clienteVinculado}</td>`
        conteudoLinhas += `<td>${produtoVinculado}</td>`
        conteudoLinhas += `<td style="color: ${corDestaque}; font-weight: bold;">${movimentoAtual.tipoMovimento}</td>`
        conteudoLinhas += `<td>${movimentoAtual.quantidadeMovimentada}</td>`
        conteudoLinhas += `<td>R$ ${parseFloat(movimentoAtual.precoFinal).toFixed(2)}</td>`
        conteudoLinhas += `</tr>`
    })
    conteudoLinhas += `</tbody>`
    return conteudoLinhas
}

function criarThead() {
    return `
        <thead>
            <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Qtd</th>
                <th>Preço Final</th>
            </tr>
        </thead>
    `
}
