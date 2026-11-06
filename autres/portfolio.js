/* =========================================================
   portfolio.js — Maryam Mohamdi
   Un seul script pour tout le site (remplace script.js) :
     1. Thème clair / sombre
     2. Taille du texte
     3. Menu mobile
     4. Bouton « remonter en haut »
     5. Photo de secours
     6. Navigation : lien actif, en-tête au défilement, progression
     7. Recherche de projets par mot-clé et par thème
     8. Formulaire de contact
     9. Animations au défilement
   Chaque bloc vérifie que ses éléments existent : le même fichier
   fonctionne sur l'accueil comme sur les pages projet.
   ========================================================= */

/* ---------- 1. Thème clair / sombre ----------
   Bouton à bascule : libellé fixe « Mode sombre » + aria-pressed.
   Le choix est mémorisé (clé « theme », lue aussi par le script du <head>). */
   (function () {
    var bouton = document.getElementById('theme');
    if (!bouton) return;
    var racine = document.documentElement;
    var icone = document.getElementById('themeIcon');
    var systeme = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  
    function estSombre() {
      var t = racine.getAttribute('data-theme');
      if (t === 'dark') return true;
      if (t === 'light') return false;
      return !!(systeme && systeme.matches);
    }
    function maj() {
      var sombre = estSombre();
      bouton.setAttribute('aria-pressed', sombre ? 'true' : 'false');
      if (icone) icone.textContent = sombre ? '☾' : '☀';
    }
    bouton.addEventListener('click', function () {
      var choix = estSombre() ? 'light' : 'dark';
      racine.setAttribute('data-theme', choix);
      try { localStorage.setItem('theme', choix); } catch (e) {}
      maj();
    });
    if (systeme && systeme.addEventListener) systeme.addEventListener('change', maj);
    maj();
  })();
  
  /* ---------- 2. Taille du texte ----------
     De 80 % à 200 % par pas de 10. La taille de base du site est 120 %,
     d'où le facteur 1.2 (même calcul que le script du <head>).
     Aux bornes, le bouton reste focusable avec aria-disabled. */
  (function () {
    var bouton = document.getElementById('zoom');
    var pop = document.getElementById('zpop');
    if (!bouton || !pop) return;
    var racine = document.documentElement;
    var valeur = document.getElementById('zval');
    var moins = document.getElementById('zout');
    var plus = document.getElementById('zin');
    var reinit = document.getElementById('zreset');
    var MIN = 80, MAX = 200, PAS = 10;
    var taille = 100;
    try {
      var z = parseInt(localStorage.getItem('textSize'), 10);
      if (z >= MIN && z <= MAX) taille = z;
    } catch (e) {}
  
    function appliquer(t) {
      taille = Math.max(MIN, Math.min(MAX, t));
      racine.style.fontSize = (taille * 1.2) + '%';
      if (valeur) valeur.textContent = taille + ' %';
      if (moins) moins.setAttribute('aria-disabled', taille <= MIN ? 'true' : 'false');
      if (plus) plus.setAttribute('aria-disabled', taille >= MAX ? 'true' : 'false');
      try { localStorage.setItem('textSize', taille); } catch (e) {}
    }
    function ouvrir() { pop.hidden = false; bouton.setAttribute('aria-expanded', 'true'); }
    function fermer(rendreFocus) {
      if (pop.hidden) return;
      pop.hidden = true;
      bouton.setAttribute('aria-expanded', 'false');
      if (rendreFocus) bouton.focus();
    }
  
    bouton.addEventListener('click', function () { pop.hidden ? ouvrir() : fermer(false); });
    if (moins) moins.addEventListener('click', function () { if (taille > MIN) appliquer(taille - PAS); });
    if (plus) plus.addEventListener('click', function () { if (taille < MAX) appliquer(taille + PAS); });
    if (reinit) reinit.addEventListener('click', function () { appliquer(100); });
  
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !pop.hidden) fermer(true);
    });
    document.addEventListener('click', function (e) {
      var wrap = document.getElementById('zoomwrap') || pop.parentNode;
      if (!pop.hidden && !wrap.contains(e.target)) fermer(false);
    });
    appliquer(taille);
  })();
  
  /* ---------- 3. Menu mobile ----------
     Échap ou clic en dehors referme le menu ; le focus revient au bouton. */
  (function () {
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');
    if (!burger || !menu) return;
    var ecranLarge = window.matchMedia('(min-width: 1061px)');
  
    function ouvrir() {
      menu.classList.add('open');
      document.body.classList.add('menu-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fermer le menu');
    }
    function fermer(rendreFocus) {
      if (!menu.classList.contains('open')) return;
      menu.classList.remove('open');
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Ouvrir le menu');
      if (rendreFocus) burger.focus();
    }
  
    burger.addEventListener('click', function () {
      menu.classList.contains('open') ? fermer(false) : ouvrir();
    });
    // Un clic sur un lien du menu le referme
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fermer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) fermer(true);
    });
    document.addEventListener('click', function (e) {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !burger.contains(e.target)) fermer(false);
    });
    var surChangement = function () { if (ecranLarge.matches) fermer(false); };
    if (ecranLarge.addEventListener) ecranLarge.addEventListener('change', surChangement);
  })();
  
  /* ---------- 4. Bouton « remonter en haut » ----------
     Masqué (et donc hors du parcours clavier) tant qu'on n'a pas défilé. */
  (function () {
    var haut = document.getElementById('totop');
    if (!haut) return;
    var attente = false;
    function maj() { attente = false; haut.classList.toggle('show', window.scrollY > 600); }
    window.addEventListener('scroll', function () {
      if (!attente) { attente = true; requestAnimationFrame(maj); }
    }, { passive: true });
    maj();
  })();
  
  /* ---------- 5. Photo de secours ----------
     Si la photo ne charge pas, on affiche les initiales en gardant
     l'alternative textuelle de l'image. */
  (function () {
    var photo = document.getElementById('photo');
    var secours = document.getElementById('photoFallback');
    if (!photo || !secours) return;
    function basculer() {
      photo.hidden = true;
      secours.hidden = false;
      secours.removeAttribute('aria-hidden');
      secours.setAttribute('role', 'img');
      secours.setAttribute('aria-label', photo.getAttribute('alt') || '');
    }
    photo.addEventListener('error', basculer);
    if (photo.complete && photo.naturalWidth === 0) basculer();
  })();
  
  /* ---------- 6. Navigation : lien actif, en-tête, progression ---------- */
  (function () {
    var racine = document.documentElement;
    var header = document.querySelector('header');
    var barre = document.getElementById('progression');
    var liens = Array.prototype.slice.call(document.querySelectorAll('.menu a[href^="#"]'));
  
    /* --- En-tête et progression --- */
    var enAttente = false;
    function surDefilement() {
      enAttente = false;
      var y = window.scrollY;
      if (header) header.classList.toggle('defile', y > 8);
      if (barre) {
        var max = racine.scrollHeight - window.innerHeight;
        barre.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      }
    }
    window.addEventListener('scroll', function () {
      if (!enAttente) { enAttente = true; requestAnimationFrame(surDefilement); }
    }, { passive: true });
    surDefilement();
  
    /* --- Lien actif selon la section visible --- */
    if ('IntersectionObserver' in window && liens.length) {
      var sections = liens.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
      var espion = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
          if (!e.isIntersecting) return;
          liens.forEach(function (a) {
            if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
            else a.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) { espion.observe(s); });
    }
  })();
  
  /* ---------- 7. Recherche de projets ----------
     Sans JavaScript, les outils restent masqués et tous les projets s'affichent. */
  (function () {
    var outils = document.getElementById('outils-projets');
    var grille = document.getElementById('grille-projets');
    if (!outils || !grille) return;
  
    var champ = document.getElementById('recherche-projet');
    var boutons = Array.prototype.slice.call(outils.querySelectorAll('button[data-theme]'));
    var cartes = Array.prototype.slice.call(grille.querySelectorAll('.cp'));
    var resultat = document.getElementById('resultat-projets');
    var vide = document.getElementById('projets-vide');
    var reinit = document.getElementById('reinit-recherche');
    var theme = 'tous';
    var minuterie;
  
    // Texte sans accents ni majuscules, pour que « acces » trouve « Accessibilité »
    function normaliser(t) {
      return (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }
    // La recherche porte aussi sur les thèmes de la carte (ex. « accessibilité » trouve QT'Ly)
    var libelles = {};
    Array.prototype.forEach.call(outils.querySelectorAll('button[data-theme]'), function (b) {
      libelles[b.getAttribute('data-theme')] = b.firstChild.textContent;
    });
    cartes.forEach(function (c) {
      var themes = (c.getAttribute('data-theme') || '').split(' ').map(function (t) { return libelles[t] || ''; }).join(' ');
      c._texte = normaliser(c.textContent + ' ' + themes);
    });
  
    function aLeTheme(carte, t) {
      return t === 'tous' || (' ' + carte.getAttribute('data-theme') + ' ').indexOf(' ' + t + ' ') > -1;
    }
  
    boutons.forEach(function (b) {
      var t = b.getAttribute('data-theme');
      var nb = cartes.filter(function (c) { return aLeTheme(c, t); }).length;
      var pastille = b.querySelector('.nb');
      if (pastille) pastille.textContent = nb;
      if (nb === 0) b.hidden = true;
    });
  
    function appliquer(annoncer) {
      var mots = normaliser(champ.value).split(/\s+/).filter(Boolean);
      var visibles = 0;
      cartes.forEach(function (c) {
        var ok = aLeTheme(c, theme) && mots.every(function (m) { return c._texte.indexOf(m) > -1; });
        if (ok && c.hidden) {
          c.classList.remove('reapparait'); void c.offsetWidth; c.classList.add('reapparait');
        }
        c.hidden = !ok;
        if (ok) visibles++;
      });
      vide.hidden = visibles > 0;
      var filtre = theme !== 'tous' || mots.length > 0;
      resultat.textContent = !filtre ? '' :
        visibles === 0 ? 'Aucun projet trouvé.' :
        visibles + (visibles > 1 ? ' projets trouvés.' : ' projet trouvé.');
    }
  
    boutons.forEach(function (b) {
      b.addEventListener('click', function () {
        theme = b.getAttribute('data-theme');
        boutons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        appliquer(true);
      });
    });
  
    // Annonce différée pendant la frappe, pour ne pas interrompre à chaque lettre
    champ.addEventListener('input', function () {
      clearTimeout(minuterie);
      minuterie = setTimeout(function () { appliquer(true); }, 350);
    });
  
    reinit.addEventListener('click', function () {
      champ.value = '';
      theme = 'tous';
      boutons.forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-theme') === 'tous' ? 'true' : 'false'); });
      appliquer(true);
      champ.focus();
    });
  
    outils.hidden = false;
  })();
  
  /* ---------- 8. Formulaire de contact ----------
     Erreurs reliées aux champs, récapitulatif qui reçoit le focus,
     envoi Formspree ou repli vers la messagerie (mailto). */
  (function () {
    var form = document.getElementById('form-contact');
    if (!form) return;
  
    var DESTINATAIRE = 'mohamdimaryam19@gmail.com';
    var recap = document.getElementById('form-erreurs');
    var statut = document.getElementById('form-statut');
    var bouton = form.querySelector('button[type="submit"]');
  
    var regles = [
      { id: 'c-nom', label: 'Nom', verifier: function (v) { return v ? '' : 'Indiquez votre nom.'; } },
      { id: 'c-email', label: 'Adresse e-mail', verifier: function (v) {
          if (!v) return 'Indiquez votre adresse e-mail.';
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'L’adresse e-mail n’est pas au bon format, par exemple : nom@exemple.fr';
        } },
      { id: 'c-message', label: 'Message', verifier: function (v) { return v ? '' : 'Écrivez votre message.'; } }
    ];
  
    function afficherErreur(champ, message) {
      var err = document.getElementById(champ.id + '-err');
      if (message) {
        champ.setAttribute('aria-invalid', 'true');
        err.textContent = message;
        err.hidden = false;
      } else {
        champ.removeAttribute('aria-invalid');
        err.textContent = '';
        err.hidden = true;
      }
    }
  
    function verifier() {
      var erreurs = [];
      regles.forEach(function (r) {
        var champ = document.getElementById(r.id);
        var msg = r.verifier(champ.value.trim());
        afficherErreur(champ, msg);
        if (msg) erreurs.push({ id: r.id, msg: msg });
      });
      return erreurs;
    }
  
    // Une fois une erreur affichée, on la retire dès que le champ est corrigé
    regles.forEach(function (r) {
      var champ = document.getElementById(r.id);
      champ.addEventListener('blur', function () {
        if (champ.getAttribute('aria-invalid') === 'true') afficherErreur(champ, r.verifier(champ.value.trim()));
      });
    });
  
    function afficherRecap(erreurs) {
      recap.innerHTML = '';
      var titre = document.createElement('p');
      titre.className = 'erreurs__titre';
      titre.textContent = erreurs.length > 1
        ? erreurs.length + ' champs sont à corriger :'
        : '1 champ est à corriger :';
      var liste = document.createElement('ul');
      erreurs.forEach(function (e) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + e.id;
        a.textContent = e.msg;
        a.addEventListener('click', function (ev) { ev.preventDefault(); document.getElementById(e.id).focus(); });
        li.appendChild(a);
        liste.appendChild(li);
      });
      recap.appendChild(titre);
      recap.appendChild(liste);
      recap.hidden = false;
      recap.focus();
    }
  
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      statut.textContent = '';
      statut.className = 'form-statut';
      var erreurs = verifier();
      if (erreurs.length) { afficherRecap(erreurs); return; }
      recap.hidden = true;
  
      var donnees = new FormData(form);
  
      // Repli : Formspree pas encore configuré → messagerie de l'internaute
      if (form.action.indexOf('VOTRE_ID') > -1) {
        var corps = donnees.get('message') + '\n\n' + donnees.get('nom') + ' — ' + donnees.get('email');
        var sujet = donnees.get('objet') || 'Contact depuis le portfolio';
        window.location.href = 'mailto:' + DESTINATAIRE + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(corps);
        statut.textContent = 'Votre messagerie va s’ouvrir avec le message prérempli.';
        return;
      }
  
      bouton.disabled = true;
      bouton.textContent = 'Envoi en cours…';
      fetch(form.action, { method: 'POST', body: donnees, headers: { Accept: 'application/json' } })
        .then(function (rep) {
          if (!rep.ok) throw new Error();
          form.reset();
          statut.textContent = 'Merci, votre message a bien été envoyé. Je vous réponds rapidement.';
          statut.className = 'form-statut form-statut--ok';
        })
        .catch(function () {
          statut.textContent = 'Le message n’a pas pu être envoyé. Réessayez ou écrivez directement à ' + DESTINATAIRE + '.';
          statut.className = 'form-statut form-statut--ko';
        })
        .then(function () {
          bouton.disabled = false;
          bouton.textContent = 'Envoyer le message';
        });
    });
  })();
  
  /* ---------- 9. Animations au défilement ----------
     Seulement si html.anim (mouvement non réduit, posé dans le <head>). */
  (function () {
    var racine = document.documentElement;
    if (!racine.classList.contains('anim')) return;
    var cibles = document.querySelectorAll(
      'section > h2, .apropos .txt, .cursus > div, .outils-projets, .cp, .memoire-visuel, .memoire-txt, .skills > div, .contact-infos, .formulaire'
    );
    var apparition = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('vu');
        apparition.unobserve(el);
        // Une fois apparu, on rend l'élément à ses styles normaux (survol, etc.)
        setTimeout(function () { el.removeAttribute('data-anim'); el.style.removeProperty('--retard'); }, 1000);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(cibles, function (el) {
      // Décalage en cascade pour les éléments frères (cartes, colonnes)
      var freres = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--retard', Math.min(freres, 5) * 70 + 'ms');
      el.setAttribute('data-anim', '');
      apparition.observe(el);
    });
  })();