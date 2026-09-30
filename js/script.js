/* ============================================
   CM REGULADORA — JAVASCRIPT
   ============================================ */

(() => {
  'use strict';

  function iniciar() {
    const porId = id => document.getElementById(id);

    // ========================================
    // HEADER E VOLTAR AO TOPO
    // ========================================

    const header = porId('header');
    const backToTop = porId('backToTop');

    function atualizarScroll() {
      header?.classList.toggle('scrolled', window.scrollY > 50);
      backToTop?.classList.toggle('visible', window.scrollY > 400);
    }

    window.addEventListener('scroll', atualizarScroll, { passive: true });
    atualizarScroll();

    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ========================================
    // MENU MOBILE
    // ========================================

    const hamburger = porId('hamburger');
    const mobileMenu = porId('mobileMenu');
    const mobileOverlay = porId('mobileOverlay');
    const mobileClose = porId('mobileClose');

    function fecharMenu() {
      hamburger?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
      mobileMenu?.classList.remove('active');
      mobileOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    }

    function alternarMenu() {
      if (!hamburger || !mobileMenu || !mobileOverlay) return;

      const aberto = !mobileMenu.classList.contains('active');

      hamburger.classList.toggle('active', aberto);
      hamburger.setAttribute('aria-expanded', String(aberto));
      mobileMenu.classList.toggle('active', aberto);
      mobileOverlay.classList.toggle('active', aberto);

      document.body.style.overflow = aberto ? 'hidden' : '';
    }

    hamburger?.addEventListener('click', alternarMenu);

    hamburger?.addEventListener('keydown', event => {
      if (
        hamburger.tagName !== 'BUTTON' &&
        (event.key === 'Enter' || event.key === ' ')
      ) {
        event.preventDefault();
        alternarMenu();
      }
    });

    mobileClose?.addEventListener('click', fecharMenu);
    mobileOverlay?.addEventListener('click', fecharMenu);

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', fecharMenu);
    });

    // ========================================
    // ANIMAÇÕES AO ROLAR
    // ========================================

    const elementosAnimados = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      elementosAnimados.forEach(elemento => observer.observe(elemento));
    } else {
      elementosAnimados.forEach(elemento => {
        elemento.classList.add('visible');
      });
    }

    // ========================================
    // CONTADORES
    // ========================================

    function animarContador(elemento) {
      const alvo = Number.parseInt(elemento.dataset.count, 10);

      if (!Number.isFinite(alvo)) return;

      const prefixo = elemento.dataset.prefix || '';
      const sufixo = elemento.dataset.suffix || '';
      const inicio = performance.now();
      const duracao = 2000;

      function atualizar(agora) {
        const progresso = Math.min((agora - inicio) / duracao, 1);
        const suavizado = 1 - Math.pow(1 - progresso, 3);
        const atual = Math.round(alvo * suavizado);

        elemento.textContent =
          prefixo + atual.toLocaleString('pt-BR') + sufixo;

        if (progresso < 1) {
          requestAnimationFrame(atualizar);
        }
      }

      requestAnimationFrame(atualizar);
    }

    const contadores = document.querySelectorAll('.stat-number[data-count]');

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          animarContador(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });

      contadores.forEach(elemento => counterObserver.observe(elemento));
    } else {
      contadores.forEach(animarContador);
    }

    // ========================================
    // LIGHTBOX
    // ========================================

    const imgLightbox = porId('imgLightbox');
    const imgLightboxImg = porId('imgLightboxImg');
    const imgLightboxClose = porId('imgLightboxClose');

    function fecharLightbox() {
      imgLightbox?.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (imgLightbox && imgLightboxImg) {
      document.querySelectorAll('.base-card-img img').forEach(img => {
        img.addEventListener('click', () => {
          imgLightboxImg.src = img.src;
          imgLightboxImg.alt = img.alt || '';
          imgLightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        });
      });

      imgLightboxClose?.addEventListener('click', fecharLightbox);

      imgLightbox.addEventListener('click', event => {
        if (event.target === imgLightbox) fecharLightbox();
      });
    }

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;

      fecharMenu();

      if (imgLightbox?.classList.contains('active')) {
        fecharLightbox();
      }
    });

    // ========================================
    // CARROSSÉIS
    // ========================================

    function configurarCarrossel({
      trackId,
      prevId,
      nextId,
      slidesPorTela,
      intervalo
    }) {
      const track = porId(trackId);
      const anterior = porId(prevId);
      const proximo = porId(nextId);

      if (!track || !anterior || !proximo) return;

      let atual = 0;

      function maximo() {
        return Math.max(
          0,
          Math.ceil(track.children.length - slidesPorTela())
        );
      }

      function atualizar() {
        atual = Math.min(atual, maximo());
        const largura = 100 / slidesPorTela();

        track.style.transform = `translateX(-${atual * largura}%)`;
      }

      anterior.addEventListener('click', () => {
        atual = Math.max(0, atual - 1);
        atualizar();
      });

      proximo.addEventListener('click', () => {
        atual = Math.min(maximo(), atual + 1);
        atualizar();
      });

      window.addEventListener('resize', atualizar);
      atualizar();

      window.setInterval(() => {
        if (document.hidden) return;

        atual = atual < maximo() ? atual + 1 : 0;
        atualizar();
      }, intervalo);
    }

    configurarCarrossel({
      trackId: 'testimonialsTrack',
      prevId: 'prevBtn',
      nextId: 'nextBtn',
      slidesPorTela: () => window.innerWidth >= 768 ? 3 : 1,
      intervalo: 5000
    });

    configurarCarrossel({
      trackId: 'basesTrack',
      prevId: 'basesPrevBtn',
      nextId: 'basesNextBtn',
      slidesPorTela: () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        if (window.innerWidth >= 480) return 1.25;
        return 1;
      },
      intervalo: 4500
    });

    // ========================================
    // POPUP WHATSAPP
    // ========================================

    const whatsappBtn = porId('whatsappBtn');
    const whatsappPopup = porId('whatsappPopup');

    if (whatsappBtn && whatsappPopup) {
      let aberto = false;
      let interagiu = false;

      function mostrarPopup(valor) {
        aberto = valor;
        whatsappPopup.classList.toggle('show', aberto);
      }

      whatsappBtn.addEventListener('click', () => {
        interagiu = true;
        mostrarPopup(!aberto);
      });

      document.addEventListener('click', event => {
        if (
          !whatsappBtn.contains(event.target) &&
          !whatsappPopup.contains(event.target)
        ) {
          mostrarPopup(false);
        }
      });

      window.setTimeout(() => {
        if (!interagiu) mostrarPopup(true);
      }, 3000);
    }

    // ========================================
    // ROLAGEM SUAVE
    // ========================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const href = link.getAttribute('href');

        if (!href || href === '#') return;

        let id;

        try {
          id = decodeURIComponent(href.slice(1));
        } catch {
          return;
        }

        const destino = porId(id);

        if (!destino) return;

        event.preventDefault();

        window.scrollTo({
          top: destino.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      });
    });

    // ========================================
    // LINK ATIVO DA NAVEGAÇÃO
    // ========================================

    const secoes = document.querySelectorAll('section[id]');
    const linksLocais = Array.from(
      document.querySelectorAll('.nav-desktop a')
    ).filter(link => {
      const href = link.getAttribute('href');
      return href?.startsWith('#') && href.length > 1;
    });

    if (secoes.length && linksLocais.length) {
      function atualizarNavegacao() {
        let atual = '';

        secoes.forEach(secao => {
          if (window.scrollY >= secao.offsetTop - 100) {
            atual = secao.id;
          }
        });

        linksLocais.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + atual
          );
        });
      }

      window.addEventListener('scroll', atualizarNavegacao, {
        passive: true
      });

      atualizarNavegacao();
    }

    // ========================================
    // FORMULÁRIO DE CONTATO — WHATSAPP
    // ========================================

    const contactForm = porId('contactForm');

    if (contactForm) {
      contactForm.addEventListener('submit', event => {
        event.preventDefault();

        let valido = true;

        const campos = [
          'formNome',
          'formEmail',
          'formTelefone',
          'formServico',
          'formMensagem'
        ];

        campos.forEach(id => {
          const campo = porId(id);

          if (!campo) {
            valido = false;
            return;
          }

          const grupo = campo.closest('.form-group');
          const erro = grupo?.querySelector('.form-error');

          campo.value = campo.value.trim();

          let mensagemErro = '';

          if (!campo.value) {
            mensagemErro = 'Este campo é obrigatório';
          } else if (
            id === 'formEmail' &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campo.value)
          ) {
            mensagemErro = 'E-mail inválido';
          } else if (
            id === 'formTelefone' &&
            campo.value.replace(/\D/g, '').length < 10
          ) {
            mensagemErro = 'Telefone inválido';
          }

          grupo?.classList.toggle('error', Boolean(mensagemErro));

          if (erro) erro.textContent = mensagemErro;
          if (mensagemErro) valido = false;
        });

        if (!valido || !contactForm.reportValidity()) return;

        const valor = id => porId(id)?.value.trim() || '';

        const mensagem = [
          '*Nova Solicitação de Orçamento*',
          '',
          `👤 Nome: ${valor('formNome')}`,
          `🏢 Empresa: ${valor('formEmpresa') || 'Não informado'}`,
          `📧 E-mail: ${valor('formEmail')}`,
          `📞 Telefone: ${valor('formTelefone')}`,
          `💼 Serviço: ${valor('formServico')}`,
          '',
          '📝 Mensagem:',
          valor('formMensagem')
        ].join('\n');

        // Número mantido do seu script original.
        const numero = '5581996744143';

        window.open(
          `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
          '_blank',
          'noopener,noreferrer'
        );

        // Mantém os campos preenchidos caso a pessoa precise tentar novamente.
      });

      contactForm.querySelectorAll('input, textarea, select').forEach(campo => {
        campo.addEventListener('input', () => {
          const grupo = campo.closest('.form-group');

          grupo?.classList.remove('error');

          const erro = grupo?.querySelector('.form-error');
          if (erro) erro.textContent = '';
        });
      });
    }

    // ========================================
    // CADASTRO — TRABALHE CONOSCO
    // ========================================

    const form = porId('vistoriadorForm');
    const botaoEnviar = porId('vistoriadorSubmitBtn');
    const aviso = porId('vistoriadorFormSuccess');
    const botaoEmail = porId('emailAlternativo');
    const statusEmail = porId('emailAlternativoStatus');

    if (form && botaoEnviar && aviso) {
      const LIMITE_ANEXOS = 9 * 1000 * 1000;
      const textoOriginal = botaoEnviar.innerHTML;
      let enviando = false;

      function mostrarAviso(mensagem) {
        aviso.textContent = mensagem;
        aviso.style.display = 'block';
      }

      function limparTextos() {
        form.querySelectorAll('input, textarea').forEach(campo => {
          if (
            ['text', 'tel', 'email', 'search', 'url'].includes(campo.type) ||
            campo.tagName === 'TEXTAREA'
          ) {
            campo.value = campo.value.trim();
          }
        });
      }

      function restaurarBotao() {
        enviando = false;
        botaoEnviar.disabled = false;
        botaoEnviar.innerHTML = textoOriginal;
        aviso.style.display = 'none';
      }

      window.addEventListener('pageshow', restaurarBotao);

      const ano = porId('vAno');

      if (ano) {
        ano.max = String(new Date().getFullYear());
      }

      form.addEventListener('submit', event => {
        if (enviando) {
          event.preventDefault();
          return;
        }

        limparTextos();

        if (!form.reportValidity()) {
          event.preventDefault();
          return;
        }

        const arquivos = Array.from(
          form.querySelectorAll('input[type="file"]')
        ).flatMap(campo => Array.from(campo.files || []));

        const tamanhoTotal = arquivos.reduce(
          (total, arquivo) => total + arquivo.size,
          0
        );

        if (tamanhoTotal > LIMITE_ANEXOS) {
          event.preventDefault();

          mostrarAviso(
            'Os anexos ultrapassam 9 MB. Reduza os arquivos ou use ' +
            'a opção “Abrir cadastro no e-mail”.'
          );

          aviso.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          return;
        }

        const arquivoInvalido = arquivos.find(arquivo => {
          return !/\.(pdf|jpe?g|png)$/i.test(arquivo.name);
        });

        if (arquivoInvalido) {
          event.preventDefault();

          mostrarAviso(
            'Use apenas documentos em PDF, JPG, JPEG ou PNG.'
          );

          aviso.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });

          return;
        }

        const vaga = porId('vCargo')?.value || '';
        const segundaVaga = porId('vCargo2')?.value || '';
        const assunto = form.querySelector('input[name="_subject"]');

        if (assunto) {
          assunto.value =
            'Novo Cadastro - ' + vaga +
            (segundaVaga ? ' / ' + segundaVaga : '');
        }

        enviando = true;
        botaoEnviar.disabled = true;
        botaoEnviar.textContent = 'Enviando...';

        mostrarAviso(
          'Encaminhando cadastro e documentos. ' +
          'Conclua a verificação na próxima página, se solicitada.'
        );

        // Sem preventDefault neste ponto:
        // o navegador envia o formulário com os arquivos.
        // Não apresenta sucesso antes da resposta do serviço.
      });

      botaoEmail?.addEventListener('click', () => {
        limparTextos();

        // Para o envio manual, valida os dados de texto.
        // Os arquivos serão anexados no aplicativo de e-mail.
        const campos = Array.from(form.elements).filter(campo => {
          return (
            campo.willValidate &&
            campo.type !== 'file' &&
            campo.type !== 'submit' &&
            campo.type !== 'button'
          );
        });

        const invalido = campos.find(campo => !campo.checkValidity());

        if (invalido) {
          invalido.reportValidity();
          return;
        }

        const rotulos = {
          vaga_pretendida: 'Oportunidade pretendida',
          segunda_vaga_pretendida: 'Segunda oportunidade',
          nome: 'Nome completo',
          data_nascimento: 'Data de nascimento',
          cpf: 'CPF',
          rg: 'RG',
          endereco: 'Endereço',
          cidade: 'Cidade',
          uf: 'UF',
          cep: 'CEP',
          tel_celular: 'Telefone celular',
          tel_recado: 'Telefone para recado',
          banco: 'Banco',
          agencia: 'Agência',
          titular_conta: 'Titular da conta',
          conta_corrente: 'Conta corrente',
          conta_poupanca: 'Conta poupança',
          pix: 'Chave PIX',
          tempo_experiencia: 'Tempo de experiência',
          relato_experiencia: 'Experiência profissional',
          veiculo_marca: 'Marca do veículo',
          veiculo_modelo: 'Modelo do veículo',
          veiculo_ano: 'Ano de fabricação',
          veiculo_placa: 'Placa',
          possui_seguro: 'Possui seguro',
          seguradora: 'Seguradora'
        };

        const linhas = [
          'CADASTRO DE PARCEIRO — CM REGULADORA',
          ''
        ];

        for (const [nome, valor] of new FormData(form).entries()) {
          if (
            nome.startsWith('_') ||
            valor instanceof File ||
            !String(valor).trim()
          ) {
            continue;
          }

          linhas.push(
            `${rotulos[nome] || nome}: ${valor}`
          );
        }

        linhas.push(
          '',
          'DOCUMENTOS:',
          'Anexar CNH, CRLV e comprovante de endereço a este e-mail.'
        );

        const nome = porId('vNome')?.value || '';
        const assunto = 'Cadastro de parceiro - ' + nome;

        if (statusEmail) {
          statusEmail.textContent =
            'O cadastro ainda não foi enviado. No aplicativo de e-mail, ' +
            'confira os dados, anexe os três documentos e clique em Enviar. ' +
            'Se o aplicativo não abrir, envie diretamente para ' +
            'cmreguladora@gmail.com.';
        }

        window.location.href =
          'mailto:cmreguladora@gmail.com' +
          '?subject=' + encodeURIComponent(assunto) +
          '&body=' + encodeURIComponent(linhas.join('\n'));
      });
    }

    // ========================================
    // PARALLAX
    // ========================================

    const hero = document.querySelector('.hero-bg');

    if (hero) {
      window.addEventListener('scroll', () => {
        hero.style.transform = `translateY(${window.scrollY * 0.5}px)`;
      }, { passive: true });
    }

    // ========================================
    // PARTÍCULAS DO HERO
    // ========================================

    const heroParticles = porId('heroParticles');

    if (heroParticles && !heroParticles.dataset.initialized) {
      heroParticles.dataset.initialized = 'true';

      const style = document.createElement('style');

      style.textContent = `
        @keyframes cmHeroFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
      `;

      document.head.appendChild(style);

      for (let i = 0; i < 5; i++) {
        const particula = document.createElement('div');
        const tamanho = Math.random() * 100 + 50;

        Object.assign(particula.style, {
          position: 'absolute',
          width: tamanho + 'px',
          height: tamanho + 'px',
          background: `rgba(196, 18, 48, ${Math.random() * 0.1})`,
          borderRadius: '50%',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          animation: `cmHeroFloat ${10 + Math.random() * 10}s infinite ease-in-out`,
          pointerEvents: 'none'
        });

        heroParticles.appendChild(particula);
      }
    }

    // ========================================
    // RESPONSIVIDADE
    // ========================================

    function atualizarResponsividade() {
      const largura = window.innerWidth;

      document.body.style.fontSize =
        largura < 768 ? '14px' :
        largura < 1024 ? '15px' :
        '16px';
    }

    window.addEventListener('resize', atualizarResponsividade);
    atualizarResponsividade();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar, { once: true });
  } else {
    iniciar();
  }
})();
