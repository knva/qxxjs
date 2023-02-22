##
## 使用说明：1运行centbrowser C:\Users\Administrator\AppData\Local\CentBrowser\Application\chrome.exe chrome.exe --remote-debugging-port=9222
## 2：运行本脚本
import os.path
import sys

from selenium.webdriver.common.by import By
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
chrome_options = Options()
chrome_driver = "chromedriver.exe"

JS_ADD_TEXT_TO_INPUT = """
  var elm = arguments[0], txt = arguments[1];
  elm.value += txt;
  elm.dispatchEvent(new Event('change'));
  """

if __name__ == '__main__':
    if len(sys.argv) == 3:
        port = sys.argv[1]
        jsname = sys.argv[2]
    elif len(sys.argv)==2:
        if ".js" in sys.argv[1]:
            port = "9222"
            jsname=sys.argv[1]
        else:
            port = sys.argv[1]
            print("端口为：",port)
            print("执行默认文档")
    else:
        print("执行默认文档")
        port = "9222"
        jsname="run.js"

    chrome_options.add_experimental_option("debuggerAddress", "127.0.0.1:"+str(port))
    driver = webdriver.Chrome(chrome_driver, chrome_options=chrome_options)
    print(driver.title)
    if driver == "MUD游戏，武神传说":
        print('未登录')
    elif "-MUD游戏-武神传说" in driver.title:
        print('登陆账号为', driver.title)
        print("执行{}内容".format(jsname))
        # 判断run.js是否存在
        if os.path.exists(jsname):
            with open(jsname,encoding='utf-8') as f:

                elem = driver.find_element(By.ID,'testmain')
                elem.clear()
                driver.execute_script(JS_ADD_TEXT_TO_INPUT, elem, f.read())
                driver.execute_script("unsafeWindow.ToRaid.perform($(\"#testmain\").val());")
        else:
            print('{}不存在'.format(jsname))
    elif "wsmud多开" in driver.title:
        print("执行{}内容".format(jsname))
        if os.path.exists(jsname):
            with open(jsname,encoding='utf-8') as f:

                elem = driver.find_element(By.ID,'data')
                elem.clear()
                driver.execute_script(JS_ADD_TEXT_TO_INPUT, elem, f.read())
                elem = driver.find_element(By.ID,'sendBtn')
                elem.click()
        else:
            print('{}不存在'.format(jsname))
    else:
        print('未知页面')
