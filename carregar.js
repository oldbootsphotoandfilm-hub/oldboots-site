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

  function iniciar() {
    var caixas = Array.prototype.slice.call(document.querySelectorAll('[data-ob]:not([data-ob-feito])'));
    Promise.all(caixas.map(carregar)).then(pronto, pronto);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
