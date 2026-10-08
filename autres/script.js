/* =========================================================
   Portfolio Maryam Mohamdi — scripts
   ========================================================= */
   (function(){
    'use strict';
    var root=document.documentElement;
    function $(id){return document.getElementById(id)}
    
    /* ---------- Photo de l'accueil ----------
       Si images/photo-maryam.jpg est introuvable, on affiche le monogramme « MM ». */
    var photo=$('photo'),photoFb=$('photoFallback');
    if(photo&&photoFb){
      var photoFail=function(){photo.hidden=true;photoFb.hidden=false};
      photo.addEventListener('error',photoFail);
      if(photo.complete&&photo.naturalWidth===0)photoFail(); /* erreur survenue avant le chargement du script */
    }
    
    /* ---------- Carrousel de projets (accueil uniquement) ---------- */
    if($('slide')){
    var B='projets/';
    /* Images du dossier images/ du dépôt (attention à la casse : tos-logo.PNG) */
    var IMG='https://mohamdimaryam19-pixel.github.io/maryam-portfolio/images/';
    var P=[
     {n:"QT’Ly",t:"Robotique sociale · TSA",d:"Interface de médiation avec QTrobot pour accompagner la compréhension des émotions chez l’enfant.",u:"qtly.html",img:"projet-qtly.svg",c:["#e8a0b0","#b9707f"]},
     {n:"TeaTime",t:"IoT · Application mobile",d:"Objet connecté permettant de suivre la température idéale du thé avec une application mobile.",u:"teatime.html",img:"projet-teatime.jpg",c:["#f4c6cf","#a86a5a"]},
     {n:"Lehna Collection",t:"UX/UI · E-commerce",d:"Création de l’identité visuelle et de l’expérience utilisateur d’une boutique de robes kabyles.",u:"lehna-collection.html",img:"lehna-logo.png",c:["#d99aa8","#8b5a50"]},
     {n:"Tous O Sport",t:"UX/UI · Ergonomie",d:"Prototype d’un site web de l’association Tous’OSport.",u:"tous-o-sport.html",img:"tos-logo.PNG",c:["#f0b8a8","#c47a8a"]},
     {n:"Fonctionnalité Leboncoin",t:"UX recherche · Ergonomie",d:"Prototype de l’application Leboncoin avec ajout d’une fonctionnalité contextuelle.",u:"leboncoin.html",img:"lbc-logo.png",c:["#e6a9b8","#7a4a3c"]}
    ];
    var i=0,slide=$('slide'),shot=$('shot'),pager=$('pager'),pimg=$('pimg'),pletter=$('pletter');
    /* Si une image ne charge pas, on affiche l'initiale du projet à la place */
    pimg.addEventListener('error',function(){pimg.hidden=true;pletter.hidden=false;shot.classList.remove('cover')});
    
    P.forEach(function(p,k){
      var b=document.createElement('button');
      b.type='button';
      b.setAttribute('aria-label',p.n+' ('+(k+1)+' sur '+P.length+')');
      b.addEventListener('click',function(){go(k)});
      pager.appendChild(b);
    });
    
    function show(){
      var p=P[i];
      $('ptag').textContent=p.t;
      $('ptitle').textContent=p.n;
      $('pdesc').textContent=p.d;
      $('plink').href=B+p.u;
      $('plname').textContent=' '+p.n; /* nom accessible unique : « Voir le projet QT’Ly » */
      pletter.textContent=p.n.charAt(0);
      if(p.img){pimg.hidden=false;pletter.hidden=true;pimg.src=IMG+p.img}
      else{pimg.hidden=true;pletter.hidden=false;pimg.removeAttribute('src')}
      shot.classList.toggle('cover',!!p.cover);
      shot.style.setProperty('--c1',p.c[0]);
      shot.style.setProperty('--c2',p.c[1]);
      slide.setAttribute('aria-label',(i+1)+' sur '+P.length);
      [].forEach.call(pager.children,function(b,k){
        if(k===i)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');
      });
    }
    /* La zone n'est rendue « live » qu'après une action, pour ne rien annoncer au chargement */
    function go(k){
      var dir=k>i?1:-1;
      i=(k+P.length)%P.length;slide.setAttribute('aria-live','polite');show();
      /* Petit glissement de la diapositive (désactivé si mouvement réduit) */
      if(root.classList.contains('anim')&&slide.animate){
        slide.animate([{opacity:0,transform:'translateX('+(dir*28)+'px)'},{opacity:1,transform:'none'}],
          {duration:380,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
    }
    $('prev').addEventListener('click',function(){go(i-1)});
    $('next').addEventListener('click',function(){go(i+1)});
    show();
    }
    
    /* ---------- Thème clair / sombre ---------- */
    var tb=$('theme'),ti=$('themeIcon'),mq=window.matchMedia('(prefers-color-scheme: dark)');
    function isDark(){var a=root.getAttribute('data-theme');return a?a==='dark':mq.matches}
    function themeUI(){var d=isDark();ti.textContent=d?'☾':'☀';tb.setAttribute('aria-pressed',String(d))}
    tb.addEventListener('click',function(){
      var t=isDark()?'light':'dark';
      root.setAttribute('data-theme',t);
      try{localStorage.setItem('theme',t)}catch(e){}
      themeUI();
    });
    if(mq.addEventListener)mq.addEventListener('change',themeUI);
    themeUI();
    
    /* ---------- Menu et panneau de taille du texte ---------- */
    var burger=$('burger'),menu=$('menu'),bp=$('bpath'),
        zb=$('zoom'),zwrap=$('zoomwrap'),zpop=$('zpop'),zval=$('zval'),
        zin=$('zin'),zout=$('zout'),zreset=$('zreset');
    
    function setMenu(o){
      menu.classList.toggle('open',o);
      document.body.classList.toggle('menu-open',o);
      burger.setAttribute('aria-expanded',String(o));
      burger.setAttribute('aria-label',o?'Fermer le menu':'Ouvrir le menu');
      bp.setAttribute('d',o?'M4 3l14 12M18 3L4 15':'M2 3h18M2 9h18M2 15h18');
    }
    /* Repasser en affichage ordinateur referme le menu */
    var wide=window.matchMedia('(min-width:1061px)');
    if(wide.addEventListener)wide.addEventListener('change',function(){if(wide.matches)setMenu(false)});
    function setZ(o){zpop.hidden=!o;zb.setAttribute('aria-expanded',String(o))}
    
    burger.addEventListener('click',function(e){e.stopPropagation();var o=!menu.classList.contains('open');setMenu(o);if(o)setZ(false)});
    zb.addEventListener('click',function(e){e.stopPropagation();var o=zpop.hidden;setZ(o);if(o)setMenu(false)});
    zpop.addEventListener('click',function(e){e.stopPropagation()});
    menu.addEventListener('click',function(e){if(e.target.tagName==='A')setMenu(false)});
    document.addEventListener('click',function(){setMenu(false);setZ(false)});
    
    /* Fermeture quand le focus sort, pour que le menu ne masque pas l'élément focalisé */
    menu.addEventListener('focusout',function(e){
      var t=e.relatedTarget;
      if(t&&!menu.contains(t)&&t!==burger)setMenu(false);
    });
    zwrap.addEventListener('focusout',function(e){
      var t=e.relatedTarget;
      if(t&&!zwrap.contains(t))setZ(false);
    });
    
    document.addEventListener('keydown',function(e){
      if(e.key!=='Escape')return;
      if(!zpop.hidden){setZ(false);zb.focus()}
      if(menu.classList.contains('open')){setMenu(false);burger.focus()}
    });
    
    /* aria-disabled plutôt que disabled : un bouton désactivé perd le focus
       (renvoyé sur <body>) quand on atteint la limite au clavier. */
    /* 100 % affiché = taille de base du site (120 % du navigateur, cf. style.css) */
    var BASE=1.2,zl=100,ZMIN=80,ZMAX=200,ZSTEP=10;
    try{var sv=parseInt(localStorage.getItem('textSize'),10);if(sv>=ZMIN&&sv<=ZMAX)zl=sv}catch(e){}
    function setDis(b,d){b.setAttribute('aria-disabled',String(d))}
    function isDis(b){return b.getAttribute('aria-disabled')==='true'}
    function applyZ(save){
      if(zl===100)root.style.removeProperty('font-size');else root.style.fontSize=(zl*BASE)+'%';
      zval.textContent=zl+' %';
      setDis(zin,zl>=ZMAX);setDis(zout,zl<=ZMIN);setDis(zreset,zl===100);
      if(save){try{localStorage.setItem('textSize',String(zl))}catch(e){}}
    }
    zin.addEventListener('click',function(){if(isDis(zin))return;zl=Math.min(ZMAX,zl+ZSTEP);applyZ(true)});
    zout.addEventListener('click',function(){if(isDis(zout))return;zl=Math.max(ZMIN,zl-ZSTEP);applyZ(true)});
    zreset.addEventListener('click',function(){if(isDis(zreset))return;zl=100;applyZ(true)});
    applyZ(false);
    
    /* ---------- Bouton « remonter en haut » ----------
       visibility:hidden le retire aussi de l'ordre de tabulation tant qu'il est inutile. */
    var totop=$('totop');
    function toggleTop(){totop.classList.toggle('show',window.scrollY>500)}
    window.addEventListener('scroll',toggleTop,{passive:true});
    toggleTop();
    
    /* ---------- Accueil : 3 projets visibles, « Voir plus » affiche les autres ---------- */
    var lpBtn=$('lp-toggle');
    if(lpBtn){
      var extra=[].slice.call(document.querySelectorAll('.lp-plus'));
      var setLp=function(open){
        extra.forEach(function(li){li.hidden=!open});
        lpBtn.setAttribute('aria-expanded',String(open));
        lpBtn.textContent=open?'Voir moins':'Voir plus';
      };
      setLp(false);lpBtn.hidden=false;
      lpBtn.addEventListener('click',function(){
        var open=lpBtn.getAttribute('aria-expanded')!=='true';
        setLp(open);
        /* À l'ouverture, le focus va sur le premier projet ajouté pour que le clavier et
           les lecteurs d'écran le trouvent tout de suite */
        if(open){var l=extra[0]&&extra[0].querySelector('a');if(l)l.focus()}
      });
    }
    
    /* =========================================================
       Animations — uniquement si l'utilisateur n'a pas demandé
       à réduire les mouvements (classe .anim posée dans le <head>).
       Rien n'est caché si le JavaScript ne s'exécute pas.
       ========================================================= */
    var motion=window.matchMedia('(prefers-reduced-motion: reduce)');
    function animOn(){return root.classList.contains('anim')}
    
    /* 1. Au défilement, seule la frise s'anime : la ligne se dessine
          et les étapes apparaissent l'une après l'autre. Le reste est statique. */
    var groups=[['.frise li',140]];
    var revealEls=[];
    groups.forEach(function(g){
      [].forEach.call(document.querySelectorAll(g[0]),function(el,n){
        if(el.classList.contains('reveal'))return;
        el.classList.add('reveal');
        el.style.setProperty('--d',Math.min(n*g[1],600)+'ms');
        revealEls.push(el);
      });
    });
    var lines=[].slice.call(document.querySelectorAll('.frise'));
    function revealAll(){revealEls.concat(lines).forEach(function(el){el.classList.add('in')})}
    if(animOn()){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}});
      },{rootMargin:'0px 0px -8% 0px',threshold:.12});
      revealEls.concat(lines).forEach(function(el){io.observe(el)});
    }else revealAll();
    /* Si la préférence change en cours de visite : tout s'affiche, plus d'animation */
    function stopAnim(){if(motion.matches){root.classList.remove('anim');revealAll()}}
    if(motion.addEventListener)motion.addEventListener('change',stopAnim);
    
    /* 2. Pluie de pétales à l'arrivée sur la page : courte (< 5 s), décorative, puis supprimée */
    if(animOn()&&document.body.animate&&$('home')){
      var layer=document.createElement('div');
      layer.className='petals';layer.setAttribute('aria-hidden','true');
      document.body.appendChild(layer);
      var NS='http://www.w3.org/2000/svg',W=window.innerWidth,H=window.innerHeight,left=12;
      for(var p=0;p<12;p++){
        var sz=10+Math.random()*14,svg=document.createElementNS(NS,'svg'),use=document.createElementNS(NS,'use');
        svg.setAttribute('viewBox','0 0 60 60');svg.setAttribute('width',sz);svg.setAttribute('height',sz);
        use.setAttribute('href','#sak');use.setAttribute('width','60');use.setAttribute('height','60');
        svg.appendChild(use);svg.style.left=(Math.random()*W)+'px';layer.appendChild(svg);
        var drift=(Math.random()*160-80),rot=(Math.random()*360-180);
        var a=svg.animate([
          {transform:'translate(0,-40px) rotate(0deg)',opacity:0},
          {opacity:.9,offset:.15},
          {transform:'translate('+drift+'px,'+(H*.75)+'px) rotate('+rot+'deg)',opacity:0}
        ],{duration:3200+Math.random()*1200,delay:Math.random()*400,easing:'cubic-bezier(.3,.5,.4,1)',fill:'forwards'});
        a.onfinish=function(){if(--left<=0)layer.remove()};
      }
    }
    
    var frame=document.querySelector('.hero .frame');
    if(frame&&window.matchMedia('(pointer:fine)').matches){
      frame.addEventListener('pointermove',function(e){
        if(!animOn())return;
        var r=frame.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        frame.style.transform='perspective(800px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg)';
      });
      frame.addEventListener('pointerleave',function(){frame.style.transform=''});
    }
    })();