# 🧪 鑑識分析實體跡證標本庫 (Synthetic & Competition Forensic Evidence Catalog)

> [!IMPORTANT]
> **用途**: 本目錄收錄實體 PCAP 封包、Windows 安全事件日誌、Java 堆疊傾印 (Hprof) 以及競賽級記憶體/硬碟鑑識標本。
> **支援對象**:
> 1. 免開虛擬機／容器，直接本機以 `tshark`、`wireshark`、`strings`、`chainsaw` 揮刀實作。
> 2. 對應 **全真模擬測驗 B 卷 (mock_exam_b_lab_questions.md)** 與 107 本藍隊作戰手冊。

---

## 📊 跡證標本清單與 SHA-256 完整性校驗

| 檔案路徑 | 類型 | 檔案大小 | SHA-256 雜湊值 | 對應手冊 / 題組 |
| :--- | :--- | :--- | :--- | :--- |
| `pcap/dns_exfil_Topic1.pcap` | 網路封包 | 251 KB | `6c83bffd3c2ab063adff46bbbe4e51719fb528f50bdbd9f34b5361e00cca04fd` | `16.1` / Mock Exam B 題組一 (Q1~Q3) |
| `pcap/web_attack_traffic.pcap` | 網路封包 | 11.8 MB | `dd54e952b55f28c99766c1658958b00afce480f90604e7b182f7b9857c6dff4e` | `28.1`, `16.2` / Mock Exam B 題組一 (Q4~Q8) |
| `memory/patientportal.hprof.gz` | JVM 記憶體 | 6.3 MB | `ca355a65f7c62822c08c473590e9700b271782c8a75fcc900f1edf7ffe082e79` | `20.1` / Mock Exam B 題組二 (Q9~Q15) |
| `evtx/windows_ir_security_sample.json` | 事件日誌 | 2.5 KB | `c6ab881122a847a1e31d395d94b5e426131578aab0bf2cfc2412cdafdfb9353e` | `15.3`, `18.4` / Mock Exam B (證據 C) |
| `memory/target.mem` *(本機位置)* | 系統記憶體 | 1.0 GB | `20260728 Skills Competition/題目/IR/試題檔/` | `23.1` / Mock Exam B 題組二 (Q16~Q22) |
| `disk/workstation.ext4.img` *(本機位置)* | 磁碟映像 | 160 MB | `20260728 Skills Competition/題目/IR/試題檔/` | `24.1`, `25.1` / Mock Exam B 題組三 (Q23~Q24) |

---

## 🛠️ 實戰指令快速速查指引

### 1. DNS 隱寫外帶分析 (`pcap/dns_exfil_Topic1.pcap`)
```bash
# 篩選所有 DNS 查詢請求與回應
tshark -r pcap/dns_exfil_Topic1.pcap -Y "dns" -T fields -e frame.time -e ip.src -e dns.qry.name | head -n 30

# 提取被外帶的 Base32/Base64/Hex 子域名並還原檔案
tshark -r pcap/dns_exfil_Topic1.pcap -Y "dns.qry.name contains sync-cdn" -T fields -e dns.qry.name | sort -u
```

### 2. Web 入侵與橫向移動流量分析 (`pcap/web_attack_traffic.pcap`)
```bash
# 統計 HTTP 狀態碼與請求量最高的來源 IP (識別掃描器與入侵者)
tshark -r pcap/web_attack_traffic.pcap -Y "http.request" -T fields -e ip.src | sort | uniq -c | sort -nr

# 檢索 SQL Injection 特徵與 API 端點
tshark -r pcap/web_attack_traffic.pcap -Y "http.request.uri contains products or http.request.uri contains admin" -T fields -e ip.src -e http.request.method -e http.request.uri
```

### 3. Java 記憶體 Dump 分析 (`memory/patientportal.hprof.gz`)
```bash
# 解壓縮 Hprof 檔案
gzip -dk memory/patientportal.hprof.gz

# 透過 strings 搜尋記憶體敏感關鍵字 (JWT, 密碼, Token, Flag)
strings memory/patientportal.hprof | grep -E "(jwt|secret|key|flag|mediSync)" -i -C 2
```

### 4. Windows 安全事件獵捕 (`evtx/windows_ir_security_sample.json`)
```bash
# 快速檢視 Event ID 統計分佈
jq '.[].EventID' evtx/windows_ir_security_sample.json | sort | uniq -c

# 提取暴力破解 (4625) 與提權服務安裝 (7045)
jq '.[] | select(.EventID == 4625 or .EventID == 7045)' evtx/windows_ir_security_sample.json
```
