import urllib.request

base = 'https://raw.githubusercontent.com/Youchenjiang/sec-compendium/main/security/practice/exams/evidence/'
files = [
    'README.md',
    'evtx/windows_ir_security_sample.json',
    'pcap/dns_exfil_Topic1.pcap',
    'pcap/web_attack_traffic.pcap',
    'memory/patientportal.hprof.gz'
]

for f in files:
    url = base + f
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as resp:
            cl = resp.headers.get('Content-Length')
            print(f"{f}: OK ({cl} bytes)")
    except Exception as e:
        print(f"{f}: Failed ({e})")
