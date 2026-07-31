let resposta = document.getElementById('resposta')
let btn_cadastrar = document.getElementById('btn_cadastrar')

btn_cadastrar.addEventListener('click', (e) => {
    e.preventDefault()

    const idUsuario = document.getElementById('idUsuario').value
    const idProduto = document.getElementById('idProduto').value
    const tipoMovimento = document.getElementById('tipoMovimento').value
    const quantidadeMovimentada = document.getElementById('quantidade').value
    const descontoAplicado = document.getElementById('desconto').value
    const formaPagamento = document.getElementById('formaPagamento').value
    const statusCompra = document.getElementById('statusCompra').value
    const dataCompra = new Date().toISOString().split('T')[0]

    const compra = { 
        idUsuario: parseInt(idUsuario),
        idProduto: parseInt(idProduto),
        tipoMovimento: tipoMovimento,
        quantidadeMovimentada: parseInt(quantidadeMovimentada),
        descontoAplicado: parseFloat(descontoAplicado),
        formaPagamento: formaPagamento,
        statusCompra: statusCompra,
        dataCompra: dataCompra
    }

    fetch('http://localhost:3000/compra', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(compra)
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''
        if (dados.message) {
            resposta.innerHTML += `<p>${dados.message}</p>`
        } else {
            resposta.innerHTML += `<p>Movimentação registrada com sucesso! ID Transação: ${dados.id || dados.codCompra || 'Gerado'}</p>`
        }
        document.querySelector('form').reset()
    })
    .catch((err) => {
        console.error('Erro ao registrar a movimentação', err)
        resposta.innerHTML = '<p>Erro ao tentar registrar a movimentação.</p>'
    })
})
