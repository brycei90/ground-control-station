import asyncio
import json
import time
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from pymavlink import mavutil
from autonomy import arm
import autonomy.set_mode as mode
from autonomy.arm import arm_drone, disarm_drone

app = FastAPI()

# define frontend server ip
origins = ["http://localhost:5173"]

# cross-orogin resource sharing CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


print("attempting connection")

the_connection = mavutil.mavlink_connection("udp:172.23.192.1:14550")

the_connection.wait_heartbeat()
print(
    "Heartbeat from system (system %u component %u)"
    % (the_connection.target_system, the_connection.target_component)
)
connection_status = True

print("connected to MAVLink")


class ModeRequest(BaseModel):
    mode: str


class ArmRequest(BaseModel):
    mode: str


@app.post("/arm")
async def set_arm(request: ArmRequest):
    if request.mode == "arm":
        arm_drone(the_connection)
    elif request.mode == "disarm":
        disarm_drone(the_connection)
    else:
        print("invalid")
        return {"error": "invalid mode"}
    print(request.mode)


@app.post("/mode")
async def set_manual(request: ModeRequest):
    if request.mode == "auto":
        mode.set_auto(the_connection)
    elif request.mode == "stabilize":
        mode.set_stabilize(the_connection)
    elif request.mode == "RTL":
        mode.RTL(the_connection)
    elif request.mode == "loiter":
        mode.Loiter(the_connection)
    elif request.mode == "autotune":
        mode.set_autoTune(the_connection)
    print(request.mode)


@app.get("/modeGet")
async def get_mode(response_model=ModeRequest):
    ARDUCOPTER_MODES = {
        0: "STABILIZE",
        1: "ACRO",
        2: "ALT_HOLD",
        3: "AUTO",
        4: "GUIDED",
        5: "LOITER",
        6: "RTL",
        7: "CIRCLE",
        9: "LAND",
        11: "DRIFT",
        13: "SPORT",
        14: "FLIP",
        15: "AUTOTUNE",
        16: "POSHOLD",
        17: "BRAKE",
        18: "THROW",
        19: "AVOID_ADSB",
        20: "GUIDED_NOGPS",
        21: "SMART_RTL",
    }
    try:
        msg = the_connection.recv_match(type="HEARTBEAT", blocking=True, timeout=1)
        if msg:
            if msg.custom_mode in ARDUCOPTER_MODES:
                modeCurrent = {"mode": msg.custom_mode}
                json_mode = json.dumps(modeCurrent)
                return json_mode
    except Exception as e:
        print("set mode error: ", e)


@app.get("/connection_status", response_model=ModeRequest)
async def connection_status():
    msg = the_connection.recv_match(type="HEARTBEAT", blocking=True)
    if msg:
        return {"mode": "connected"}
    else:
        return {"mode": "disconnected"}


@app.websocket("/battery")
async def battery(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            msg = the_connection.recv_match(type="SYS_STATUS", blocking=True, timeout=1)
            if msg:
                battery_status = {
                    "voltage": round(msg.voltage_battery / 1000, 2),
                    "current": round(msg.current_battery / 100.0, 2),
                }
                json_battery = json.dumps(battery_status)
                await websocket.send_text(json_battery)
            await asyncio.sleep(3)
        except WebSocketDisconnect:
            print("Client disconnected from /battery")
        except Exception as e:
            print("Battery WebSocket error", e)
            break


@app.websocket("/gps_position")
async def get_gps_position(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            msg = the_connection.recv_match(
                type="GLOBAL_POSITION_INT", blocking=True, timeout=1
            )
            if msg:
                position = {"lat": msg.lat / 1e7, "lon": msg.lon / 1e7}
                json_position = json.dumps(position)
                await websocket.send_text(json_position)
            await asyncio.sleep(1)
        except WebSocketDisconnect:
            print("Client disconnected from /gps_position")
        except Exception as e:
            print("GPS websocket error", e)


@app.websocket("/altitude")
async def altitude(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            msg = the_connection.recv_match(
                type="GLOBAL_POSITION_INT", blocking=True, timeout=1
            )
            if msg:
                position = {"alt": msg.alt / 1000}
                json_position = json.dumps(position)
                await websocket.send_text(json_position)
            await asyncio.sleep(1)
        except WebSocketDisconnect:
            print("Client disconnected from /altitude")
        except Exception as e:
            print("Altitude websocket error", e)
