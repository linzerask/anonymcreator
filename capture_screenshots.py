import os
import time
from playwright.sync_api import sync_playwright

def main():
    screenshots_dir = os.path.join(os.path.dirname(__file__), "screenshots")
    os.makedirs(screenshots_dir, exist_ok=True)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop Homepage (1920x1080)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        page.goto("http://localhost:8099/index.html", wait_until="networkidle")
        time.sleep(1)
        
        # Scroll and reveal all elements
        page.evaluate("""() => {
            document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('visible'));
        }""")
        time.sleep(0.5)
        
        homepage_path = os.path.join(screenshots_dir, "homepage_portfolio_redesign.png")
        page.screenshot(path=homepage_path, full_page=True)
        print(f"Captured: {homepage_path}")
        context.close()
        
        # 2. Desktop Projekte Page (1920x1080)
        context = browser.new_context(viewport={"width": 1920, "height": 1080})
        page = context.new_page()
        page.goto("http://localhost:8099/projekte.html", wait_until="networkidle")
        time.sleep(1)
        
        page.evaluate("""() => {
            document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('visible'));
        }""")
        time.sleep(0.5)
        
        projekte_desktop_path = os.path.join(screenshots_dir, "projekte_desktop_redesign.png")
        page.screenshot(path=projekte_desktop_path, full_page=True)
        print(f"Captured: {projekte_desktop_path}")
        
        # Test Filter Click (Web-Apps)
        webapps_btn = page.query_selector('button[data-filter="webapps"]')
        if webapps_btn:
            webapps_btn.click()
            time.sleep(0.5)
            filtered_path = os.path.join(screenshots_dir, "projekte_filtered_webapps.png")
            page.screenshot(path=filtered_path, full_page=True)
            print(f"Captured filtered: {filtered_path}")
            
        context.close()
        
        # 3. Mobile Projekte Page (375x812)
        context = browser.new_context(viewport={"width": 375, "height": 812}, is_mobile=True)
        page = context.new_page()
        page.goto("http://localhost:8099/projekte.html", wait_until="networkidle")
        time.sleep(1)
        
        page.evaluate("""() => {
            document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('visible'));
        }""")
        time.sleep(0.5)
        
        projekte_mobile_path = os.path.join(screenshots_dir, "projekte_mobile_redesign.png")
        page.screenshot(path=projekte_mobile_path, full_page=True)
        print(f"Captured: {projekte_mobile_path}")
        context.close()
        
        browser.close()
        print("All screenshots captured successfully!")

if __name__ == "__main__":
    main()
