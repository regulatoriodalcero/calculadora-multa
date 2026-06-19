# Calculadora de Simulação de Multa — Grupo Dal Cero

Ferramenta web (HTML único) para simular o enquadramento e o **valor estimado de multa** por não conformidade na fabricação de produtos para **alimentação animal**, com base legal em:

- **Decreto nº 12.031/2024** — classificação das infrações (arts. 100–106) e dosimetria (arts. 112–122).
- **Portaria MAPA nº 854/2025** — valores das multas (Anexo da Lei nº 14.515/2022, atualizado +4,87% INPC, vigência 2026).

## Recursos

- **Dois modos de entrada:**
  1. *Descrever a não conformidade* — texto livre; o sistema sugere o enquadramento (artigo + natureza) por análise de palavras-chave.
  2. *Já tenho um auto de infração* — selecionar artigo + inciso; a **natureza é identificada automaticamente**.
- Cálculo por **faixa legal (mín–máx)** conforme o **porte** do agente.
- **Atenuantes** (art. 113), **agravantes** (art. 114) e **reincidência específica** (art. 116, máximo +10% cumulativo).
- **Advertência** automática nos casos do art. 119.
- **Memória de cálculo** com a base legal citada.
- **Envio do resultado por e-mail** para o cliente (via Google Apps Script).
- **Planilha-compilado** (Google Sheets) registra toda simulação — aba `Respostas` (ordenável por empresa) e aba `Marketing (opt-in)` (quem aceitou marketing). Cópia interna por e-mail só para `regulatorio@`.
- Página inicial de **captura de dados com LGPD** (consentimento obrigatório + opt-in de marketing).

## Estrutura

```
index.html            → a aplicação (abra no navegador / GitHub Pages)
apps-script/Code.gs    → Web App do Google Apps Script que envia os e-mails
```

## Configuração do envio de e-mail

1. Implante `apps-script/Code.gs` como **App da Web** no Google Apps Script (instruções no topo do arquivo).
2. Copie a URL terminada em `/exec`.
3. No `index.html`, cole a URL na constante:

   ```js
   const APPS_SCRIPT_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT_EXEC";
   ```

Enquanto a URL não for configurada, a calculadora funciona normalmente e exibe um aviso de que o envio por e-mail ainda não está ativo.

## Aviso

Simulação de caráter **orientativo e não vinculante**. O valor definitivo da multa é fixado pela autoridade competente do MAPA no processo administrativo (art. 121 do Decreto 12.031/2024).

---

**Grupo Dal Cero** · Assessoria em Assuntos Regulatórios — MAPA / ANVISA
(49) 9971-0329 · [www.dalceroacademy.com](https://www.dalceroacademy.com)
