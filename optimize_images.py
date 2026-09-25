import os
from PIL import Image
import sys

def convert_to_webp(source_folder):
    """
    Konvertiert alle PNG und JPG Bilder in einem Ordner in das moderne WebP-Format.
    Dies reduziert die Dateigröße massiv, ohne sichtbaren Qualitätsverlust, und ist perfekt für SEO.
    """
    if not os.path.exists(source_folder):
        print(f"Fehler: Der Ordner '{source_folder}' existiert nicht.")
        return

    converted_count = 0
    saved_bytes = 0

    for filename in os.listdir(source_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            file_path = os.path.join(source_folder, filename)
            
            # Ziel-Dateiname (Erweiterung zu .webp ändern)
            name_without_ext = os.path.splitext(filename)[0]
            webp_path = os.path.join(source_folder, f"{name_without_ext}.webp")

            # Datei öffnen und konvertieren
            try:
                # Hole die ursprüngliche Dateigröße
                original_size = os.path.getsize(file_path)

                img = Image.open(file_path)
                
                # Wenn es ein PNG mit Transparenz ist, erhalten wir diese in WebP
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    img.save(webp_path, 'WEBP', quality=85, lossless=False, method=6)
                else:
                    img = img.convert('RGB')
                    img.save(webp_path, 'WEBP', quality=85, method=6)

                new_size = os.path.getsize(webp_path)
                saved_kb = (original_size - new_size) / 1024
                saved_bytes += (original_size - new_size)

                print(f"[OK] {filename} -> {name_without_ext}.webp (Gespart: {saved_kb:.1f} KB)")
                converted_count += 1
            except Exception as e:
                print(f"[FEHLER] bei {filename}: {e}")

    if converted_count > 0:
        total_saved_mb = saved_bytes / (1024 * 1024)
        print(f"\n[FERTIG] {converted_count} Bilder wurden konvertiert.")
        print(f"[ERFOLG] Insgesamt gesparter Speicherplatz: {total_saved_mb:.2f} MB")
        print("\nNächster Schritt: Tausche die Endungen in deinen HTML-Dateien aus (z.B. .png zu .webp).")
    else:
        print("\nKeine Bilder zum Konvertieren gefunden.")

if __name__ == "__main__":
    # Standardmäßig wird der Ordner "Assets" im selben Verzeichnis genutzt
    folder = "Assets"
    
    if len(sys.argv) > 1:
        folder = sys.argv[1]
        
    print(f"Starte WebP-Konvertierung für Ordner: {folder}...\n")
    convert_to_webp(folder)
