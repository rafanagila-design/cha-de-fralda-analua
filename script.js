/* ==========================================
   CHÁ DE FRALDA DA ANALUA
   script.js
========================================== */


/* ==========================================
   CONTAGEM REGRESSIVA
========================================== */

const dataEvento = new Date("August 16, 2026 16:00:00").getTime();

const dias = document.getElementById("dias");
const horas = document.getElementById("horas");
const minutos = document.getElementById("minutos");
const segundos = document.getElementById("segundos");

function atualizarContagem() {

    const agora = new Date().getTime();

    const distancia = dataEvento - agora;

    if (distancia <= 0) {

        dias.innerHTML = "00";
        horas.innerHTML = "00";
        minutos.innerHTML = "00";
        segundos.innerHTML = "00";

        return;

    }

    dias.innerHTML = Math.floor(distancia / (1000 * 60 * 60 * 24));

    horas.innerHTML = Math.floor(
        (distancia % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    minutos.innerHTML = Math.floor(
        (distancia % (1000 * 60 * 60))
        / (1000 * 60)
    );

    segundos.innerHTML = Math.floor(
        (distancia % (1000 * 60))
        / 1000
    );

}

setInterval(atualizarContagem,1000);

atualizarContagem();


/* ==========================================
   BOTÃO VOLTAR AO TOPO
========================================== */

const voltarTopo = document.getElementById("backToTop");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 500){

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


/* ==========================================
   PESQUISA DOS MIMOS
========================================== */

const pesquisa = document.getElementById("searchInput");

const cards = document.querySelectorAll(".gift-card");

pesquisa.addEventListener("keyup",()=>{

    const texto = pesquisa.value.toLowerCase();

    cards.forEach(card=>{

        const titulo = card.querySelector("h3").innerText.toLowerCase();

        const categoria = card.querySelector(".badge").innerText.toLowerCase();

        if(

            titulo.includes(texto) ||

            categoria.includes(texto)

        ){

            card.style.display="block";

        }else{

            card.style.display="none";

        }

    });

});


/* ==========================================
   FILTRO DAS CATEGORIAS
========================================== */

const botoesCategoria = document.querySelectorAll(".category");

botoesCategoria.forEach(botao=>{

    botao.addEventListener("click",()=>{

        botoesCategoria.forEach(b=>{

            b.classList.remove("active");

        });

        botao.classList.add("active");

        const categoria = botao.innerText.toLowerCase();

        cards.forEach(card=>{

            const badge = card.querySelector(".badge").innerText.toLowerCase();

            if(

                categoria === "todos"

            ){

                card.style.display="block";

            }

            else if(

                badge === categoria

            ){

                card.style.display="block";

            }

            else{

                card.style.display="none";

            }

        });

    });

});


/* ==========================================
   ANIMAÇÃO AO ROLAR
========================================== */

const elementos = document.querySelectorAll(

".card,.gift-card,.hero-buttons,.banner"

);

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.opacity="1";

            entry.target.style.transform="translateY(0)";

        }
/* ========================================
   LISTA DE MIMOS (GOOGLE SHEETS)
======================================== */

const URL_PLANILHA =
"https://script.google.com/macros/s/AKfycbxAtjF85X4lYMXmu2-SRNNuzQiDm1Ql_D425M7E0Usn44jr2MzwNq8GbtF5nLns3owy/exec";

async function carregarMimos() {

    try {

        const resposta = await fetch(URL_PLANILHA);

        const dados = await resposta.json();

        const lista = document.getElementById("lista-mimos");

        if(!lista) return;

        lista.innerHTML = "";

        dados.forEach(item=>{

            const disponivel = Number(item.disponivel);

            const card = document.createElement("div");

            card.className="card-mimo";

            card.innerHTML = `

            <h3>${item.item}</h3>

            <p>${item.categoria}</p>

            <span class="${disponivel>0?'verde':'vermelho'}">

                ${disponivel>0
                ? "Disponível ("+disponivel+")"
                : "Reservado"}

            </span>

            ${
                disponivel>0

                ?

                `<button onclick="reservarMimo('${item.item}')">

                Escolher este mimo

                </button>`

                :

                `<button disabled>

                Reservado

                </button>`

            }

            `;

            lista.appendChild(card);

        });

    }

    catch(erro){

        console.log(erro);

    }

}

async function reservarMimo(nome){

    const confirmar = confirm(

        "Deseja reservar este mimo?"

    );

    if(!confirmar) return;

    window.open(

`https://wa.me/5551991814905?text=${encodeURIComponent(
`Olá! Quero confirmar minha presença no Chá da Analua 🌙

Gostaria de reservar o mimo:

${nome}`)}`,

"_blank"

);

}

window.addEventListener("load",carregarMimos);
    });

},{

    threshold:0.15

});

elementos.forEach(el=>{

    el.style.opacity="0";

    el.style.transform="translateY(40px)";

    el.style.transition="all .8s ease";

    observer.observe(el);

});
/* ===========================
   LISTA DE MIMOS
=========================== */

const URL_PLANILHA = "https://script.google.com/macros/s/AKfycbxAtjF85X4lYMXmu2-SRNNuzQiDm1Ql_D425M7E0Usn44jr2MzwNq8GbtF5nLns3owy/exec";

async function carregarMimos() {

    const resposta = await fetch(URL_PLANILHA);
    const dados = await resposta.json();

    const lista = document.getElementById("lista-mimos");

    lista.innerHTML = "";

    dados.forEach(item => {

        const disponivel = Number(item.disponivel);

        const card = document.createElement("div");
        card.className = "card-mimo";

        card.innerHTML = `

            <h3>${item.item}</h3>

            <p>${item.categoria}</p>

            <span class="${disponivel > 0 ? "verde" : "vermelho"}">

                ${disponivel > 0
                    ? "Disponível (" + disponivel + ")"
                    : "Esgotado"}

            </span>

        `;

        lista.appendChild(card);

    });

}

carregarMimos();

/* ==========================================
   BOTÃO ESCOLHER MIMO
========================================== */

const reservar = document.querySelectorAll(".reserve-btn");

reservar.forEach(botao=>{

    botao.addEventListener("click",()=>{

        alert(

`💜 Obrigada pelo carinho!

Em breve esta lista será integrada à nossa planilha.

Assim, quando alguém escolher um mimo, ele ficará automaticamente indisponível para os próximos convidados.

🌙 Analua agradece seu carinho!`

        );

    });

});


/* ==========================================
   MENU SUAVE
========================================== */

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",function(e){

        e.preventDefault();

        const destino = document.querySelector(

            this.getAttribute("href")

        );

        destino.scrollIntoView({

            behavior:"smooth"

        });

    });

});


/* ==========================================
   FIM
========================================== */

console.log("🌙 Site da Analua carregado com sucesso!");
