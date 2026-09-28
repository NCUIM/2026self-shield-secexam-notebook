import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
DIRECTORY = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run():
    print(f"==================================================")
    print(f" 資安實戰試題問答與錯題記事本 啟動中...")
    print(f" 目錄: {DIRECTORY}")
    print(f" 網址: http://localhost:{PORT}")
    print(f"==================================================")
    
    url = f"http://localhost:{PORT}/index.html"
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"無法自動開啟瀏覽器，請手動存取: {url}")

    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"伺服器已在 http://localhost:{PORT} 運行，按 Ctrl+C 可停止伺服器。")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n伺服器已安全停止。")

if __name__ == '__main__':
    run()
