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

# Output to Vertraege folder
output_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Buchhaltung", "Einnahmen", "Vertraege"))
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

logo_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Logo"))
logo_base_uri = f"file:///{logo_dir.replace(chr(92), '/')}"

html_template = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Wartungsvertrag - AnonymCreator</title>
<style>
  body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2D3748; font-size: 9.5pt; line-height: 1.4; margin: 0; padding: 0; position: relative; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 65%; z-index: -1; }
  h1, h2, h3, h4 { color: #1B365D; page-break-after: avoid; margin-top: 0; }
  .header-table { display: table; width: 100%; border-collapse: collapse; margin-bottom: 15px; }
  .header-table td { display: table-cell; vertical-align: top; }
  .company-info { width: 50%; }
  .document-info { width: 50%; text-align: right; }
  .header-logo { max-width: 130px; height: auto; margin-bottom: 15px; }
  .document-title { font-size: 26pt; font-weight: 800; letter-spacing: 2px; margin: 0 0 10px 0; color: #1B365D; text-transform: uppercase; }
  
  .contract-parties { margin-bottom: 15px; padding: 15px; background-color: #F8FAFC; border-left: 4px solid #1B365D; }
  .contract-parties h3 { margin-bottom: 10px; font-size: 11pt; }
  .party-table { width: 100%; display: table; }
  .party-col { display: table-cell; width: 50%; vertical-align: top; }
  
  .section { margin-bottom: 8px; }
  .section-title { font-size: 11pt; font-weight: bold; color: #1B365D; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 6px; }
  .section-content { font-size: 9.5pt; text-align: justify; }
  ul { margin-top: 4px; margin-bottom: 6px; padding-left: 20px; }
  li { margin-bottom: 3px; }
  
  .signature-table { display: table; width: 100%; border-collapse: collapse; margin-top: 15px; page-break-inside: avoid; }
  .signature-table td { display: table-cell; width: 50%; vertical-align: bottom; }
  .signature-container { width: 85%; }
  .signature-container.right { margin-left: auto; }
  .signature-img-wrapper { height: 70px; position: relative; }
  .signature-img { height: 90px; width: auto; position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); }
  .signature-line { border-top: 1px solid #1B365D; padding-top: 8px; text-align: center; font-size: 10pt; color: #1B365D; line-height: 1.4; }
</style>
</head>
<body>

  <img src="[LOGO_BASE_URI]/4.jpg" class="watermark" alt="">

  <table class="header-table">
    <tr>
      <td class="company-info">
        <h1 class="document-title">Wartungsvertrag</h1>
        <div style="font-size: 11pt; color: #4a5568;">Website-Betreuung &amp; Support-Flatrate</div>
      </td>
      <td class="document-info">
        <img src="[LOGO_BASE_URI]/2.png" alt="AnonymCreator Logo" class="header-logo">
      </td>
    </tr>
  </table>

  <div class="contract-parties">
    <div class="party-table">
      <div class="party-col">
        <h3>Auftragnehmer</h3>
        <strong>AnonymCreator &ndash; Digitalstudio</strong><br>
        Cosmin-Cristian Văduva<br>
        Carl-Anton-Carlone-Straße 7, Tür 6<br>
        4052 Ansfelden, Österreich
      </div>
      <div class="party-col">
        <h3>Auftraggeber</h3>
        <strong>[FIRMEN_NAME]</strong><br>
        [ANSPRECHPARTNER]<br>
        [STRASSE_HAUSNUMMER]<br>
        [PLZ_ORT]
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">&sect; 1 Vertragsgegenstand</div>
    <div class="section-content">
      Gegenstand dieses Vertrages ist die technische Instandhaltung, das Cloud-Hosting sowie die unbegrenzte Support-Betreuung der Webseite des Auftraggebers durch den Auftragnehmer.
    </div>
  </div>

  <div class="section">
    <div class="section-title">&sect; 2 Leistungsumfang</div>
    <div class="section-content">
      Der Auftragnehmer erbringt folgende Leistungen im Rahmen einer Pauschale:
      <ul>
        <li>Bereitstellung von ultraschnellem Cloud-Hosting inkl. SSL-Verschlüsselung.</li>
        <li>Regelmäßige Sicherheits-Updates, Backups und Überwachung der Systemstabilität.</li>
        <li><strong>Unbegrenzter technischer Support &amp; inhaltliche Anpassungen inklusive</strong>.</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">&sect; 3 Vergütung &amp; Zahlungsbedingungen</div>
    <div class="section-content">
      Die Pauschale für die genannten Leistungen beträgt <strong>[PREIS] [ZAHLUNGSINTERVALL]</strong>.<br><br>
      <em>Umsatzsteuerfrei aufgrund der Kleinunternehmerregelung gem. § 6 Abs. 1 Z 27 UStG.</em><br>
      [ZAHLUNG_TEXT] Eine entsprechende Rechnung wird dem Auftraggeber zur Verfügung gestellt.
    </div>
  </div>

  <div class="section">
    <div class="section-title">&sect; 4 Laufzeit und Kündigung</div>
    <div class="section-content">
      Der Vertrag beginnt am <strong>[START_DATUM]</strong> und läuft [LAUFZEIT_TEXT].<br><br>
      Wird der Vertrag nicht rechtzeitig gekündigt, verlängert er sich automatisch [VERLAENGERUNG_TEXT]. 
      Die Kündigungsfrist beträgt <strong>[KUENDIGUNGSFRIST]</strong> vor Ablauf der jeweiligen Vertragslaufzeit. Die Kündigung bedarf der Schriftform (z.B. per E-Mail).
    </div>
  </div>

  <div class="section">
    <div class="section-title">&sect; 5 Haftung &amp; Schlussbestimmungen</div>
    <div class="section-content">
      Der Auftragnehmer haftet nicht für Ausfälle oder Datenverluste, die durch höhere Gewalt, Hackerangriffe oder Drittanbieter (z.B. Server-Provider) verursacht werden, sofern kein grob fahrlässiges Verschulden vorliegt.<br><br>
      Es gilt österreichisches Recht. Als Gerichtsstand für alle Streitigkeiten aus diesem Vertrag wird das sachlich zuständige Gericht am Sitz des Auftragnehmers vereinbart.
    </div>
  </div>

  <table class="signature-table">
    <tr>
      <td>
        <div class="signature-container">
          <div class="signature-img-wrapper">
            <img src="[LOGO_BASE_URI]/unterschrift.png" class="signature-img" alt="Unterschrift">
          </div>
          <div class="signature-line">
            <strong>Cosmin-Cristian Văduva</strong><br>
            AnonymCreator &ndash; Digitalstudio
          </div>
        </div>
      </td>
      <td>
        <div class="signature-container right">
          <div class="signature-img-wrapper"></div>
          <div class="signature-line">
            Datum, Unterschrift &amp; Firmenstempel<br>
            <strong>[FIRMEN_NAME]</strong>
          </div>
        </div>
      </td>
    </tr>
  </table>

</body>
</html>
"""

def generate_pdf(client_data):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Buchhaltung", "Einnahmen", "Vertraege"))
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    logo_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Logo"))
    logo_base_uri = f"file:///{logo_dir.replace(chr(92), '/')}"
    
    if "LOGO_BASE_URI" not in client_data:
        client_data["LOGO_BASE_URI"] = logo_base_uri
        
    client_data.setdefault("ZAHLUNGSINTERVALL", "pro Monat")
    client_data.setdefault("ZAHLUNG_TEXT", "Die Zahlung erfolgt monatlich im Voraus und ist 14 Tage nach Rechnungsstellung fällig.")
    if "END_DATUM" in client_data and "LAUFZEIT_TEXT" not in client_data:
        client_data["LAUFZEIT_TEXT"] = f"zunächst bis zum <strong>{client_data['END_DATUM']}</strong>"
    elif "LAUFZEIT_TEXT" not in client_data:
        client_data["LAUFZEIT_TEXT"] = "auf unbestimmte Zeit mit einer Mindestvertragslaufzeit von 12 Monaten"
        
    client_data.setdefault("VERLAENGERUNG_TEXT", "um jeweils einen weiteren Monat (bzw. um 12 Monate bei Mindestlaufzeit)")
    client_data.setdefault("KUENDIGUNGSFRIST", "30 Tage")
        
    rendered_html = html_template
    for placeholder, value in client_data.items():
        rendered_html = rendered_html.replace(f"[{placeholder}]", str(value))

    temp_html_path = os.path.abspath("temp_vertrag_blueprint.html")
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    safe_firma_name = client_data.get("FIRMEN_NAME", "Template")
    safe_firma_name = re.sub(r'[\\\\/*?:"<>|]', "", safe_firma_name)
    safe_firma_name = safe_firma_name.replace(" & ", "_").replace(" ", "_")

    if safe_firma_name == "Template":
        filename = "Vertrag_Template.pdf"
    else:
        date_str = datetime.today().strftime('%Y-%m-%d')
        filename = f"Wartungsvertrag_{safe_firma_name}_{date_str}.pdf"

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
            margin={"top": "8mm", "bottom": "22mm", "left": "15mm", "right": "15mm"},
            display_header_footer=True,
            header_template="<div></div>",
            footer_template=footer_html
        )
        browser.close()

    if os.path.exists(temp_html_path):
        os.remove(temp_html_path)

    return output_pdf_path
