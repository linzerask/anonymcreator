import sys
import os

# Ensure we are in the right directory
script_dir = r"C:\Users\43670\Desktop\Graphics\AnonymCreator - Digitalstudion\Portofolio\Website"
os.chdir(script_dir)
sys.path.append(script_dir)

from generate_angebot import generate_pdf

client_data = {
    "ANGEBOTS_NUMMER": "AG-2026-0601",
    "DATUM": "07. Juni 2026",
    "GUELTIG_BIS": "07. Juli 2026",
    "FIRMEN_NAME": "Selena Events",
    "ANSPRECHPARTNER": "Adelin Clement Ochian",
    "STRASSE_HAUSNUMMER": "Riesterstraße 8, Tür 2",
    "PLZ_ORT": "4050 Traun",
    "PROJEKT_TITEL": "Moderne Webseitenerstellung & Hosting",
    "SETUP_PRICE": "199,00 &euro;",
    "MAINTENANCE_PRICE": "49,00 &euro;"
}

path = generate_pdf(client_data)
print(f"Success! PDF generated at: {path}")
