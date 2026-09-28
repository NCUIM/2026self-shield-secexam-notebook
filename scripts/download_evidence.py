import urllib.request
import os
import sys
import hashlib

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

EVIDENCE_BASE = "https://raw.githubusercontent.com/Youchenjiang/sec-compendium/main/security/practice/exams/evidence/"

FILES = [
    {
        "relpath": "evtx/windows_ir_security_sample.json",
        "desc": "Windows 安全事件日誌 (JSON 格式)",
        "expected_hash": "c6ab881122a847a1e31d395d94b5e426131578aab0bf2cfc2412cdafdfb9353e"
    },
    {
        "relpath": "pcap/dns_exfil_Topic1.pcap",
        "desc": "DNS 隱寫外帶流量封包 (Wireshark PCAP)",
        "expected_hash": "6c83bffd3c2ab063adff46bbbe4e51719fb528f50bdbd9f34b5361e00cca04fd"
    },
    {
        "relpath": "pcap/web_attack_traffic.pcap",
        "desc": "Web 攻擊與 SQL 注入實體封包 (11.8 MB)",
        "expected_hash": "dd54e952b55f28c99766c1658958b00afce480f90604e7b182f7b9857c6dff4e"
    },
    {
        "relpath": "memory/patientportal.hprof.gz",
        "desc": "Java JVM 堆疊記憶體傾印 (6.3 MB)",
        "expected_hash": "ca355a65f7c62822c08c473590e9700b271782c8a75fcc900f1edf7ffe082e79"
    }
]

def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def main():
    target_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'evidence')
    os.makedirs(target_dir, exist_ok=True)
    print("=" * 60)
    print("  下載全真模擬測驗 B 卷實體跡證檔案標本庫")
    print(f"  儲存目錄: {target_dir}")
    print("=" * 60)

    for item in FILES:
        rel = item['relpath']
        dest = os.path.join(target_dir, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        url = EVIDENCE_BASE + rel

        print(f"\n[下載中] {item['desc']} -> {rel}")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out_f:
            out_f.write(resp.read())

        actual_hash = sha256_file(dest)
        status = "[通過] 完整性校驗成功" if actual_hash == item['expected_hash'] else "[警告] 雜湊值不相符"
        print(f"  大小: {os.path.getsize(dest):,} bytes")
        print(f"  SHA256: {actual_hash}")
        print(f"  狀態: {status}")

    print("\n" + "=" * 60)
    print("  所有實體證據標本已下載完畢！可直接以 Wireshark / Tshark / JQ 實作分析。")
    print("=" * 60)

if __name__ == '__main__':
    main()
