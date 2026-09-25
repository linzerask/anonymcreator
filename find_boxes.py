import fitz
import sys
import json

def find_boxes(pdf_path):
    doc = fitz.open(pdf_path)
    page = doc[1] # Page 2 (0-indexed is 1)
    
    words = page.get_text("words") # list of (x0, y0, x1, y1, "word", block_no, line_no, word_no)
    
    # We want to find exact lines or phrases. It's better to use search_for.
    phrases = [
        "Familien- oder Nachname",
        "Verheiratet",
        "Wohnsitzanschrift/Sitz",
        "Sozialversicherungsnummer (10-stellig)",
        "Geburtsdatum",
        "Tagsüber erreichbar",
        "Ich bin/war steuerlich erfasst",
        "Nein",
        "Arbeitsverhältnis/Pension",
        "Betrag in Euro",
        "Ort der Berufsausübung",
        "Bezeichnung der Tätigkeit",
        "Beginn der Berufsausübung/Tätigkeit am",
        "Eintragung im Firmenbuch erfolgt",
        "Wirtschaftsjahr für Gewinnermittlung",
        "von",
        "bis",
        "Anzahl der im Betrieb",
        "Anzahl",
        "Der voraussichtliche Jahresumsatz beträgt im Eröffnungsjahr",
        "Der voraussichtliche Jahresumsatz beträgt im Folgejahr",
        "Der voraussichtliche Gewinn beträgt im Eröffnungsjahr",
        "Der voraussichtliche Gewinn beträgt im Folgejahr",
        "Kleinunternehmen gemäß",
        "Kammerumlage",
        "Am Unternehmen ist ein echter stiller Gesellschafter beteiligt",
        "Datum, Unterschrift bzw. firmenmäßige Zeichnung"
    ]
    
    results = {}
    for phrase in phrases:
        rects = page.search_for(phrase)
        results[phrase] = [[r.x0, r.y0, r.x1, r.y1] for r in rects]
        
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    find_boxes(sys.argv[1])
