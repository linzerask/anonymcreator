import json
log_path = r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript.jsonl'
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if '<nav' in line or 'style.css' in line:
            try:
                data = json.loads(line)
                if 'content' in data:
                    c = data['content']
                    if 'VIEW_FILE' not in data.get('type', ''):
                        # print the type and step
                        print(f"--- STEP {data.get('step_index')} TYPE {data.get('type')} ---")
                        # print only up to 1000 chars to avoid flooding
                        print(c[:1000])
            except Exception as e:
                pass
