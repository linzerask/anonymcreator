import json
import os

log_path = r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript.jsonl'
output_dir = r'C:\Users\43670\Desktop\Graphics\AnonymCreator - Digitalstudion\Portofolio\Website\recovery'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

files_to_recover = [
    'index.html', 'about.html', 'contact.html', 'datenschutz.html', 
    'impressum.html', 'portfolio.html', 'preise.html', 'services.html', 'style.css'
]

file_contents = {f: "" for f in files_to_recover}

print("Parsing transcript...")
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            content = data.get('content', '')
            
            # Check if this is a VIEW_FILE result
            if data.get('type') == 'VIEW_FILE' and data.get('source') == 'MODEL' and 'The above content shows the entire, complete file contents' in content:
                for target_file in files_to_recover:
                    if target_file in content[:200]: # File path is usually at the start
                        # Extract the code
                        # The view_file output looks like:
                        # 1: <html>
                        # 2: <body>
                        # We need to strip the line numbers
                        lines = content.split('\n')
                        recovered_lines = []
                        is_code = False
                        for l in lines:
                            if l.startswith('The following code has been modified'):
                                is_code = True
                                continue
                            if l.startswith('The above content shows'):
                                is_code = False
                                continue
                            if is_code:
                                # Strip "1: ", "20: " etc
                                parts = l.split(': ', 1)
                                if len(parts) == 2 and parts[0].isdigit():
                                    recovered_lines.append(parts[1])
                                else:
                                    recovered_lines.append(l)
                        
                        recovered_str = '\n'.join(recovered_lines)
                        if len(recovered_str) > len(file_contents[target_file]):
                            file_contents[target_file] = recovered_str
                            print(f"Recovered {target_file} from VIEW_FILE step {data.get('step_index')} (len: {len(recovered_str)})")
        except Exception as e:
            pass

for fname, content in file_contents.items():
    if content:
        out_path = os.path.join(output_dir, fname)
        with open(out_path, 'w', encoding='utf-8') as out:
            out.write(content)
        print(f"Saved recovered {fname} ({len(content)} bytes)")
    else:
        print(f"Could not recover {fname}")

print("Done.")
