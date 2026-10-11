# Chaveiro Marcelo — Controle de Ganhos

App para o chaveiro Marcelo lançar os ganhos do dia e acompanhar o total por mês e por ano.
É um único `www/index.html` (HTML + JS puro, mesmo layout do app de Controle de Ambulâncias) que roda no
navegador e também como **APK Android offline**, empacotado com [Capacitor](https://capacitorjs.com).

## Como o salário é calculado

O valor digitado no serviço é a **mão de obra**. As peças/produtos vendidos (cadastrados em Peças e Materiais)
**somam** no total cobrado do cliente, mas ficam com o patrão — não entram no pagamento do funcionário.

```
SERVIÇO                                   SEU PAGAMENTO
mão de obra                               mão de obra
(+) peças vendidas (qt × valor)           (−) comissão do patrão (% configurado, padrão 50%)
(=) total cobrado do cliente              (=) você recebe
```

O salário do mês é a soma do "você recebe" de todos os serviços do **período de fechamento**:

- Dia de fechamento N (Configurações): o mês M vai do dia N+1 de M-1 até o dia N de M.
  Ex.: fechamento dia 25 → "Outubro" = 26/09 a 25/10. Se o mês não tem o dia N (ex.: 30 em fevereiro), fecha no último dia.
- "Último dia do mês" (padrão) = mês do calendário.

Cada serviço guarda o **histórico** das peças vendidas (nome, valor, quantidade) e o percentual de comissão do
momento do lançamento. Ao editar, as peças vendidas são carregadas e podem ser adicionadas/removidas. Mudar o preço de
uma peça ou a comissão depois **não altera** serviços já lançados. Mudar o dia de fechamento reagrupa todos os
serviços nos novos períodos.

## Telas

| Tela | O que faz |
|---|---|
| Dashboard | Botão "Lançar serviço de hoje" + resumo do que ele recebe: hoje, mês atual (período de fechamento), média por dia, ano |
| Lançamentos do Mês | Filtro de mês/ano, período de fechamento, demonstrativo do mês (total cobrado e salário = mão de obra − comissão) e lista por dia; editar/excluir |
| Relatório Anual | Filtro de ano, salário do ano, gráfico de barras do salário de cada mês e tabela do ano |
| Peças e Materiais | Cadastro de peças com valor (campo com máscara de 2 casas decimais) |
| Configurações | % da comissão do patrão sobre a mão de obra, dia de fechamento do mês e bloqueio por digital |
| Exportar / Importar | Backup JSON com serviços, peças e configuração (importar substitui tudo) |
| Limpar Dados | Apaga todos os serviços (mantém peças e configuração; exige digitar `CONFIRMAR`) |

Ao lançar um serviço: escolher a peça + quantidade e tocar em **+**; a prévia mostra na hora quanto ele recebe.

No gráfico: passar o mouse (ou tocar) numa barra mostra salário, serviços, peças, comissão e dias; clicar (ou tocar
de novo) abre aquele mês. Clicar numa linha da tabela do ano faz o mesmo.

## Bloqueio por digital (só no APK)

Em Configurações → "Bloquear o app com digital". Ligar e desligar pedem a digital, para ninguém além do dono mexer.

- Pede a digital ao abrir o app e ao voltar depois de **1 minuto** fora dele (o próprio prompt da digital, o
  seletor de arquivos e o compartilhar não contam).
- Aceita digital, rosto e o **PIN/padrão do celular** como alternativa, então o dono nunca fica trancado para fora.
- Se o celular ficar sem digital e sem bloqueio de tela, o app libera a entrada e desliga o bloqueio (não há como verificar).
- Plugin: `@capgo/capacitor-native-biometric`. O estado fica em `ch_bio`, só neste aparelho (não vai no backup).
- Protege a tela do app; os dados no aparelho não são criptografados.

## Dados (localStorage)

| Chave | Conteúdo |
|---|---|
| `ch_gan_v1` | Array de serviços |
| `ch_pec_v1` | Array de peças |
| `ch_cfg_v1` | `{ "comissao": 50, "corte": 0 }` (`corte` 0 = último dia do mês, 1..30) |
| `ch_theme` | `"dark"` ou `"light"` |
| `ch_bio` | `"1"` quando o bloqueio por digital está ligado (não exportado) |

`valor` = mão de obra.

```json
{ "id": "uid", "data": "2026-10-10", "valor": 15000, "desc": "Troca de fechadura", "pag": "dinheiro|pix|cartao",
  "pecas": [{ "id": "uid", "nome": "Cilindro", "valor": 2550, "qt": 2 }], "pct": 50, "reg": "10/10/2026 14:30" }
```

Valores são guardados em **centavos** (inteiro) para não ter erro de arredondamento. Os campos de valor usam máscara:
digita só números e o app preenche da direita (`1` → `0,01`, `150` → `1,50`, `15000` → `150,00`).

Export: `{ versao: 2, sistema: "chaveiro-ganhos", exportado, ganhos, pecas, config }`. O import aceita também o
formato antigo (só `ganhos`) e valida cada registro.

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
