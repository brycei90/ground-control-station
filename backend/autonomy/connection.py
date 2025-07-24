import time
from pymavlink import mavutil


def connection():
    connection_status = False
    start = time.time()
    timeout = 5
    while (time.time() - start) < timeout:
        try:
            print("attempting connection")

            the_connection = mavutil.mavlink_connection("udp:172.23.192.1:14550")

            the_connection.wait_heartbeat()
            print(
                "Heartbeat from system (system %u component %u)"
                % (the_connection.target_system, the_connection.target_component)
            )
            connection_status = True

            print("connected to MAVLink")
        except Exception as e:
            print("failed to connect", e)
        finally:
            return connection_status
    else:
        print("could not connect")


connection()
