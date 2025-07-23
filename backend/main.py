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

print("connected to MAVLink")


class ModeRequest(BaseModel):
    mode: str


@app.post("/arm", response_model=ModeRequest)
async def set_arm():
    if mode == "arm":
        arm_drone()
    else:
        disarm_drone()


@app.post("/mode", response_model=ModeRequest)
async def set_manual():
    if mode == "auto":
        mode.set_auto()
    elif mode == "stabilize":
        mode.set_stabilize()
    elif mode == "RTL":
        mode.RTL()
    elif mode == "loiter":
        mode.loiter()
    elif mode == "autotune":
        mode.set_autoTune()
    print(mode)
    return mode


@app.get("/position")
async def get_gps_position():
    print("Received GPS request")
    msg = the_connection.recv_match(type="GLOBAL_POSITION_INT", blocking=True)
    return {"lat": msg.lat / 1e7, "lon": msg.lon / 1e7, "alt": msg.alt / 1000}
