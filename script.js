/* ===========================================
   ARCEN Engenharia - Script Principal
   Funcionalidades: Menu mobile, scroll suave
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 ARCEN Engenharia - Site carregado');

  // ==================== ELEMENTOS ====================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const mainNav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  const allAnchorLinks = document.querySelectorAll('a[href^="#"]');
  const mobileLinks = document.querySelectorAll('.mobile-nav a');

  // Estado do menu
  let isMobileMenuOpen = false;

  // ==================== FUNÇÕES DO MENU ====================

  /**
   * Abre o menu mobile
   */
  function openMobileMenu() {
    mobileNav.classList.add('active');
    hamburger.classList.add('active');
    mobileNav.removeAttribute('inert');
    document.body.style.overflow = 'hidden'; // Previne scroll do body
    isMobileMenuOpen = true;
    console.log('📱 Menu mobile aberto');
  }

  /**
   * Fecha o menu mobile
   */
  function closeMobileMenu() {
    mobileNav.classList.remove('active');
    hamburger.classList.remove('active');
    mobileNav.setAttribute('inert', '');
    document.body.style.overflow = '';
    isMobileMenuOpen = false;
    console.log('📱 Menu mobile fechado');
  }

  /**
   * Alterna entre abrir/fechar menu
   */
  function toggleMobileMenu() {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // ==================== SCROLL SUAVE ====================

  /**
   * Calcula a posição de scroll considerando o header fixo
   * @param {HTMLElement} targetElement - Elemento alvo
   * @returns {number} Posição para scrollTo
   */
  function getScrollPosition(targetElement) {
    if (!targetElement) return 0;
    
    const headerHeight = header.offsetHeight;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
    
    // Ajuste adicional para não ficar colado
    return offsetPosition - 20;
  }

  /**
   * Rola suavemente para um elemento
   * @param {string} targetId - ID do elemento (ex: "#services")
   */
  function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (!targetElement) {
      console.warn(`⚠️ Elemento não encontrado: ${targetId}`);
      return;
    }

    window.scrollTo({
      top: getScrollPosition(targetElement),
      behavior: 'smooth'
    });

    // Atualiza a URL sem recarregar a página (opcional, mas bom para UX)
    history.pushState(null, null, targetId);
    console.log(`🎯 Scroll para: ${targetId}`);
  }

  /**
   * Handler genérico para clicks em links âncora
   * @param {Event} event - Evento de clique
   */
  function handleAnchorClick(event) {
    const href = this.getAttribute('href');
    
    // Só processa links âncora internos válidos
    if (!href || href === '#' || !href.startsWith('#')) return;
    
    // Previne o comportamento padrão apenas para scroll suave
    event.preventDefault();
    
    // Fecha o menu mobile se estiver aberto
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
    
    // Scroll suave com pequeno delay se o menu estava aberto
    if (isMobileMenuOpen) {
      setTimeout(() => smoothScrollTo(href), 100);
    } else {
      smoothScrollTo(href);
    }
  }

  // ==================== HIGHLIGHT DA NAVEGAÇÃO ====================

  /**
   * Atualiza o link ativo na navegação baseado na seção visível
   */
  function updateActiveNavLink() {
    // Esta função é opcional, mas melhora a UX
    // Pode ser implementada se desejar
  }

  // ==================== EVENT LISTENERS ====================

  // 1. Menu hamburger
  if (hamburger) {
    hamburger.addEventListener('click', (event) => {
      event.stopPropagation(); // Evita que clique se propague
      toggleMobileMenu();
    });
  }

  // 2. Links do menu mobile
  mobileLinks.forEach(link => {
    link.addEventListener('click', handleAnchorClick);
  });

  // 3. Links da navegação principal (desktop)
  if (mainNav) {
    const navLinks = mainNav.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', handleAnchorClick);
    });
  }

  // 4. Botões da Hero section (são tratados pelos listeners acima, mas garantimos)
  const heroButtons = document.querySelectorAll('.hero-actions a[href^="#"]');
  heroButtons.forEach(button => {
    button.addEventListener('click', handleAnchorClick);
  });

  // 5. Fechar menu ao clicar fora (no overlay)
  document.addEventListener('click', (event) => {
    if (isMobileMenuOpen && 
        !mobileNav.contains(event.target) && 
        !hamburger.contains(event.target)) {
      closeMobileMenu();
    }
  });

  // 6. Fechar menu ao pressionar ESC
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMobileMenuOpen) {
      closeMobileMenu();
    }
  });

  // 7. Fechar menu ao redimensionar para desktop (opcional)
  window.addEventListener('resize', () => {
    // Se a tela for maior que 768px e o menu estiver aberto, fecha
    if (window.innerWidth > 768 && isMobileMenuOpen) {
      closeMobileMenu();
    }
  });

  // 8. Highlight da navegação ao scroll (opcional)
  window.addEventListener('scroll', () => {
    // Debounce para performance
    clearTimeout(window.scrollTimeout);
    window.scrollTimeout = setTimeout(updateActiveNavLink, 100);
  });

  // ==================== INICIALIZAÇÃO ====================

  /**
   * Inicializa todos os comportamentos
   */
  function init() {
    // Garante que o menu mobile comece fechado e inerte
    mobileNav.setAttribute('inert', '');
    
    // Adiciona `inert` polyfill se necessário (para navegadores antigos)
    if (typeof HTMLElement.prototype.hasAttribute !== 'function') {
      console.warn('Seu navegador pode não suportar `inert`.');
    }
    
    console.log('✅ Sistema de navegação inicializado');
  }

  // Executa a inicialização
  init();
});

// ==================== POLYFILL SIMPLES PARA INERT ====================
// Caso necessário para navegadores muito antigos
(function() {
  if ('inert' in HTMLElement.prototype) return;
  
  Object.defineProperty(HTMLElement.prototype, 'inert', {
    enumerable: true,
    get: function() {
      return this.hasAttribute('inert');
    },
    set: function(value) {
      if (value) {
        this.setAttribute('inert', '');
        this.style.pointerEvents = 'none';
        this.style.userSelect = 'none';
        this.setAttribute('aria-hidden', 'true');
        
        // Torna todos os filhos inacessíveis
        const children = this.querySelectorAll('*');
        children.forEach(child => {
          child.style.pointerEvents = 'none';
          child.style.userSelect = 'none';
        });
      } else {
        this.removeAttribute('inert');
        this.style.pointerEvents = '';
        this.style.userSelect = '';
        this.removeAttribute('aria-hidden');
        
        const children = this.querySelectorAll('*');
        children.forEach(child => {
          child.style.pointerEvents = '';
          child.style.userSelect = '';
        });
      }
    }
  });
});