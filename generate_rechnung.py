import os
import sys
import re
from datetime import datetime

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: playwright is not installed.")
    sys.exit(1)

script_dir = os.path.dirname(os.path.abspath(__file__))

# Output to Buchhaltung\Einnahmen\Rechnungen
output_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Buchhaltung", "Einnahmen", "Rechnungen"))
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

logo_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Logo"))
logo_base_uri = f"file:///{logo_dir.replace(chr(92), '/')}"

html_template = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Rechnung - AnonymCreator</title>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2D3748; font-size: 10.5pt; line-height: 1.4; margin: 0; padding: 0; position: relative; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 65%; z-index: -1; }
  h1, h2, h3, h4 { color: #1B365D; page-break-after: avoid; margin-top: 0; }
  .header-table { display: table; width: 100%; border-collapse: collapse; margin-bottom: 40px; }
  .header-table td { display: table-cell; vertical-align: top; }
  .company-info { width: 50%; }
  .document-info { width: 50%; text-align: right; }
  .header-logo { max-width: 130px; height: auto; margin-bottom: 15px; }
  .company-info-text { font-size: 10pt; color: #2D3748; line-height: 1.6; }
  .document-title { font-size: 32pt; font-weight: 800; letter-spacing: 4px; margin: 0 0 15px 0; color: #1B365D; text-transform: uppercase; }
  .meta-table { display: table; width: 100%; border-collapse: collapse; }
  .meta-table td { display: table-cell; text-align: right; padding: 3px 0; font-size: 10pt; }
  .meta-table td.label { font-weight: bold; padding-right: 15px; color: #1B365D; }
  .recipient-block { margin-top: 10px; margin-bottom: 45px; font-size: 11pt; line-height: 1.6; }
  .project-section { margin-bottom: 15px; }
  .project-title { font-size: 15pt; font-weight: bold; color: #1B365D; border-bottom: 2px solid #00D2FF; padding-bottom: 6px; margin-bottom: 0; }
  .pricing-matrix { display: table; width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .pricing-matrix th { background-color: #1B365D !important; color: #ffffff !important; text-transform: uppercase; letter-spacing: 1px; font-size: 8.5pt; padding: 8px 10px; white-space: nowrap; }
  .pricing-matrix td { padding: 8px 10px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  .pricing-matrix tr:nth-child(even) td { background-color: #F8FAFC !important; }
  .col-pos { width: 6%; text-align: center; }
  .col-desc { width: 54%; text-align: left; }
  .col-qty { width: 8%; text-align: center; }
  .col-unit { width: 16%; text-align: right; white-space: nowrap; }
  .col-total { width: 16%; text-align: right; white-space: nowrap; }
  .item-title { font-weight: bold; color: #1B365D; display: block; margin-bottom: 4px; font-size: 10pt; }
  .item-desc { font-size: 9pt; color: #4a5568; line-height: 1.4; }
  .clearfix::after { content: ""; display: table; clear: both; }
  .totals-table { display: table; width: 50%; float: right; border-collapse: collapse; margin-bottom: 35px; }
  .totals-table td { display: table-cell; padding: 8px 10px; text-align: right; }
  .totals-table .label { font-weight: bold; text-align: left; color: #1B365D; }
  .totals-table .total-row td { border-top: 2px solid #1B365D; font-weight: bold; font-size: 13pt; color: #1B365D; padding-top: 12px; }
  .legal-callout { border-left: 4px solid #00D2FF; background-color: #F8FAFC !important; padding: 16px; margin-bottom: 30px; font-size: 9.5pt; line-height: 1.5; clear: both; color: #2D3748; page-break-before: auto; }
  .legal-callout strong { color: #1B365D; }
  .bank-details { margin-top: 20px; padding: 15px; border: 1px solid #e2e8f0; background: #fff; font-size: 10pt; border-radius: 4px; }
  .bank-details strong { color: #1B365D; }
</style>
</head>
<body>

  <img src="[LOGO_BASE_URI]/4.jpg" class="watermark" alt="">

  <table class="header-table" style="margin-bottom: 15px;">
    <tr>
      <td class="company-info">
        <div class="company-info-text">
          <strong>AnonymCreator &ndash; Digitalstudio</strong><br>
          Cosmin-Cristian Văduva<br>
          Carl-Anton-Carlone-Straße 7, Tür 6<br>
          4052 Ansfelden, Österreich<br><br>
          Tel.: +43 664 500 0057<br>
          E-Mail: info@anonymcreator.online
        </div>
        
        <div class="recipient-block" style="margin-top: 20px; margin-bottom: 0;">
          <strong>[FIRMEN_NAME]</strong><br>
          z.H. [ANSPRECHPARTNER]<br>
          [STRASSE_HAUSNUMMER]<br>
          [PLZ_ORT]
        </div>
      </td>
      <td class="document-info">
        <div style="text-align: center; margin-top: -20px;">
          <img src="[LOGO_BASE_URI]/2.png" alt="AnonymCreator Logo" class="header-logo">
        </div>
        <h1 class="document-title">Rechnung</h1>
        <table class="meta-table">
          <tr><td class="label">Rechnungs-Nr.:</td><td>[RECHNUNGS_NUMMER]</td></tr>
          <tr><td class="label">Rechnungsdatum:</td><td>[DATUM]</td></tr>
          <tr><td class="label">Leistungsdatum:</td><td>[LEISTUNGS_DATUM]</td></tr>
          <tr><td class="label">GISA-Zahl:</td><td>39760272</td></tr>
        </table>
      </td>
    </tr>
  </table>

  <div class="project-section">
    <div class="project-title">Projekt: [PROJEKT_TITEL]</div>
  </div>

  <table class="pricing-matrix">
    <thead>
      <tr>
        <th class="col-pos">Pos.</th>
        <th class="col-desc">Leistungsbeschreibung</th>
        <th class="col-qty">Menge</th>
        <th class="col-unit">Einzel (&euro;)</th>
        <th class="col-total">Gesamt (&euro;)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="col-pos">1</td>
        <td class="col-desc">
          <span class="item-title">[ITEM_1_TITLE]</span>
          <span class="item-desc">[ITEM_1_DESC]</span>
        </td>
        <td class="col-qty">1</td>
        <td class="col-unit">[ITEM_1_PRICE]</td>
        <td class="col-total">[ITEM_1_PRICE]</td>
      </tr>
    </tbody>
  </table>

  <div class="clearfix">
    <table class="totals-table">
      <tr class="total-row">
        <td class="label">Rechnungsbetrag:</td>
        <td>[TOTAL_PRICE]</td>
      </tr>
    </table>
  </div>

  <div class="legal-callout">
    <strong>Zahlungsinformationen &amp; Steuerliche Hinweise:</strong><br><br>
    Bitte überweisen Sie den fälligen Betrag von <strong>[TOTAL_PRICE]</strong> ohne Abzug bis zum <strong>[FAELLIGKEITS_DATUM]</strong> auf das unten angegebene Konto, oder Bar begleichen.<br><br>
    <em>Umsatzsteuerfrei aufgrund der Kleinunternehmerregelung gem. § 6 Abs. 1 Z 27 UStG.</em>
  </div>

  <div class="bank-details">
    <strong>Bankverbindung für Überweisung:</strong><br>
    Kontoinhaber: COSMIN CRISTIAN VADUVA<br>
    IBAN: DE23 1001 1001 2919 1241 90<br>
    BIC: NTSBDEB1XXX<br>
    Bank: N26 Bank
  </div>

</body>
</html>
"""

def generate_pdf(client_data):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Buchhaltung", "Einnahmen", "Rechnungen"))
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    logo_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Logo"))
    logo_base_uri = f"file:///{logo_dir.replace(chr(92), '/')}"
    
    if "LOGO_BASE_URI" not in client_data:
        client_data["LOGO_BASE_URI"] = logo_base_uri
        
    rendered_html = html_template
    for placeholder, value in client_data.items():
        rendered_html = rendered_html.replace(f"[{placeholder}]", str(value))

    temp_html_path = os.path.abspath("temp_rechnung_blueprint.html")
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    if "OUTPUT_DIR" in client_data:
        output_dir = client_data["OUTPUT_DIR"]
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    safe_firma_name = client_data.get("FIRMEN_NAME", "Template")
    safe_firma_name = re.sub(r'[\\\\/*?:"<>|]', "", safe_firma_name)
    safe_firma_name = safe_firma_name.replace(" & ", "_").replace(" ", "_")

    if safe_firma_name == "Template":
        filename = "Rechnung_Template.pdf"
    else:
        date_str = client_data.get("FILE_DATE", datetime.today().strftime('%Y-%m-%d'))
        inv_num = client_data.get('RECHNUNGS_NUMMER', '')
        filename = f"Rechnung_{inv_num}_{safe_firma_name}_{date_str}.pdf"

    output_pdf_path = os.path.join(output_dir, filename)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(f"file:///{temp_html_path.replace(chr(92), '/')}", wait_until="networkidle")
        
        footer_html = '<div style="font-size: 7.5pt; font-family: Helvetica, Arial, sans-serif; color: #718096; width: 100%; padding: 10px 15mm 0 15mm; display: flex; justify-content: space-between; box-sizing: border-box; line-height: 1.4;"><div style="flex: 1;"><strong>AnonymCreator &ndash; Digitalstudio</strong><br>Cosmin-Cristian Văduva<br>GISA-Zahl: 39760272</div><div style="flex: 1;"><strong>Kontakt</strong><br>info@anonymcreator.online<br>www.anonymcreator.online</div><div style="flex: 1; text-align: right;"><strong>Bankverbindung</strong><br>N26 Bank (BIC: NTSBDEB1XXX)<br>IBAN: DE23 1001 1001 2919 1241 90</div></div>'
        
        page.pdf(
            path=output_pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "15mm", "bottom": "22mm", "left": "18mm", "right": "18mm"},
            display_header_footer=True,
            header_template="<div></div>",
            footer_template=footer_html
        )
        browser.close()

    if os.path.exists(temp_html_path):
        os.remove(temp_html_path)

    return output_pdf_path
