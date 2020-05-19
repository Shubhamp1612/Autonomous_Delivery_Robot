#!/usr/bin/env python

from __future__ import print_function

import roslib; roslib.load_manifest('teleop_twist_keyboard')
import rospy
import time
from geometry_msgs.msg import Twist
import numpy as np

import sys, select, termios, tty

msg = """
Reading from the keyboard  and Publishing to Twist!
---------------------------
Moving around:
   u    i    o
   j    k    l
   m    ,    .

For Holonomic mode (strafing), hold down the shift key:
---------------------------
   U    I    O
   J    K    L
   M    <    >

t : up (+z)
b : down (-z)

anything else : stop

q/z : increase/decrease max speeds by 10%
w/x : increase/decrease only linear speed by 10%
e/c : increase/decrease only angular speed by 10%

CTRL-C to quit
"""

throttleKeys = { 
    'w':  0.05, 
    's': -0.05
}
steeringKeys = { 
    'a':  0.5, 
    'd': -0.5
}
    
DEFAULT_SPEED = 0.5
DEFAULT_STEERING = 0.5

MIN_THROTTLE = 0.4
MAX_THROTTLE = 0.6

MIN_STEERING = 0.0
MAX_STEERING = 1.0


currSpeed = DEFAULT_SPEED
currAngle = DEFAULT_STEERING

def getKey():
    tty.setraw(sys.stdin.fileno())
    rList, _, _ = select.select([sys.stdin], [], [], 0.1)
    key = None
    if rList:
        key = sys.stdin.read(1)
    termios.tcsetattr(sys.stdin, termios.TCSADRAIN, settings)
    return key


def vels(speed,turn):
    return "currently:\tspeed %s\tturn %s " % (speed,turn)

def generateData(key):
    global currSpeed,  currAngle
    twist = Twist()
    
    if (key in throttleKeys.keys()):
        dx = throttleKeys[key]
        currSpeed = np.clip(currSpeed+dx,  MIN_THROTTLE,  MAX_THROTTLE)
    elif (key in steeringKeys.keys()):
        dt = steeringKeys[key]
        currAngle = np.clip(currAngle+dt,  MIN_STEERING,  MAX_STEERING)
    elif (key == None):
        if (currSpeed < DEFAULT_SPEED):
            currSpeed += 0.01
        elif(currSpeed > DEFAULT_SPEED):
            currSpeed -= 0.01
        currSpeed = np.clip(currSpeed,  MIN_THROTTLE,  MAX_THROTTLE)
        
        if (currAngle < DEFAULT_STEERING):
            currAngle += 0.1
        elif(currAngle > DEFAULT_STEERING):
            currAngle -= 0.1
        else:
            currAngle = DEFAULT_STEERING
        currAngle = np.clip(currAngle,  MIN_STEERING,  MAX_STEERING)
    else:
        currSpeed = DEFAULT_SPEED
        currAngle = DEFAULT_STEERING
    
    #twist.linear.x = currSpeed
    twist.linear.x = 100 if (key == 'w') else 90
    twist.angular.z = currAngle
    print(key, twist.linear.x, twist.angular.z )
    return twist

if __name__=="__main__":
    settings = termios.tcgetattr(sys.stdin)

    pub = rospy.Publisher('cmd_vel', Twist, queue_size = 1)
    rospy.init_node('teleop_twist_keyboard')

    speed = rospy.get_param("~speed", 0.5)
    turn = rospy.get_param("~turn", 1.0)

    try:
        print(msg)
        print(vels(speed,turn))
        while(1):
            key = getKey()
            if (key == '\x03'):
                break
            twist = generateData(key)
            pub.publish(twist)

    except Exception as e:
        print(e)

    finally:
        twist = Twist()
        twist.linear.x = 0; twist.linear.y = 0; twist.linear.z = 0
        twist.angular.x = 0; twist.angular.y = 0; twist.angular.z = 0
        pub.publish(twist)

        termios.tcsetattr(sys.stdin, termios.TCSADRAIN, settings)
