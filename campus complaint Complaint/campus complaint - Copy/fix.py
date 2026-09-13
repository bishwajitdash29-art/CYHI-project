import os

frontend_dir = 'frontend/src'
for root, _, files in os.walk(frontend_dir):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            content = content.replace("'http://localhost:5000", "API_URL + '")
            content = content.replace('"http://localhost:5000', 'API_URL + "')
            content = content.replace('`http://localhost:5000', '`${API_URL}')
            content = content.replace('"http://localhost:5000"', 'API_URL + "')

            if 'API_URL' in content and 'const API_URL' not in content:
                lines = content.split('\n')
                import_end = 0
                for i, line in enumerate(lines):
                    if line.startswith('import '):
                        import_end = i
                lines.insert(import_end + 1, "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';")
                content = '\n'.join(lines)

            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
