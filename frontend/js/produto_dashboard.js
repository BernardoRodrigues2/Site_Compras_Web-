let resposta = document.getElementById('resposta')
let grid_produtos = document.getElementById('grid_produtos')

function carregarProdutos() {
    fetch('http://localhost:3000/produto')
    .then(res => res.json())
    .then(dados => {
        grid_produtos.innerHTML = ''
        
        if (dados.length === 0) {
            resposta.innerHTML = '<p>Nenhum produto cadastrado.</p>'
            return
        }

        dados.forEach(el => {
            const imgSrc = el.imagem ? el.imagem : 'https://via.placeholder.com/250x150?text=Sem+Imagem'
            const precoFormatado = parseFloat(el.preco).toFixed(2)
            
            const cardHTML = `
                <div class="card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
                    <img src="${imgSrc}" alt="${el.nome}" style="width: 100%; height: 150px; object-fit: cover;">
                    <div style="padding: 15px; display: flex; flex-direction: column; gap: 10px; flex: 1;">
                        <h3 style="margin: 0; font-size: 1.2rem;">${el.nome}</h3>
                        <span style="font-size: 0.9rem; color: var(--text-muted);">${el.categoria} ${el.marca ? '| ' + el.marca : ''}</span>
                        <p style="margin: 0; font-size: 0.9rem; flex: 1;">${el.descricao || 'Sem descrição.'}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                            <span style="font-weight: bold; font-size: 1.1rem; color: var(--primary);">R$ ${precoFormatado}</span>
                            <span style="font-size: 0.85rem; background: var(--bg-hover); padding: 4px 8px; border-radius: 4px;">Estoque: ${el.qtdeEstoque}</span>
                        </div>
                    </div>
                </div>
            `
            grid_produtos.innerHTML += cardHTML
        })
    })
    .catch((err) => {
        console.error('Erro ao listar os dados', err)
        resposta.innerHTML = '<p>Erro ao carregar o dashboard de produtos.</p>'
    })
}

// Carregar ao abrir a página
window.addEventListener('DOMContentLoaded', carregarProdutos)
