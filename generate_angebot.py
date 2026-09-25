import os
import sys
import re

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Error: playwright is not installed.")
    print("Please run: pip install playwright && playwright install chromium")
    sys.exit(1)

# Get the script directory (AnonymCreator - Digitalstudion\Portofolio\Website)
script_dir = os.path.dirname(os.path.abspath(__file__))

# 1. NEW OUTPUT DIRECTORY: AnonymCreator - Digitalstudion\Angebote
# (Goes up 2 levels from Website -> Portofolio -> AnonymCreator - Digitalstudion)
output_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Angebote"))
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 2. NEW ASSETS DIRECTORY: AnonymCreator - Digitalstudion\Logo
logo_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Logo"))
# Create a safe file:// URI for Playwright
logo_base_uri = f"file:///{logo_dir.replace(chr(92), '/')}"

# The reusable HTML blueprint
html_template = """<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>Angebot - AnonymCreator</title>
<style>
  /* Base Typography & Colors */
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #2D3748;
    font-size: 10.5pt;
    line-height: 1.4;
    margin: 0;
    padding: 0;
    position: relative;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Massive Centered Watermark */
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 65%;
    z-index: -1;
  }

  h1, h2, h3, h4 {
    color: #1B365D;
    page-break-after: avoid;
    margin-top: 0;
  }

  /* 1. Elegant Two-Column Document Header */
  .header-table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 40px;
  }

  .header-table td {
    display: table-cell;
    vertical-align: top;
  }

  .company-info {
    width: 50%;
  }

  .document-info {
    width: 50%;
    text-align: right;
  }

  /* FIXED: Made the main logo significantly smaller */
  .header-logo {
    max-width: 130px;
    height: auto;
    margin-bottom: 15px;
  }

  .company-info-text {
    font-size: 10pt;
    color: #2D3748;
    line-height: 1.6;
  }

  .document-title {
    font-size: 32pt;
    font-weight: 800;
    letter-spacing: 4px;
    margin: 0 0 15px 0;
    color: #1B365D;
    text-transform: uppercase;
  }

  .meta-table {
    display: table;
    width: 100%;
    border-collapse: collapse;
  }
  
  .meta-table td {
    display: table-cell;
    text-align: right;
    padding: 3px 0;
    font-size: 10pt;
  }
  
  .meta-table td.label {
    font-weight: bold;
    padding-right: 15px;
    color: #1B365D;
  }

  /* 2. Recipient Block */
  .recipient-block {
    margin-top: 10px;
    margin-bottom: 45px;
    font-size: 11pt;
    line-height: 1.6;
  }

  /* 3. Core Project Identification */
  .project-section {
    margin-bottom: 15px;
  }
  
  .project-title {
    font-size: 15pt;
    font-weight: bold;
    color: #1B365D;
    border-bottom: 2px solid #00D2FF;
    padding-bottom: 6px;
    margin-bottom: 0;
  }

  /* 4. Itemized Pricing Matrix */
  .pricing-matrix {
    display: table;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  /* FIXED: Added white-space: nowrap to prevent EINZEL and GESAMT from wrapping */
  .pricing-matrix th {
    background-color: #1B365D !important;
    color: #ffffff !important;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 8.5pt;
    padding: 8px 10px;
    white-space: nowrap;
  }
  
  .pricing-matrix td {
    padding: 8px 10px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }

  .pricing-matrix tr:nth-child(even) td {
    background-color: #F8FAFC !important;
  }

  /* Adjusted widths slightly to give more room for price columns */
  .col-pos { width: 6%; text-align: center; }
  .col-desc { width: 54%; text-align: left; }
  .col-qty { width: 8%; text-align: center; }
  .col-unit { width: 16%; text-align: right; white-space: nowrap; }
  .col-total { width: 16%; text-align: right; white-space: nowrap; }

  .item-title {
    font-weight: bold;
    color: #1B365D;
    display: block;
    margin-bottom: 4px;
    font-size: 10pt;
  }
  
  .item-desc {
    font-size: 9pt;
    color: #4a5568;
    line-height: 1.4;
  }

  .strikethrough {
    text-decoration: line-through;
    color: #a0aec0;
    font-size: 8.5pt;
    display: block;
    margin-bottom: 2px;
  }

  /* 5. Financial Totals & Legal Blocks */
  .clearfix::after {
    content: "";
    display: table;
    clear: both;
  }

  .totals-table {
    display: table;
    width: 50%;
    float: right;
    border-collapse: collapse;
    margin-bottom: 35px;
  }

  .totals-table td {
    display: table-cell;
    padding: 8px 10px;
    text-align: right;
  }

  .totals-table .label {
    font-weight: bold;
    text-align: left;
    color: #1B365D;
  }

  .totals-table .total-row td {
    border-top: 2px solid #1B365D;
    font-weight: bold;
    font-size: 13pt;
    color: #1B365D;
    padding-top: 12px;
  }

  .legal-callout {
    border-left: 4px solid #00D2FF;
    background-color: #F8FAFC !important;
    padding: 16px;
    margin-bottom: 45px;
    font-size: 9.5pt;
    line-height: 1.5;
    clear: both;
    color: #2D3748;
    page-break-before: always;
  }
  
  .legal-callout strong {
    color: #1B365D;
  }

  .friendly-note {
    font-size: 10pt;
    color: #4a5568;
    line-height: 1.6;
    margin-bottom: 40px;
    margin-top: 20px;
  }
  
  .friendly-note strong {
    color: #1B365D;
    font-size: 10.5pt;
    display: inline-block;
    margin-bottom: 4px;
  }

  /* 6. Double Signature Execution Block */
  .signature-table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    margin-top: 60px;
    page-break-inside: avoid;
  }

  .signature-table td {
    display: table-cell;
    width: 50%;
    vertical-align: bottom;
  }

  .signature-container {
    width: 85%;
  }
  
  .signature-container.right {
    margin-left: auto;
  }

  .signature-img-wrapper {
    height: 70px;
    position: relative;
  }

  .signature-img {
    height: 90px;
    width: auto;
    position: absolute;
    bottom: -20px; /* Moved down closer to the line */
    left: 50%;
    transform: translateX(-50%);
  }

  .signature-line {
    border-top: 1px solid #1B365D;
    padding-top: 8px;
    text-align: center;
    font-size: 10pt;
    color: #1B365D;
    line-height: 1.4;
  }
</style>
</head>
<body>

  <!-- Watermark: Pulling from the new absolute Logo folder -->
  <img src="[LOGO_BASE_URI]/4.jpg" class="watermark" alt="">

  <!-- 1. Header Section -->
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
        
        <!-- 2. Recipient Block -->
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
        <h1 class="document-title">Angebot</h1>
        <table class="meta-table">
          <tr><td class="label">Angebots-Nr.:</td><td>[ANGEBOTS_NUMMER]</td></tr>
          <tr><td class="label">Datum:</td><td>[DATUM]</td></tr>
          <tr><td class="label">Gültig bis:</td><td>[GUELTIG_BIS]</td></tr>
          <tr><td class="label">GISA-Zahl:</td><td>39760272</td></tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- 3. Core Project Identification -->
  <div class="project-section">
    <div class="project-title">Projekt: [PROJEKT_TITEL]</div>
  </div>

  <!-- 4. Itemized Pricing Matrix -->
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
          <span class="item-title">Strategy &amp; Conceptual planning</span>
          <span class="item-desc">Analyse der Zielgruppe und Erstellung eines technischen und visuellen Konzepts.</span>
        </td>
        <td class="col-qty">1</td>
        <td class="col-unit">
          <span class="strikethrough">299,00 &euro;</span>
          0,00 &euro;
        </td>
        <td class="col-total">
          <span class="strikethrough">299,00 &euro;</span>
          0,00 &euro;
        </td>
      </tr>
      <tr>
        <td class="col-pos">2</td>
        <td class="col-desc">
          <span class="item-title">UI/UX Design &amp; Web Development</span>
          <span class="item-desc">Individuelles High-End Webdesign, fully responsive, inkl. lokaler SEO und DSGVO-Konfiguration.</span>
        </td>
        <td class="col-qty">1</td>
        <td class="col-unit">
          <span class="strikethrough">499,00 &euro;</span>
          [SETUP_PRICE] *
        </td>
        <td class="col-total">
          <span class="strikethrough">499,00 &euro;</span>
          [SETUP_PRICE] *
        </td>
      </tr>
      <tr>
        <td class="col-pos">3</td>
        <td class="col-desc">
          <span class="item-title">Technical Maintenance, Cloud-Hosting &amp; Support-Flatrate</span>
          <span class="item-desc">Ultraschnelles Cloud-Hosting, SSL-Verschlüsselung, Sicherheits-Updates &amp; 30 Min. inkludierte Arbeitszeit.</span>
        </td>
        <td class="col-qty">12</td>
        <td class="col-unit">[MAINTENANCE_PRICE] / Monat</td>
        <td class="col-total">[MAINTENANCE_PRICE] / Monat</td>
      </tr>
    </tbody>
  </table>

  <!-- 5. Financial Totals & Legal Blocks -->
  <div class="clearfix">
    <table class="totals-table">
      <tr>
        <td class="label">Einmalige Einrichtung (Netto):</td>
        <td>[SETUP_PRICE]</td>
      </tr>
      <tr>
        <td class="label">Monatliche Betreuung (Netto):</td>
        <td>[MAINTENANCE_PRICE] / Monat</td>
      </tr>
      <tr class="total-row">
        <td class="label">Gesamtsumme (Einmalig):</td>
        <td>[SETUP_PRICE]</td>
      </tr>
    </table>
  </div>

  <div class="legal-callout">
    <strong>Vertragskonditionen &amp; Steuerliche Hinweise:</strong><br><br>
    Für die monatliche technische Betreuung gilt eine <strong>Mindestvertragslaufzeit von 12 Monaten</strong>. 
    Die Abrechnung der monatlichen Gebühren erfolgt im Voraus (wahlweise monatlich oder jährlich).<br><br>
    <em>Rechnungsstellung erfolgt gemäß der Kleinunternehmerregelung nach § 6 Abs. 1 Z 27 UStG umsatzsteuerbefreit. Alle angegebenen Preise sind Endpreise.</em>
  </div>

  <div class="friendly-note">
    <strong>Individuelle Anpassungen jederzeit möglich</strong><br>
    Dieses Angebot wurde sorgfältig auf Basis unserer Absprachen für Sie zusammengestellt. Sollten Sie Änderungswünsche haben oder weitere Module benötigen, können wir die Leistungen selbstverständlich jederzeit flexibel an Ihre individuellen Bedürfnisse anpassen.<br><br>
    <strong>Angebotsannahme &amp; Vertragsabschluss</strong><br>
    Wenn Sie mit diesem Angebot einverstanden sind, bitten wir Sie, das Dokument zu unterzeichnen und an uns zurückzusenden. Mit Ihrer Unterschrift bestätigen Sie die verbindliche Annahme des Angebots. Wir freuen uns sehr auf die gemeinsame Umsetzung Ihres Projekts!
  </div>

  <!-- 6. Double Signature Execution Block -->
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
    # Get the script directory (AnonymCreator - Digitalstudion\Portofolio\Website)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. NEW OUTPUT DIRECTORY: AnonymCreator - Digitalstudion\Angebote\Outreach_Bot Angebote
    output_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Angebote", "Outreach_Bot Angebote"))
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    # 2. NEW ASSETS DIRECTORY: AnonymCreator - Digitalstudion\Logo
    logo_dir = os.path.abspath(os.path.join(script_dir, "..", "..", "Logo"))
    logo_base_uri = f"file:///{logo_dir.replace(chr(92), '/')}"
    
    # Ensure LOGO_BASE_URI is in client_data
    if "LOGO_BASE_URI" not in client_data:
        client_data["LOGO_BASE_URI"] = logo_base_uri
        
    rendered_html = html_template
    for placeholder, value in client_data.items():
        rendered_html = rendered_html.replace(f"[{placeholder}]", value)

    temp_html_path = os.path.abspath("temp_angebot_blueprint.html")
    with open(temp_html_path, "w", encoding="utf-8") as f:
        f.write(rendered_html)

    # Dynamically generate filename based on FIRMEN_NAME
    safe_firma_name = client_data.get("FIRMEN_NAME", "Template")
    safe_firma_name = re.sub(r'[\\\\/*?:"<>|]', "", safe_firma_name)
    safe_firma_name = safe_firma_name.replace(" & ", "_").replace(" ", "_")

    if safe_firma_name == "[FIRMEN_NAME]":
        filename = "Angebot_Template.pdf"
    else:
        filename = f"Angebot_{safe_firma_name}_AnonymCreator.pdf"

    output_pdf_path = os.path.join(output_dir, filename)

    print(f"Generating High-End PDF for {safe_firma_name}...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.goto(f"file:///{temp_html_path.replace(chr(92), '/')}", wait_until="networkidle")
        
        footer_html = '<div style="font-size: 9pt; font-family: Helvetica, Arial, sans-serif; color: #718096; text-align: right; width: 100%; padding-right: 18mm;">Seite <span class="pageNumber"></span> von <span class="totalPages"></span></div>'
        
        page.pdf(
            path=output_pdf_path,
            format="A4",
            print_background=True,
            margin={"top": "15mm", "bottom": "15mm", "left": "18mm", "right": "18mm"},
            display_header_footer=True,
            header_template="<div></div>",
            footer_template=footer_html
        )
        
        browser.close()

    if os.path.exists(temp_html_path):
        os.remove(temp_html_path)

    return output_pdf_path

if __name__ == "__main__":
    # Example usage
    client_data = {
        "ANGEBOTS_NUMMER": "AG-2026-0016",
        "DATUM": "02. Juni 2026",
        "GUELTIG_BIS": "30. Juni 2026",
        "FIRMEN_NAME": "Piccolina OG",
        "ANSPRECHPARTNER": "Elisabeth Walzel & Coleen Weikl",
        "STRASSE_HAUSNUMMER": "Linzerstraße 13",
        "PLZ_ORT": "4614 Marchtrenk",
        "PROJEKT_TITEL": "Exklusiver Salon-Auftritt & Smartphone-Optimierung",
        "SETUP_PRICE": "199,00 &euro;",
        "MAINTENANCE_PRICE": "59,00 &euro;"
    }
    path = generate_pdf(client_data)
    print(f"Success! PDF has been generated at: {path}")
