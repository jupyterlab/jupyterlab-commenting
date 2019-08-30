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


@app.get("/newThread/")
async def createNewThread(target: str, value: str, created: str, creator: str,  indicator: dict = None):
    table = db[target]

    id = 0

    for row in table.rows:
        id += 1

    body = [
        {
            "id": 0,
            "created": created,
            "creator": creator,
            "edited": False,
            "value": value
        }
    ]

    # Convert dict to str and change seperators to use no whitespaces
    body_trimmed = json.dumps(body, separators=(',', ':'))

    table.insert({
        "id": id,
        "total": 1,
        "resolved": False,
        "indicator": indicator,
        "body": body_trimmed
    })

    return {"created": table.rows}


@app.get("/newComment/")
async def createNewComment(target: str, thread_id: int, value: str, created: str, creator: str):
    table = db[target]

    thread = table.get(thread_id)

    body = json.loads(thread['body'])

    total_comments = len(body)

    new_comment = {
        "id": total_comments,
        "created": created,
        "creator": creator,
        "edited": False,
        "value": value
    }

    body.append(new_comment)

    new_body = json.dumps(body, separators=(',', ':'))

    table.update(thread_id, {"body": new_body})

    return {"Message": thread}
