/* ============================================
       CM REGULADORA - JAVASCRIPT
    ============================================ */

    // === Header Scroll Effect ===
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === Mobile Menu ===
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function closeMobileMenu() {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileClose.addEventListener('click', closeMobileMenu);

    mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // === Scroll Animations ===
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });

    // === Counter Animation ===
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const duration = 2000;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
      counterObserver.observe(el);
    });

    // === Testimonials Slider ===
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let slidesPerView = 1;

    function updateSlidesPerView() {
      if (window.innerWidth >= 768) {
        slidesPerView = 3;
      } else {
        slidesPerView = 1;
      }
    }

    function getTotalSlides() {
      return track.children.length;
    }

    function getMaxSlide() {
      return Math.max(0, getTotalSlides() - slidesPerView);
    }

    function updateSlider() {
      updateSlidesPerView();
      const cardWidth = 100 / slidesPerView;
      track.style.transform = `translateX(-${currentSlide * cardWidth}%)`;
    }

    prevBtn.addEventListener('click', () => {
      currentSlide = Math.max(0, currentSlide - 1);
      updateSlider();
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = Math.min(getMaxSlide(), currentSlide + 1);
      updateSlider();
    });

    window.addEventListener('resize', updateSlider);
    updateSlider();

    // Auto-play slider
    setInterval(() => {
      if (currentSlide < getMaxSlide()) {
        currentSlide++;
      } else {
        currentSlide = 0;
      }
      updateSlider();
    }, 5000);

    // === Bases Gallery Slider (Conheça Nossas Bases) ===
    const basesTrack = document.getElementById('basesTrack');
    const basesPrevBtn = document.getElementById('basesPrevBtn');
    const basesNextBtn = document.getElementById('basesNextBtn');

    if (basesTrack && basesPrevBtn && basesNextBtn) {
      let basesCurrentSlide = 0;
      let basesSlidesPerView = 1;

      function updateBasesSlidesPerView() {
        if (window.innerWidth >= 1024) {
          basesSlidesPerView = 3;
        } else if (window.innerWidth >= 768) {
          basesSlidesPerView = 2;
        } else if (window.innerWidth >= 480) {
          basesSlidesPerView = 1.25;
        } else {
          basesSlidesPerView = 1;
        }
      }

      function getBasesTotalSlides() {
        return basesTrack.children.length;
      }

      function getBasesMaxSlide() {
        return Math.max(0, Math.ceil(getBasesTotalSlides() - basesSlidesPerView));
      }

      function updateBasesSlider() {
        updateBasesSlidesPerView();
        const maxSlide = getBasesMaxSlide();
        if (basesCurrentSlide > maxSlide) {
          basesCurrentSlide = maxSlide;
        }
        const cardWidth = 100 / basesSlidesPerView;
        basesTrack.style.transform = `translateX(-${basesCurrentSlide * cardWidth}%)`;
      }

      basesPrevBtn.addEventListener('click', () => {
        basesCurrentSlide = Math.max(0, basesCurrentSlide - 1);
        updateBasesSlider();
      });

      basesNextBtn.addEventListener('click', () => {
        basesCurrentSlide = Math.min(getBasesMaxSlide(), basesCurrentSlide + 1);
        updateBasesSlider();
      });

      window.addEventListener('resize', updateBasesSlider);
      updateBasesSlider();

      // Auto-play do carrossel de bases
      setInterval(() => {
        if (basesCurrentSlide < getBasesMaxSlide()) {
          basesCurrentSlide++;
        } else {
          basesCurrentSlide = 0;
        }
        updateBasesSlider();
      }, 4500);
    }

    // === WhatsApp Popup ===
    const whatsappBtn = document.getElementById('whatsappBtn');
    const whatsappPopup = document.getElementById('whatsappPopup');
    let popupOpen = false;

    whatsappBtn.addEventListener('click', () => {
      popupOpen = !popupOpen;
      whatsappPopup.classList.toggle('show', popupOpen);
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (!whatsappBtn.contains(e.target) && !whatsappPopup.contains(e.target)) {
        popupOpen = false;
        whatsappPopup.classList.remove('show');
      }
    });

    // Show popup after 3 seconds
    setTimeout(() => {
      if (!popupOpen) {
        popupOpen = true;
        whatsappPopup.classList.add('show');
      }
    }, 3000);

    // === Smooth scroll for anchor links ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // === Active nav link on scroll ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-desktop a');

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });

    // === Professional Form Handling ===
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validação dos campos
        let isValid = true;
        const fields = ['formNome', 'formEmail', 'formTelefone', 'formServico', 'formMensagem'];

        fields.forEach(fieldId => {
          const field = document.getElementById(fieldId);
          const formGroup = field.closest('.form-group');
          const errorSpan = formGroup.querySelector('.form-error');

          if (!field.value.trim()) {
            isValid = false;
            formGroup.classList.add('error');
            errorSpan.textContent = 'Este campo é obrigatório';
          } else {
            formGroup.classList.remove('error');
            errorSpan.textContent = '';

            // Validação específica de email
            if (fieldId === 'formEmail') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(field.value)) {
                isValid = false;
                formGroup.classList.add('error');
                errorSpan.textContent = 'E-mail inválido';
              }
            }

            // Validação de telefone
            if (fieldId === 'formTelefone') {
              const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/;
              const cleanPhone = field.value.replace(/\D/g, '');
              if (cleanPhone.length < 10) {
                isValid = false;
                formGroup.classList.add('error');
                errorSpan.textContent = 'Telefone inválido';
              }
            }
          }
        });

        if (isValid) {
          // Simular envio do formulário
          const formData = {
            nome: document.getElementById('formNome').value,
            empresa: document.getElementById('formEmpresa').value,
            email: document.getElementById('formEmail').value,
            telefone: document.getElementById('formTelefone').value,
            servico: document.getElementById('formServico').value,
            mensagem: document.getElementById('formMensagem').value
          };

          console.log('Formulário enviado:', formData);

          // Mostrar mensagem de sucesso
          contactForm.style.display = 'none';
          formSuccess.classList.add('show');

          // Resetar formulário após 3 segundos
          setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'flex';
            formSuccess.classList.remove('show');
          }, 3000);
        }
      });

      // Limpar erro ao digitar
      const inputs = contactForm.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('input', function() {
          const formGroup = this.closest('.form-group');
          if (this.value.trim()) {
            formGroup.classList.remove('error');
          }
        });
      });
    }

    // === Parallax Effect para Hero ===
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const hero = document.querySelector('.hero-bg');
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });

    // === Criar partículas no hero (opcional) ===
    function createHeroParticles() {
      const container = document.getElementById('heroParticles');
      if (!container) return;

      for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 100 + 50 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(196, 18, 48, ${Math.random() * 0.1})`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${10 + Math.random() * 10}s infinite ease-in-out`;
        container.appendChild(particle);
      }
    }

    // Adicionar animação de float
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(20px); }
      }
    `;
    document.head.appendChild(style);

    createHeroParticles();

    // === Responsividade melhorada ===
    function handleResponsive() {
      const width = window.innerWidth;
      
      // Ajustar comportamento baseado no tamanho da tela
      if (width < 768) {
        // Mobile
        document.body.style.fontSize = '14px';
      } else if (width < 1024) {
        // Tablet
        document.body.style.fontSize = '15px';
      } else {
        // Desktop
        document.body.style.fontSize = '16px';
      }
    }

    window.addEventListener('resize', handleResponsive);
    handleResponsive();
