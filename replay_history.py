import json
import os

log_path = r'C:\Users\43670\.gemini\antigravity\brain\57931a7e-c242-47d7-8fd9-6bb26971ff12\.system_generated\logs\transcript.jsonl'
output_dir = r'C:\Users\43670\Desktop\Graphics\AnonymCreator - Digitalstudion\Portofolio\Website'

files_state = {}

def apply_replace(content, target, replacement):
    if target in content:
        return content.replace(target, replacement)
    else:
        # fallback
        return content

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            step_index = data.get('step_index')
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    args = tc.get('args', tc.get('arguments', {}))
                    target_file = args.get('TargetFile', '')
                    
                    if not target_file: continue
                    
                    fname = target_file.split('\\')[-1].split('/')[-1].replace('"', '')
                    
                    if tc.get('name') in ['write_to_file', 'default_api:write_to_file']:
                        files_state[fname] = args.get('CodeContent', '')
                        
                    elif tc.get('name') in ['replace_file_content', 'default_api:replace_file_content']:
                        if fname in files_state:
                            old_content = files_state[fname]
                            target = args.get('TargetContent', '')
                            replacement = args.get('ReplacementContent', '')
                            files_state[fname] = apply_replace(old_content, target, replacement)
                            
                    elif tc.get('name') in ['multi_replace_file_content', 'default_api:multi_replace_file_content']:
                        if fname in files_state:
                            old_content = files_state[fname]
                            chunks = args.get('ReplacementChunks', [])
                            if isinstance(chunks, str):
                                try: chunks = json.loads(chunks)
                                except: chunks = []
                            for chunk in chunks:
                                target = chunk.get('TargetContent', '')
                                replacement = chunk.get('ReplacementContent', '')
                                old_content = apply_replace(old_content, target, replacement)
                            files_state[fname] = old_content
        except Exception as e:
            pass

for fname, content in files_state.items():
    if fname in ['index.html', 'style.css', 'script.js']:
        path = os.path.join(output_dir, 'perfect_' + fname)
        with open(path, 'w', encoding='utf-8') as out:
            out.write(content)
        print(f"Saved {path} with length {len(content)}")
