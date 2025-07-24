from pymavlink import mavutil


def set_auto(the_connection):
    the_connection.mav.command_long_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_MODE,
        0,  # confirmation
        mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,  # command specific parameters
        3,  # set auto
        0,
        0,
        0,
        0,
        0,
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)


def set_stabilize(the_connection):
    the_connection.mav.command_long_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_MODE,
        0,  # confirmation
        mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,  # command specific parameters
        0,  # set stabilize
        0,
        0,
        0,
        0,
        0,
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)


def set_autoTune(the_connection):
    the_connection.mav.command_long_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_MODE,
        0,  # confirmation
        mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,  # command specific parameters
        15,  # set autotune
        0,
        0,
        0,
        0,
        0,
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)


def RTL(the_connection):
    the_connection.mav.command_long_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_MODE,
        0,  # confirmation
        mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,  # command specific parameters
        6,  # set loiter
        0,
        0,
        0,
        0,
        0,
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)


def Loiter(the_connection):
    the_connection.mav.command_int_send(
        the_connection.target_system,
        the_connection.target_component,
        mavutil.mavlink.MAV_CMD_DO_SET_MODE,
        0,  # confirmation
        mavutil.mavlink.MAV_MODE_FLAG_CUSTOM_MODE_ENABLED,  # command specific parameters
        5,
        0,
        0,
        0,
        0,
        0,
    )
    msg = the_connection.recv_match(type="COMMAND_ACK", blocking=True)
    print(msg)
