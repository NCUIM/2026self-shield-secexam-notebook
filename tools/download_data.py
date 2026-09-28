import urllib.request
import os
import json

urls = {
    'mock_exam_a_questions.md': 'https://raw.githubusercontent.com/Youchenjiang/sec-compendium/main/security/practice/exams/mock_exam_a_100q_questions.md',
    'mock_exam_a_solutions.md': 'https://raw.githubusercontent.com/Youchenjiang/sec-compendium/main/security/practice/exams/mock_exam_a_100q_solutions.md',
    'mock_exam_b_questions.md': 'https://raw.githubusercontent.com/Youchenjiang/sec-compendium/main/security/practice/exams/mock_exam_b_lab_questions.md',
    'mock_exam_b_solutions.md': 'https://raw.githubusercontent.com/Youchenjiang/sec-compendium/main/security/practice/exams/mock_exam_b_lab_solutions.md'
}

data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw'))
os.makedirs(data_dir, exist_ok=True)

for filename, url in urls.items():
    filepath = os.path.join(data_dir, filename)
    print(f"Downloading {url} to {filepath}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        lines = content.splitlines()
        print(f"Downloaded {filename}: {len(lines)} lines, {len(content)} chars.")
        if lines:
            print(f"First 3 lines:\n  " + "\n  ".join(lines[:3]))
