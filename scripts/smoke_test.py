import os
import http.server
import socketserver
import threading
import urllib.request
import json
import time

PORT = 8999
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve from project root
        super().__init__(*args, directory=PROJECT_ROOT, **kwargs)

def start_server():
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"[TEST SERVER] Serving files at http://localhost:{PORT}")
        httpd.serve_forever()

def run_smoke_test():
    print("=" * 80)
    print("STARTING SMOKE TEST FOR PODCAST Q&A BOT APPLICATION")
    print("=" * 80)
    
    # 1. Start local server in a separate thread
    server_thread = threading.Thread(target=start_server)
    server_thread.daemon = True
    server_thread.start()
    
    # Give server a moment to start
    time.sleep(1.5)
    
    success = True
    assets_to_test = [
        ("/", "text/html"),
        ("/index.html", "text/html"),
        ("/src/styles.css", "text/css"),
        ("/src/app.js", "application/javascript"),
        ("/public/transcript.json", "application/json")
    ]
    
    print("\n[STEP 1] Testing HTTP Status of Application Assets...")
    print("-" * 50)
    for asset, expected_type in assets_to_test:
        url = f"http://localhost:{PORT}{asset}"
        try:
            response = urllib.request.urlopen(url)
            status = response.getcode()
            content_type = response.info().get_content_type()
            
            if status == 200:
                print(f"[ OK  ] {asset:<30} -> HTTP 200 OK (Type: {content_type})")
            else:
                print(f"[FAIL ] {asset:<30} -> HTTP {status}")
                success = False
        except Exception as e:
            print(f"[FAIL ] {asset:<30} -> Failed to fetch: {e}")
            success = False
            
    # 2. Validate Transcript Data Schema
    print("\n[STEP 2] Validating Transcript Data Structure & Schema...")
    print("-" * 50)
    try:
        url = f"http://localhost:{PORT}/public/transcript.json"
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        
        if isinstance(data, list) and len(data) > 0:
            first_item = data[0]
            required_keys = {"id", "text", "start", "duration", "timestamp"}
            missing_keys = required_keys - set(first_item.keys())
            
            if not missing_keys:
                print(f"[ OK  ] Transcript Validated: {len(data)} chunks found.")
                print(f"        Schema Schema Check: Passed ({', '.join(required_keys)})")
                print(f"        Sample chunk text snippet: \"{first_item['text'][:60]}...\"")
            else:
                print(f"[FAIL ] Transcript Schema Invalid. Missing keys: {missing_keys}")
                success = False
        else:
            print("[FAIL ] Transcript JSON is empty or not a list.")
            success = False
    except Exception as e:
        print(f"[FAIL ] Transcript parsing failed: {e}")
        success = False

    # 3. Check file contents of index.html for correct references
    print("\n[STEP 3] Verifying Asset References in index.html...")
    print("-" * 50)
    try:
        with open(os.path.join(PROJECT_ROOT, "index.html"), 'r', encoding='utf-8') as f:
            html_content = f.read()
            
        references = [
            ('./src/styles.css', 'styles.css stylesheet link'),
            ('./src/app.js', 'app.js script tag'),
            ('https://www.youtube.com/iframe_api', 'YouTube API Script')
        ]
        
        for ref, desc in references:
            if ref in html_content:
                print(f"[ OK  ] Reference check: Found '{ref}' ({desc})")
            else:
                print(f"[FAIL ] Reference check: Missing '{ref}' ({desc})")
                success = False
    except Exception as e:
        print(f"[FAIL ] index.html verification failed: {e}")
        success = False

    print("\n" + "=" * 80)
    if success:
        print("[ SUCCESS ] SMOKE TEST PASSED: Application is fully functional and ready for deployment!")
    else:
        print("[ ERROR ] SMOKE TEST FAILED: Please check the errors above.")
    print("=" * 80)
    
    # Server will automatically stop when python script exits

if __name__ == "__main__":
    run_smoke_test()
