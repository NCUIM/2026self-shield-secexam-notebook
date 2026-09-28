import os

base_dir = os.path.dirname(os.path.abspath(__file__))

html_path = os.path.join(base_dir, 'index.html')
css_path = os.path.join(base_dir, 'style.css')
data_path = os.path.join(base_dir, 'data.js')
app_path = os.path.join(base_dir, 'app.js')
output_path = os.path.join(base_dir, 'sec_quiz_notebook_standalone.html')

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

with open(data_path, 'r', encoding='utf-8') as f:
    data_js = f.read()

with open(app_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Replace <link rel="stylesheet" href="style.css"> with <style>...</style>
html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>\n{css}\n</style>')

# Replace <script src="data.js"></script> and <script src="app.js"></script> with inline scripts
script_replacement = f'<script>\n{data_js}\n</script>\n<script>\n{app_js}\n</script>'
html = html.replace('<script src="data.js"></script>', '')
html = html.replace('<script src="app.js"></script>', script_replacement)

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html)

size_kb = os.path.getsize(output_path) / 1024
print(f"Single-file bundle generated: {output_path} ({size_kb:.1f} KB)")
