# @license BSD-3-Clause
#
# Copyright (c) 2019 Project Jupyter Contributors.
# Distributed under the terms of the 3-Clause BSD License.

"""Jupyterlab Commenting Service Server"""
import os


def start():
    """
    Start Jupyterlab Commenting Service Server Start

    Returns:
        dict -- A dictionary with the command to start the Commenting Service Server
    """
    path = os.path.dirname(os.path.abspath(__file__))
    database = os.path.join(path, 'comments.db')

    try:
        with open(database, "w+") as f:
            pass
    except FileNotFoundError as f:
        print('The file %s could not be found or opened' % (f.filename))

    return {
        'command': [
            'datasette',
            'serve',
            database,
            '-p',
            '{port}',
            '--cors'
        ],
        'timeout': 60,
        'port': 0  # 40000
    }


def fastapi():
    path = os.path.dirname(os.path.abspath(__file__))

    return {
        'command': [
            'uvicorn',
            'main:app',
            '--host',
            '0.0.0.0',
            '--port',
            '{port}',
            '--proxy-headers',
            '--reload',
            '--app-dir',
            path
        ],
        'timeout': 60,
        'port': 0,  # 30000
        'absolute_url': False
    }
