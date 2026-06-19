/**
 * ============================================================================
 *  CALCULADORA DE SIMULAÇÃO DE MULTA — Dal Cero Consultoria
 *  Google Apps Script (Web App): recebe o resultado da calculadora e envia
 *  por e-mail (1) para o cliente e (2) cópia interna para a Dal Cero.
 *  Layout do e-mail do cliente espelha o da Calculadora de Risco.
 * ============================================================================
 *  COMO IMPLANTAR / ATUALIZAR:
 *  1. https://script.google.com → abra o projeto (ou Novo projeto).
 *  2. Cole TODO este arquivo, salve.
 *  3. 1ª vez: Implantar > Nova implantação > App da Web
 *       - Executar como: Eu   |   Quem pode acessar: Qualquer pessoa
 *     Atualização: Gerenciar implantações > (editar, ícone lápis) >
 *       Versão: Nova versão > Implantar. A URL /exec NÃO muda.
 *  4. Autorize as permissões de e-mail quando solicitado.
 * ============================================================================
 */

// E-mails internos que recebem a cópia de cada simulação (separados por vírgula).
var COPIA_INTERNA = "comercial@dalceroconsultoria.com.br,regulatorio@dalceroconsultoria.com.br";
var REMETENTE_NOME = "Dal Cero Consultoria";

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var emailCliente = (p.email || "").trim();

    if (emailCliente) {
      MailApp.sendEmail({
        to: emailCliente,
        subject: "Sua simulação de multa — " + (p.natureza || "") + " | Dal Cero Consultoria",
        htmlBody: emailCliente_(p),
        name: REMETENTE_NOME
      });
    }

    MailApp.sendEmail({
      to: COPIA_INTERNA,
      subject: "[Nova simulação de multa] " + (p.empresa || "—") + " — " + (p.valor_estimado || ""),
      htmlBody: emailInterno_(p),
      name: REMETENTE_NOME,
      replyTo: emailCliente || undefined
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Calculadora de Multa — Web App ativo.");
}

/* ---------------------- helpers ---------------------- */
function esc_(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function dataFmt_(iso) {
  try {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return esc_(iso);
    return Utilities.formatDate(d, Session.getScriptTimeZone(), "dd/MM/yyyy 'às' HH:mm");
  } catch (e) { return esc_(iso); }
}
function memoriaHtml_(m) {
  if (!m) return "";
  var linhas = String(m).split("\n").map(function (l) { return l.trim(); }).filter(String);
  return "<ol style='margin:0;padding-left:20px;color:#041F47;font-size:13px;line-height:1.55'>" +
    linhas.map(function (l) { return "<li style='margin-bottom:7px'>" + esc_(l) + "</li>"; }).join("") +
    "</ol>";
}
function secaoLabel_(txt) {
  return "<div style='border-top:1px solid #d8dce3;margin:26px 0 14px'></div>" +
    "<div style='color:#E8B461;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:12px'>" + esc_(txt) + "</div>";
}
function contatos_() {
  function card(label, val, href) {
    var inner = href
      ? "<a href='" + href + "' style='color:#ffffff;text-decoration:none;font-weight:700;font-size:13px'>" + esc_(val) + "</a>"
      : "<span style='color:#ffffff;font-weight:700;font-size:13px'>" + esc_(val) + "</span>";
    return "<td style='width:50%;padding:5px;vertical-align:top'>" +
      "<div style='background:rgba(255,255,255,0.10);border-radius:8px;padding:11px 13px'>" +
      "<div style='color:#E8B461;font-size:10px;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;margin-bottom:4px'>" + esc_(label) + "</div>" +
      inner + "</div></td>";
  }
  return "<table role='presentation' style='width:100%;border-collapse:collapse'>" +
    "<tr>" + card("Camila · Comercial", "(49) 99199-3297", "https://wa.me/5549991993297") +
             card("Eduardo · Comercial", "(49) 99971-0329", "https://wa.me/5549999710329") + "</tr>" +
    "<tr>" + card("E-mail Comercial", "comercial@dalceroconsultoria.com.br", "mailto:comercial@dalceroconsultoria.com.br") +
             card("Site", "dalceroacademy.com", "https://dalceroacademy.com") + "</tr>" +
    "<tr>" + card("LinkedIn", "/grupo-dal-cero", "https://www.linkedin.com/company/grupo-dal-cero/") +
             card("Instagram", "@grupodalcero", "https://www.instagram.com/grupodalcero/") + "</tr>" +
    "</table>";
}

/* ---------------------- e-mail do cliente (espelha a Calculadora de Risco) ---------------------- */
function emailCliente_(p) {
  var registro = (p.registro && String(p.registro).trim()) ? esc_(p.registro) : "(não informado)";
  var advert = (p.advertencia === "sim")
    ? "<div style='background:#ecfdf5;border:1px solid #a7f3d0;border-left:4px solid #10b981;border-radius:10px;padding:14px 16px;margin:16px 0 0;color:#065f46;font-size:13px;line-height:1.5'><b>Penalidade indicada: Advertência (sem multa).</b> Infração leve, infrator primário e sem agravantes (art. 119). Os valores acima são referência caso a multa venha a ser aplicada.</div>"
    : "";

  return "" +
  "<div style='margin:0;padding:0;background:#f4f5f7'>" +
  "<div style='font-family:Inter,Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff'>" +

    "<div style='background:#000000;padding:20px 28px'>" +
      "<div style='color:#eaeaea;font-weight:800;font-size:18px;letter-spacing:0.04em'>DAL CERO CONSULTORIA</div>" +
      "<div style='color:#eaeaea;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.7;margin-top:3px'>Regulatório · MAPA</div>" +
    "</div>" +

    "<div style='background-color:#041F47;background-image:linear-gradient(135deg,#041F47 0%,#003B91 60%,#0043D8 100%);color:#ffffff;padding:34px 28px'>" +
      "<div style='display:inline-block;padding:6px 14px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:999px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E8B461;font-weight:700;margin-bottom:16px'>Sua simulação de multa</div>" +
      "<div style='font-size:22px;font-weight:800;margin-bottom:10px'>Olá " + esc_(p.nome || "") + ",</div>" +
      "<div style='font-size:14px;color:rgba(255,255,255,0.88);line-height:1.55'>Obrigado por usar nossa Calculadora de Simulação de Multa. Abaixo segue o resultado, com base no Decreto nº 12.031/2024 e na Portaria MAPA nº 854/2025 (valores vigentes em 2026).</div>" +
    "</div>" +

    "<div style='padding:8px 28px 28px'>" +

      secaoLabel_("Estabelecimento avaliado") +
      "<div style='font-size:16px;font-weight:700;color:#041F47'>" + esc_(p.empresa || "") + "</div>" +
      "<div style='font-size:13px;color:#5b6478;margin-top:3px'>CNPJ / Registro MAPA: " + registro + "</div>" +
      "<div style='font-size:13px;color:#5b6478;margin-top:2px'>Simulado em " + dataFmt_(p.data) + "</div>" +

      secaoLabel_("Valor estimado da multa") +
      "<div style='background-color:#0043D8;background-image:linear-gradient(135deg,#003B91,#0043D8);border-radius:12px;padding:24px;text-align:center;color:#ffffff'>" +
        "<div style='font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.85'>Valor estimado</div>" +
        "<div style='font-size:36px;font-weight:900;margin:6px 0 12px'>" + esc_(p.valor_estimado || "") + "</div>" +
        "<div style='display:inline-block;background:#E8B461;color:#041F47;font-weight:700;font-size:12px;padding:6px 16px;border-radius:999px'>Natureza " + esc_(p.natureza || "") + "</div>" +
        "<div style='font-size:12px;opacity:0.85;margin-top:12px'>" + esc_(p.base_valor || "") + "</div>" +
      "</div>" +
      advert +

      secaoLabel_("Faixa legal da multa") +
      "<div style='background:#041F47;border-radius:12px;padding:18px 24px;text-align:center;color:#ffffff'>" +
        "<div style='font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.8;margin-bottom:6px'>Mínimo e máximo · Portaria 854/2025</div>" +
        "<div style='font-size:19px;font-weight:800'>" + esc_(p.faixa_min || "") + " &nbsp;—&nbsp; " + esc_(p.faixa_max || "") + "</div>" +
      "</div>" +

      secaoLabel_("Enquadramento") +
      "<table role='presentation' style='width:100%;border-collapse:collapse;font-size:13px'>" +
        "<tr><td style='padding:8px 10px;border:1px solid #d8dce3;background:#f4f5f7;font-weight:700;color:#041F47;width:38%'>Infração</td><td style='padding:8px 10px;border:1px solid #d8dce3;color:#041F47'>" + esc_(p.enquadramento || "—") + "</td></tr>" +
        "<tr><td style='padding:8px 10px;border:1px solid #d8dce3;background:#f4f5f7;font-weight:700;color:#041F47'>Porte do agente</td><td style='padding:8px 10px;border:1px solid #d8dce3;color:#041F47'>" + esc_(p.porte || "") + "</td></tr>" +
        "<tr><td style='padding:8px 10px;border:1px solid #d8dce3;background:#f4f5f7;font-weight:700;color:#041F47'>Atenuantes</td><td style='padding:8px 10px;border:1px solid #d8dce3;color:#041F47'>" + esc_(p.atenuantes || "nenhuma") + "</td></tr>" +
        "<tr><td style='padding:8px 10px;border:1px solid #d8dce3;background:#f4f5f7;font-weight:700;color:#041F47'>Agravantes</td><td style='padding:8px 10px;border:1px solid #d8dce3;color:#041F47'>" + esc_(p.agravantes || "nenhuma") + "</td></tr>" +
      "</table>" +

      secaoLabel_("Memória de cálculo") +
      memoriaHtml_(p.memoria) +

      "<div style='background:#eef4ff;border-left:4px solid #4399FF;border-radius:8px;padding:13px 15px;margin:22px 0 0;font-size:12px;color:#041F47;line-height:1.5'><b>Importante:</b> esta é uma simulação orientativa, com base no Decreto nº 12.031/2024 e na Portaria MAPA nº 854/2025. A legislação não fixa percentual por atenuante/agravante (art. 115). O valor definitivo é fixado pela autoridade competente do MAPA no processo administrativo (art. 121).</div>" +

    "</div>" +

    "<div style='background-color:#041F47;background-image:linear-gradient(135deg,#041F47,#003B91);color:#ffffff;padding:28px'>" +
      "<div style='display:inline-block;padding:6px 14px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);border-radius:999px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E8B461;font-weight:700;margin-bottom:14px'>Dal Cero Consultoria</div>" +
      "<div style='font-size:18px;font-weight:800;margin-bottom:8px'>Recebeu um auto de infração? Nós temos a solução.</div>" +
      "<div style='font-size:13px;color:rgba(255,255,255,0.85);line-height:1.55;margin-bottom:18px'>A Dal Cero Consultoria é especialista em regulatório MAPA para o setor de alimentação animal — defesa administrativa, dosimetria de penalidades, adequação às Boas Práticas de Fabricação e autocontroles. Fale com nosso comercial e construa um plano personalizado.</div>" +
      contatos_() +
    "</div>" +

    "<div style='background:#000000;color:#eaeaea;text-align:center;padding:20px 28px'>" +
      "<div style='font-weight:800;font-size:14px;letter-spacing:0.04em'>DAL CERO CONSULTORIA</div>" +
      "<div style='font-size:11px;color:#9aa3b2;margin-top:6px'>Rua Prefeito Albino Cerutti Cella, 322, Sala 06 · Centro · Maravilha — SC</div>" +
    "</div>" +
    "<div style='text-align:center;padding:14px 28px;font-size:11px;color:#9aa3b2;background:#f4f5f7'>Você está recebendo este e-mail porque solicitou uma simulação de multa na Calculadora da Dal Cero Consultoria.</div>" +

  "</div></div>";
}

/* ---------------------- cópia interna ---------------------- */
function emailInterno_(p) {
  function linha(rot, val) {
    return "<tr><td style='padding:7px 10px;border:1px solid #d8dce3;background:#f4f5f7;font-weight:700;color:#041F47;width:210px'>" + esc_(rot) + "</td><td style='padding:7px 10px;border:1px solid #d8dce3'>" + esc_(val || "—") + "</td></tr>";
  }
  return "" +
  "<div style='font-family:Inter,Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto'>" +
    "<h2 style='color:#003B91;font-size:18px'>Nova simulação de multa</h2>" +
    "<h3 style='color:#041F47;font-size:14px;margin:14px 0 6px'>Lead</h3>" +
    "<table style='width:100%;border-collapse:collapse;font-size:13px'>" +
      linha("Nome", p.nome) + linha("Empresa", p.empresa) + linha("E-mail", p.email) +
      linha("Registro MAPA", p.registro) + linha("Data/hora", dataFmt_(p.data)) +
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
