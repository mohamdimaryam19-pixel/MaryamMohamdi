
   (function () {
    'use strict';
  
    var toggle = document.getElementById('outils-toggle');
    var panneau = document.getElementById('outils');
    if (!toggle || !panneau) return;
  
    var burger = document.getElementById('burger');
    var zoom = document.getElementById('zoom');
    var zpop = document.getElementById('zpop');
    var mobile = window.matchMedia('(max-width: 760px)');
  
    function estOuvert() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }
  
    function ouvrir() {
      // Un seul panneau à la fois : on ferme le menu s'il est ouvert
      if (burger && burger.getAttribute('aria-expanded') === 'true') burger.click();
      toggle.setAttribute('aria-expanded', 'true');
      panneau.classList.add('open');
    }
  
    function fermer(rendreFocus) {
      if (!estOuvert()) return;
      // Referme aussi le réglage de taille s'il était déplié
      if (zoom && zoom.getAttribute('aria-expanded') === 'true') zoom.click();
      toggle.setAttribute('aria-expanded', 'false');
      panneau.classList.remove('open');
      if (rendreFocus) toggle.focus();
    }
  
    toggle.addEventListener('click', function () {
      if (estOuvert()) fermer(false);
      else ouvrir();
    });
  
    // Ouvrir le menu burger ferme les outils
    if (burger) {
      burger.addEventListener('click', function () {
        if (estOuvert()) fermer(false);
      });
    }
  
    // Échap : ferme le réglage de taille d'abord (s'il est ouvert), sinon le panneau
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape' || !estOuvert()) return;
      if (zpop && !zpop.hidden) return; // laissé au comportement existant du réglage de taille
      fermer(panneau.contains(document.activeElement) || document.activeElement === toggle);
    });
  
    // Clic en dehors : ferme sans déplacer le focus
    document.addEventListener('click', function (ev) {
      if (!estOuvert()) return;
      if (panneau.contains(ev.target) || toggle.contains(ev.target)) return;
      fermer(false);
    });
  
    // Retour en affichage ordinateur : on remet l'état à zéro
    function surChangement() {
      if (!mobile.matches) fermer(false);
    }
    if (mobile.addEventListener) mobile.addEventListener('change', surChangement);
    else mobile.addListener(surChangement);
  })();