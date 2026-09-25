import json
import os

log_path = r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript.jsonl'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_index = data.get('step_index')
            if data.get('type') == 'USER_INPUT' or data.get('source') == 'USER_EXPLICIT':
                content = data.get('content', '')
                if 'index.html' in content or '<html' in content or 'css' in content.lower():
                    print(f'--- USER MESSAGE AT STEP {step_index} --- length: {len(content)}')
                    print(content[:500] + '...')
            
            # Also check if the AI used write_to_file or multi_replace for index.html with a huge length
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    args = tc.get('args', tc.get('arguments', {}))
                    target = args.get('TargetFile', '')
                    if 'index.html' in target:
                        if tc.get('name') in ['write_to_file', 'default_api:write_to_file']:
                            c = args.get('CodeContent', '')
                            print(f'--- AI WROTE index.html AT STEP {step_index} --- length: {len(c)}')
                        elif tc.get('name') in ['replace_file_content', 'default_api:replace_file_content', 'multi_replace_file_content']:
                            print(f'--- AI REPLACED index.html AT STEP {step_index} ---')
        except Exception as e:
            pass
