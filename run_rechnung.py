import sys
import os

# Ensure we are in the right directory
script_dir = r"C:\Users\43670\Desktop\Graphics\AnonymCreator - Digitalstudion\Portofolio\Website"
os.chdir(script_dir)
sys.path.append(script_dir)

from generate_rechnung import generate_pdf

client_data = {
    "RECHNUNGS_NUMMER": "RE-2026-002",
    "DATUM": "01. September 2026",
    "LEISTUNGS_DATUM": "01. September 2026 - 30. September 2026",
    "FIRMEN_NAME": "Selena Events",
    "ANSPRECHPARTNER": "Adelin Clement Ochian",
    "STRASSE_HAUSNUMMER": "Riesterstraße 8, Tür 2",
    "PLZ_ORT": "4050 Traun",
    "PROJEKT_TITEL": "Wartungsvertrag (Monat September 2026)",
    "ITEM_1_TITLE": "Website-Betreuung & Support-Flatrate",
    "ITEM_1_DESC": "Cloud-Hosting, Sicherheits-Updates, Backups und unbegrenzter technischer Support (Monatliche Pauschale: September 2026).",
    "ITEM_1_PRICE": "49,00 &euro;",
    "TOTAL_PRICE": "49,00 &euro;",
    "FAELLIGKEITS_DATUM": "15. September 2026"
}

path = generate_pdf(client_data)
print(f"Success! Invoice PDF generated at: {path}")
