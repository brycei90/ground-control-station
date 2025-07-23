from pymavlink import mavutil


# 550 is default, but in sitl we can run 551
the_connection = mavutil.mavlink_connection("udp:172.23.192.1:14550")

the_connection.wait_heartbeat()
print(
    "Heartbeat from system (system %u component %u)"
    % (the_connection.target_system, the_connection.target_component)
)
