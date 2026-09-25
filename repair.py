import os
import glob

fffd = chr(0xFFFD)

replacements = {
    # RO
    "mul?umi?i": "mulțumiți",
    "?i": "și",
    "?tim": "știm",
    "AGEN?IA": "AGENȚIA",
    "Agen?ia": "Agenția",
    "Agen?ie": "Agenție",
    "agen?iei": "agenției",
    "Aplica?ii": "Aplicații",
    "cerin?ele": "cerințele",
    "Clien?i": "Clienți",
    "clien?i": "clienți",
    "conecta?i": "conectați",
    "Consultan?a": "Consultanță",
    "Cunoa?te": "Cunoaște",
    "E?ti": "Ești",
    "Economise?te": "Economisește",
    "Eficien?a": "Eficiența",
    "Excelen?a": "Excelența",
    "execu?ie": "execuție",
    "experien?a": "experiența",
    "experien?e": "experiențe",
    "Experien?ele": "Experiențele",
    "genera?ie": "generație",
    "ini?iem": "inițiem",
    "inspira?ie": "inspirație",
    "Interfe?e": "Interfețe",
    "interna?ionali": "internaționali",
    "Loca?ie": "Locație",
    "Motiva?ia": "Motivația",
    "no?tri": "noștri",
    "Op?ional": "Opțional",
    "performan?a": "performanța",
    "po?i": "poți",
    "Pozi?ionare": "Poziționare",
    "re?ele": "rețele",
    "REFERIN?ELE": "REFERINȚELE",
    "Solu?ii": "Soluții",
    "??i": "îți",
    "?mpreuna": "Împreună",
    "?n": "în",
    "?ncepe": "Începe",
    "?ncerci": "încerci",
    "?ntr": "într",
    "?ntregul": "întregul",
    "Acasa în": "Acasă în",
    
    # FFFD
    f"automatiz{fffd}nd": "automatizând",
    f"cur{fffd}nd": "curând",
    f"cuv{fffd}ntul": "cuvântul",
    f"{fffd}mpreuna": "Împreună",
    f"Acasa {fffd}n": "Acasa în",
    f" {fffd}n ": " în ",
    f"{fffd}ncepe": "Începe",
    f"{fffd}ncerci": "încerci",
    f"{fffd}ntr": "într",
    f"{fffd}ntregul": "întregul",
    f"t{fffd}rziu": "târziu",
    f"Stra{fffd}e": "Straße",
    f"T{fffd}r": "Tür",
    f"Alpengl{fffd}ck": "Alpenglück",
    f"business {fffd} we": "business — we",
    f"afacerea ta {fffd} noi": "afacerea ta — noi",
    f"rebranding {fffd} suntem": "rebranding — suntem",
    
    # Fix the mistakes from earlier PowerShell regex
    "mulțumițiți": "mulțumiți",
    "mulțumițiși": "mulțumiți",
    "Acasa în": "Acasă în",
    "Cunoaște-ne": "Cunoaște-ne"
}

# Fix edge cases for '?i' not replacing real question marks
replacements_ordered = {k: replacements[k] for k in sorted(replacements.keys(), key=len, reverse=True)}

for root, _, files in os.walk('.'):
    for f in files:
        if f.endswith('.html'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
            
            original = content
            # Special case for ?i to avoid replacing '?' at end of sentences
            content = content.replace(" ?i ", " și ")
            content = content.replace(">?i ", ">și ")
            content = content.replace(" ??i ", " îți ")
            
            for k, v in replacements_ordered.items():
                if k not in ["?i", "??i"]:
                    content = content.replace(k, v)
                    
            if content != original:
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)
                print(f"Repaired {path}")

print("Done.")
