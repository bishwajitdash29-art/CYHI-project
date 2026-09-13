with open('backend/server.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "app.listen(PORT, () => {\n  console.log(`Server running on port ${PORT}`);\n});",
    "if (process.env.NODE_ENV !== 'production') {\n  app.listen(PORT, () => {\n    console.log(`Server running on port ${PORT}`);\n  });\n}\n\nmodule.exports = app;"
)

with open('backend/server.js', 'w', encoding='utf-8') as f:
    f.write(content)
