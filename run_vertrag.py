import sys
import os

# Ensure we are in the right directory
script_dir = r"C:\Users\43670\Desktop\Graphics\AnonymCreator - Digitalstudion\Portofolio\Website"
os.chdir(script_dir)
sys.path.append(script_dir)

from generate_vertrag import generate_pdf

client_data = {
    "FIRMEN_NAME": "Selena Events",
    "ANSPRECHPARTNER": "Adelin Clement Ochian",
    "STRASSE_HAUSNUMMER": "Riesterstraße 8, Tür 2",
    "PLZ_ORT": "4050 Traun",
    "PREIS": "49,00 &euro;",
    "ZAHLUNGSINTERVALL": "pro Monat",
    "ZAHLUNG_TEXT": "Die Zahlung erfolgt monatlich im Voraus und ist jeweils bis zum 5. eines jeden Monats fällig.",
    "START_DATUM": "01. September 2026",
    "LAUFZEIT_TEXT": "auf unbestimmte Zeit (Monatsvertrag)",
    "VERLAENGERUNG_TEXT": "um jeweils einen weiteren Monat",
    "KUENDIGUNGSFRIST": "1 Monat"
}

path = generate_pdf(client_data)
print(f"Success! Contract PDF generated at: {path}")
