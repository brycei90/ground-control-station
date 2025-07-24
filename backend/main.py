import json
import uvicorn
from fastapi import FastAPI
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

the_connection = mavutil.mavlink_connection("udp:172.23.192.1:14550")

the_connection.wait_heartbeat()
print(
    "Heartbeat from system (system %u component %u)"
    % (the_connection.target_system, the_connection.target_component)
)
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
    return request.mode


@app.post("/voltage")
async def volage():
    return 5.0


@app.post("/current")
async def current():
    return 7.0


@app.get("/gps_position")
async def get_gps_position():
    print("Received GPS request")
    msg = the_connection.recv_match(type="GLOBAL_POSITION_INT", blocking=True)
    position = {"lat": msg.lat / 1e7, "lon": msg.lon / 1e7, "alt": msg.alt / 1000}
    json_position = json.dumps(position)
    return json_position
