import os
import re
import json

def clean_text(text):
    if not text:
        return ""
    text = text.strip()
    # Remove trailing markdown horizontal lines or header artifacts
    text = re.sub(r'\n+---+\s*$', '', text)
    text = re.sub(r'\n+##+\s*$', '', text)
    return text.strip()

def parse_exam_a(q_file, s_file):
    with open(q_file, 'r', encoding='utf-8') as f:
        q_text = f.read()
    with open(s_file, 'r', encoding='utf-8') as f:
        s_text = f.read()

    # Parse solutions
    sol_pattern = r'### 第\s*(\d+)\s*題[^\n]*\n([\s\S]*?)(?=(?:### 第\s*\d+\s*題|## |\Z))'
    solutions = {}
    for m in re.finditer(sol_pattern, s_text):
        qid = int(m.group(1))
        body = m.group(2).strip()
        ans_match = re.search(r'正確答案[**：\s:]+\(?\s*([A-D])\s*\)?', body)
        ans = ans_match.group(1) if ans_match else ''
        
        basis_match = re.search(r'-\s*\*\*正解依據\*\*[：:]\s*([\s\S]*?)(?=(?:-\s*\*\*干擾項辨析\*\*|\Z))', body)
        basis = clean_text(basis_match.group(1)) if basis_match else ''
        
        distractor_match = re.search(r'-\s*\*\*干擾項辨析\*\*[：:]\s*([\s\S]*?)$', body)
        distractor = clean_text(distractor_match.group(1)) if distractor_match else ''

        solutions[qid] = {
            'answer': ans,
            'basis': basis,
            'distractor': distractor,
            'full_solution': clean_text(body)
        }

    domains = [
        {"name": "領域一：Web 應用安全與 OWASP Top 10", "start": 1, "end": 20},
        {"name": "領域二：密碼學與身份驗證機制", "start": 21, "end": 35},
        {"name": "領域三：網路協議分析與封包取證", "start": 36, "end": 50},
        {"name": "領域四：系統安全加固、Linux/Windows 權限與配置", "start": 51, "end": 65},
        {"name": "領域五：逆向工程、惡意程式與二進位安全", "start": 66, "end": 80},
        {"name": "領域六：資安法規、標準與治理體系", "start": 81, "end": 90},
        {"name": "領域七：資安事件應變與數位鑑識", "start": 91, "end": 100}
    ]

    def get_domain(qid):
        for d in domains:
            if d['start'] <= qid <= d['end']:
                return d['name']
        return "綜合領域"

    q_pattern = r'### 第\s*(\d+)\s*題【(.*?)】\n([\s\S]*?)(?=(?:### 第\s*\d+\s*題|## 考生標準答題卡|\Z))'
    questions = []
    for m in re.finditer(q_pattern, q_text):
        qid = int(m.group(1))
        category = m.group(2).strip()
        body = m.group(3).strip()

        opt_matches = list(re.finditer(r'^\(([A-D])\)\s*([\s\S]*?)(?=(?:^\([A-D]\)|\Z))', body, re.MULTILINE))
        options = {}
        q_desc = body
        if len(opt_matches) == 4:
            first_opt_pos = opt_matches[0].start()
            q_desc = clean_text(body[:first_opt_pos])
            for om in opt_matches:
                opt_key = om.group(1)
                opt_val = clean_text(om.group(2))
                options[opt_key] = opt_val

        sol = solutions.get(qid, {'answer': '', 'basis': '', 'distractor': '', 'full_solution': ''})

        questions.append({
            'id': qid,
            'exam': 'exam_a',
            'domain': get_domain(qid),
            'category': category,
            'type': 'single_choice',
            'question': q_desc,
            'options': options,
            'answer': sol['answer'],
            'basis': sol['basis'],
            'distractor': sol['distractor'],
            'full_solution': sol['full_solution']
        })

    return questions

def parse_exam_b(q_file, s_file):
    with open(q_file, 'r', encoding='utf-8') as f:
        q_text = f.read()
    with open(s_file, 'r', encoding='utf-8') as f:
        s_text = f.read()

    # Parse solutions
    sol_pattern = r'### 第\s*(\d+)\s*題[^\n]*\n([\s\S]*?)(?=(?:### 第\s*\d+\s*題|## |\Z))'
    solutions = {}
    for m in re.finditer(sol_pattern, s_text):
        qid = int(m.group(1))
        body = m.group(2).strip()
        ans_match = re.search(r'-\s*\*\*官方標準答案\*\*[：:]\s*([\s\S]*?)(?=(?:-\s*\*\*|\Z))', body)
        ans = clean_text(ans_match.group(1)) if ans_match else ''
        
        basis_match = re.search(r'-\s*\*\*解析依據[^\*]*\*\*[：:]\s*([\s\S]*?)$', body)
        basis = clean_text(basis_match.group(1)) if basis_match else ''

        solutions[qid] = {
            'answer': ans,
            'basis': basis,
            'full_solution': clean_text(body)
        }

    parts = [
        {"name": "第一部分：IR 事件應變與記憶體取證演練", "start": 1, "end": 23, "category": "事件應變與記憶體取證"},
        {"name": "第二部分：系統安全加固實務演練", "start": 24, "end": 51, "category": "系統安全加固實務"},
        {"name": "第三部分：CTF I 封包分析與密碼隱寫實戰演練", "start": 52, "end": 81, "category": "封包分析與密碼隱寫"},
        {"name": "第四部分：CTF II 實戰靶機渗透與權限提升演練", "start": 82, "end": 93, "category": "實戰靶機渗透與提權"}
    ]

    def get_part_info(qid):
        for p in parts:
            if p['start'] <= qid <= p['end']:
                cat = p['category']
                if p['start'] == 24:
                    if qid <= 38:
                        cat = "Linux 安全加固"
                    else:
                        cat = "Windows 安全加固"
                return p['name'], cat
        return "實體真題演練", "實戰分析"

    # Evidence blocks
    evidence_blocks = []
    # Pattern to match all ### 【情境背景說明】 or #### 【證據 ...】 or #### 【Linux...】
    ev_pattern = r'(#{3,4}\s*【(.*?)】\n[\s\S]*?)(?=(?:#{3,4}\s*【|## |\Z))'
    for em in re.finditer(ev_pattern, q_text):
        raw = em.group(1).strip()
        full_title = em.group(2).strip()
        first_line = raw.splitlines()[0]
        body = '\n'.join(raw.splitlines()[1:]).strip()
        
        # Decide which part this evidence belongs to
        part_idx = 1
        pos = em.start()
        p2_pos = q_text.find("## 第二部分")
        p3_pos = q_text.find("## 第三部分")
        p4_pos = q_text.find("## 第四部分")
        if p4_pos != -1 and pos >= p4_pos:
            part_idx = 4
        elif p3_pos != -1 and pos >= p3_pos:
            part_idx = 3
        elif p2_pos != -1 and pos >= p2_pos:
            part_idx = 2

        evidence_blocks.append({
            'part': part_idx,
            'title': f"【{full_title}】",
            'raw_title': full_title,
            'content': clean_text(body)
        })

    # Parse questions
    q_pattern = r'-\s*\*\*第\s*(\d+)\s*題\*\*\s*[:：]\s*([\s\S]*?)(?=(?:-\s*\*\*第\s*\d+\s*題|## |\Z))'
    questions = []
    for m in re.finditer(q_pattern, q_text):
        qid = int(m.group(1))
        body = clean_text(m.group(2))

        domain_name, category = get_part_info(qid)

        # Match related evidence based on content or QID
        related_ev = []
        if 1 <= qid <= 23:
            for ev in evidence_blocks:
                if ev['part'] == 1:
                    # check if evidence letter is mentioned (e.g. 證據 A, 證據 B, 證據 C, 證據 D)
                    m_ev = re.search(r'證據\s*([A-D])', ev['title'])
                    if m_ev and (f"證據 {m_ev.group(1)}" in body or f"證據{m_ev.group(1)}" in body):
                        related_ev.append(ev['title'])
            if not related_ev:
                related_ev.append("【情境背景說明】")
        elif 24 <= qid <= 38:
            related_ev.append("【Linux 安全加固篇 (第 24 ~ 38 題)】")
        elif 39 <= qid <= 51:
            related_ev.append("【Windows 安全加固篇 (第 39 ~ 51 題)】")
        elif 52 <= qid <= 81:
            for ev in evidence_blocks:
                if ev['part'] == 3:
                    m_ev = re.search(r'證據\s*([E-G])', ev['title'])
                    if m_ev and (f"證據 {m_ev.group(1)}" in body or f"證據{m_ev.group(1)}" in body):
                        related_ev.append(ev['title'])
            if not related_ev:
                related_ev.append("【情境背景說明】")
        elif 82 <= qid <= 93:
            for ev in evidence_blocks:
                if ev['part'] == 4:
                    m_ev = re.search(r'證據\s*([H-K])', ev['title'])
                    if m_ev and (f"證據 {m_ev.group(1)}" in body or f"證據{m_ev.group(1)}" in body):
                        related_ev.append(ev['title'])
            if not related_ev:
                related_ev.append("【情境背景說明】")

        sol = solutions.get(qid, {'answer': '', 'basis': '', 'full_solution': ''})

        # Clean answer string: extract clean version without quotes/backticks
        raw_ans = sol['answer']
        clean_ans = re.sub(r'^[`"\'\s]+|[`"\'\s]+$', '', raw_ans)

        questions.append({
            'id': qid,
            'exam': 'exam_b',
            'domain': domain_name,
            'category': category,
            'type': 'lab_question',
            'question': body,
            'related_evidence': related_ev,
            'answer': raw_ans,
            'clean_answer': clean_ans,
            'basis': sol['basis'],
            'full_solution': sol['full_solution']
        })

    return questions, evidence_blocks

def main():
    q_a_file = 'raw_data/mock_exam_a_questions.md'
    s_a_file = 'raw_data/mock_exam_a_solutions.md'
    q_b_file = 'raw_data/mock_exam_b_questions.md'
    s_b_file = 'raw_data/mock_exam_b_solutions.md'

    exam_a = parse_exam_a(q_a_file, s_a_file)
    exam_b, evidences = parse_exam_b(q_b_file, s_b_file)

    data = {
        'meta': {
            'title': '資安實戰模擬試題與錯題筆記系統',
            'version': '1.0',
            'updated': '2026-09-28',
            'counts': {
                'exam_a': len(exam_a),
                'exam_b': len(exam_b),
                'total': len(exam_a) + len(exam_b)
            },
            'domains_a': [
                "領域一：Web 應用安全與 OWASP Top 10",
                "領域二：密碼學與身份驗證機制",
                "領域三：網路協議分析與封包取證",
                "領域四：系統安全加固、Linux/Windows 權限與配置",
                "領域五：逆向工程、惡意程式與二進位安全",
                "領域六：資安法規、標準與治理體系",
                "領域七：資安事件應變與數位鑑識"
            ],
            'domains_b': [
                "第一部分：IR 事件應變與記憶體取證演練",
                "第二部分：系統安全加固實務演練",
                "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
                "第四部分：CTF II 實戰靶機渗透與權限提升演練"
            ]
        },
        'exam_a': exam_a,
        'exam_b': exam_b,
        'evidences': evidences
    }

    # Save JSON
    with open('exam_data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    # Save as JS object for zero-config file:// local opening
    js_content = "window.EXAM_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n"
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)

    print("Success: Generated exam_data.json and data.js!")
    print(f"Exam A: {len(exam_a)} questions.")
    print(f"Exam B: {len(exam_b)} questions.")
    print(f"Evidence sections: {len(evidences)} sections.")

if __name__ == '__main__':
    main()
