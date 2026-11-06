/* Formulaire de contact accessible — validation + envoi Formspree en AJAX
   RGAA 11.10 (contrôle de saisie), 11.11 (suggestions de correction), 7.5 (messages de statut)
   WCAG 3.3.1, 3.3.3, 4.1.3 */
   (function () {
    'use strict';
  
    var form = document.getElementById('form-contact');
    if (!form) return;
  
    var resume = document.getElementById('form-erreurs');
    var resumeTitre = document.getElementById('form-erreurs-titre');
    var resumeListe = document.getElementById('form-erreurs-liste');
    var statut = document.getElementById('form-statut');
    var bouton = form.querySelector('button[type="submit"]');
    var titreOriginal = document.title;
    var envoiEnCours = false;
    var dejaSoumis = false;
  
    // Messages qui disent quoi faire, pas seulement ce qui ne va pas
    var champs = [
      { id: 'c-nom', vide: 'Indiquez votre nom.' },
      {
        id: 'c-email',
        vide: 'Indiquez votre adresse e-mail.',
        format: 'Indiquez une adresse e-mail au bon format, par exemple : nom@exemple.fr.'
      },
      { id: 'c-message', vide: 'Écrivez votre message.' }
    ];
  
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    function verifier(c) {
      var el = document.getElementById(c.id);
      var v = el.value.trim();
      if (!v) return c.vide;
      if (c.format && !EMAIL.test(v)) return c.format;
      return '';
    }
  
    // Ajoute / retire l'id du message d'erreur dans aria-describedby sans toucher à l'aide
    function lierDescription(el, id, actif) {
      var ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      var i = ids.indexOf(id);
      if (actif && i === -1) ids.unshift(id);
      if (!actif && i !== -1) ids.splice(i, 1);
      if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
      else el.removeAttribute('aria-describedby');
    }
  
    function afficherErreur(c, message) {
      var el = document.getElementById(c.id);
      var err = document.getElementById(c.id + '-err');
      var champ = el.closest('.champ');
  
      if (message) {
        err.textContent = '';
        var prefixe = document.createElement('span');
        prefixe.className = 'sr-only';
        prefixe.textContent = 'Erreur : ';
        err.appendChild(prefixe);
        err.appendChild(document.createTextNode(message));
        err.hidden = false;
        el.setAttribute('aria-invalid', 'true');
        champ.classList.add('champ--erreur');
      } else {
        err.textContent = '';
        err.hidden = true;
        el.removeAttribute('aria-invalid');
        champ.classList.remove('champ--erreur');
      }
      lierDescription(el, err.id, !!message);
    }
  
    function afficherResume(erreurs) {
      resumeListe.textContent = '';
      if (!erreurs.length) {
        resume.hidden = true;
        document.title = titreOriginal;
        return;
      }
      erreurs.forEach(function (e) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + e.id;
        a.textContent = e.message;
        li.appendChild(a);
        resumeListe.appendChild(li);
      });
      var n = erreurs.length;
      resumeTitre.textContent = 'Le formulaire contient ' + n + (n > 1 ? ' erreurs' : ' erreur');
      resume.hidden = false;
      // Le titre de l'onglet signale aussi l'erreur (annoncé par certains lecteurs d'écran)
      document.title = 'Erreur : ' + titreOriginal;
    }
  
    // Lien du récapitulatif → place le focus dans le champ (un simple #ancre ne le fait pas partout)
    resumeListe.addEventListener('click', function (ev) {
      var a = ev.target.closest('a');
      if (!a) return;
      var cible = document.getElementById(a.getAttribute('href').slice(1));
      if (!cible) return;
      ev.preventDefault();
      var label = form.querySelector('label[for="' + cible.id + '"]');
      (label || cible).scrollIntoView({ block: 'start' });
      cible.focus({ preventScroll: true });
    });
  
    // Après une 1re soumission : on retire l'erreur dès qu'elle est corrigée,
    // mais on n'en ajoute jamais pendant la frappe
    champs.forEach(function (c) {
      var el = document.getElementById(c.id);
      el.addEventListener('input', function () {
        if (!dejaSoumis || el.getAttribute('aria-invalid') !== 'true') return;
        if (!verifier(c)) afficherErreur(c, '');
      });
    });
  
    function annoncer(type, texte, lien) {
      statut.textContent = '';
      statut.className = 'form-statut' + (type ? ' form-statut--' + type : '');
      // Vider puis remplir après un court délai : garantit l'annonce même si le texte est identique
      setTimeout(function () {
        statut.appendChild(document.createTextNode(texte));
        if (lien) {
          var a = document.createElement('a');
          a.href = 'mailto:' + lien;
          a.textContent = lien;
          statut.appendChild(a);
          statut.appendChild(document.createTextNode('.'));
        }
      }, 100);
    }
  
    function envoyer() {
      envoiEnCours = true;
      bouton.setAttribute('aria-disabled', 'true'); // reste focalisable, contrairement à disabled
      annoncer('', 'Envoi en cours…');
  
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' } // pas de redirection vers la page Formspree (en anglais)
      })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          form.reset();
          dejaSoumis = false;
          annoncer('succes', 'Merci, votre message a bien été envoyé. Je vous réponds rapidement.');
        })
        .catch(function () {
          annoncer('erreur', 'Le message n’a pas pu être envoyé. Réessayez dans un instant, ou écrivez-moi directement à ', 'mohamdimaryam19@gmail.com');
        })
        .then(function () {
          envoiEnCours = false;
          bouton.removeAttribute('aria-disabled');
        });
    }
  
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (envoiEnCours) return;
      dejaSoumis = true;
  
      var erreurs = [];
      champs.forEach(function (c) {
        var m = verifier(c);
        afficherErreur(c, m);
        if (m) erreurs.push({ id: c.id, message: m });
      });
      afficherResume(erreurs);
  
      if (erreurs.length) {
        statut.textContent = '';
        statut.className = 'form-statut';
        resumeTitre.focus();
        return;
      }
      envoyer();
    });
  })();