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
def csv2json(filepath, linetitle, datecol, dateformat, ycol):
    fl = open(filepath, "rU")
    reader = csv.DictReader(fl)
    line = [{
        "key": linetitle,
        "values": []
    }]

    for row in reader:
        dt = row[datecol]
        dt = time.mktime(datetime.datetime.strptime(dt, dateformat).timetuple())*1000
        y = float(row[ycol].replace(",",""))
        line[0]["values"].append([dt, y])

    fl.close()

    return line

json_file = json.load(open("meta.json"))
for line in json_file:
    # example 
    jsondata = csv2json(filepath=line["filepath"], 
        linetitle=line["linetitle"],
        datecol=line["datecol"],
        dateformat=line["dateformat"], #"%m/%d/%y", #"%Y-%m-%dT%I:%M:%S", #
        ycol=line["ycol"])

    print json.dumps(jsondata)