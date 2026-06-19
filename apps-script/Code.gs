/**
 * ============================================================================
 *  CALCULADORA DE SIMULAÇÃO DE MULTA — Grupo Dal Cero
 *  Google Apps Script (Web App) que recebe o resultado da calculadora e
 *  envia por e-mail: (1) para o cliente e (2) cópia interna para a Dal Cero.
 * ============================================================================
 *  COMO IMPLANTAR:
 *  1. Acesse https://script.google.com  e crie um "Novo projeto".
 *  2. Apague o conteúdo padrão e cole TODO este arquivo.
 *  3. Salve (ícone de disquete).
 *  4. Implantar > Nova implantação > engrenagem > "App da Web".
 *       - Descrição: Calculadora de Multa
 *       - Executar como: Eu (sua conta)
 *       - Quem pode acessar: Qualquer pessoa
 *  5. Clique em "Implantar", autorize as permissões de e-mail.
 *  6. Copie a URL terminada em /exec.
 *  7. Cole essa URL na constante APPS_SCRIPT_URL do index.html.
 *  Obs.: a cada alteração no código, use "Gerenciar implantações" > editar >
 *        "Nova versão" para publicar a atualização.
 * ============================================================================
 */

// E-mails internos que recebem a cópia de cada simulação (separados por vírgula).
var COPIA_INTERNA = "comercial@dalceroconsultoria.com.br,regulatorio@dalceroconsultoria.com.br";
var REMETENTE_NOME = "Grupo Dal Cero";

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var emailCliente = (p.email || "").trim();

    // 1) E-mail para o cliente
    if (emailCliente) {
      MailApp.sendEmail({
        to: emailCliente,
        subject: "Sua simulação de multa — " + (p.natureza || "") + " | Grupo Dal Cero",
        htmlBody: emailCliente_(p),
        name: REMETENTE_NOME
      });
    }

    // 2) Cópia interna para a Dal Cero
    MailApp.sendEmail({
      to: COPIA_INTERNA,
      subject: "[Nova simulação de multa] " + (p.empresa || "—") + " — " + (p.valor_estimado || ""),
      htmlBody: emailInterno_(p),
      name: REMETENTE_NOME,
      replyTo: emailCliente || undefined
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Calculadora de Multa — Web App ativo.");
}

/* ---------------------- helpers ---------------------- */
function esc_(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function memoriaHtml_(m) {
  if (!m) return "";
  var linhas = String(m).split("\n").map(function (l) { return l.trim(); }).filter(String);
  return "<ol style='margin:0;padding-left:20px;color:#1f2937;font-size:13px;line-height:1.5'>" +
    linhas.map(function (l) { return "<li style='margin-bottom:6px'>" + esc_(l) + "</li>"; }).join("") +
    "</ol>";
}

/* ---------------------- e-mail do cliente ---------------------- */
function emailCliente_(p) {
  var advert = (p.advertencia === "sim")
    ? "<div style='background:#ecfdf5;border-left:4px solid #10b981;border-radius:8px;padding:12px 14px;margin:0 0 16px;color:#065f46;font-size:13px'><b>Penalidade indicada: Advertência (sem multa)</b> — infração leve, infrator primário e sem agravantes (art. 119). Os valores abaixo são referência caso a multa venha a ser aplicada.</div>"
    : "";

  return "" +
  "<div style='font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;border:1px solid #e5e9f0;border-radius:12px;overflow:hidden'>" +
    "<div style='background:#041F47;color:#fff;padding:20px 24px'>" +
      "<div style='font-size:18px;font-weight:800;letter-spacing:1px'>GRUPO DAL CERO</div>" +
      "<div style='font-size:12px;color:#4399FF;letter-spacing:2px;text-transform:uppercase'>Assessoria Regulatória — MAPA / ANVISA</div>" +
    "</div>" +
    "<div style='padding:24px'>" +
      "<p style='font-size:15px;color:#1f2937;margin:0 0 14px'>Olá, " + esc_(p.nome || "") + "!</p>" +
      "<p style='font-size:14px;color:#1f2937;margin:0 0 18px'>Segue o resultado da sua <b>simulação de multa</b> para alimentação animal, com base no Decreto nº 12.031/2024 e na Portaria MAPA nº 854/2025.</p>" +
      advert +
      "<div style='background:linear-gradient(135deg,#041F47,#0043D8);color:#fff;border-radius:12px;padding:22px;text-align:center;margin:0 0 18px'>" +
        "<div style='font-size:11px;text-transform:uppercase;letter-spacing:1.5px;opacity:.85'>Valor estimado da multa</div>" +
        "<div style='font-size:34px;font-weight:900;margin:6px 0 2px'>" + esc_(p.valor_estimado || "") + "</div>" +
        "<div style='font-size:12px;opacity:.85'>Natureza: " + esc_(p.natureza || "") + " — " + esc_(p.base_valor || "") + "</div>" +
      "</div>" +
      "<table style='width:100%;border-collapse:collapse;margin:0 0 18px;font-size:13px'>" +
        "<tr><td style='padding:8px 10px;border:1px solid #e5e9f0;background:#f7f9fc;font-weight:700;color:#041F47'>Enquadramento</td><td style='padding:8px 10px;border:1px solid #e5e9f0'>" + esc_(p.enquadramento || "—") + "</td></tr>" +
        "<tr><td style='padding:8px 10px;border:1px solid #e5e9f0;background:#f7f9fc;font-weight:700;color:#041F47'>Porte do agente</td><td style='padding:8px 10px;border:1px solid #e5e9f0'>" + esc_(p.porte || "") + "</td></tr>" +
        "<tr><td style='padding:8px 10px;border:1px solid #e5e9f0;background:#f7f9fc;font-weight:700;color:#041F47'>Faixa legal</td><td style='padding:8px 10px;border:1px solid #e5e9f0'>" + esc_(p.faixa_min || "") + " a " + esc_(p.faixa_max || "") + "</td></tr>" +
      "</table>" +
      "<h3 style='font-size:14px;color:#003B91;margin:0 0 8px'>Memória de cálculo</h3>" +
      memoriaHtml_(p.memoria) +
      "<div style='background:#fff7ed;border-left:4px solid #E8B461;border-radius:8px;padding:12px 14px;margin:18px 0 0;font-size:12px;color:#041F47'>" +
        "<b>Simulação orientativa — não vinculante.</b> Os valores mín./máx. são os da Portaria 854/2025. O valor estimado é uma projeção do Grupo Dal Cero dentro da faixa legal (a norma não fixa percentual por atenuante/agravante — art. 115). Somente a autoridade competente do MAPA fixa o valor definitivo no processo administrativo (art. 121)." +
      "</div>" +
      "<div style='text-align:center;margin:22px 0 6px'>" +
        "<a href='https://www.dalceroacademy.com' style='display:inline-block;background:#0043D8;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:8px'>Falar com a Dal Cero</a>" +
      "</div>" +
      "<p style='text-align:center;font-size:12px;color:#6b7280;margin:10px 0 0'>(49) 9971-0329 · <a href='https://www.dalceroacademy.com' style='color:#0043D8'>www.dalceroacademy.com</a></p>" +
    "</div>" +
  "</div>";
}

/* ---------------------- cópia interna ---------------------- */
function emailInterno_(p) {
  function linha(rot, val) {
    return "<tr><td style='padding:7px 10px;border:1px solid #e5e9f0;background:#f7f9fc;font-weight:700;color:#041F47;width:200px'>" + esc_(rot) + "</td><td style='padding:7px 10px;border:1px solid #e5e9f0'>" + esc_(val || "—") + "</td></tr>";
  }
  return "" +
  "<div style='font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto'>" +
    "<h2 style='color:#003B91;font-size:18px'>Nova simulação de multa</h2>" +
    "<h3 style='color:#041F47;font-size:14px;margin:14px 0 6px'>Lead</h3>" +
    "<table style='width:100%;border-collapse:collapse;font-size:13px'>" +
      linha("Nome", p.nome) + linha("Empresa", p.empresa) + linha("E-mail", p.email) +
      linha("Registro MAPA", p.registro) + linha("Data/hora", p.data) +
      linha("Consentimento LGPD", p.consentimento) + linha("Aceita marketing/comercial", p.optin_marketing) +
    "</table>" +
    "<h3 style='color:#041F47;font-size:14px;margin:16px 0 6px'>Resultado</h3>" +
    "<table style='width:100%;border-collapse:collapse;font-size:13px'>" +
      linha("Natureza", p.natureza) + linha("Enquadramento", p.enquadramento) + linha("Porte", p.porte) +
      linha("Faixa legal", (p.faixa_min || "") + " a " + (p.faixa_max || "")) +
      linha("Valor estimado", p.valor_estimado) + linha("Base do valor", p.base_valor) +
      linha("Atenuantes", p.atenuantes) + linha("Agravantes", p.agravantes) +
      linha("Reincidência específica", p.reincidencia_especifica) + linha("Advertência", p.advertencia) +
    "</table>" +
    "<h3 style='color:#041F47;font-size:14px;margin:16px 0 6px'>Memória de cálculo</h3>" +
    memoriaHtml_(p.memoria) +
  "</div>";
}
