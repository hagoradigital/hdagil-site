document.addEventListener("DOMContentLoaded", () => {
    /* ==================================================
       HEADER E MENU MOBILE
    ================================================== */

    const header = document.getElementById("site-header");
    const menuButton = document.getElementById("site-menu-button");
    const navigation = document.getElementById("site-navigation");

    const updateHeader = () => {
        if (!header) {
            return;
        }

        header.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");

            menuButton.classList.toggle("is-active", isOpen);
            menuButton.setAttribute("aria-expanded", String(isOpen));

            document.body.classList.toggle("menu-open", isOpen);
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navigation.classList.remove("is-open");
                menuButton.classList.remove("is-active");
                menuButton.setAttribute("aria-expanded", "false");

                document.body.classList.remove("menu-open");
            });
        });
    }

    /* ==================================================
       PRODUTO EM AÇÃO
    ================================================== */

    const productSteps = {
        cliente: {
            image: "/static/img/produto/cliente.png",
            alt: "Tela de clientes e contatos do HDÁgil",
            eyebrow: "Etapa 01 — Relacionamento",
            title: "Tudo começa com uma visão completa do cliente.",
            description:
                "Dados, contatos, grupos e históricos permanecem centralizados. " +
                "A mesma informação acompanha o cliente durante toda a jornada dentro da empresa.",
            items: [
                "Cadastro centralizado",
                "Histórico de relacionamento",
                "Informação disponível para toda a operação"
            ]
        },

        pedido: {
            image: "/static/img/produto/pedido.png",
            alt: "Tela de pedidos do HDÁgil",
            eyebrow: "Etapa 02 — Pedido",
            title: "A oportunidade se transforma em uma operação organizada.",
            description:
                "O pedido reúne cliente, produtos, valores, condições comerciais " +
                "e informações necessárias para que a operação avance sem depender " +
                "de controles paralelos.",
            items: [
                "Informações comerciais centralizadas",
                "Itens, valores e condições no mesmo fluxo",
                "Visibilidade para as próximas etapas"
            ]
        },

        producao: {
            image: "/static/img/produto/producao.png",
            alt: "Tela de produção do HDÁgil",
            eyebrow: "Etapa 03 — Operação",
            title: "Cada etapa da produção pode ser acompanhada.",
            description:
                "A equipe visualiza prioridades, andamento e responsabilidades. " +
                "O pedido deixa de ser apenas uma venda e passa a orientar todo " +
                "o processo operacional.",
            items: [
                "Acompanhamento por etapa",
                "Prazos e prioridades visíveis",
                "Informação conectada ao pedido"
            ]
        },

        financeiro: {
            image: "/static/img/produto/financeiro.png",
            alt: "Tela financeira do HDÁgil",
            eyebrow: "Etapa 04 — Gestão",
            title: "A operação alimenta o controle financeiro.",
            description:
                "Valores, recebimentos e formas de pagamento permanecem ligados " +
                "ao pedido, permitindo que o financeiro trabalhe com contexto e " +
                "informações confiáveis.",
            items: [
                "Recebimentos vinculados ao pedido",
                "Controle de pagamentos e parcelas",
                "Visão financeira da operação"
            ]
        },

        indicadores: {
            image: "/static/img/produto/dashboard.png",
            alt: "Dashboard executivo do HDÁgil",
            eyebrow: "Etapa 05 — Evolução",
            title: "Os dados da operação se transformam em decisões.",
            description:
                "O gestor acompanha indicadores, resultados e tendências com base " +
                "nas informações produzidas ao longo de toda a jornada.",
            items: [
                "Dashboard executivo",
                "Indicadores em tempo real",
                "Decisões baseadas em dados"
            ]
        }
    };

    const productTabs = document.querySelectorAll("[data-product-step]");
    const productImage = document.querySelector("#product-image");
    const productFallback = document.querySelector("#product-fallback");
    const productEyebrow = document.querySelector("#product-eyebrow");
    const productTitle = document.querySelector("#product-title");
    const productDescription = document.querySelector("#product-description");
    const productList = document.querySelector("#product-list");

    function loadProductImage(src, alt) {
        if (!productImage) {
            return;
        }

        productImage.classList.add("is-changing");

        const preloadImage = new Image();

        preloadImage.onload = () => {
            productImage.src = src;
            productImage.alt = alt;
            productImage.hidden = false;

            if (productFallback) {
                productFallback.hidden = true;
            }

            productImage.classList.remove("is-changing");
        };

        preloadImage.onerror = () => {
            productImage.hidden = true;

            if (productFallback) {
                productFallback.hidden = false;
            }

            productImage.classList.remove("is-changing");
        };

        preloadImage.src = src;
    }

    function activateProductStep(stepName) {
        const step = productSteps[stepName];

        if (
            !step ||
            !productImage ||
            !productEyebrow ||
            !productTitle ||
            !productDescription ||
            !productList
        ) {
            return;
        }

        productTabs.forEach((tab) => {
            const isActive = tab.dataset.productStep === stepName;

            tab.classList.toggle("is-active", isActive);
            tab.setAttribute("aria-selected", String(isActive));
        });

        loadProductImage(step.image, step.alt);

        productEyebrow.textContent = step.eyebrow;
        productTitle.textContent = step.title;
        productDescription.textContent = step.description;

        productList.innerHTML = "";

        step.items.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.textContent = item;
            productList.appendChild(listItem);
        });
    }

    productTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            activateProductStep(tab.dataset.productStep);
        });
    });

    if (productImage) {
        activateProductStep("cliente");
    }


    document.querySelectorAll(".site-flash__close").forEach((button) => {
        button.addEventListener("click", () => {
            const flash = button.closest(".site-flash");

            if (flash) {
                flash.remove();
            }
        });
    });

});