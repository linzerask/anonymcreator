import json

log_path = r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript.jsonl'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('type') == 'PLANNER_RESPONSE':
                content = data.get('content', '')
                if 'CSS' in content or 'Design' in content or 'Farbe' in content or 'neon' in content.lower():
                    print(f'--- AI AT STEP {data.get("step_index")} ---')
                    print(content[:500])
        except Exception as e:
            pass
