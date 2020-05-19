/*
 * Copyright (c) 2014, RoboPeak
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without 
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, 
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice, 
 *    this list of conditions and the following disclaimer in the documentation 
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR 
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR 
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, 
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
 * WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR 
 * OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, 
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
/*
 *  RoboPeak LIDAR System
 *  RPlidar ROS Node client test app
 *
 *  Copyright 2009 - 2014 RoboPeak Team
 *  http://www.robopeak.com
 * 
 */


#include "ros/ros.h"
#include "sensor_msgs/LaserScan.h"
#include "geometry_msgs/Twist.h"

#define RAD2DEG(x) ((x)*180./M_PI)

ros::Publisher pub;

const int DEBOUNCE_DEFAULT = 30;
int debounceCount = DEBOUNCE_DEFAULT;

bool oldDetected = false;
float oldX = 0.0;

void scanCallback(const sensor_msgs::LaserScan::ConstPtr& scan)
{
    int count = scan->scan_time / scan->time_increment;
    //ROS_INFO("I heard laser scan %s[%d]:", scan->header.frame_id.c_str(), count);
    //ROS_INFO("angle_range, %f, %f", RAD2DEG(scan->angle_min), RAD2DEG(scan->angle_max));
  
    geometry_msgs::Twist twist;
    bool left=false;
    bool right=false;
    bool straight=true;
    bool detected=false;
    //ros::Rate rate(50);

    for(int i = 0; i < count; i++) 
    {
        float degree = RAD2DEG(scan->angle_min + scan->angle_increment * i);

	//STRAIGHT
	/*if(-20<degree<20)
	{
		if(scan->ranges[i] < 0.2 or straight=false){
			straight=false;		
			twist.linear.x = 92;
			ROS_INFO("object in front");
			ROS_INFO(": [%f, %f]", degree, scan->ranges[i]);
			pub.publish(twist);
		//ROS_INFO(": [%f]", twist.linear.x);
		}	
		else
        	{
			twist.linear.x = 100;
			straight=true
			ROS_INFO("free straight");
			pub.publish(twist);
		}
	}
	//LEFT
	else if(-60<degree<-20)
	{
		if(scan->ranges[i] < 0.2){		
			twist.linear.x = 92;
			twist.angular.x=120;
			ROS_INFO("object at left");
			ROS_INFO(": [%f, %f]", degree, scan->ranges[i]);
			pub.publish(twist);
		//ROS_INFO(": [%f]", twist.linear.x);
		}	
		else
        	{
			left=true;
			twist.linear.x = 100;
			ROS_INFO("free left");
			pub.publish(twist);
		}
	}
	//RIGHT
	else if(20<degree<60)
	{
		if(scan->ranges[i] < 0.2){		
			twist.linear.x = 92;
			twist.angular.x=70;
			ROS_INFO("object at right");
			ROS_INFO(": [%f, %f]", degree, scan->ranges[i]);
			pub.publish(twist);
		//ROS_INFO(": [%f]", twist.linear.x);
		}	
		else
        	{	
			right=false;
			twist.linear.x = 100;
			ROS_INFO("free right");
			pub.publish(twist);
		}
	}
	*/
	if((degree>120) && (degree < 179) && !detected)
	{
		if(scan->ranges[i] < 0.2){		
			twist.linear.x = 92;
			ROS_INFO("here");
			ROS_INFO(": [%f, %f]", degree, scan->ranges[i]);
			detected = true;
			debounceCount = DEBOUNCE_DEFAULT;
		//ROS_INFO(": [%f]", twist.linear.x);
		}	
		else
        	{
			if (!oldDetected) {
				if (debounceCount > 0) {
					debounceCount--;				
				} else {
					twist.linear.x = 100;
					ROS_INFO("elseee");
					detected = false;
				} 
			}
		}
	}

    }
    if (oldX != twist.linear.x) {
	pub.publish(twist);
    }
    oldX = twist.linear.x;
    oldDetected = detected;
    
}

int main(int argc, char **argv)
{
    ros::init(argc, argv, "rplidar_node_client");
    ros::NodeHandle n;
	
    ros::Subscriber sub = n.subscribe<sensor_msgs::LaserScan>("scan", 1000, scanCallback);
    
    pub = n.advertise<geometry_msgs::Twist>("cmd_vel", 1000);

    ros::spin();

    return 0;
}
