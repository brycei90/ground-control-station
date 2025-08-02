from pymavlink import mavutil


def takeOff(the_connection):
    the_connection.mav.command_long_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_NAV_TAKEOFF,
        0,  # confirmation
        0,  # pitch  # command specific parameters
        0,  # empty
        0,  # empty
        0,  # yaw angle
        0,  # lat
        0,  # lon
        10,  # altitude in meters
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)
