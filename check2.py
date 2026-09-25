import json
with open(r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        if '.htaccess' in line and '"type":"LIST_DIRECTORY"' in line:
            try:
                data = json.loads(line)
                content = data.get('content', '')
                if '.htaccess' in content:
                    lines = content.split('\n')
                    for l in lines:
                        if '.htaccess' in l:
                            print(l)
            except:
                pass
