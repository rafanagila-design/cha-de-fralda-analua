/* ======================================================
   CHÁ DE FRALDA DA ANALUA
   script.js
====================================================== */

/* ======================================================
   CONFIGURAÇÕES
====================================================== */

const API_URL = "https://script.google.com/macros/s/AKfycbxAtjF85X4lYMXmu2-SRNNuzQiDm1Ql_D425M7E0Usn44jr2MzwNq8GbtF5nLns3owy/exec";

const DATA_EVENTO = new Date("2026-08-16T16:00:00");

/* ======================================================
   CONTAGEM REGRESSIVA
====================================================== */

function atualizarContagem() {

    const agora = new Date().getTime();

    const distancia = DATA_EVENTO.getTime() - agora;

    const dias = document.getElementById("dias");
    const horas = document.getElementById("horas");
    const minutos = document.getElementById("minutos");
    const segundos = document.getElementById("segundos");

    if (!dias || !horas || !minutos || !segundos) {
        return;
    }

    if (distancia <= 0) {

        dias.textContent = "00";
        horas.textContent = "00";
        minutos.textContent = "00";
        segundos.textContent = "00";

        return;

    }

    dias.textContent = String(
        Math.floor(distancia / (1000 * 60 * 60 * 24))
    ).padStart(2, "0");

    horas.textContent = String(
        Math.floor((distancia / (1000 * 60 * 60)) % 24)
    ).padStart(2, "0");

    minutos.textContent = String(
        Math.floor((distancia / (1000 * 60)) % 60)
    ).padStart(2, "0");

    segundos.textContent = String(
        Math.floor((distancia / 1000) % 60)
    ).padStart(2, "0");

}

setInterval(atualizarContagem, 1000);
atualizarContagem();

/* ======================================================
   BOTÃO VOLTAR AO TOPO
====================================================== */

const voltarTopo = document.getElementById("backToTop");

if (voltarTopo) {

    window.addEventListener("scroll", () => {

        voltarTopo.style.display =
            window.scrollY > 500 ? "flex" : "none";

    });

    voltarTopo.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/* ======================================================
   VARIÁVEIS GLOBAIS
====================================================== */

let todosMimos = [];

const lista = document.getElementById("lista-mimos");

const pesquisa = document.getElementById("searchInput");

const categorias = document.querySelectorAll(".category");/* ======================================================
   CARREGAR MIMOS DA PLANILHA
====================================================== */

async function carregarMimos() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao acessar o Apps Script.");
        }

        todosMimos = await resposta.json();

        renderizarMimos(todosMimos);

    } catch (erro) {

        console.error("Erro ao carregar mimos:", erro);

        if (lista) {

            lista.innerHTML = `

                <div class="erro-api">

                    <h3>Não foi possível carregar a lista de mimos.</h3>

                    <p>Verifique a conexão com a planilha.</p>

                </div>

            `;

        }

    }

}

/* ======================================================
   RENDERIZAR MIMOS
====================================================== */

function renderizarMimos(mimos) {

    if (!lista) return;

    lista.innerHTML = "";

    mimos.forEach(item => {

        const disponivel = Number(item.disponivel);

        const card = document.createElement("div");

        card.className = "card-mimo";

        card.dataset.categoria = item.categoria.toLowerCase();

        card.innerHTML = `

            <h3>${item.item}</h3>

            <p class="categoria">${item.categoria}</p>

            <p class="quantidade">

                Disponíveis:
                <strong>${disponivel}</strong>

            </p>

            <button

                class="btn-reservar"

                ${disponivel <= 0 ? "disabled" : ""}

                onclick="reservarMimo('${item.item.replace(/'/g,"\\'")}')"

            >

                ${disponivel > 0 ? "Escolher este mimo" : "Esgotado"}

            </button>

        `;

        lista.appendChild(card);

    });

}

/* ======================================================
   PESQUISA
====================================================== */

if (pesquisa) {

    pesquisa.addEventListener("keyup", () => {

        const texto = pesquisa.value.toLowerCase();

        const filtrados = todosMimos.filter(item =>

            item.item.toLowerCase().includes(texto)

        );

        renderizarMimos(filtrados);

    });

}

/* ======================================================
   FILTRO POR CATEGORIA
====================================================== */

categorias.forEach(botao => {

    botao.addEventListener("click", () => {

        categorias.forEach(btn =>

            btn.classList.remove("active")

        );

        botao.classList.add("active");

        const categoria = botao.textContent.trim().toLowerCase();

        if (categoria === "todos") {

            renderizarMimos(todosMimos);

            return;

        }

        const filtrados = todosMimos.filter(item =>

            item.categoria.toLowerCase() === categoria

        );

        renderizarMimos(filtrados);

    });

});/* ======================================================
   RESERVAR MIMO
====================================================== */

async function reservarMimo(item) {

    const confirmar = confirm(
        `Deseja reservar o mimo:\n\n${item} ?`
    );

    if (!confirmar) return;

    try {

        const resposta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },

            body: "item=" + encodeURIComponent(item)

        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {

            alert("💜 Mimo reservado com sucesso!");

            carregarMimos();

        } else {

            alert(resultado.mensagem);

            return;

        }

    } catch (erro) {

        console.error(erro);

        alert("Erro ao reservar o mimo.");

        return;

    }

    const mensagem = `Olá! 💜

Gostaria de confirmar minha presença no Chá de Fraldas da Analua.

Reservei o mimo:

${item}

Até breve! 🌙`;

    window.open(
        "https://wa.me/5551991814905?text=" +
        encodeURIComponent(mensagem),
        "_blank"
    );

}

/* ======================================================
   ANIMAÇÃO DOS CARDS
====================================================== */

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";

            entry.target.style.transform="translateY(0)";

        }

    });

},{
    threshold:0.15
});

function ativarAnimacoes(){

    document.querySelectorAll(".card-mimo").forEach(card=>{

        card.style.opacity="0";

        card.style.transform="translateY(25px)";

        card.style.transition=".6s";

        observer.observe(card);

    });

}

/* ======================================================
   INICIALIZAÇÃO
====================================================== */

window.addEventListener("load", async ()=>{

    await carregarMimos();

    ativarAnimacoes();

});

console.log("🌙 Site da Analua carregado com sucesso!");
