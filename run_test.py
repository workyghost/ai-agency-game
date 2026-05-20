import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

def run_tests():
    # Setup chrome options for headless execution
    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--window-size=1280,800")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")

    # Start Chrome driver
    driver = webdriver.Chrome(options=chrome_options)
    
    # Path to local index.html
    html_path = os.path.abspath("index.html")
    url = f"file:///{html_path}".replace("\\", "/")
    print(f"Opening URL: {url}")
    driver.get(url)
    
    # Create screenshots directory
    os.makedirs("screenshots", exist_ok=True)
    
    time.sleep(2)
    driver.save_screenshot("screenshots/01_init.png")
    print("Initial screenshot captured.")
    
    # Check input field position
    input_el = driver.find_element(By.ID, "terminal-input")
    location = input_el.location
    size = input_el.size
    print(f"Terminal Input Position: {location}, Size: {size}")
    
    # Helper to send command
    def send_cmd(cmd):
        # Dismiss level up modal if it becomes active
        try:
            modal = driver.find_element(By.ID, "level-up-modal")
            if "active" in modal.get_attribute("class"):
                print("Level up modal detected. Dismissing it...")
                close_btn = driver.find_element(By.ID, "level-up-close-btn")
                close_btn.click()
                time.sleep(1)
        except Exception as e:
            pass
            
        print(f"Running command: {cmd}")
        input_el.click()
        input_el.send_keys(cmd)
        input_el.send_keys(Keys.ENTER)
        time.sleep(3)  # Wait for output typing to finish
        
    # Execute onboarding commands
    send_cmd("automate-ops")
    driver.save_screenshot("screenshots/02_automate_ops.png")
    
    send_cmd("select-niche local-service")
    driver.save_screenshot("screenshots/03_select_niche.png")
    
    send_cmd("next-month")
    driver.save_screenshot("screenshots/04_next_month.png")
    
    # Let's inspect some state changes in DOM
    level_el = driver.find_element(By.ID, "agency-level")
    mrr_el = driver.find_element(By.ID, "mrr-usd")
    cash_el = driver.find_element(By.ID, "cash-reserve")
    hours_el = driver.find_element(By.ID, "weekly-hours")
    
    print(f"UI Values after Lvl 1 transition:")
    print(f"  Level: {level_el.text}")
    print(f"  MRR: {mrr_el.text}")
    print(f"  Cash: {cash_el.text}")
    print(f"  Weekly Hours: {hours_el.text}")
    
    # Execute outbound and demo calls (Level 1 allows outbound? Wait, outbound templates are Lvl 3+, but let's see)
    send_cmd("send-outbound")
    driver.save_screenshot("screenshots/05_send_outbound.png")
    
    # Display outbound-templates
    send_cmd("outbound-templates")
    driver.save_screenshot("screenshots/06_outbound_templates.png")
    
    # Scroll position of terminal output
    output_el = driver.find_element(By.ID, "terminal-output")
    scroll_top = driver.execute_script("return arguments[0].scrollTop;", output_el)
    scroll_height = driver.execute_script("return arguments[0].scrollHeight;", output_el)
    client_height = driver.execute_script("return arguments[0].clientHeight;", output_el)
    print(f"Terminal Output Scroll: scrollTop={scroll_top}, scrollHeight={scroll_height}, clientHeight={client_height}")
    
    # Check if input line is in viewport
    body_height = driver.execute_script("return window.innerHeight;")
    input_rect_bottom = driver.execute_script("return arguments[0].getBoundingClientRect().bottom;", input_el)
    print(f"Window height: {body_height}, Input bottom rect: {input_rect_bottom}")
    if input_rect_bottom > body_height:
        print("WARNING: Input line is pushed below the visible viewport!")
    else:
        print("SUCCESS: Input line is visible within the viewport.")
        
    driver.quit()

if __name__ == "__main__":
    run_tests()
