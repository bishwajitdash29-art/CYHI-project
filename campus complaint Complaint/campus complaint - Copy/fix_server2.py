with open('backend/server.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('backend/server.js', 'w', encoding='utf-8') as f:
    for line in lines:
        if line.startswith('app.listen('):
            f.write('if (process.env.Zeit !== '1') {\n')
            f.write(line)
        elif line.startswith(')}') and ('}' in lines[-1] or '}' in lines[-2]):
            f.write(line)
            f.write('}\nmodule.exports = app;\n')
        else:
            f.write(line)
