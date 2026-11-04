# Old Boots · páginas do site

Código das páginas especiais do site (carregado pelo WordPress a partir daqui, através do GitHub Pages).

| Ficheiro | Página no WordPress |
|---|---|
| `paginas/bastidores.html` | /bastidores/ |
| `paginas/propostas.html` | /propostas/ (editor) |
| `paginas/proposta-pt.html` | /proposta/ (cliente, PT) |
| `paginas/proposal-en.html` | /proposal/ (cliente, EN) |
| `paginas/sessao.html` | landing pages das sessões esporádicas (ex.: /natal/): estilo + formulário de marcação |
| `paginas/natal.html` | página da sessão de Natal (carta animada, convite, elementos, cenários, informações, reservas por WhatsApp): `<div data-ob="natal" data-sessao="CÓDIGO"></div>` |
| `imagens/` | imagens novas usadas pelas páginas |

Em cada página, o widget HTML do Elementor só tem uma linha:

```html
<div data-ob="bastidores"></div><script src="https://oldbootsphotoandfilm-hub.github.io/oldboots-site/carregar.js"></script>
```

As alterações aparecem no site 1 a 3 minutos depois de chegarem aqui. Não há senhas nem dados de clientes neste repositório: o acesso aos dados é controlado no servidor (login Google + aba Acessos).
