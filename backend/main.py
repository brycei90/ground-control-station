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
from autonomy.takeOff import takeOff

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

sitl = "udp:172.23.192.1:14550"
drone = "COM3"
baud = 57600

print("attempting connection")

the_connection = mavutil.mavlink_connection(sitl)

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


latest_data = {}


async def mavlink_listener():
    while True:
        try:
            msg = the_connection.recv_match(blocking=False)
            if msg:
                msg_type = msg.get_type()
                latest_data[msg_type] = msg
        except Exception as e:
            print("mavlink listener error", e)
        await asyncio.sleep(0.01)


@app.on_event("startup")
async def start_listener():
    asyncio.create_task(mavlink_listener())


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
    elif request.mode == "guided":
        mode.set_guided(the_connection)

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
        heartbeat = latest_data.get("HEARTBEAT")
        if heartbeat:
            if heartbeat.custom_mode in ARDUCOPTER_MODES:
                modeCurrent = {"mode": heartbeat.custom_mode}
                json_mode = json.dumps(modeCurrent)
                return json_mode
    except Exception as e:
        print("set mode error: ", e)


@app.get("/connection")
async def connection_status():
    heartbeat = latest_data.get("HEARTBEAT")
    if heartbeat:
        return {"mode": "connected"}
    else:
        return {"mode": "disconnected"}


@app.get("/takeoff")
async def takeoff():
    takeOff(the_connection)


@app.websocket("/satellite")
async def satelites(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            gps = latest_data.get("GPS_STATUS")
            if gps:
                satellite_status = {"satellites": gps.satellites_visible}
                json_sats = json.dumps(satellite_status)
                await websocket.send_text(json_sats)
            await asyncio.sleep(5)
        except WebSocketDisconnect:
            print("Client disconnected from /satelite")
            break
        except Exception as e:
            print("Battery WebSocket error", e)
            break


@app.websocket("/battery")
async def battery(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            sys = latest_data.get("SYS_STATUS")
            if sys:
                battery_status = {
                    "voltage": round(sys.voltage_battery / 1000, 2),
                    "current": round(sys.current_battery / 100.0, 2),
                    "battery_rem": sys.battery_remaining,
                }
                json_battery = json.dumps(battery_status)
                await websocket.send_text(json_battery)
            await asyncio.sleep(0.5)
        except WebSocketDisconnect:
            print("Client disconnected from /battery")
            break
        except Exception as e:
            print("Battery WebSocket error", e)
            break


@app.websocket("/gps_position")
async def get_gps_position(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            pos = latest_data.get("GLOBAL_POSITION_INT")
            if pos:
                position = {"lat": pos.lat / 1e7, "lon": pos.lon / 1e7}
                json_position = json.dumps(position)
                await websocket.send_text(json_position)
            await asyncio.sleep(1)
        except WebSocketDisconnect:
            print("Client disconnected from /gps_position")
            break
        except Exception as e:
            print("GPS websocket error", e)


@app.websocket("/altitude")
async def altitude(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            pos = latest_data.get("GLOBAL_POSITION_INT")
            if pos:
                position = {"alt": pos.relative_alt / 1000.0}
                json_position = json.dumps(position)
                await websocket.send_text(json_position)
            await asyncio.sleep(1)
        except WebSocketDisconnect:
            print("Client disconnected from /altitude")
            break
        except Exception as e:
            print("Altitude websocket error", e)


@app.websocket("/telemetry")
async def telemetry(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            sys = latest_data.get("SYS_STATUS")
            hud = latest_data.get("VFR_HUD")
            rc = latest_data.get("RC_CHANNELS")
            if sys and hud and rc and hasattr(rc, "chan3_raw"):
                telem = {
                    "current": sys.current_battery / 100.0,
                    "auto_throttle": hud.throttle,
                    "throttle_percent": (rc.chan3_raw - 1000) / 10,
                }
                json_telemetry = json.dumps(telem)
                await websocket.send_text(json_telemetry)
            await asyncio.sleep(0.5)
        except WebSocketDisconnect:
            print("Client disconnected from /telemetry")
            break
        except Exception as e:
            print("Telemetry websocket error", e)
