let resposta = document.getElementById('resposta')
let btn_cadastrar_manual = document.getElementById('btn_cadastrar_manual')
let btn_carga_lote = document.getElementById('btn_carga_lote')

btn_cadastrar_manual.addEventListener('click', (e) => {
    e.preventDefault()
    
    const nome = document.getElementById('nome').value
    const sobrenome = document.getElementById('sobrenome').value
    const idade = parseInt(document.getElementById('idade').value) || 0
    const email = document.getElementById('email').value
    const telefone = document.getElementById('telefone').value
    const endereco = document.getElementById('endereco').value
    const cidade = document.getElementById('cidade').value
    const estado = document.getElementById('estado').value

    const usuario = { 
        nome,
        sobrenome,
        idade,
        email,
        telefone,
        endereco,
        cidade,
        estado
    }

    fetch('http://localhost:3000/usuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''
        resposta.innerHTML += `<p>${dados.message}</p>`
        document.querySelector('form').reset()
    })
    .catch((err) => {
        console.error('Erro ao cadastrar o usuário', err)
        resposta.innerHTML = '<p>Erro ao tentar cadastrar o usuário.</p>'
    })
})

btn_carga_lote.addEventListener('click', (e) => {
    e.preventDefault()
    
    resposta.innerHTML = '<p>Buscando registros na API DummyJSON (https://dummyjson.com/users)...</p>'

    fetch('https://dummyjson.com/users')
    .then(res => res.json())
    .then(dadosExternos => {
        resposta.innerHTML = '<p>Dados recebidos com sucesso! Transmitindo lote para o back-end...</p>'
        
        return fetch('http://localhost:3000/usuarios/carga-lote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosExternos.users)
        })
    })
    .then(res => res.json())
    .then(dados => {
        resposta.innerHTML = ''
        resposta.innerHTML += `<p>${dados.message}</p>`
    })
    .catch((err) => {
        console.error('Erro na carga em lote:', err)
        resposta.innerHTML = '<p>Falha ao processar os dados da carga em lote no servidor local.</p>'
    })
})
