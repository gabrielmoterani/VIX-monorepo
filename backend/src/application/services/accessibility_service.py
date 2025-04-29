import json
from playwright.sync_api import sync_playwright

class AccessibilityService:
    def __init__(self):
        pass
        
    def get_accessibility_tree(self, html_content: str) -> dict:
        """
        Get accessibility tree of HTML content using Playwright
        
        Args:
            html_content: HTML content as a string
            
        Returns:
            dict: Accessibility tree as a dictionary
        """
        try:
            with sync_playwright() as p:
                browser = p.chromium.launch(headless=True)
                page = browser.new_page()
                page.set_content(html_content)
                snapshot = page.accessibility.snapshot()
                browser.close()
                return snapshot
        except Exception as e:
            print(f"Error getting accessibility tree: {e}")
            return {"error": f"Error getting accessibility tree: {str(e)}"} 