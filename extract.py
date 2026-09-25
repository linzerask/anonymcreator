import json
import os

log_path = r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript_full.jsonl'

files = {}
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            # Find view_file responses
            if data.get('type') == 'VIEW_FILE':
                content = data.get('content', '')
                if 'File Path:' in content:
                    path_line = [l for l in content.split('\n') if 'File Path:' in l][0]
                    # path_line looks like: File Path: ile:///C:/...
                    path = path_line.split('')[1]
                    filename = os.path.basename(path)
                    
                    if 'Showing lines' in content and 'The following code has been modified' in content:
                        parts = content.split('remove the line number, colon, and leading space.\n')
                        if len(parts) > 1:
                            lines = parts[1].split('\n')
                            clean_lines = []
                            for l in lines:
                                if ':' in l:
                                    # remove line number like "1: " or "123: "
                                    try:
                                        num_part, rest = l.split(':', 1)
                                        int(num_part) # verify it's a number
                                        clean_lines.append(rest[1:]) # remove leading space
                                    except:
                                        clean_lines.append(l)
                                else:
                                    clean_lines.append(l)
                            
                            # we take the first version we saw to get the original before corruption
                            if filename not in files:
                                files[filename] = '\n'.join(clean_lines).replace('\r\n', '\n').replace('\nThe above content shows the entire, complete file contents of the requested file.', '')
            
            # Find write_to_file tool calls
            for call in data.get('tool_calls', []):
                if call.get('function', {}).get('name') == 'default_api:write_to_file':
                    args = call['function']['arguments']
                    if isinstance(args, str):
                        args = json.loads(args)
                    target = args['TargetFile']
                    filename = os.path.basename(target)
                    content = args['CodeContent']
                    
                    if filename not in files:
                        files[filename] = content
        except Exception as e:
            pass

print("Found files:", list(files.keys()))
for name, content in files.items():
    if name in ['agentur.html', 'agb.html', 'datenschutz.html', 'impressum.html', 'dashboard.html', 'danke.html', 'login.html', 'kundenstimmen.html', 'leistungen.html', 'projekte.html', 'stories.html', 'preise.html']:
        print(f"Writing {name}")
        with open(name, 'w', encoding='utf-8') as out:
            out.write(content)
