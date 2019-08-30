"""Jupyterlab Commenting Service Server"""
import os


def start():
    """
    Start Jupyterlab Commenting Service Server Start

    Returns:
        dict -- A dictionary with the command to start the Commenting Service Server
    """
    path = os.path.dirname(os.path.abspath(__file__))

    return {
        'command': [
            'datasette', 'serve', os.path.join(
                path, 'comments.db'), '-p', '{port}', '--cors'
        ],
        'timeout': 60,
        'port': 40000
    }


def fastapi():
    path = os.path.dirname(os.path.abspath(__file__))
    os.chdir(path)

    return {
        'command': [
            'uvicorn', 'main:app', '--host', '0.0.0.0',
            '--port', '{port}', '--proxy-headers', '--reload'
        ],
        'timeout': 60,
        'port': 30000,
        'absolute_url': False
    }
