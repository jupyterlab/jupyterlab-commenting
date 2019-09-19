import os
import json
import sqlite_utils
from fastapi import FastAPI

app = FastAPI()
path = os.path.dirname(os.path.abspath(__file__))
database = os.path.join(path, 'comments.db')

try:
    open(database)
except FileNotFoundError as f:
    print('The file %s could not be found or opened' % (f.filename))

db = sqlite_utils.Database(database)


@app.get("/")
async def root():
    return {"message": "Fastapi"}


@app.get("/getAllComments/")
async def getAllComments():
    tables = db.table_names()

    all_comments = []

    for target in tables:
        temp = {}

        temp[target] = db[target].rows

        all_comments.append(temp)

    return {"comments": all_comments}


@app.get("/file/")
async def getByTarget(target: str):
    tables = db.table_names()

    if (target in tables):
        print('Found existing: ' + target)
        return {"data": db[target].rows}
    else:
        print('Creating new table: ' + target)

        db[target].create({
            "id": int,
            "total": int,
            "resolved": bool,
            "indicator": str,
            "body": str
        }, pk=("id"))

        return {"table": target}


@app.get("/saveComments/")
async def saveComments(comments: str, target: str):
    table = db[target]

    threads = json.loads(comments)

    for thread in threads["comments"]:
        id = thread["id"]
        total = thread["total"]
        resolved = thread["resolved"]

        try:
            indicator = thread["indicator"]
        except KeyError:
            indicator = ''

        # body = json.loads(thread["body"])
        body = thread["body"]

        # body_trimmed = json.dumps(body, separators=(',', ':'))

        table.upsert({
            "id": id,
            "total": total,
            "resolved": resolved,
            "indicator": indicator,
            "body": body
        }, pk="id")

    return {"Comments to save": "no"}
