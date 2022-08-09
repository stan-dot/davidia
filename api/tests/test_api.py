import json
import msgpack
import pytest
import time
from httpx import AsyncClient
from fastapi.testclient import TestClient

from main import app


def test_status_ws():
    initial_data = {
            "type": "multiline data",
            "data": [
                {
                    "id": "line_0",
                    "colour": "red",
                    "x": [0, 1, 2, 3, 4],
                    "y": [0, 1, 4, 9, 16]
                },
                {
                    "id": "line_1",
                    "colour": "blue",
                    "x": [2, 4, 6, 8],
                    "y": [20, 10, 30, 50, 5]
                },
                {
                    "id": "line_2",
                    "colour": "green",
                    "x": [0, 1, 2, 3, 4],
                    "y": [0, 10, 40, 10, 0]
                },
                {
                    "id": "line_3",
                    "colour": "black",
                    "x": [5, 6, 7, 8, 9],
                    "y": [12, 1, 4, 9, 16]
                }
            ]
        }

    with TestClient(app) as client:
        with client.websocket_connect("/status") as ws:
            from main import ps
            assert len(ps.response_list) == 1
            assert ps.react_status == 'busy'
            assert len(ps.ws_list) == 1
            ws.send_json({"type":"status","text":"ready"})
            time.sleep(1)
            assert ps.react_status == 'busy'
            assert len(ps.response_list) == 0
            received = ws.receive()
            assert received["text"] == msgpack.packb(initial_data, use_bin_type=True)

            ws.send_json({"type":"data_request", "request_type":"new_line_request", "line_id":"4"})
            time.sleep(1)
            assert ps.react_status == 'busy'
            assert len(ps.response_list) == 0
            received_new_line = ws.receive()
            rec_data = msgpack.unpackb(received_new_line["text"])
            assert rec_data["type"] == "new line data"
            assert rec_data["data"]["id"] == "line_4"


@pytest.mark.anyio
async def test_get_data():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        aux_line_data = json.dumps({
            "type": "data_request",
            "request_type": "aux_line_data",
            "data":
                {
                    "id": "line",
                    "colour": "pink",
                    "x": [3, 4, 5],
                    "y": [10, 15, 20]
                }
        })
        response = await ac.get("/push_data", params={'data':aux_line_data}, headers={'Content-type': 'application/json'}, auth=('user', 'pass'))
    assert response.status_code == 200
    assert response.json() == "data sent"
