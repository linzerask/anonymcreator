import json
import os

log_path = r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript.jsonl'
output_dir = r'C:\Users\43670\Desktop\Graphics\AnonymCreator - Digitalstudion\Portofolio\Website'

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'write_to_file' in line:
            try:
                data = json.loads(line)
                if 'tool_calls' in data:
                    for tc in data['tool_calls']:
                        if tc.get('name') in ['write_to_file', 'default_api:write_to_file']:
                            args = tc.get('args', tc.get('arguments', {}))
                            target = args.get('TargetFile', '')
                            
                            if 'style.css' in target:
                                content = args.get('CodeContent', '')
                                step = data.get("step_index")
                                print(f"Found style.css content length: {len(content)} at step {step}")
                                with open(os.path.join(output_dir, 'recovery_style.css'), 'w', encoding='utf-8') as out:
                                    out.write(content)
                                    
                            if target.endswith('.html'):
                                content = args.get('CodeContent', '')
                                fname = os.path.basename(target).replace('\\', '/')
                                step = data.get("step_index")
                                print(f"Found {fname} content length: {len(content)} at step {step}")
                                with open(os.path.join(output_dir, 'recovery_' + fname), 'w', encoding='utf-8') as out:
                                    out.write(content)
            except Exception as e:
                pass
