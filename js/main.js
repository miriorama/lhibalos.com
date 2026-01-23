class Balos {
  static init() {
    Balos.menuToggle = document.querySelector('.menu-toggle');
    Balos.nav = document.querySelector('.nav');
    Balos.revealItems = document.querySelectorAll('.reveal');
    Balos.lyricsButtons = document.querySelectorAll('.lyrics-list button');
    Balos.modal = document.getElementById('lyrics-modal');
    Balos.modalContent = Balos.modal?.querySelector('.modal-content');
    Balos.modalTitle = Balos.modal?.querySelector('#modal-title');
    Balos.stackContainers = document.querySelectorAll('.hero-stack, .photo-stack');
    Balos.badge = document.querySelector('.badge');
    Balos.badgeTicking = false;

    Balos.initReveal();
    Balos.initLyricsModal();
    Balos.initStacks();
    Balos.initBadgeRotation();
  }

  static openMenu(){
    Balos.nav.classList.toggle('open');
  }

  static closeMenu(){
    Balos.nav.classList.remove('open');
  }

  static initReveal() {
    if (Balos.revealItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.style.transitionDelay = `${index * 80}ms`;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    Balos.revealItems.forEach((item) => observer.observe(item));
  }

  static initLyricsModal() {
    Balos.lyricsButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const src = button.getAttribute('data-src');
        if (!src) return;
        Balos.openModal(button.textContent.trim(), src);
      });
    });

    if (Balos.modal) {
      Balos.modal.addEventListener('click', (event) => {
        if (event.target.closest('[data-close="true"]')) {
          Balos.closeModal();
        }
      });
    }

    document.addEventListener('keydown', Balos.handleEscape);
  }

  static initStacks() {
    Balos.stackContainers.forEach((stack) => {
      stack.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const item = target.closest('.stack-item');
        if (!item || !stack.contains(item)) return;
        stack.insertBefore(item, stack.firstChild);
      });
    });
  }

  static initBadgeRotation() {
    if (!Balos.badge) return;
    window.addEventListener('scroll', () => {
      if (!Balos.badgeTicking) {
        Balos.badgeTicking = true;
        requestAnimationFrame(Balos.updateBadgeRotation);
      }
    });
  }

  static handleEscape(event) {
    if (event.key === 'Escape') Balos.closeModal();
  }

  static closeModal() {
    if (!Balos.modal) return;
    Balos.modal.classList.remove('open');
    Balos.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (Balos.modalContent) Balos.modalContent.innerHTML = '';
  }

  static async openModal(title, src) {
    if (!Balos.modal || !Balos.modalContent) return;
    Balos.modal.classList.add('open');
    Balos.modal.setAttribute('aria-hidden', 'false');
    Balos.modalTitle.textContent = title;
    document.body.style.overflow = 'hidden';
    Balos.modalContent.textContent = 'Caricamento...';
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error('Errore caricamento');
      const html = await response.text();
      const trimmedHtml = html.trim();
      if (!trimmedHtml) throw new Error('Testo non disponibile.');
      Balos.modalContent.innerHTML = trimmedHtml;
    } catch (error) {
      Balos.modalContent.textContent = 'Impossibile caricare il testo.';
    }
  }

  static updateBadgeRotation() {
    if (!Balos.badge) return;
    Balos.badge.style.transform = `rotate(${window.scrollY * 0.045}deg)`;
    Balos.badgeTicking = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  Balos.init();
});
