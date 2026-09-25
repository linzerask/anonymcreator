import fitz
import sys

def fill_pdf(input_pdf, output_pdf, sig_img):
    doc = fitz.open(input_pdf)
    page = doc[1] # Page 2

    # Settings for text insertion
    fontname = "helv"
    fontsize = 10
    color = (0, 0, 0) # Black

    def draw_text(text, x, y):
        page.insert_text(fitz.Point(x, y), str(text), fontname=fontname, fontsize=fontsize, color=color)

    def draw_cross(x, y):
        page.insert_text(fitz.Point(x, y), "X", fontname="hebo", fontsize=12, color=color)

    # 1. Familien- oder Nachname und Vorname
    draw_text("Cosmin Cristian Vaduva", 60, 75)

    # 2. Familienstand - Verheiratet
    draw_cross(61, 109)

    # 3. Wohnsitzanschrift
    draw_text("Carl-Anton-Carlone Strasse 7, 4052 Ansfelden", 60, 146)

    # 4. Sozialversicherungsnummer, Geburtsdatum, Telefon
    draw_text("5123221295", 60, 174)
    draw_text("22.12.1995", 202, 174)
    draw_text("06645000057", 295, 174)

    # 5. Ich bin/war steuerlich erfasst -> Ja + Steuernummer
    # We find "Ja" below "Ich bin/war steuerlich erfasst"
    ja_rects = page.search_for("Ja")
    ja_rect = [r for r in ja_rects if 190 < r.y0 < 210][0]
    draw_cross(ja_rect.x0 - 15, ja_rect.y1 - 3)
    
    st_rects = page.search_for("unter der Steuernummer")
    st_rect = [r for r in st_rects if 180 < r.y0 < 210][0]
    draw_text("46 477/2888", st_rect.x1 + 10, st_rect.y1 - 1)

    # 6. Arbeitsverhältnis/Pension -> 34440
    draw_cross(61, 230)
    draw_text("34.440", 350, 228)

    # 7. Ort der Berufsausübung
    draw_text("Carl-Anton-Carlone Strasse 7, 4052 Ansfelden", 60, 273)

    # 8. Bezeichnung der Tätigkeit
    draw_text("Webdesign, IT-Dienstleistungen", 60, 329)

    # 9. Beginn der Berufsausübung
    draw_text("01.06.2026", 210, 348)

    # 10. Eintragung im Firmenbuch -> Nein (second Nein: y=353)
    draw_cross(299, 362)

    # 11. Wirtschaftsjahr -> 01.06.2026 bis 31.12.2026
    draw_text("01.06.2026", 80, 387)
    draw_text("31.12.2026", 145, 387)

    # 12. Anzahl im Betrieb -> 0
    draw_text("0", 520, 377)

    # 13. Jahresumsatz
    draw_text("55.000", 120, 418) # Eröffnungsjahr
    draw_text("55.000", 355, 418) # Folgejahr

    # 14. Gewinn
    draw_text("6.613,20", 120, 441) # Eröffnungsjahr
    draw_text("6.613,20", 355, 441) # Folgejahr

    # 15. Kleinunternehmen -> Nein
    draw_cross(61, 476)

    # 16. Abgaben -> Kammerumlage
    draw_cross(61, 553)

    # 17. Stiller Gesellschafter -> Nein
    draw_cross(296, 568)

    # 18. Datum
    draw_text("19.06.2026", 60, 712)

    # 19. Signature
    try:
        rect = fitz.Rect(120, 660, 250, 710)
        page.insert_image(rect, filename=sig_img)
    except Exception as e:
        print("Could not insert signature:", e)

    doc.save(output_pdf)
    print("Done generating", output_pdf)

if __name__ == "__main__":
    fill_pdf(sys.argv[1], sys.argv[2], sys.argv[3])
