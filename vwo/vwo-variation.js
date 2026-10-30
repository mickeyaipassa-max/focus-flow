/*
 * VWO-variatie "Keuzehulp-tag bij Kies je basisdekking" — a.s.r. Autoverzekering Ik kies zelf, stap 2 "Kies je dekking".
 * Plak dit in de Custom JavaScript-editor van de variatie (MODE = 'variation') en, alleen voor de meting, ook in Control (MODE = 'control').
 * Hoort bij vwo-variation.css en vwo-implementation.md. Geen randomisatie in deze code: VWO verdeelt Control en Variation.
 *
 * Wat de code doet (MODE = 'variation'):
 *   1. Zoekt de kaartengroep van stap 2 (asr-radio-card-group[formcontrolname="baseCoverage"]) en vervangt het label
 *      "Kies je basisverzekering (WA/WA+/Allrisk)" door "Kies je basisdekking".
 *   2. Zet de tag "Hulp nodig?" achter het label, in de shadow root van die groep (daar staat het label; gewone CSS en selectors bereiken het niet).
 *   3. Een klik op de tag opent de keuzehulp-chat (de bestaande chat, app/embed/keuzehulp) in een iframe-paneel, met de gekozen dekking als context.
 *   4. Meet de interacties met VWO.event (zie TRACKING hieronder).
 * Wat de code doet (MODE = 'control'): niets aan de pagina; alleen de meting van klikken op de kaarten en op "Verder naar".
 *
 * Veiligheid: geen sleutels of geheimen in de browser (de chat roept zijn eigen /api/chat aan, binnen het iframe), geen eigen randomisatie,
 * geen literal URL's in deze code, alles in try/catch, en een tweede keer uitvoeren (dubbel plakken, SPA-herstart) doet niets.
 */
(function () {
  'use strict';

  var MODE = 'variation'; // 'variation' of 'control'

  var NS = '__asrKeuzehulpVwo';
  if (window[NS]) return; // al actief: nooit dubbel initialiseren

  var user = window.__ASR_KEUZEHULP_CONFIG__ || {}; // optioneel, voor Preview/test: { chatOrigin: 'https://…', debug: true }
  var CFG = {
    labelNieuw: 'Kies je basisdekking',
    tagTekst: 'Hulp nodig?',
    chatPad: '/embed/keuzehulp',
    readyTimeoutMs: 8000,
    debug: !!user.debug || /[?&]asr_vwo_debug=1/.test(location.search)
  };
  // Het chatdomein staat in stukken, zodat er geen volledige URL in de code staat (mailprogramma's herschrijven die en breken dan de code).
  var CHAT_ORIGIN = user.chatOrigin || 'https:' + '//' + ['ditismick', 'com'].join('.');

  var GROEP = 'asr-radio-card-group[formcontrolname="baseCoverage"]';
  var KAART = 'asr-radio-card-control-bottom';
  var DEKKING_VAN_WAARDE = { Wa: 'wa', WaCasco: 'wa-casco-beperkt', WaCascoAllRisk: 'wa-casco-allrisk' };
  var AI_ICOON = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true" focusable="false"><path d="M8 1.5C8.2091 1.5 8.39606 1.63014 8.46875 1.82617L10.0098 5.98926L14.1738 7.53125C14.3699 7.60394 14.5 7.7909 14.5 8C14.5 8.2091 14.3699 8.39605 14.1738 8.46875L10.0098 10.0098L8.46875 14.1738C8.39605 14.3699 8.2091 14.5 8 14.5C7.7909 14.5 7.60394 14.3699 7.53125 14.1738L5.98926 10.0098L1.82617 8.46875C1.63014 8.39606 1.5 8.2091 1.5 8C1.5 7.7909 1.63014 7.60394 1.82617 7.53125L5.98926 5.98926L7.53125 1.82617L7.56348 1.75586C7.65082 1.59959 7.81701 1.5 8 1.5ZM6.76855 6.76855L3.44043 8L6.76855 9.23145L8 12.5586L9.23145 9.23145L12.5586 8L9.23145 6.76855L8 3.44043L6.76855 6.76855Z" fill="#000"/></svg>';
  // Ingebouwde kopie van de tag-CSS (zie vwo-variation.css), alleen gebruikt als de regels niet in het stylesheet van de pagina staan.
  var TAG_CSS_FALLBACK =
    '.asr-vwo-hulp-tag{all:unset;position:relative;box-sizing:border-box;display:inline-flex;align-items:center;gap:4px;height:32px;margin:-2.5px 0;padding:4px 12px 4px 8px;border-radius:9999px;background:rgba(0,0,0,.08);color:#000;font-family:inherit;font-size:14px;font-weight:550;line-height:1.5;white-space:nowrap;vertical-align:middle;cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    'legend.asr-vwo-hulp-legend{display:flex;flex-wrap:wrap;align-items:center;row-gap:4px}' +
    '.asr-vwo-hulp-legend .label-required{margin-inline-end:12px}' +
    '.asr-vwo-hulp-tag::after{content:"";position:absolute;inset:-6px -4px}' +
    '.asr-vwo-hulp-tag:hover{background:rgba(0,0,0,.14)}' +
    '.asr-vwo-hulp-tag:focus-visible{outline:2px solid #000;outline-offset:2px}' +
    '.asr-vwo-hulp-tag svg{display:block;flex:none;width:16px;height:16px}';

  var state = {
    versie: '1.0.0',
    mode: MODE,
    groep: null,
    schaduwObserver: null,
    paneel: null,
    scrim: null,
    iframe: null,
    tag: null,
    ready: false,
    open: false,
    readyTimer: null,
    verstuurd: {}, // eenmalige events per paginaweergave
    laatsteKlik: {},
    herstelTeller: 0
  };
  window[NS] = state;

  function log() {
    if (!CFG.debug || !window.console) return;
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[asr-keuzehulp-vwo]');
    console.log.apply(console, args);
  }
  function veilig(fn) {
    return function () {
      try {
        return fn.apply(this, arguments);
      } catch (e) {
        log('fout', e);
      }
    };
  }

  /* ------------------------------------------------------------------ TRACKING
   * VWO SmartCode 2.x op asr.nl (account 219513). Custom events gaan met VWO.event(naam, eigenschappen); als die helper nog niet bestaat,
   * zet VWO.push(['event', naam, eigenschappen]) hem in de wachtrij (zo schrijft VWO's eigen snippet het ook).
   * Elk event bevat variant ('variation' | 'control'). Eenmalige events worden per paginaweergave maar één keer verstuurd.
   *
   *   asr_hulp_tag_click        klik op de tag "Hulp nodig?"                (alleen variation)
   *   asr_chat_opened           de chat is geladen en zichtbaar (eenmalig)  (alleen variation)
   *   asr_chat_first_message    eerste klantbericht, tag of getypt (eenmalig)
   *   asr_chat_first_question   eerste getypte vraag (eenmalig)
   *   asr_card_click            klik op een productkaart (WA, WA + Casco beperkt, WA + Casco allrisk), niet op "Meer informatie"
   *   asr_card_info_click       klik op "Meer informatie" in een kaart
   *   asr_funnel_next_click     klik op "Verder naar: Vul je gegevens in" (dichtstbijzijnde doel; zie handleiding)
   *   asr_chat_fallback         de chat kon niet laden; de terugval is getoond
   */
  function track(naam, eigenschappen, eenmalig) {
    if (eenmalig) {
      if (state.verstuurd[naam]) return;
      state.verstuurd[naam] = true;
    }
    var payload = { variant: MODE };
    for (var k in eigenschappen || {}) if (Object.prototype.hasOwnProperty.call(eigenschappen, k)) payload[k] = eigenschappen[k];
    try {
      window.VWO = window.VWO || [];
      if (typeof window.VWO.event === 'function') window.VWO.event(naam, payload);
      else window.VWO.push(['event', naam, payload]);
    } catch (e) {
      log('track fout', naam, e);
    }
    log('event', naam, payload);
  }
  /** Voorkomt dubbele events door dubbele DOM-events (bijv. label- en input-klik op dezelfde kaart). */
  function nietDubbel(sleutel) {
    var nu = Date.now();
    if (state.laatsteKlik[sleutel] && nu - state.laatsteKlik[sleutel] < 400) return false;
    state.laatsteKlik[sleutel] = nu;
    return true;
  }

  /* ------------------------------------------------------------------ CONTEXT VAN DE PRODUCTKAART */
  function kaarten(groep) {
    return Array.prototype.slice.call((groep || state.groep || document).querySelectorAll(':scope > ' + KAART));
  }
  function kaartTitel(kaart) {
    var h = kaart && kaart.querySelector('[slot="title"]');
    return h ? h.textContent.replace(/\s+/g, ' ').trim() : '';
  }
  function leesContext() {
    var groep = state.groep || document.querySelector(GROEP);
    var gekozen = null;
    var lijst = [];
    kaarten(groep).forEach(function (kaart) {
      lijst.push(kaartTitel(kaart));
      if (kaart.checked === true || kaart.hasAttribute('checked')) gekozen = kaart;
    });
    var waarde = gekozen ? gekozen.value || gekozen.getAttribute('value') : null;
    return { dekking: DEKKING_VAN_WAARDE[waarde] || null, kaart: gekozen ? kaartTitel(gekozen) : null, kaarten: lijst };
  }

  /* ------------------------------------------------------------------ CHATPANEEL */
  function chatUrl(ctx) {
    var url = CHAT_ORIGIN + CFG.chatPad;
    return ctx && ctx.dekking ? url + '?dekking=' + encodeURIComponent(ctx.dekking) : url;
  }
  function naarChat(type, extra) {
    if (!state.iframe || !state.iframe.contentWindow) return;
    var bericht = { bron: 'asr-keuzehulp', type: type };
    for (var k in extra || {}) if (Object.prototype.hasOwnProperty.call(extra, k)) bericht[k] = extra[k];
    state.iframe.contentWindow.postMessage(bericht, CHAT_ORIGIN);
  }
  function stuurContext() {
    var ctx = leesContext();
    naarChat('context', { dekking: ctx.dekking, kaart: ctx.kaart });
  }
  function maakPaneel() {
    if (state.paneel) return;
    var ctx = leesContext();

    var scrim = document.createElement('div');
    scrim.className = 'asr-vwo-scrim';
    scrim.addEventListener('click', veilig(function () { sluit(); }));

    var paneel = document.createElement('div');
    paneel.className = 'asr-vwo-chat';
    paneel.setAttribute('role', 'region');
    paneel.setAttribute('aria-label', 'AI-assistent van a.s.r.');
    paneel.setAttribute('data-open', 'false');

    var iframe = document.createElement('iframe');
    iframe.title = 'AI-assistent van a.s.r.';
    iframe.setAttribute('referrerpolicy', 'origin');
    // De chat in het iframe luistert pas na het laden van zijn eigen scripts. Daarom herhalen we de begroeting (de context) tot hij 'ready' meldt.
    iframe.addEventListener('load', veilig(function () {
      stuurContext();
      state.pingTimer = setInterval(veilig(function () {
        if (state.ready) clearInterval(state.pingTimer);
        else stuurContext();
      }), 300);
    }));
    state.readyTimer = setTimeout(function () {
      clearInterval(state.pingTimer);
      if (!state.ready) toonFallback('timeout');
    }, CFG.readyTimeoutMs);
    iframe.src = chatUrl(ctx);

    var laden = document.createElement('div');
    laden.className = 'asr-vwo-chat__laden';
    laden.setAttribute('role', 'status');
    laden.textContent = 'Even geduld alsjeblieft…';

    var fb = document.createElement('div');
    fb.className = 'asr-vwo-chat__fallback';
    fb.setAttribute('role', 'alert');
    var tekst = document.createElement('p');
    tekst.textContent = 'De chat is op dit moment niet beschikbaar. Probeer het later nog een keer of neem contact op met de klantenservice van a.s.r.';
    var link = document.createElement('a');
    link.textContent = 'Open de chat in een nieuw venster';
    link.target = '_blank';
    link.rel = 'noopener';
    link.href = chatUrl(ctx);
    var sluitKnop = document.createElement('button');
    sluitKnop.type = 'button';
    sluitKnop.className = 'asr-vwo-chat__sluit';
    sluitKnop.textContent = 'Sluiten';
    sluitKnop.addEventListener('click', veilig(function () { sluit(); }));
    fb.appendChild(tekst);
    fb.appendChild(link);
    fb.appendChild(sluitKnop);

    paneel.appendChild(iframe);
    paneel.appendChild(laden);
    paneel.appendChild(fb);
    document.body.appendChild(scrim);
    document.body.appendChild(paneel);
    state.scrim = scrim;
    state.paneel = paneel;
    state.iframe = iframe;
    state.fallbackLink = link;
  }
  function zetOpen(open) {
    state.open = open;
    if (state.paneel) state.paneel.setAttribute('data-open', open ? 'true' : 'false');
    if (state.scrim) state.scrim.setAttribute('data-open', open ? 'true' : 'false');
    if (state.tag) state.tag.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function toonFallback(reden) {
    if (!state.paneel || state.ready || state.paneel.getAttribute('data-fallback') === 'true') return;
    state.paneel.setAttribute('data-fallback', 'true');
    if (state.fallbackLink) state.fallbackLink.href = chatUrl(leesContext());
    track('asr_chat_fallback', { reden: reden }, true);
  }
  function openChat() {
    maakPaneel();
    zetOpen(true);
    if (state.ready) {
      stuurContext();
      naarChat('focus');
    }
  }
  function sluit() {
    if (!state.open) return;
    zetOpen(false);
    if (state.tag && state.tag.focus) state.tag.focus();
  }

  var opBericht = veilig(function (event) {
    if (event.origin !== CHAT_ORIGIN || !state.iframe || event.source !== state.iframe.contentWindow) return;
    var d = event.data;
    if (!d || d.bron !== 'asr-keuzehulp-chat') return;
    if (d.type === 'ready') {
      state.ready = true;
      clearTimeout(state.readyTimer);
      clearInterval(state.pingTimer);
      if (state.paneel) state.paneel.setAttribute('data-klaar', 'true');
      track('asr_chat_opened', {}, true);
      if (state.open) naarChat('focus');
    } else if (d.type === 'message') {
      track('asr_chat_first_message', { via: d.via }, true);
      if (d.via === 'getypt') track('asr_chat_first_question', {}, true);
    } else if (d.type === 'minimize' || d.type === 'close') {
      sluit();
    }
  });
  var opCsp = veilig(function (event) {
    var geblokkeerd = String(event.blockedURI || '');
    if (/frame|child|default/.test(String(event.effectiveDirective || '')) && geblokkeerd.indexOf(CHAT_ORIGIN) === 0) toonFallback('csp');
  });
  var opToets = veilig(function (event) {
    if (event.key === 'Escape' && state.open) sluit();
  });

  /* ------------------------------------------------------------------ DE TAG EN HET LABEL (variation) */
  /** De regels uit het stylesheet van de pagina (VWO Custom CSS) die bij de tag horen, of de ingebouwde kopie. */
  function tagCss() {
    var regels = [];
    try {
      Array.prototype.forEach.call(document.styleSheets, function (blad) {
        var lijst;
        try {
          lijst = blad.cssRules;
        } catch (e) {
          return; // stylesheet van een ander domein
        }
        Array.prototype.forEach.call(lijst || [], function (regel) {
          var tekst = regel.cssText || '';
          if (regel.type === 1 && /\.asr-vwo-hulp/.test(regel.selectorText || '')) regels.push(tekst);
          else if (regel.type === 4 && /\.asr-vwo-hulp/.test(tekst)) regels.push(tekst);
        });
      });
    } catch (e) {
      /* ingebouwde kopie */
    }
    return regels.length ? regels.join('\n') : TAG_CSS_FALLBACK;
  }
  function maakTag() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'asr-vwo-hulp-tag';
    b.setAttribute('data-asr-vwo', 'hulp-tag');
    b.setAttribute('aria-haspopup', 'dialog');
    b.setAttribute('aria-expanded', state.open ? 'true' : 'false');
    b.innerHTML = AI_ICOON + '<span></span>';
    b.lastChild.textContent = CFG.tagTekst;
    b.addEventListener('click', veilig(function (event) {
      // De tag staat in het label van de groep: een klik mag nooit een kaart kiezen of een link volgen.
      event.preventDefault();
      event.stopPropagation();
      if (nietDubbel('tag')) {
        var ctx = leesContext();
        track('asr_hulp_tag_click', { dekking: ctx.dekking, kaart: ctx.kaart });
        openChat();
      }
    }));
    return b;
  }
  /** Zet label en tag goed in deze groep. Veilig om vaker aan te roepen (herstelt wat de component opnieuw tekent). */
  function zetLabelEnTag(groep) {
    var root = groep.shadowRoot;
    var legend = root && root.querySelector('legend');
    if (!legend) return false;
    if (groep.getAttribute('label') !== CFG.labelNieuw) groep.setAttribute('label', CFG.labelNieuw);
    if (!root.querySelector('style[data-asr-vwo]')) {
      var stijl = document.createElement('style');
      stijl.setAttribute('data-asr-vwo', 'tag');
      stijl.textContent = tagCss();
      root.appendChild(stijl);
    }
    legend.classList.add('asr-vwo-hulp-legend');
    var bestaand = legend.querySelector('[data-asr-vwo="hulp-tag"]');
    if (bestaand) {
      state.tag = bestaand;
      return true;
    }
    var tag = maakTag();
    var sterretje = legend.querySelector('.label-required');
    if (sterretje && sterretje.parentNode === legend) legend.insertBefore(tag, sterretje.nextSibling);
    else legend.appendChild(tag);
    state.tag = tag;
    return true;
  }
  /** Bewaakt alleen deze ene shadow root, beperkt in aantal herstelacties (geen oneindige lus). */
  function bewaakSchaduw(groep) {
    if (state.schaduwObserver) state.schaduwObserver.disconnect();
    var wachtend = false;
    state.schaduwObserver = new MutationObserver(function () {
      if (wachtend || state.herstelTeller > 20) return;
      wachtend = true;
      Promise.resolve().then(function () {
        wachtend = false;
        var legend = groep.shadowRoot && groep.shadowRoot.querySelector('legend');
        if (groep.isConnected && legend && (!legend.querySelector('[data-asr-vwo="hulp-tag"]') || groep.getAttribute('label') !== CFG.labelNieuw)) {
          state.herstelTeller += 1;
          veilig(zetLabelEnTag)(groep);
        }
      });
    });
    state.schaduwObserver.observe(groep.shadowRoot, { childList: true, subtree: true });
  }

  /* ------------------------------------------------------------------ KLIKKEN OP KAARTEN EN "VERDER" (beide varianten) */
  function koppelKaarten(groep) {
    groep.addEventListener('click', veilig(function (event) {
      var pad = typeof event.composedPath === 'function' ? event.composedPath() : [];
      var kaart = null;
      var info = false;
      for (var i = 0; i < pad.length; i++) {
        var el = pad[i];
        if (!el || !el.tagName) continue;
        if (el.tagName === 'ASR-BUTTON' && el.getAttribute('slot') === 'action') info = true;
        if (el.tagName.toLowerCase() === KAART) {
          kaart = el;
          break;
        }
        if (el === groep) break;
      }
      if (!kaart) return;
      var titel = kaartTitel(kaart);
      if (!nietDubbel((info ? 'info:' : 'kaart:') + titel)) return;
      var waarde = kaart.value || kaart.getAttribute('value');
      track(info ? 'asr_card_info_click' : 'asr_card_click', { kaart: titel, dekking: DEKKING_VAN_WAARDE[waarde] || null });
      // Na een keuze weet de chat welke dekking er geselecteerd staat.
      if (!info && state.iframe && state.ready) setTimeout(veilig(stuurContext), 400);
    }), true);
  }
  var opVerder = veilig(function (event) {
    if (!state.groep || !state.groep.isConnected) return;
    var pad = typeof event.composedPath === 'function' ? event.composedPath() : [];
    for (var i = 0; i < pad.length; i++) {
      var el = pad[i];
      if (el && el.tagName === 'ASR-BUTTON' && /^\s*Verder naar/i.test(el.textContent || '')) {
        if (nietDubbel('verder')) {
          var ctx = leesContext();
          track('asr_funnel_next_click', { dekking: ctx.dekking, kaart: ctx.kaart });
        }
        return;
      }
    }
  });

  /* ------------------------------------------------------------------ DYNAMISCH LADEN (Angular zet stap 2 pas na stap 1 neer) */
  function verwerkGroep(groep) {
    if (groep.getAttribute('data-asr-vwo-verwerkt') === MODE) return;
    groep.setAttribute('data-asr-vwo-verwerkt', MODE);
    state.groep = groep;
    state.herstelTeller = 0;
    koppelKaarten(groep);
    if (MODE !== 'variation') return;
    // De component tekent zijn label asynchroon (Lit); wacht tot dat klaar is en pas dan aan, zodat het label niet terugspringt.
    Promise.resolve(groep.updateComplete)
      .then(function () {
        if (!groep.isConnected) return;
        if (zetLabelEnTag(groep)) bewaakSchaduw(groep);
      })
      .catch(function (e) { log('updateComplete', e); });
  }
  var check = veilig(function () {
    var groep = document.querySelector(GROEP);
    if (groep && groep !== state.groep) verwerkGroep(groep);
    else if (groep && groep.getAttribute('data-asr-vwo-verwerkt') !== MODE) verwerkGroep(groep);
  });

  function start() {
    document.addEventListener('click', opVerder, true);
    if (MODE === 'variation') {
      window.addEventListener('message', opBericht);
      document.addEventListener('securitypolicyviolation', opCsp);
      document.addEventListener('keydown', opToets);
    }
    var wachtend = false;
    state.observer = new MutationObserver(function () {
      if (wachtend) return;
      wachtend = true;
      Promise.resolve().then(function () {
        wachtend = false;
        check();
      });
    });
    state.observer.observe(document.body, { childList: true, subtree: true });
    check();
    log('gestart', MODE, 'chat:', CHAT_ORIGIN);
  }

  /** Voor tests en Preview: alles weer opruimen. */
  state.destroy = function () {
    try {
      if (state.observer) state.observer.disconnect();
      if (state.schaduwObserver) state.schaduwObserver.disconnect();
      document.removeEventListener('click', opVerder, true);
      window.removeEventListener('message', opBericht);
      document.removeEventListener('securitypolicyviolation', opCsp);
      document.removeEventListener('keydown', opToets);
      clearTimeout(state.readyTimer);
      clearInterval(state.pingTimer);
      [state.paneel, state.scrim].forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
      var groep = state.groep;
      if (groep) {
        groep.removeAttribute('data-asr-vwo-verwerkt');
        if (groep.shadowRoot) {
          Array.prototype.forEach.call(groep.shadowRoot.querySelectorAll('[data-asr-vwo]'), function (el) { el.remove(); });
          var kop = groep.shadowRoot.querySelector('legend');
          if (kop) kop.classList.remove('asr-vwo-hulp-legend');
        }
      }
    } catch (e) {
      log('destroy', e);
    }
    delete window[NS];
  };

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', veilig(start), { once: true });
})();
