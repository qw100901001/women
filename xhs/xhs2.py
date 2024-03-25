import re
import time
import requests
import execjs
import json
import csv
from datetime import datetime, timedelta
from selenium import webdriver
from DrissionPage import ChromiumPage

from bs4 import BeautifulSoup

now = datetime.now()
time_formatted = now.strftime("%Y-%m-%d")
keyword=f"广州户外婚礼_{time_formatted}"

end_date = datetime.now().strftime("%Y-%m-%d")
start_date = end_date-timedelta(days=5)
print("keyword",end_date,start_date)
tabs=[]
tab_list=[]
tabIndex=-1

headers = {
    "authority": "edith.xiaohongshu.com",
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
    "content-type": "application/json;charset=UTF-8",
    "origin": "https://www.xiaohongshu.com",
    "referer": "https://www.xiaohongshu.com/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}
# 替换web_session
cookies = {
     "sec_poison_id": "7869d8b9-cba5-4841-aa34-7312e65506bb",
     "gid": "yYjdJqf4qqFdyYjdJqfJjWF14y48u9yKjS0FfjIkYSTTVJ28E9U8k0888qq4K448qfKYWY2j",
     "a1": "189e23d294140zt169carg8ckkjwtp0gr7d2arl9n50000334644",
     "websectiga": "7750c37de43b7be9de8ed9ff8ea0e576519e8cd2157322eb972ecb429a7735d4",
     "webId": "5be414ee9dea89add826c174c443f76b",
     "web_session": "0400698e076e1b56170f5ebb35344b1bd1aca3",
     "xsecappid": "xhs-pc-web",
     "webBuild": "4.6.0",
     "acw_tc":"5f3d3b2f73520242752033111daf0192e3c0b08578d3ffc8ccd2c93c6e66e106",
     "gid":"yYjdJqf4qqFdyYjdJqfJjWF14y48u9yKjS0FfjIkYSTTVJ28E9U8k0888qq4K448qfKYWY2j",
     "abRequestId":"5be414ee9dea89add826c174c443f76b",

}


js = execjs.compile(open(r'info.js', 'r', encoding='utf-8').read())

note_count = 0

# 向csv文件写入表头  笔记数据csv文件
header = ["评论","评论时间","笔记标题", "笔记链接","用户名", "IP属地","笔记内容"]
f=open(f"{keyword}.csv", 'a', encoding="utf-8-sig", newline="")
writer = csv.DictWriter(f, header)
writer.writeheader()


# 时间戳转换成日期
def get_time(ctime):
    timeArray = time.localtime(int(ctime / 1000))
    otherStyleTime = time.strftime("%Y-%m-%d", timeArray)
    return str(otherStyleTime)


# 保存笔记数据
def get_note_info(note_id, title,user_name, user_id):
    note_url = f'https://www.xiaohongshu.com/explore/{note_id}'
    res = requests.get(note_url, headers=headers, cookies=cookies)
    bs = BeautifulSoup(res.text, "html.parser")  # 创建BeautifulSoup对象

    comment_url=f'https://edith.xiaohongshu.com/api/sns/web/v2/comment/page?note_id={note_id}&cursor=&top_comment_id=&image_formats=jpg,webp,avif'
    comment_res = requests.get(comment_url, headers=headers, cookies=cookies)
    comment_json_data = comment_res.json()
    commentsList = comment_json_data['data']['comments']
    content=bs.find('div', {'class': 'desc'})
    data_dict = {
        "评论":"",
        "评论时间":"",
        "笔记标题": title.strip(),
        "笔记链接": "https://www.xiaohongshu.com/explore/" + note_id,
        "用户名": user_name.strip(),
        "IP属地": "",
        "笔记内容": ""
    }
    if content is not None :
       content = content.get_text().strip().replace('\n', '')
       data_dict["笔记内容"]=content  
    time.sleep(1)
    # 笔记数量+1
    global note_count
    note_count += 1
    print("note_count",note_count)
    print(f"当前笔记数量: {note_count}\n",
          f"笔记标题：{data_dict['笔记标题']}\n",
          f"笔记链接：{data_dict['笔记链接']}\n",
          f"用户名：{data_dict['用户名']}\n"
          )
    print("data_dict",data_dict)
    writeRowHandler(commentsList,data_dict)
    
def writeRowHandler(commentsList,data_dict):
    for comment in commentsList:
        if "sub_comments" in comment:
            writeRowHandler(comment["sub_comments"],data_dict)
        else:
            check_date = get_time(comment["create_time"])
            data_dict["评论"]=comment["content"].strip()
            data_dict["评论时间"]=check_date
            end_date = datetime.now().strftime("%Y-%m-%d%")
            start_date = end_date-timedelta(days=5)
            
            if is_date_in_range(start_date,end_date,check_date):
                if "ip_location" in comment:
                    if comment["ip_location"]=='广东':
                        data_dict["IP属地"]=comment["ip_location"]
                        writer.writerow(data_dict)                   
def is_date_in_range(start_date, end_date, check_date):
    # 将输入的日期字符串转换为datetime对象
    start_date = datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.strptime(end_date, "%Y-%m-%d")
    check_date = datetime.strptime(check_date, "%Y-%m-%d") 
    return start_date <= check_date <= end_date

def keyword_search(type):
    api = '/api/sns/web/v1/search/notes'
    search_url = "https://edith.xiaohongshu.com/api/sns/web/v1/search/notes"

    # 排序方式 general: 综合排序 popularity_descending: 热门排序 time_descending: 最新排序 
    data = {
        "image_scenes": "FD_PRV_WEBP,FD_WM_WEBP",
        "keyword": "",
        "note_type": "0",
        "page": "",
        "page_size":"20",
        "search_id": "2c7hu5b3kzoivkh848hp0",
        "sort": "time_descending",
        "filters":"[{\"type\":\"filter_hot\",\"tags\":[\"花园风\"]}]"
    }

    data = json.dumps(data, separators=(',', ':'))
    data = re.sub(r'"keyword":".*?"', f'"keyword":"{keyword}"', data)
    page_count=20
    for page in range(1, page_count):
        print("page",page,page_count)
        data = re.sub(r'"page":".*?"', f'"page":"{page}"', data)

        ret = js.call('get_xs', api, data, cookies['a1'])
        headers['x-s'], headers['x-t'] = ret['X-s'], str(ret['X-t'])

        response = requests.post(search_url, headers=headers, cookies=cookies, data=data.encode('utf-8'))

        json_data = response.json()
        try:
            notes = json_data['data']['items']
        except:
            global tabIndex
            length=len(tabs)
            print('================爬取完毕================',tabIndex)
            break
            tabIndex+=1
            if tabIndex==length-1:
                break
            else:
                tab=tabs[tabIndex]
                keyword_search(tab.text)    
        for note in notes:
            note_id = note['id']
            if len(note_id) != 24:
                continue
            try:
                title = note['note_card']['display_title']
            except:
                title = ''

            user_avatar = note['note_card']['user']['avatar']
            user_name = note['note_card']['user']['nick_name']
            user_id = note['note_card']['user']['user_id']

            get_note_info(note_id, title,user_name, user_id)

def getChromiumPage():
    global tabs
    page = ChromiumPage()
    page.get('https://www.xiaohongshu.com/search_result?keyword='+keyword+'&source=web_explore_feed') 
    tab_container = page.ele('.reds-sticky-box')
    tabs=tab_container.eles(".tab")
    keyword_search("")
   
def main():
    getChromiumPage()
    time.sleep(2)
 
  



if __name__ == "__main__":
    main()





