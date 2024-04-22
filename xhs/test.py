from DrissionPage import ChromiumPage,SessionPage
page = ChromiumPage()
page.get('https://mc.xitaoinfo.com/mc/v2/login#/home')
cookies=page.get_cookies()
 
print(cookies)