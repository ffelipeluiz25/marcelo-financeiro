# Chaveiro Marcelo — Controle de Ganhos

App para o chaveiro Marcelo lançar os ganhos do dia e acompanhar o total por mês e por ano.
É um único `www/index.html` (HTML + JS puro, mesmo layout do app de Controle de Ambulâncias) que roda no
navegador e também como **APK Android offline**, empacotado com [Capacitor](https://capacitorjs.com).

## Telas

| Tela | O que faz |
|---|---|
| Dashboard | Botão "Lançar ganho de hoje" + resumo: hoje, mês atual, média por dia trabalhado, ano |
| Lançamentos do Mês | Filtro de mês/ano (‹ ›, "Mês atual"), totais do mês e lista agrupada por dia com subtotal; editar/excluir |
| Relatório Anual | Filtro de ano, totais do ano, gráfico de barras com o total de cada mês e tabela do ano |
| Exportar / Importar | Backup JSON (importar substitui tudo) |
| Limpar Dados | Apaga todos os ganhos (exige digitar `CONFIRMAR`) |

No gráfico: passar o mouse (ou tocar) numa barra mostra total, dias trabalhados e média; clicar (ou tocar de
novo) abre aquele mês em Lançamentos. Clicar numa linha da tabela do ano faz o mesmo.

## Dados (localStorage)

| Chave | Conteúdo |
|---|---|
| `ch_gan_v1` | Array de ganhos |
| `ch_theme` | `"dark"` ou `"light"` |

```json
{ "id": "uid", "data": "2026-10-10", "valor": 15050, "desc": "Cópia de chave", "pag": "dinheiro|pix|cartao", "reg": "10/10/2026 14:30" }
```

`valor` é guardado em **centavos** (inteiro) para não ter erro de arredondamento. O campo de valor aceita
`150`, `150,50`, `1.234,56` ou `R$ 80`.

Export: `{ versao, sistema: "chaveiro-ganhos", exportado, ganhos }`. O import valida cada lançamento.

## Estrutura

| Caminho | O que é |
|---|---|
| `www/index.html` | O app inteiro (única fonte de código) |
| `www/vendor/` | Bootstrap e Bootstrap Icons copiados de `node_modules` (gerado, fora do git) |
| `android/` | Projeto Android gerado pelo Capacitor (appId `com.ffelipeluiz25.marcelofinanceiro`) |
| `assets/` | PNGs-fonte do ícone (chave) e splash, gerados por `scripts/icons.mjs` |

## Comandos

Ambiente (Node, JDK 21, Android SDK em `D:\DevTools`) é o mesmo do RepoAmbulancias.

```bash
npm install            # primeira vez, depois de clonar
npm run vendor         # copia as bibliotecas para www/vendor (necessário até para abrir no navegador)
npm run apk:release    # gera android/app/build/outputs/apk/release/app-release.apk (assinado)
npm run icons          # regenera ícone e splash
```

Antes de distribuir uma versão nova, aumentar `versionCode`/`versionName` em `android/app/build.gradle`.

## Assinatura (importante)

Keystore: `D:\DevTools\keystores\marcelo-financeiro-release.jks`. Senha em `android/keystore.properties`
(fora do git) e cópia em `D:\DevTools\keystores\marcelo-financeiro-release.properties`.

**Faça backup do `.jks` e da senha fora desta máquina.** Sem eles, uma versão nova não instala por cima da
antiga; desinstalar o app **apaga todos os dados** do aparelho. Use **Exportar** como backup regular.

No Android, o backup é salvo em `Documentos/ChaveiroMarcelo/Backups/` e pode ser compartilhado (WhatsApp, Drive…).

## Git

Repositório: `git@github.com:ffelipeluiz25/marcelo-financeiro.git`, com a conta ffelipeluiz25 aplicada só a
este diretório via `includeIf` no `~/.gitconfig` (inclui `~/.gitconfig-ffelipeluiz25`).
