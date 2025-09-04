// --- Gerenciamento de Tema ---
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.theme = isDark ? 'dark' : 'light';
}

// Sempre iniciar em dark mode
document.documentElement.classList.add('dark');
localStorage.theme = 'dark';

// --- Navbar Dinâmica e Inovadora ---
let lastScrollTop = 0;
let scrollTimeout;
let isScrollingDown = false;

// Elementos da navbar
const navbar = document.querySelector('#navbar');
const readingProgress = document.querySelector('#reading-progress');
const dynamicBreadcrumb = document.querySelector('#dynamic-breadcrumb');
const floatingNav = document.querySelector('#floating-nav');
const navLinks = document.querySelectorAll('.nav-link');

// Configurações das seções da navbar
const navSections = [
    { id: 'home', name: 'Início', icon: '🏠' },
    { id: 'sobre', name: 'Sobre Mim', icon: '👨‍💻' },
    { id: 'habilidades', name: 'Habilidades', icon: '🚀' },
    { id: 'experiencia', name: 'Experiência', icon: '💼' },
    { id: 'orcamento', name: 'Orçamento', icon: '💰' },
    { id: 'contato', name: 'Contato', icon: '📧' }
];

// Função principal de controle do scroll
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Determinar direção do scroll
    isScrollingDown = scrollTop > lastScrollTop;
    
    // 1. Controle de estado da navbar
    if (scrollTop > 100) {
        // Navbar compacta quando scrolla para baixo
        navbar.classList.remove('navbar-full');
        navbar.classList.add('navbar-compact');
        
        // Esconder navbar apenas quando scrolling para baixo rapidamente
        if (isScrollingDown && scrollTop > lastScrollTop + 5) {
            navbar.classList.add('navbar-hidden');
        } else {
            navbar.classList.remove('navbar-hidden');
        }
    } else {
        // Navbar completa no topo
        navbar.classList.remove('navbar-compact', 'navbar-hidden');
        navbar.classList.add('navbar-full');
    }
    
    // 2. Barra de progresso de leitura
    const scrollProgress = (scrollTop / (documentHeight - windowHeight)) * 100;
    readingProgress.style.transform = `scaleX(${scrollProgress / 100})`;
    
    // 3. Detectar seção ativa e atualizar breadcrumb
    updateActiveSection(scrollTop);
    
    // 4. Controlar floating nav (mobile)
    if (window.innerWidth < 768) {
        if (scrollTop > 300) {
            floatingNav.classList.add('show');
        } else {
            floatingNav.classList.remove('show');
        }
    }
    
    lastScrollTop = scrollTop;
    
    // Clear timeout para mostrar navbar quando parar de scrollar
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        navbar.classList.remove('navbar-hidden');
    }, 150);
});

// Função para atualizar seção ativa
function updateActiveSection(scrollTop) {
    const currentSection = getCurrentSection(scrollTop);
    
    // Atualizar links ativos
    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (section === currentSection.id) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Atualizar breadcrumb dinâmico
    if (currentSection.id !== 'home') {
        dynamicBreadcrumb.textContent = `${currentSection.icon} ${currentSection.name}`;
        dynamicBreadcrumb.classList.remove('hidden');
    } else {
        dynamicBreadcrumb.classList.add('hidden');
    }
}

// Função para determinar seção atual baseada no scroll
function getCurrentSection(scrollTop) {
    for (let i = navSections.length - 1; i >= 0; i--) {
        const section = document.getElementById(navSections[i].id);
        if (section) {
            const sectionTop = section.offsetTop - 150; // Offset para navbar
            if (scrollTop >= sectionTop) {
                return navSections[i];
            }
        }
    }
    return navSections[0]; // Retorna 'home' por padrão
}

// Smooth scroll melhorado para links da navbar
document.addEventListener('DOMContentLoaded', () => {
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Fechar menu mobile se estiver aberto
                const mobileMenu = document.getElementById('mobile-menu');
                mobileMenu.classList.add('hidden');
                
                // Scroll suave com offset para navbar
                const offsetTop = targetElement.offsetTop - 120;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Adicionar efeito visual à seção alvo
                targetElement.style.transform = 'scale(1.01)';
                setTimeout(() => {
                    targetElement.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
});

// --- Efeitos Especiais da Navbar ---

// Efeito de glitch ocasional no breadcrumb
setInterval(() => {
    if (Math.random() < 0.1 && !dynamicBreadcrumb.classList.contains('hidden')) {
        dynamicBreadcrumb.classList.add('glitch-effect');
        setTimeout(() => {
            dynamicBreadcrumb.classList.remove('glitch-effect');
        }, 300);
    }
}, 10000);

// Parallax suave na navbar
let ticking = false;
function updateNavbarParallax() {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.1;
    
    if (navbar.classList.contains('navbar-compact')) {
        navbar.style.transform = `translateY(${parallax}px)`;
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbarParallax);
        ticking = true;
    }
});

// Animação de entrada da navbar
window.addEventListener('load', () => {
    navbar.classList.add('navbar-enter');
});

// Easter egg: Shake animation quando clica múltiplas vezes no logo
let logoClickCount = 0;
let logoClickTimeout;

document.querySelector('.logo-animated').addEventListener('click', (e) => {
    e.preventDefault();
    logoClickCount++;
    
    clearTimeout(logoClickTimeout);
    logoClickTimeout = setTimeout(() => {
        logoClickCount = 0;
    }, 2000);
    
    if (logoClickCount >= 5) {
        navbar.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            navbar.style.animation = '';
        }, 500);
        logoClickCount = 0;
    }
});

// CSS para o shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
`;
document.head.appendChild(shakeStyle);

// Ripple effect on navbar removed per request (kept other ripple usages elsewhere)


// --- Menu Mobile ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Fecha o menu ao clicar em um link
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});


// --- Efeito de Digitação (Typed.js) ---
document.addEventListener('DOMContentLoaded', () => {
    // Terminal typing effect
    const terminalCommands = [
        'whoami',
        'echo "Gabriel Damante Frias"',
        'echo "Desenvolvedor Front-End"'
    ];
    
    // Terminal command typing
    new Typed('#terminal-text', {
        strings: terminalCommands,
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 1000,
        startDelay: 500,
        onComplete: (self) => {
            // After terminal commands, show name with typing effect
            setTimeout(() => {
                new Typed('#terminal-name', {
                    strings: ['Gabriel Damante Frias'],
                    typeSpeed: 70,
                    showCursor: false,
                    onComplete: () => {
                        // After name, show role with typing effect
                        setTimeout(() => {
                            new Typed('#terminal-role', {
                                strings: ['Desenvolvedor Front-End'],
                                typeSpeed: 70,
                                showCursor: true,
                                cursorChar: '|',
                                loop: false
                            });
                        }, 300);
                    }
                });
            }, 500);
        }
    });
});


// --- Animação de Scroll (Intersection Observer) ---
const sections = document.querySelectorAll('.fade-in-section');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Anima apenas uma vez
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// --- Skills Tooltips ---
document.addEventListener('DOMContentLoaded', () => {
    const skillCards = document.querySelectorAll('.skill-card');
    let activeTooltip = null;
    let leaveTimer = null;

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function showTooltip(tooltip, card) {
        // Se o card não estiver visível, não mostrar o tooltip
        if (!isElementInViewport(card)) return;

        if (activeTooltip && activeTooltip !== tooltip) {
            hideTooltip(activeTooltip);
        }
        if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }

        // Guarda parent original e referência do card
        if (!tooltip._originalParent) tooltip._originalParent = tooltip.parentElement;
        tooltip._anchorCard = card;

        document.body.appendChild(tooltip);
        tooltip.style.position = 'fixed';
        tooltip.style.pointerEvents = 'auto';
        tooltip.classList.remove('opacity-0', 'invisible');
        
        // Force reflow para garantir que as dimensões estejam corretas
        tooltip.offsetHeight;
        
        // Calcular posição
        const rect = card.getBoundingClientRect();
        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;
        const halfWidth = tooltipWidth / 2;
        const centerX = rect.left + rect.width / 2;
        const viewportHeight = window.innerHeight;
        
        // Verificar espaço disponível acima e abaixo
        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;
        let top;
        let isAbove;
        
        // Decidir posição baseado no espaço disponível
        if (spaceAbove >= tooltipHeight + 8 || spaceAbove > spaceBelow) {
            top = rect.top - tooltipHeight - 8;
            isAbove = true;
        } else {
            top = rect.bottom + 8;
            isAbove = false;
        }
        
        // Ajustar posição horizontal para não sair da tela
        let left = centerX;
        const minLeft = 8 + halfWidth;
        const maxLeft = window.innerWidth - 8 - halfWidth;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        // Aplicar posição
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'translate(-50%, 0)';
        tooltip.style.zIndex = '9999';

        // Ajustar seta
        const arrow = tooltip.querySelector('.tooltip-arrow');
        if (arrow) {
            // Rotacionar seta baseado na posição
            arrow.style.transform = isAbove ? 'translateX(-50%) rotate(180deg)' : 'translateX(-50%)';
            arrow.style.top = isAbove ? 'auto' : '-8px';
            arrow.style.bottom = isAbove ? '-8px' : 'auto';
            arrow.style.left = '50%';
        }

        activeTooltip = tooltip;
    }

    function hideTooltip(tooltip) {
        if (!tooltip) return;
        tooltip.classList.add('opacity-0', 'invisible');
        tooltip.style.pointerEvents = 'none';

        // Restaurar para a posição original
        if (tooltip._originalParent && tooltip._originalParent.appendChild) {
            tooltip._originalParent.appendChild(tooltip);
            tooltip.style.position = '';
            tooltip.style.left = '';
            tooltip.style.top = '';
            tooltip.style.transform = '';
            tooltip.style.zIndex = '';
            
            const arrow = tooltip.querySelector('.tooltip-arrow');
            if (arrow) {
                arrow.style.transform = '';
                arrow.style.top = '';
                arrow.style.bottom = '';
            }
        }

        tooltip._anchorCard = null;
        if (activeTooltip === tooltip) activeTooltip = null;
    }

    function updateTooltipPosition(tooltip) {
        if (!tooltip || !tooltip._anchorCard) return;
        const card = tooltip._anchorCard;

        // Se o card não estiver mais visível, esconder o tooltip
        if (!isElementInViewport(card)) {
            hideTooltip(tooltip);
            return;
        }

        const rect = card.getBoundingClientRect();

        // Calcular posição
        const tooltipHeight = tooltip.offsetHeight;
        const tooltipWidth = tooltip.offsetWidth;
        const halfWidth = tooltipWidth / 2;
        const centerX = rect.left + rect.width / 2;
        const viewportHeight = window.innerHeight;
        
        // Verificar espaço disponível acima e abaixo
        const spaceAbove = rect.top;
        const spaceBelow = viewportHeight - rect.bottom;
        let top;
        let isAbove;
        
        // Decidir posição baseado no espaço disponível
        if (spaceAbove >= tooltipHeight + 8 || spaceAbove > spaceBelow) {
            top = rect.top - tooltipHeight - 8;
            isAbove = true;
        } else {
            top = rect.bottom + 8;
            isAbove = false;
        }
        
        // Ajustar posição horizontal para não sair da tela
        let left = centerX;
        const minLeft = 8 + halfWidth;
        const maxLeft = window.innerWidth - 8 - halfWidth;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        // Aplicar posição
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
        tooltip.style.transform = 'translate(-50%, 0)';
        tooltip.style.zIndex = '9999';

        // Ajustar seta
        const arrow = tooltip.querySelector('.tooltip-arrow');
        if (arrow) {
            // Rotacionar seta baseado na posição
            arrow.style.transform = isAbove ? 'translateX(-50%) rotate(180deg)' : 'translateX(-50%)';
            arrow.style.top = isAbove ? 'auto' : '-8px';
            arrow.style.bottom = isAbove ? '-8px' : 'auto';
            arrow.style.left = '50%';
        }
    }

    // Atualizar durante scroll com requestAnimationFrame
    let scrollRaf = null;
    window.addEventListener('scroll', () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
            if (activeTooltip) updateTooltipPosition(activeTooltip);
            scrollRaf = null;
        });
    }, { passive: true });

    // Atualizar ao redimensionar
    window.addEventListener('resize', () => {
        if (activeTooltip) updateTooltipPosition(activeTooltip);
    });

    // Setup dos eventos para cada card
    skillCards.forEach(card => {
        const tooltip = card.querySelector('.skill-tooltip');
        if (!tooltip) return;

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (tooltip.classList.contains('opacity-0')) {
                showTooltip(tooltip, card);
            } else {
                hideTooltip(tooltip);
            }
        });

        card.addEventListener('mouseenter', () => {
            if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
            showTooltip(tooltip, card);
        });

        card.addEventListener('mouseleave', () => {
            leaveTimer = setTimeout(() => hideTooltip(tooltip), 120);
        });

        tooltip.addEventListener('click', (ev) => ev.stopPropagation());
    });

    document.addEventListener('click', () => {
        if (activeTooltip) hideTooltip(activeTooltip);
    });
});

// --- Projetos Interativos ---
document.addEventListener('DOMContentLoaded', () => {
    // Dados dos projetos
    const projectsData = {
        projeto1: {
            title: 'App de Delivery',
            image: 'https://via.placeholder.com/800x450',
            description: 'Aplicativo mobile desenvolvido com React Native para uma rede de restaurantes, com sistema de pedidos em tempo real e integração com gateway de pagamento.',
            problem: 'A rede de restaurantes precisava de uma solução mobile para aumentar vendas e melhorar a experiência do cliente, reduzindo o tempo de espera e erros nos pedidos.',
            solution: 'Desenvolvemos um app intuitivo com React Native que permite aos clientes navegar pelo cardápio, personalizar itens, realizar pagamentos e acompanhar o status do pedido em tempo real.',
            impact: 'Aumento de 35% nas vendas online, redução de 80% em erros de pedidos e melhoria significativa na satisfação do cliente.',
            technologies: [
                { name: 'React Native', class: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' },
                { name: 'TypeScript', class: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' },
                { name: 'Node.js', class: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' },
                { name: 'Firebase', class: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' },
                { name: 'Stripe', class: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' }
            ],
            demoUrl: '#',
            githubUrl: 'https://github.com/GabrielDamanteFrias'
        },
        projeto2: {
            title: 'E-commerce Dashboard',
            image: 'https://via.placeholder.com/800x450',
            description: 'Dashboard administrativo completo para gerenciamento de produtos, pedidos e clientes, com análise de dados e relatórios em tempo real.',
            problem: 'O cliente precisava de uma interface centralizada para gerenciar seu e-commerce em crescimento, com controle de estoque, pedidos e análise de dados.',
            solution: 'Criamos um dashboard completo com React e Firebase, oferecendo visões personalizadas para diferentes níveis de usuários e relatórios detalhados.',
            impact: 'Redução de 40% no tempo gasto em tarefas administrativas e aumento de 25% na eficiência operacional geral.',
            technologies: [
                { name: 'React', class: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400' },
                { name: 'Tailwind', class: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' },
                { name: 'Firebase', class: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' },
                { name: 'Chart.js', class: 'bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400' }
            ],
            demoUrl: '#',
            githubUrl: 'https://github.com/GabrielDamanteFrias'
        },
        projeto3: {
            title: 'Automação de Relatórios',
            image: 'https://via.placeholder.com/800x450',
            description: 'Sistema RPA para automatização de geração e envio de relatórios financeiros diários, com integração a múltiplas fontes de dados.',
            problem: 'A empresa gastava mais de 4 horas diárias coletando dados de diferentes sistemas para gerar relatórios financeiros manuais, sujeitos a erros humanos.',
            solution: 'Desenvolvemos um sistema RPA com Selenium e Python que automatiza todo o processo, coletando dados de várias fontes, gerando relatórios e enviando por email.',
            impact: 'Redução de 95% no tempo gasto com relatórios (de 4 horas para 12 minutos) e eliminação de erros humanos no processo.',
            technologies: [
                { name: 'Python', class: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400' },
                { name: 'Selenium', class: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' },
                { name: 'Pandas', class: 'bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400' },
                { name: 'SQLite', class: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' }
            ],
            demoUrl: '#',
            githubUrl: 'https://github.com/GabrielDamanteFrias'
        }
    };

    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const projectDetailsBtns = document.querySelectorAll('.project-details-btn');
    
    // Elementos do modal
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.querySelector('#modal-image img');
    const modalDescription = document.getElementById('modal-description');
    const modalProblem = document.getElementById('modal-problem');
    const modalSolution = document.getElementById('modal-solution');
    const modalImpact = document.getElementById('modal-impact');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalDemo = document.getElementById('modal-demo');
    const modalGithub = document.getElementById('modal-github');
    
    // Função para abrir o modal
    function openProjectModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;
        
        // Preenche os dados do projeto no modal
        modalTitle.textContent = project.title;
        modalImage.src = project.image;
        modalImage.alt = project.title;
        modalDescription.textContent = project.description;
        modalProblem.textContent = project.problem;
        modalSolution.textContent = project.solution;
        modalImpact.textContent = project.impact;
        
        // Limpa e adiciona as tecnologias
        modalTechnologies.innerHTML = '';
        project.technologies.forEach(tech => {
            const techBadge = document.createElement('span');
            techBadge.className = `px-3 py-1 ${tech.class} rounded-full text-sm`;
            techBadge.textContent = tech.name;
            modalTechnologies.appendChild(techBadge);
        });
        
        // Define os links
        modalDemo.href = project.demoUrl;
        modalGithub.href = project.githubUrl;
        
        // Mostra o modal
        projectModal.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden'; // Impede o scroll da página
    }
    
    // Função para fechar o modal
    function closeProjectModal() {
        projectModal.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = ''; // Restaura o scroll da página
    }
    
    // Event listeners
    projectDetailsBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectId = btn.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });
    
    closeModalBtn.addEventListener('click', closeProjectModal);
    
    // Fecha o modal ao clicar fora dele
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeProjectModal();
        }
    });
    
    // Fecha o modal com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !projectModal.classList.contains('opacity-0')) {
            closeProjectModal();
        }
    });
});

// --- Code Playground ---
document.addEventListener('DOMContentLoaded', () => {
    const codePreview = document.getElementById('code-preview');
    const runCodeBtn = document.getElementById('run-code');
    const codeTabs = document.querySelectorAll('.code-tab');
    const editorPanes = document.querySelectorAll('.editor-pane');
    const codeInputs = document.querySelectorAll('.code-input');
    
    if (!codePreview || !runCodeBtn) return;
    
    // Variáveis para armazenar o código
    let htmlCode = '';
    let cssCode = '';
    let jsCode = '';
    
    // Função para obter o código atual
    function getCode() {
        htmlCode = document.querySelector('#editor-html .code-input').value;
        cssCode = document.querySelector('#editor-css .code-input').value;
        jsCode = document.querySelector('#editor-js .code-input').value;
    }
    
    // Função para renderizar o código no preview
    function renderCode() {
        getCode();
        
        // Limpa o preview
        codePreview.innerHTML = '';
        
        // Cria um iframe para isolar o código
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        codePreview.appendChild(iframe);
        
        // Escreve o conteúdo no iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>${jsCode}</script>
            </body>
            </html>
        `);
        iframeDoc.close();
    }
    
    // Alterna entre as abas
    codeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove a classe 'active' de todas as abas
            codeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Esconde todos os painéis de edição
            editorPanes.forEach(pane => pane.classList.add('hidden'));
            
            // Mostra o painel correspondente à aba clicada
            const lang = tab.getAttribute('data-lang');
            document.getElementById(`editor-${lang}`).classList.remove('hidden');
        });
    });
    
    // Executa o código
    runCodeBtn.addEventListener('click', renderCode);
    
    // Atualiza o código quando o usuário digita (com debounce para não sobrecarregar)
    let debounceTimer;
    codeInputs.forEach(input => {
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(renderCode, 1000); // Atualiza após 1 segundo de inatividade
        });
    });
    
    // Inicializa o preview
    renderCode();
    
    // Estiliza as abas ativas
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.code-tab').forEach(t => {
                t.classList.remove('active');
                t.classList.remove('bg-indigo-600');
                t.classList.remove('text-white');
            });
            this.classList.add('active');
            this.classList.add('bg-indigo-600');
            this.classList.add('text-white');
        });
    });
    
    // Ativa a primeira aba por padrão
    document.querySelector('.code-tab[data-lang="html"]').classList.add('bg-indigo-600');
    document.querySelector('.code-tab[data-lang="html"]').classList.add('text-white');
});

// --- Testimonials Chat Simulation ---
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    // Dados dos depoimentos
    const testimonials = [
        {
            name: 'Ana Silva',
            role: 'CEO da TechSolutions',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            message: 'O Gabriel foi fundamental para o sucesso do nosso app de delivery. Sua atenção aos detalhes e conhecimento técnico são impressionantes!'
        },
        {
            name: 'Carlos Mendes',
            role: 'CTO da E-Shop',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            message: 'Contratamos o Gabriel para redesenhar nossa plataforma e o resultado superou todas as expectativas. Profissional dedicado e criativo.'
        },
        {
            name: 'Mariana Costa',
            role: 'Product Manager',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            message: 'A capacidade do Gabriel de transformar conceitos complexos em interfaces intuitivas é incrível. Nossos usuários adoraram o novo design!'
        },
        {
            name: 'Roberto Almeida',
            role: 'Gerente de Projetos',
            avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
            message: 'As automações desenvolvidas pelo Gabriel economizaram horas de trabalho manual para nossa equipe. Recomendo fortemente seus serviços.'
        }
    ];
    
    // Função para criar mensagem do chat
    function createChatMessage(sender, message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message flex ${isUser ? 'justify-end' : 'items-start'}`;
        
        let html = '';
        
        if (!isUser) {
            html = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 mr-3">
                        <img src="${sender.avatar}" alt="${sender.name}" class="w-10 h-10 rounded-full">
                    </div>
                    <div>
                        <div class="flex items-center">
                            <span class="font-medium text-slate-900 dark:text-white">${sender.name}</span>
                            <span class="ml-2 text-xs text-slate-500 dark:text-slate-400">${sender.role}</span>
                        </div>
                        <div class="mt-1 bg-slate-100 dark:bg-neutral-700 p-3 rounded-lg rounded-tl-none max-w-xs sm:max-w-md">
                            <p class="text-slate-800 dark:text-slate-200">${message}</p>
                        </div>
                    </div>
                </div>
            `;
        } else {
            html = `
                <div class="max-w-xs sm:max-w-md bg-indigo-600 p-3 rounded-lg rounded-tr-none">
                    <p class="text-white">${message}</p>
                </div>
            `;
        }
        
        messageDiv.innerHTML = html;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        
        return messageDiv;
    }
    
    // Função para animar a entrada da mensagem
    function animateMessage(messageDiv) {
        setTimeout(() => {
            messageDiv.style.transition = 'opacity 0.5s, transform 0.5s';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Função para simular a digitação (efeito de "está digitando...")
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message flex items-start typing-indicator';
        typingDiv.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0 mr-3">
                    <div class="w-10 h-10 rounded-full bg-slate-300 dark:bg-neutral-600 animate-pulse"></div>
                </div>
                <div class="mt-1 bg-slate-100 dark:bg-neutral-700 p-3 rounded-lg rounded-tl-none">
                    <div class="flex space-x-2">
                        <div class="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style="animation-delay: 0ms"></div>
                        <div class="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style="animation-delay: 150ms"></div>
                        <div class="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return typingDiv;
    }
    
    // Função para iniciar a simulação do chat
    function startChatSimulation() {
        let currentIndex = 0;
        
        // Mensagem inicial do usuário
        const userMessage = createChatMessage(null, 'Olá! Gostaria de saber mais sobre o seu trabalho. O que seus clientes acham dos seus serviços?', true);
        chatMessages.appendChild(userMessage);
        animateMessage(userMessage);
        
        // Função para mostrar os depoimentos sequencialmente
        function showNextTestimonial() {
            if (currentIndex >= testimonials.length) return;
            
            const testimonial = testimonials[currentIndex];
            currentIndex++;
            
            // Mostra indicador de digitação
            const typingIndicator = showTypingIndicator();
            
            // Simula tempo de digitação baseado no tamanho da mensagem
            const typingTime = Math.min(1500, testimonial.message.length * 20);
            
            // Remove o indicador e mostra a mensagem após o "tempo de digitação"
            setTimeout(() => {
                typingIndicator.remove();
                const messageDiv = createChatMessage(testimonial, testimonial.message);
                chatMessages.appendChild(messageDiv);
                animateMessage(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Programa a próxima mensagem
                if (currentIndex < testimonials.length) {
                    setTimeout(showNextTestimonial, 3000);
                }
            }, typingTime);
        }
        
        // Inicia a sequência após um pequeno delay
        setTimeout(showNextTestimonial, 1000);
    }
    
    // Inicia a simulação quando a seção estiver visível
    const testimonialsSection = document.getElementById('testimonials');
    if (testimonialsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && chatMessages.children.length === 0) {
                    startChatSimulation();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(testimonialsSection);
    }
});

// --- Timeline Horizontal Interativa ---
document.addEventListener('DOMContentLoaded', () => {
    const timelineSlider = document.getElementById('timeline-slider');
    const prevBtn = document.getElementById('timeline-prev');
    const nextBtn = document.getElementById('timeline-next');
    const indicators = document.querySelectorAll('.timeline-indicators button');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (!timelineSlider || !prevBtn || !nextBtn || !indicators.length || !timelineItems.length) return;
    
    let currentIndex = 0;
    const totalItems = timelineItems.length;
    let startX, isDragging = false, startScrollLeft;
    
    // Função para atualizar a timeline
    function updateTimeline() {
        // Calcula a largura do item para centralizar
        const itemWidth = timelineItems[0].offsetWidth;
        
        // Move a timeline para o item atual
        timelineSlider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
        
        // Atualiza os indicadores
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.remove('bg-slate-300', 'dark:bg-neutral-700');
                indicator.classList.add('bg-indigo-600', 'dark:bg-indigo-500');
            } else {
                indicator.classList.add('bg-slate-300', 'dark:bg-neutral-700');
                indicator.classList.remove('bg-indigo-600', 'dark:bg-indigo-500');
            }
        });
    }

    // Event listeners para os botões
    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateTimeline();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, totalItems - 1);
        updateTimeline();
    });

    // Event listeners para os indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateTimeline();
        });
    });

    // Suporte a arrastar (drag) para a timeline
    timelineSlider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        startScrollLeft = currentIndex;
        timelineSlider.style.cursor = 'grabbing';
    });
    
    timelineSlider.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        // Calcula a distância arrastada
        const x = e.pageX;
        const walk = (x - startX) / timelineItems[0].offsetWidth;
        
        // Define um limite para considerar como arrasto válido
        if (Math.abs(walk) > 0.2) {
            if (walk > 0 && currentIndex > 0) {
                currentIndex = startScrollLeft - 1;
                isDragging = false;
                updateTimeline();
            } else if (walk < 0 && currentIndex < totalItems - 1) {
                currentIndex = startScrollLeft + 1;
                isDragging = false;
                updateTimeline();
            }
        }
    });
    
    timelineSlider.addEventListener('mouseup', () => {
        isDragging = false;
        timelineSlider.style.cursor = 'grab';
    });
    
    timelineSlider.addEventListener('mouseleave', () => {
        isDragging = false;
        timelineSlider.style.cursor = 'grab';
    });

    // Suporte a gestos touch para dispositivos móveis
    timelineSlider.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].pageX;
        startScrollLeft = currentIndex;
    });
    
    timelineSlider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const x = e.touches[0].pageX;
        const walk = (x - startX) / timelineItems[0].offsetWidth;
        
        if (Math.abs(walk) > 0.2) {
            if (walk > 0 && currentIndex > 0) {
                currentIndex = startScrollLeft - 1;
                isDragging = false;
                updateTimeline();
            } else if (walk < 0 && currentIndex < totalItems - 1) {
                currentIndex = startScrollLeft + 1;
                isDragging = false;
                updateTimeline();
            }
        }
    });
    
    timelineSlider.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Inicialização
    updateTimeline();
});

// --- Experiência - Cards Expansíveis ---
function toggleExperience(cardType) {
    const details = document.getElementById(`${cardType}-details`);
    const arrow = document.getElementById(`${cardType}-arrow`);
    const card = document.querySelector(`[data-card="${cardType}"]`);
    
    // Debug para verificar se os elementos estão sendo encontrados
    console.log(`Toggling ${cardType}:`, { details, arrow, card });
    
    if (!details || !arrow || !card) {
        console.error(`Elementos não encontrados para ${cardType}`);
        return;
    }
    
    const isExpanded = card.classList.contains('expanded');

    if (!isExpanded) {
        // Fecha outros cards abertos para evitar sobreposição estranha
        document.querySelectorAll('.experience-card.expanded').forEach(openCard => {
            openCard.classList.remove('expanded');
            const openType = openCard.getAttribute('data-card');
            const openArrow = document.getElementById(`${openType}-arrow`);
            if (openArrow) {
                openArrow.style.transform = 'rotate(0deg)';
                openArrow.style.transition = 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)';
            }
            openCard.classList.remove('ring-2', 'ring-indigo-300', 'dark:ring-indigo-700', 'ring-blue-300', 'dark:ring-blue-700');
            const openDetails = document.getElementById(`${openType}-details`);
            if (openDetails) {
                openDetails.setAttribute('aria-hidden', 'true');
                // Colapsa a altura e limpa o estilo após a transição para permitir recálculo futuro
                openDetails.style.maxHeight = '0px';
                setTimeout(() => {
                    // Só limpa se ainda estiver colapsado
                    if (!openCard.classList.contains('expanded')) {
                        openDetails.style.maxHeight = '';
                    }
                }, 480);
            }
        });

    // Expandir este card
    card.classList.add('expanded');
    details.setAttribute('aria-hidden', 'false');

    // Garantir que a transição de maxHeight ocorra: forçar maxHeight 0 -> reflow -> set para scrollHeight
    details.style.maxHeight = '0px';
    // Forçar reflow
    details.offsetHeight;
    // Animar a altura dinamicamente para o valor real do conteúdo
    details.style.maxHeight = details.scrollHeight + 'px';

        // Animar a seta com transição suave
        arrow.style.transform = 'rotate(180deg)';
        arrow.style.transition = 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)';

        // Adicionar efeito de destaque específico para cada card
        card.classList.add('ring-2');
        if (cardType === 'frontend') {
            card.classList.add('ring-indigo-300', 'dark:ring-indigo-700');
        } else if (cardType === 'rpa') {
            card.classList.add('ring-blue-300', 'dark:ring-blue-700');
        }

        // Suave scroll para trazer o card ao centro da viewport sem provocar reflow na section
        setTimeout(() => {
            const rect = card.getBoundingClientRect();
            const absoluteTop = window.pageYOffset + rect.top;
            const target = Math.max(absoluteTop - (window.innerHeight / 2) + (rect.height / 2), 0);
            window.scrollTo({ top: target, behavior: 'smooth' });
        }, 220);

    } else {
    // Recolher este card
    card.classList.remove('expanded');
    details.setAttribute('aria-hidden', 'true');

        // Animar recolhimento definindo maxHeight = 0
        details.style.maxHeight = '0px';
        // Limpar estilo inline após a transição para manter o fluxo natural
        setTimeout(() => {
            if (!card.classList.contains('expanded')) details.style.maxHeight = '';
        }, 480);

        // Animar a seta com transição suave
        arrow.style.transform = 'rotate(0deg)';
        arrow.style.transition = 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)';

        // Remover efeito de destaque após a transição
        setTimeout(() => {
            card.classList.remove('ring-2', 'ring-indigo-300', 'dark:ring-indigo-700', 'ring-blue-300', 'dark:ring-blue-700');
        }, 340);
    }
}

// Adicionar event listeners individuais para cada card
function setupExperienceOnReady() {
    // Inicializar experiência cards
    initializeExperienceCards();

    // Garantir que as partículas tenham delays diferentes
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        particle.style.setProperty('--delay', `${(index % 3) * 0.2}s`);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupExperienceOnReady);
} else {
    // Se o DOM já estiver carregado, inicializa imediatamente
    setupExperienceOnReady();
}

function initializeExperienceCards() {
    // Event listeners específicos para cada card
    const frontendCard = document.querySelector('[data-card="frontend"]');
    const rpaCard = document.querySelector('[data-card="rpa"]');
    
    if (frontendCard) {
        frontendCard.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleExperience('frontend');
        });
        
        // Efeitos visuais para frontend
        addCardEffects(frontendCard, 'frontend');
    }
    
    if (rpaCard) {
        rpaCard.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleExperience('rpa');
        });
        
        // Efeitos visuais para rpa
        addCardEffects(rpaCard, 'rpa');
    }
}

function addCardEffects(card, cardType) {
    // Efeito de ondulação no clique
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('div');
        const rect = card.getBoundingClientRect();
        const size = 60;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        // Cores diferentes para cada card
        const color = cardType === 'frontend' 
            ? 'rgba(99, 102, 241, 0.3)' 
            : 'rgba(59, 130, 246, 0.3)';
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, ${color} 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        card.appendChild(ripple);
        
        // Remover o elemento após a animação
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
    
    // Efeito de brilho sutil no hover
    card.addEventListener('mouseenter', function() {
        const shadowColor = cardType === 'frontend' 
            ? 'rgba(99, 102, 241, 0.1)' 
            : 'rgba(59, 130, 246, 0.1)';
        this.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.1), 0 0 20px ${shadowColor}`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = '';
    });
}

// Adicionar animação CSS para o efeito ripple
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Chevron rotation transition (fallback) */
    .experience-card i.fas.fa-chevron-down {
        transition: transform 380ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    
    .particle {
        animation-delay: var(--delay, 0s);
    }
`;
document.head.appendChild(style);