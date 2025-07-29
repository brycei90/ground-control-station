from pymavlink import mavutil


def arm_drone(the_connection):
    the_connection.mav.command_long_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
        0,  # confirmation
        1,  # command specific parameters
        0,
        0,
        0,
        0,
        0,
        0,
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)


def disarm_drone(the_connection):
    the_connection.mav.command_long_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_COMPONENT_ARM_DISARM,
        0,  # confirmation
        0,  # command specific parameters
        0,
        0,
        0,
        0,
        0,
        0,
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)
