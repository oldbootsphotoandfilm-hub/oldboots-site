/* Old Boots · carrega no WordPress as páginas guardadas neste repositório.
   No widget HTML do Elementor basta:
     <div data-ob="bastidores"></div><script src="https://oldbootsphotoandfilm-hub.github.io/oldboots-site/carregar.js"></script>
*/
(function () {
  'use strict';
  var BASE = 'https://oldbootsphotoandfilm-hub.github.io/oldboots-site/';
  var RESERVA = 'https://cdn.jsdelivr.net/gh/oldbootsphotoandfilm-hub/oldboots-site@main/';
  var NOMES = /^[a-z0-9-]{1,40}$/;

  function buscar(nome) {
    var v = Math.floor(Date.now() / 120000); // muda a cada 2 minutos: as alterações aparecem depressa
    var caminho = 'paginas/' + nome + '.html';
    return fetch(BASE + caminho + '?v=' + v, { cache: 'no-cache', credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .catch(function () { // se o GitHub Pages falhar, tenta a cópia do jsDelivr
        return fetch(RESERVA + caminho, { credentials: 'omit' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); });
      });
  }

  // os <script> metidos com innerHTML não correm: recria-os pela ordem, à espera dos externos
  function correr(caixa) {
    var lista = Array.prototype.slice.call(caixa.querySelectorAll('script'));
    return lista.reduce(function (p, velho) {
      return p.then(function () {
        return new Promise(function (ok) {
          var s = document.createElement('script');
          Array.prototype.forEach.call(velho.attributes, function (a) { s.setAttribute(a.name, a.value); });
          if (velho.src) { s.onload = s.onerror = function () { ok(); }; }
          else s.text = velho.text;
          velho.parentNode.replaceChild(s, velho);
          if (!velho.src) ok();
        });
      });
    }, Promise.resolve());
  }

  function pronto() { if (document.body) document.body.classList.add('ob-ok'); }

  function carregar(caixa) {
    var nome = caixa.getAttribute('data-ob');
    // sessões de Natal: o widget antigo (data-ob="sessao" data-sessao="natal-…") passa a mostrar a página nova, sem mexer no Elementor
    if (nome === 'sessao' && /^natal/.test(caixa.getAttribute('data-sessao') || '')) {
      nome = 'natal'; caixa.setAttribute('data-ob', 'natal');
      var st = document.createElement('style');
      st.textContent = '.elementor-section[class*="ob-ln"]:not([class*="ob-ln-cfg"]){display:none!important}';
      document.head.appendChild(st);
    }
    caixa.setAttribute('data-ob-feito', '1');
    if (!NOMES.test(nome || '')) return Promise.resolve();
    return buscar(nome).then(function (html) {
      caixa.innerHTML = html;
      return correr(caixa);
    }).catch(function (e) {
      caixa.innerHTML = '<p style="font:16px/1.5 sans-serif;text-align:center;padding:40px 16px">Não foi possível carregar esta página. Recarregue dentro de momentos.</p>';
      if (window.console) console.error('Old Boots:', e);
    });
  }

  // páginas de ecrã inteiro (página do casal): tapa logo o WordPress com a cor do ecrã de abertura,
  // para não aparecer primeiro a página branca com o título enquanto a página verdadeira carrega
  var CAPAS = { questionario: '#454205' };
  function capa() {
    var cx = document.querySelector('[data-ob]'), nome = cx && cx.getAttribute('data-ob');
    var cor = CAPAS[nome] || (/\/pagina-do-casal\/?$/.test(location.pathname) ? CAPAS.questionario : '');
    if (!cor || document.getElementById('obCapa')) return null;
    var st = document.createElement('style'); st.id = 'obCapaSt';
    st.textContent = 'html,body{background:' + cor + '!important}#obCapa{position:fixed;inset:0;z-index:99998;background:' + cor + ' url(https://oldbootsphotoandfilm.com/wp-content/uploads/2026/10/ob-textura-oliva.jpg) center/cover;transition:opacity .4s}';
    (document.head || document.documentElement).appendChild(st);
    var d = document.createElement('div'); d.id = 'obCapa'; d.setAttribute('aria-hidden', 'true');
    (document.body || document.documentElement).appendChild(d);
    return d;
  }
  var CAPA = null; try { CAPA = capa(); } catch (e) { }
  function tiraCapa() { if (!CAPA) return; var d = CAPA; CAPA = null; setTimeout(function () { d.style.opacity = '0'; setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 450); }, 400); }

  function iniciar() {
    var caixas = Array.prototype.slice.call(document.querySelectorAll('[data-ob]:not([data-ob-feito])'));
    Promise.all(caixas.map(carregar)).then(function () { pronto(); tiraCapa(); }, function () { pronto(); tiraCapa(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
