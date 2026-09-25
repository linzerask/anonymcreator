import json
import os

logs = [
    r'C:\Users\43670\.gemini\antigravity\brain\942f48e1-4c0b-45a2-bc03-f0571bfd74f0\.system_generated\logs\transcript.jsonl',
    r'C:\Users\43670\.gemini\antigravity\brain\e1c36055-fc0b-4474-b8b2-c05086c58d86\.system_generated\logs\transcript.jsonl'
]

for log in logs:
    with open(log, 'r', encoding='utf-8') as f:
        for line in f:
            if 'write_to_file' in line:
                try:
                    data = json.loads(line)
                    for call in data.get('tool_calls', []):
                        if call.get('function', {}).get('name') == 'default_api:write_to_file':
                            args = call['function']['arguments']
                            if isinstance(args, str):
                                args = json.loads(args)
                            target = args['TargetFile']
                            content = args['CodeContent']
                            print(f'Restoring {target}')
                            with open(target, 'w', encoding='utf-8') as out:
                                out.write(content)
                except Exception as e:
                    pass
