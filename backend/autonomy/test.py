from pymavlink import mavutil

print("attempting connection")

the_connection = mavutil.mavlink_connection("udp:172.23.192.1:14550")

the_connection.wait_heartbeat()
print(
    "Heartbeat from system (system %u component %u)"
    % (the_connection.target_system, the_connection.target_component)
)

msg = the_connection.recv_match(type="GLOBAL_POSITION_INT", blocking=True)
if msg:
    position = {"lat": msg.lat / 1e7, "lon": msg.lon / 1e7}
    print(position)
