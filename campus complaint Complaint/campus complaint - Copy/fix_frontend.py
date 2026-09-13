import sys

filepath = 'frontend/src/pages/Proposals.jsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<option value=\"General\">General Campus</option>', '<option value=\"General Campus\">General Campus</option>')
content = content.replace('<option value=\"Computer Science\">Head of CSE</option>', '<option value=\"Head of CSE\">Head of CSE</option>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
