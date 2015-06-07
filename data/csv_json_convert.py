import sys
import csv
import json
import time
import datetime

"""
filepath - location of csv file to convert
linetitle - desired legend title of line to be plotted
datecol - column name of date field in csv
dateformat - format string of date string in csv
ycol - column name of field in csv to be mapped to y axis
"""
def csv2json(filepath):
    fl = open(filepath, "rU")
    reader = csv.DictReader(fl)
    patharr = str.split(filepath, '/')
    linetitle = patharr[len(patharr)-1]

    for row in reader:
        for key in row:
            if "date" in key.lower():
                datecol = key
            else:
                ycol = key
        break

    line = [{
        "key": linetitle,
        "values": [],
        "yAxisLabel": ycol
    }]

    for row in reader:
        dt = row[datecol]
        dt = time.mktime(datetime.datetime.strptime(dt, "%m/%d/%Y").timetuple())*1000
        y = float(row[ycol].replace(",",""))
        line[0]["values"].append([dt, y])

    fl.close()

    return line

if len(sys.argv) >= 2:
    filename = sys.argv[1]
else:
    print "Please add name of file in raw_csv as argument (with .csv)"

# example 
jsondata = csv2json(filepath="raw_csv/" + filename)

print json.dumps(jsondata)