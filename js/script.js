/**
 * Script Principal - Foco Educação
 * Gerencia interações, validações e funcionalidades da página
 * Versão: 2.0
 */

// ===== INICIALIZAÇÃO ===== 
document.addEventListener('DOMContentLoaded', () => {
    initializeFormValidation();
    initializeScrollAnimations();
    initializeAccessibility();
    initializeSmoothScrolling();
    trackUserInteractions();
});

// ===== VALIDAÇÃO DE FORMULÁRIO =====
/**
 * Valida e envia o formulário de contato
 * Implementa validação Bootstrap e feedback visual
 */
function initializeFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    // Validação no submit
    contactForm.addEventListener('submit', handleFormSubmit);

    // Validação em tempo real
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('input', validateInput);
    });
}

/**
 * Valida um input individual
 */
function validateInput(event) {
    const input = event.target;
    const isValid = input.checkValidity();
    
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else if (input.value.trim() !== '') {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    } else {
        input.classList.remove('is-valid', 'is-invalid');
    }
}

/**
 * Manipula o envio do formulário
 */
function handleFormSubmit(event) {
    event.preventDefault();

    const contactForm = event.target;

    // Validação Bootstrap
    if (!contactForm.checkValidity()) {
        event.stopPropagation();
        contactForm.classList.add('was-validated');
        return;
    }

    // Coletar dados
    const formData = {
        name: document.getElementById('nameInput').value.trim(),
        email: document.getElementById('emailInput').value.trim(),
        phone: document.getElementById('phoneInput').value.trim(),
        message: document.getElementById('messageInput').value.trim(),
        timestamp: new Date().toISOString()
    };

    // Enviar dados (simulado)
    console.log('📧 Formulário enviado:', formData);
    
    // Salvar em localStorage (demonstração)
    saveFormSubmission(formData);

    // Feedback visual
    showSuccessMessage(contactForm, 'Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.');
    
    // Limpar formulário
    contactForm.reset();
    contactForm.classList.remove('was-validated');
    
    // Remover classes de validação
    contactForm.querySelectorAll('.form-control').forEach(input => {
        input.classList.remove('is-valid', 'is-invalid');
    });
}

/**
 * Salva a submissão do formulário em localStorage
 */
function saveFormSubmission(data) {
    try {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        submissions.push(data);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    } catch (error) {
        console.warn('Não foi possível salvar em localStorage:', error);
    }
}

/**
 * Exibe mensagem de sucesso ao usuário
 */
function showSuccessMessage(formElement, message) {
    // Remover alertas anteriores
    const existingAlerts = formElement.parentElement.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Criar novo alerta
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.setAttribute('role', 'alert');
    alert.setAttribute('aria-live', 'polite');
    alert.innerHTML = `
        <strong><i class="fas fa-check-circle me-2"></i>Sucesso!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
    `;

    // Inserir alerta
    formElement.parentElement.insertBefore(alert, formElement);

    // Scroll para o alerta
    alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Remover após 5 segundos
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => alert.remove(), 150);
    }, 5000);
}

// ===== ANIMAÇÕES AO ROLAR =====
/**
 * Adiciona animações ao rolar a página
 * Usa Intersection Observer para melhor performance
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateElement(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos
    const animableElements = document.querySelectorAll(
        '.card, section h2, section p, .about-item, .stat-item'
    );
    
    animableElements.forEach((element) => {
        // Aplicar estilos iniciais
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease 0s, transform 0.6s ease 0s';
        observer.observe(element);
    });
}

/**
 * Anima um elemento individualmente
 */
function animateElement(element) {
    // Pequeno delay escalonado
    const delay = element.dataset.delay || '0ms';
    element.style.transitionDelay = delay;
    
    // Ativar animação
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

// ===== SCROLL SUAVE =====
/**
 * Implementa scroll suave para links âncora
 */
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            
            // Scroll suave
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Atualizar URL sem reload
            history.pushState(null, null, href);
        });
    });
}

// ===== ACESSIBILIDADE =====
/**
 * Melhorias de acessibilidade
 */
function initializeAccessibility() {
    // Skip to main content
    const skipLink = createSkipLink();
    if (skipLink) {
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    // Atalhos de teclado
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Validar ARIA labels
    validateAriaLabels();
}

/**
 * Cria link "Pular para conteúdo principal"
 */
function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#contato';
    skipLink.textContent = 'Pular para conteúdo principal';
    skipLink.className = 'btn btn-sm btn-primary position-absolute top-0 start-50 translate-middle-x';
    skipLink.style.zIndex = '10000';
    skipLink.style.marginTop = '10px';
    skipLink.style.display = 'none';
    
    // Mostrar ao focus
    skipLink.addEventListener('focus', () => {
        skipLink.style.display = 'block';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.display = 'none';
    });
    
    return skipLink;
}

/**
 * Atalhos de teclado
 */
function handleKeyboardShortcuts(event) {
    // Pressionar 'S' para focar no formulário
    if ((event.key === 's' || event.key === 'S') && !event.ctrlKey) {
        const nameInput = document.getElementById('nameInput');
        if (nameInput) {
            nameInput.focus();
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Pressionar '?' para ajuda
    if (event.key === '?') {
        console.log('%c🎹 Atalhos disponíveis:\n- S: Ir para formulário\n- ?: Mostrar ajuda', 'color: #1e40af; font-weight: bold;');
    }
}

/**
 * Valida e adiciona ARIA labels se necessário
 */
function validateAriaLabels() {
    const elementsWithoutLabels = document.querySelectorAll(
        '[role="region"]:not([aria-label]):not([aria-labelledby])'
    );
    
    elementsWithoutLabels.forEach((element, index) => {
        if (!element.id) {
            element.id = `region-${index}`;
        }
    });
}

// ===== RASTREAMENTO DE INTERAÇÕES =====
/**
 * Rastreia interações do usuário
 */
function trackUserInteractions() {
    // Rastrear cliques em botões CTA
    document.querySelectorAll('.btn-primary, .btn-outline-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.textContent.trim();
            console.log(`📍 CTA clicado: ${action}`);
        });
    });

    // Rastrear expansões de accordion
    const accordion = document.getElementById('faqAccordion');
    if (accordion) {
        accordion.addEventListener('shown.bs.collapse', (event) => {
            const question = event.target.querySelector('.accordion-button')?.textContent || 'FAQ';
            console.log(`❓ Pergunta visualizada: ${question.trim()}`);
        });
    }

    // Rastrear scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            console.log(`📊 Scroll: ${Math.round(scrollPercent)}%`);
        }, 500);
    });
}

// ===== UTILITÁRIOS =====
/**
 * Detecta suporte a lazy loading nativo
 */
function supportsNativeLazyLoading() {
    return 'loading' in HTMLImageElement.prototype;
}

/**
 * Formata telefone em tempo real
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        value = value.substring(0, 11);
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    input.value = value;
}

/**
 * Valida email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== INICIALIZAÇÃO DE FEATURES ADICIONAIS =====
/**
 * Inicializa formatação de telefone
 */
function initializePhoneFormatting() {
    const phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
    }
}

// Executar formatação de telefone
document.addEventListener('DOMContentLoaded', initializePhoneFormatting);

// ===== LOG DE INICIALIZAÇÃO =====
console.log('%c✅ Foco Educação - Sistema carregado com sucesso!', 'color: #1e40af; font-weight: bold; font-size: 14px;');
console.log('%c📱 Versão: 2.0 | 🌐 Responsivo | ♿ Acessível', 'color: #64748b; font-size: 12px;');

// Verificar estado do LocalStorage
if (typeof(Storage) !== 'undefined') {
    const savedCount = (JSON.parse(localStorage.getItem('formSubmissions') || '[]')).length;
    if (savedCount > 0) {
        console.log(`💾 ${savedCount} submissões salvas localmente`);
    }
}
