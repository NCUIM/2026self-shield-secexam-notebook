# 2026self-shield-secexam-notebook
### 資安客觀綜合 100 題 & 全國技能競賽/金盾獎實體真題 93 題 全真互動問答與錯題記事本

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: Web](https://img.shields.io/badge/Platform-Web%20%7C%20Offline%20Ready-brightgreen.svg)](#)
[![Questions: 193](https://img.shields.io/badge/Questions-193%20Verified%20Q%26A-orange.svg)](#)
[![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla%20JS)-success.svg)](#)

專為資安從業人員、各類資安證照備考者、全國技能競賽（Cyber Security）與金盾獎資安競賽選手打造的**雙卷全功能離線互動刷題系統與專屬錯題記事本**。

題庫與解答完整提取自開源社群題庫 [Youchenjiang/sec-compendium](https://github.com/Youchenjiang/sec-compendium/tree/main/security/practice/exams)，並經過全自動逐題交叉校驗，確保題目、選項、官方解答與深度剖析 100% 精準無誤。

---

## 🌟 系統核心特色

### 1. 雙卷雙軌模式，共 193 道高質量試題與解析
- **📘 全真模擬測驗 A 卷（客觀綜合 100 題）**：
  - 100 道單選題，全面覆蓋現代資訊安全 7 大核心知識領域。
  - 每道題目均附帶**「標準答案」**、**「正解核心依據」**以及**「誘答干擾項辨析（易錯陷阱深度剖析）」**。
- **🛠️ 全真模擬測驗 B 卷（全國技能競賽 & 金盾獎實體真題 93 題）**：
  - 改編自國內外頂尖資安實務競賽真題，涵蓋 4 大實戰模組。
  - 系統內建**【實戰情境證據資料庫】**（Volatility 記憶體 dump、Windows 日誌、PCAP 封包、加固規則、Web 原始碼），可隨時一鍵展開比對。

### 2. 三大多工學習模式
- 🎯 **刷題練習模式 (Practice Mode)**：即答即評，即刻展開正解原理與干擾項剖析；答錯時系統自動收錄至錯題記事本。
- ⏱️ **模擬考閉卷模式 (Exam Simulation)**：配備倒數計時器（A 卷 90 分鐘 / B 卷 180 分鐘）與全卷答題卡快速跳轉，交卷後自動計算得分、繪製領域掌握度長條圖，並批次將錯題加入錯題本。
- 📕 **錯題專攻記事本 (Mistake Notebook)**：
  - **個人訂正筆記**：每道題皆有專屬備忘錄，記錄盲點與心得，輸入即自動保存至瀏覽器 `localStorage`。
  - **掌握度分級**：支援 `🔴 待加強`、`🟡 已理解`、`🟢 已掌握` 動態標記。
  - **快捷標籤**：一鍵插入 `#考點盲區`、`#粗心看錯`、`#概念混淆`、`#高頻必背`、`#關鍵指令`。
  - **錯題專項重測**：一鍵清空錯題作答狀態，啟動針對性測驗直到完全攻克。

### 3. 多維度備份與知識庫匯出
- **📥 一鍵下載「錯題筆記本 (.md)」**：自動將所有錯題、選項、標準答案、官方詳解與您的個人訂正心得排版輸出為 Markdown 文件，便於收錄進 Notion / Obsidian 或列印複習。
- **📦 JSON 學習進度跨裝置同步**：完整匯出/匯入作答進度、收藏星號與筆記，換電腦或換瀏覽器無縫銜接。

### 4. 實體跡證完整打包 (`evidence/`)
專案附帶實際競賽等級的真實跡證標本檔案，可直接使用本機分析工具（Wireshark, Tshark, strings, JQ）動手操作：
- `dns_exfil_Topic1.pcap`：DNS 隱寫外帶流量封包 (251 KB)
- `web_attack_traffic.pcap`：Web 攻擊與 SQL 注入實體封包 (11.8 MB)
- `windows_ir_security_sample.json`：Windows 安全事件日誌 (Event ID 4625, 4624, 7045, 4688)
- `patientportal.hprof.gz`：JVM 記憶體堆疊傾印標本 (6.3 MB)

---

## 📚 試卷架構與題型分佈

### 📘 A 卷：資安客觀綜合 100 題
| 領域編號 | 知識領域名稱 | 涵蓋題號 | 關鍵考點 |
| :--- | :--- | :---: | :--- |
| **領域一** | Web 應用安全與 OWASP Top 10 | Q1 ~ Q20 | SQLi, XSS, CSRF, SSRF, CORS, JWT, IDOR, XXE, SSTI |
| **領域二** | 密碼學與身份驗證機制 | Q21 ~ Q35 | AES 模式, Padding Oracle, RSA, 橢圓曲線, Diffie-Hellman, 哈希加鹽 |
| **領域三** | 網路協議分析與封包取證 | Q36 ~ Q50 | TCP 三向交握, ARP 欺騙, DNS 放大, TLS 握手, ICMP 隧道, Wireshark |
| **領域四** | 系統安全加固與權限配置 | Q51 ~ Q65 | Linux 檔案權限, SUID, Sudoers, SELinux, iptables, Windows GPO, UAC |
| **領域五** | 逆向工程、惡意程式與二進位安全 | Q66 ~ Q80 | Buffer Overflow, ROP, ASLR/DEP, 加殼/脫殼, PE 結構, 動態除錯 |
| **領域六** | 資安法規、標準與治理體系 | Q81 ~ Q90 | 資通安全管理法, 個人資料保護法, ISO 27001, NIST CSF, ISMS 稽核 |
| **領域七** | 資安事件應變與數位鑑識 | Q91 ~ Q100 | 鑑識採證原則, 揮發性順序, NTFS MFT, Prefetch, 記憶體取證, 反鑑識 |

### 🛠️ B 卷：實體真題演練 93 題
| 部分編號 | 實戰情境主題 | 涵蓋題號 | 核心實作技術 |
| :--- | :--- | :---: | :--- |
| **第一部分** | IR 事件應變與記憶體取證演練 | Q1 ~ Q23 | Volatility 3 `pslist`/`netscan`, Windows EVTX 登入與持久化追蹤 |
| **第二部分** | 系統安全加固實務演練 | Q24 ~ Q51 | OpenSSH 加固, PAM 登入防禦, SUID 清理, sysctl, iptables, secpol.msc |
| **第三部分** | CTF I 封包分析與密碼隱寫演練 | Q52 ~ Q81 | DNS 隧道解碼, 客戶名單隱寫 Flag 還原, HTTP 攻擊封包逆向 |
| **第四部分** | CTF II 實戰靶機渗透與權限提升 | Q82 ~ Q93 | Nmap 全端口掃描, PHP 檔案包含, Flask API 滲透, Sudo GTFOBins 提權 |

---

## 🚀 快速開始使用

本專案為**零依賴純前端應用（Pure Vanilla HTML/CSS/JS）**，無需安裝 Node.js 或建置編譯環境，100% 離線可用。

### 方式一：直接在瀏覽器開啟（最推薦）
雙擊開啟專案根目錄下的任一檔案即可立即作答：
- **`index.html`**：完整功能版（分離式結構）
- **`sec_quiz_notebook_standalone.html`**：**單一檔案獨立免安裝版**（所有樣式、資料庫與邏輯已濃縮於單檔，僅約 418 KB，極適合隨身攜帶或傳送）

### 方式二：本機 Python 伺服器啟動
在終端機中執行內附腳本：
```bash
python start_server.py
```
伺服器將在 `http://localhost:8080/index.html` 啟動並自動為您彈出瀏覽器。

### 方式三：啟用 GitHub Pages（線上隨時刷題）
1. 在您個人的 GitHub 倉庫點擊 **Settings → Pages**。
2. 在 **Build and deployment** 下將 Source 設為 `Deploy from a branch`，Branch 選擇 `main`，資料夾選擇 `/ (root)`，點擊 **Save**。
3. 稍候數分鐘即可取得專屬公開網址（例如 `https://<帳號>.github.io/2026self-shield-secexam-notebook/`），無論手機、平板或電腦皆能隨時隨地刷題！

---

## ⌨️ 鍵盤快捷鍵指南

| 按鍵 | 操作功能 |
| :---: | :--- |
| `A` / `B` / `C` / `D` 或 `1` / `2` / `3` / `4` | 快速選取單選題對應選項 |
| `←` 或 `P` | 切換至上一題 (Previous) |
| `→` 或 `N` | 切換至下一題 (Next) |
| `S` | 標記重點／切換收藏星號（★） |
| `Enter` | 在 B 卷實作題中快速送出答案比對 |

---

## 📂 專案檔案結構清單

```text
2026self-shield-secexam-notebook/
├── index.html                     # 主程式入口（現代化雙卷問答與錯題記事本介面）
├── style.css                      # UI 樣式表（深色/淺色主題、響應式排版）
├── app.js                         # 核心邏輯（答題比對、錯題自動收錄、筆記自動保存）
├── data.js                        # 打包後題庫資料庫（含 A/B 卷 193 題與 20 組實戰情境證據）
├── exam_data.json                 # 標準 JSON 格式題庫與證據資料
├── sec_quiz_notebook_standalone.html # 單檔免安裝獨立版（大小僅約 418 KB，開箱即用）
├── start_server.py                # 一鍵本地 Web 伺服器啟動腳本
├── verify_answers.py              # 全題庫答案 100% 交叉自動校驗腳本
├── README.md                      # 專案詳細說明與架構手冊
├── evidence/                      # 實體真題跡證標本庫
│   ├── pcap/                      # DNS 外洩與 Web 攻擊 PCAP 封包
│   ├── evtx/                      # Windows 安全日誌 JSON 樣本
│   ├── memory/                    # JVM 堆疊記憶體傾印標本
│   └── README.md                  # 跡證檔案清單與 SHA-256 校驗指引
├── raw_data/                      # 原始 Markdown 試題與官方解題手冊
│   ├── mock_exam_a_questions.md
│   ├── mock_exam_a_solutions.md
│   ├── mock_exam_b_questions.md
│   └── mock_exam_b_solutions.md
└── scripts/                       # 輔助建置與處理腳本
    ├── bundle_single_file.py      # 單檔 HTML 打包腳本
    ├── check_evidence_urls.py     # 遠端跡證校驗腳本
    ├── download_data.py           # 原始題庫拉取腳本
    ├── download_evidence.py       # 實體跡證檔案下載腳本
    └── parse_data.py              # 題庫剖析與結構化腳本
```

---

## 📜 聲明與致謝

- **題庫來源**：特別感謝 [Youchenjiang/sec-compendium](https://github.com/Youchenjiang/sec-compendium) 專案提供高品質、專業嚴謹之資安客觀綜合 100 題與實體真題情境推演題本。
- **免責聲明**：本專案僅供資安學術研究、技能競賽訓練與資安教育使用。嚴禁將相關技術、Payload 與實作手法用於任何未經合法授權之滲透測試或惡意攻擊行為。
