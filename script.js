/* ======================================================
   CHÁ DE FRALDAS ANALUA
   script.js
====================================================== */

/* ======================================================
   URL DO APPS SCRIPT
====================================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbxAtjF85X4lYMXmu2-SRNNuzQiDm1Ql_D425M7E0Usn44jr2MzwNq8GbtF5nLns3owy/exec";

/* ======================================================
   CONTAGEM REGRESSIVA
====================================================== */

const dataEvento = new Date("2026-08-16T16:00:00");

function atualizarContagem() {

    const agora = new Date();

    const distancia = dataEvento - agora;

    const dias = document.getElementById("dias");
    const horas = document.getElementById("horas");
    const minutos = document.getElementById("minutos");
    const segundos = document.getElementById("segundos");

    if (distancia <= 0) {

        dias.textContent = "00";
        horas.textContent = "00";
        minutos.textContent = "00";
        segundos.textContent = "00";

        return;

    }

    dias.textContent = Math.floor(distancia / 1000 / 60 / 60 / 24);

    horas.textContent = Math.floor((distancia / 1000 / 60 / 60) % 24);

    minutos.textContent = Math.floor((distancia / 1000 / 60) % 60);

    segundos.textContent = Math.floor((distancia / 1000) % 60);

}

setInterval(atualizarContagem,1000);

atualizarContagem();

/* ======================================================
   VOLTAR AO TOPO
====================================================== */

const voltarTopo = document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

    if(window.scrollY>500){

        voltarTopo.style.display="block";

    }else{

        voltarTopo.style.display="none";

    }

});

voltarTopo.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/* ======================================================
   PESQUISA
====================================================== */

const pesquisa = document.getElementById("searchInput");

pesquisa.addEventListener("keyup",()=>{

    const texto = pesquisa.value.toLowerCase();

    const cards = document.querySelectorAll(".card-mimo");

    cards.forEach(card=>{

        const titulo = card.querySelector("h3").innerText.toLowerCase();

        if(titulo.includes(texto)){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

});

/* ======================================================
   FILTRO POR CATEGORIA
====================================================== */

const categorias = document.querySelectorAll(".category");

categorias.forEach(botao => {

    botao.addEventListener("click", () => {

        categorias.forEach(btn => btn.classList.remove("active"));

        botao.classList.add("active");

        const categoria = botao.textContent.trim().toLowerCase();

        document.querySelectorAll(".card-mimo").forEach(card => {

            if (categoria === "todos") {

                card.style.display = "block";
                return;

            }

            if (card.dataset.categoria === categoria) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});

});/* ======================================================
   CARREGAR MIMOS DA PLANILHA
====================================================== */

async function carregarMimos() {

    try {

        const resposta = await fetch(API_URL);

        const dados = await resposta.json();

        const lista = document.getElementById("lista-mimos");

        lista.innerHTML = "";

        dados.forEach(item => {

            const disponivel = Number(item.disponivel);

            const card = document.createElement("div");

            card.className = "card-mimo";

            card.dataset.categoria = item.categoria.toLowerCase();

            card.innerHTML = `

                <h3>${item.item}</h3>

                <p>${item.categoria}</p>

                <span class="${disponivel > 0 ? "verde" : "vermelho"}">

                    ${disponivel > 0
                        ? `${disponivel} disponível(is)`
                        : "ESGOTADO"}

                </span>

                <button
                    ${disponivel <= 0 ? "disabled" : ""}
                    onclick="reservarMimo('${item.item.replace(/'/g,"\\'")}')">

                    ${disponivel > 0
                        ? "Escolher este mimo"
                        : "Indisponível"}

                </button>

            `;

            lista.appendChild(card);

        });

    } catch (erro) {

        console.error("Erro ao carregar a planilha:", erro);

    }

}

/* ======================================================
   RESERVAR MIMO
====================================================== */

async function reservarMimo(item) {

    const confirmar = confirm(

`Você deseja reservar este mimo?

${item}

Após confirmar, você será direcionado ao WhatsApp para confirmar sua presença.`

    );

    if (!confirmar) return;

    try {

        await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/x-www-form-urlencoded"

            },

            body: "item=" + encodeURIComponent(item)

        });

        carregarMimos();

    } catch (erro) {

        console.error(erro);

    }

    const mensagem =

`Olá! 💜

Gostaria de confirmar minha presença no Chá de Fraldas da Analua.

Até breve! 🌙`;

    window.open(

`https://wa.me/5551991814905?text=${encodeURIComponent(mensagem)}`,

"_blank"

    );

}

/* ======================================================
   ANIMAÇÃO DOS CARDS
====================================================== */

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.style.opacity = "1";

            entry.target.style.transform = "translateY(0)";

        }

    });

}, {

    threshold: 0.15

});

function ativarAnimacoes() {

    document.querySelectorAll(".card-mimo").forEach(card => {

        card.style.opacity = "0";

        card.style.transform = "translateY(30px)";

        card.style.transition = ".6s";

        observer.observe(card);

    });

}

/* ======================================================
   CARREGAMENTO
====================================================== */

window.addEventListener("load", async () => {

    await carregarMimos();

    ativarAnimacoes();

});

console.log("🌙 Site da Analua carregado com sucesso!");
