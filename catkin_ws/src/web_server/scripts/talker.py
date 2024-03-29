#!/usr/bin/env python
# Software License Agreement (BSD License)
#
# Copyright (c) 2008, Willow Garage, Inc.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
#
#  * Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
#  * Redistributions in binary form must reproduce the above
#    copyright notice, this list of conditions and the following
#    disclaimer in the documentation and/or other materials provided
#    with the distribution.
#  * Neither the name of Willow Garage, Inc. nor the names of its
#    contributors may be used to endorse or promote products derived
#    from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
# FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
# COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
# BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
# LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
# ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
# POSSIBILITY OF SUCH DAMAGE.
#
# Revision $Id$

## Package that coomunicates with aws database to check for new orders. 
## This package publishes on the orders topic if new order is inserted.

import rospy
import pandas as pd
import pymysql
from std_msgs.msg import String

def talker():
    host = 'samsbot1.cvrunnkd3clm.us-east-1.rds.amazonaws.com'
    port = '3306'
    dbname = 'samsbot'
    user = 'ankitj03'
    password = 'ankitj03'
    flagNewOrder = False
    pub = rospy.Publisher('orders', String, queue_size=10)
    rospy.init_node('talker', anonymous=True)
    rate = rospy.Rate(0.1) # 10hz
    while not rospy.is_shutdown() and not flagNewOrder:
        #hello_str = "hello world %s" % rospy.get_time()
        #rospy.loginfo(hello_str)
        conn = pymysql.connect(host, user = user, passwd = password, db = dbname)
	count = pd.read_sql('select * from samsbot.order_table where status="Ready"',con = conn)
	rospy.loginfo("count is:" + str(len(count)))
	if len(count):
	    address = count['client_address'][0]
            #address = 'abcd'
	    hello_str = str(address)
	    pub.publish(hello_str)
	    flagNewOrder = True
        rate.sleep()

if __name__ == '__main__':
    try:     
	talker()
    except rospy.ROSInterruptException:
        pass
