import re
import time
import requests
import execjs
import json
import csv
from datetime import datetime, timedelta
import schedule

from bs4 import BeautifulSoup
a=0

s = execjs.compile(open(r'info.js', 'r', encoding='utf-8').read())
dicts=[ {"name":12},{"name":2323}]
# 向csv文件写入表头  笔记数据csv文件
header = ["first_name", "last_name"]

file=open(f"test.csv", mode='w', encoding="utf-8-sig", newline="")
writer = csv.DictWriter(file, header)
writer.writeheader()
writer.writerow({'first_name': 'soso1', 'last_name': 'soso'})
writer.writerow({'first_name': 'soso1', 'last_name': 'soso'})
writer.writerow({'first_name': 'soso1', 'last_name': 'soso'})

def keyword_search():
    print("定时跑任务")    

def One_Plan():
    schedule.every().day.at("10:30").do(keyword_search)
    while True:
        schedule.run_pending()
        time.sleep(1)
def job_every_1_minutes():
    schedule.every(1).minutes.do(keyword_search)
 
    while True:
        schedule.run_pending()
        time.sleep(1)
def is_date_in_range(start_date, end_date, check_date):
    # 将输入的日期字符串转换为datetime对象
    start_date = datetime.strptime(start_date, "%Y/%m/%d")
    end_date = datetime.strptime(end_date, "%Y/%m/%d")
    check_date = datetime.strptime(check_date, "%Y/%m/%d") 
    return start_date <= check_date <= end_date 
# 时间戳转换成日期
def get_time(ctime):
    print("a",a)
    timeArray = time.localtime(int(ctime / 1000))
    otherStyleTime = time.strftime("%Y-%m-%d", timeArray)
    print(str(otherStyleTime),searchText)
    return str(otherStyleTime)
def getCount(page,page_count):
    for page in range(page,page_count):
        writer.writerow({'first_name': page, 'last_name': page_count})
        if page==page_count-1 :
            reGetCount(page)
        else:
            break
     


def main():
    global searchText,page ,page_count
    searchText="ss"
    aa=""
    page=1
    page_count=10
    a={
        "name":"1"
    }
    haha()
   
      
def haha():
    tabIndex=1
    tabIndex+=1
    arr=[1,2,3,4]
    length=len(arr)
    for page in range(1,5):
        print("tabIndex",tabIndex)
        tabIndex+=1
        try:
            a["ss"]
        except:
            if tabIndex==length :
                print("合理")
                return
            else:
                print("不合理")
        print('继续')    

    
           

if __name__ == "__main__":
    main()
    
   
