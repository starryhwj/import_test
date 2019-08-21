# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import render
import pymssql
from django.http import HttpResponseRedirect, JsonResponse
from django.core.urlresolvers import reverse
import os
import xlrd

import sys
reload(sys)
sys.setdefaultencoding('utf8')


def index(request):
    db = get_db()
    cur = db.cursor()
    cur.execute('select * from imports_student')
    student_list = dictfetchall(cur)
    cur.close()
    db.close()
    context = {'student_list': student_list}
    return render(request, 'index.html', context)


def add(request):
    name = request.POST.get('name')
    sex = request.POST.get('sex')
    insert_data(name, sex)
    return HttpResponseRedirect(reverse('imports:index'))


def upload(request):
    att_file = request.FILES['uploadFile']
    if att_file:
        # 保存文件到硬盘中
        file_dir = os.path.join(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'upload_files'), att_file.name)
        with open(file_dir, 'wb+') as f:
            for i in att_file.chunks():
                f.write(i)
            f.close()
        workbook = xlrd.open_workbook(file_dir)
        worksheet = workbook.sheet_by_index(0)
        nrows = worksheet.nrows
        for i in range(1, nrows):
            name = worksheet.cell_value(i, 0)
            sex = worksheet.cell_value(i, 1)
            insert_data(name, sex)
    return JsonResponse({"msg": "ok!"})


def insert_data(name, sex):
    db = get_db()
    cur = db.cursor()
    sql = "insert into imports_student values('{0}', '{1}')".format(name, sex)
    print sql
    try:
        cur.execute(sql)
        db.commit()
    except Exception as e:
        print(e)
        db.rollback()
    finally:
        cur.close()
        db.close()


def get_db():
    db = pymssql.connect(host='localhost', user='sa', password='123456', database='import_test',
                         charset="UTF-8")
    return db


def dictfetchall(cursor):
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

