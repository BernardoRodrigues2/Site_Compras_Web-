let resposta = document.getElementById('resposta')
let btn_cadastrar_manual = document.getElementById('btn_cadastrar_manual')
let btn_carga_lote = document.getElementById('btn_carga_lote')

btn_cadastrar_manual.addEventListener('click', (e) => {
    e.preventDefault()
    
    const nome = document.getElementById('nome').value
    const descricao = document.getElementById('descricao').value
    const categoria = document.getElementById('categoria').value
    const marca = document.getElementById('marca').value
    const preco = parseFloat(document.getElementById('precoUnit').value)
    const desconto = parseFloat(document.getElementById('desconto').value) || 0
    const qtdeEstoque = parseInt(document.getElementById('quantidade').value)
    const imagem = document.getElementById('imagem').value

    const produto = { 
        nome,
        descricao,
        categoria,
        marca,
        preco,
        desconto,
        qtdeEstoque,
        imagem
    }

    fetch('http://localhost:3000/produto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(produto)
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''
        resposta.innerHTML += `<p>${dados.message}</p>`
        document.querySelector('form').reset()
    })
    .catch((err) => {
        console.error('Erro ao cadastrar', err)
        resposta.innerHTML = '<p>Erro ao tentar cadastrar o produto.</p>'
    })
})

btn_carga_lote.addEventListener('click', (e) => {
    e.preventDefault()
    
    resposta.innerHTML = '<p>Buscando catálogos de produtos na API DummyJSON...</p>'

    fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(dadosExternos => {
        resposta.innerHTML = '<p>Dados recebidos com sucesso! Transmitindo lote para o back-end...</p>'
        
        return fetch('http://localhost:3000/produtos/carga-lote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosExternos.products)
        })
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''
        resposta.innerHTML += `<p>${dados.message}</p>`
    })
    .catch((err) => {
        console.error('Erro na carga em lote de produtos:', err)
        resposta.innerHTML = '<p>Falha ao processar os dados da carga de produtos em lote.</p>'
    })
})
