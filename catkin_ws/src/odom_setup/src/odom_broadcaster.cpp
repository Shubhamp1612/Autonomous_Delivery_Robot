#include <ros/ros.h>
#include <tf/transform_broadcaster.h>
#include <nav_msgs/Odometry.h>
#include "geometry_msgs/Pose.h"
#include "geometry_msgs/Twist.h"
#include "sensor_msgs/Imu.h"
#include "geometry_msgs/PoseWithCovarianceStamped.h"
#include <tf/transform_datatypes.h>

float initial_x = 0.0;
float initial_y = 0.0;
double initial_yaw=0.0;
bool init_pose=false;
float angVelZImu = 0.0;
float linearXVel = 92.0;
float angZVel = 0.01;

void initialPoseCallback(const geometry_msgs::PoseWithCovarianceStamped::ConstPtr& initialPose)
{
  initial_x = initialPose->pose.pose.position.x;
  initial_y = initialPose->pose.pose.position.y; 

  double quatx= initialPose->pose.pose.orientation.x;
  double quaty= initialPose->pose.pose.orientation.y;
  double quatz= initialPose->pose.pose.orientation.z;
  double quatw= initialPose->pose.pose.orientation.w;

  tf::Quaternion q(quatx, quaty, quatz, quatw);
  tf::Matrix3x3 m(q);
  double roll, pitch, yaw;
  m.getRPY(roll, pitch, yaw); 
  initial_yaw=yaw;
  init_pose=true;
  ROS_INFO("initialX: [%f],initialY: [%f]",initial_x,initial_y);
  //ROS_INFO("Roll: [%f],Pitch: [%f],Yaw: [%f]",roll,pitch,yaw);
}

void imuCallback(const sensor_msgs::Imu::ConstPtr& imuMsg)
{
  angVelZImu = imuMsg->angular_velocity.z;
 // ROS_INFO("Angular velocity is [%f]",angVelZImu);
}

void cmdVelCallback(const geometry_msgs::Twist::ConstPtr& twistMsg)
{
  linearXVel = twistMsg->linear.x;
 // ROS_INFO("Linear velocity is [%f]",linearXVel);
}

int main(int argc, char** argv){
  ros::init(argc, argv, "odometry_publisher");

  ros::NodeHandle n;
  ros::Publisher odom_pub = n.advertise<nav_msgs::Odometry>("odom", 50);
  ros::Subscriber subInitialPose = n.subscribe<geometry_msgs::PoseWithCovarianceStamped>("initialpose", 1000, initialPoseCallback);
  ros::Subscriber subcmdvel = n.subscribe<geometry_msgs::Twist>("cmd_vel", 1000, cmdVelCallback);
  ros::Subscriber subImu = n.subscribe<sensor_msgs::Imu>("imu", 1000, imuCallback);

  tf::TransformBroadcaster odom_broadcaster;


  double x = 0.0;
  double y = 0.0;
  double th = 0.0;

  double vx = 0;
  double vy = 0;
  double vth = 0;
 
  float current_speed = 0.0;

  ros::Time current_time, last_time;
  current_time = ros::Time::now();
  last_time = ros::Time::now();

  ros::Rate r(1.0);
  while(n.ok()){

   if(init_pose == true)
   {
	x = initial_x;
        y = initial_y;
        th = initial_yaw;
	init_pose = false;
   }

   if(linearXVel >= 110)
   {
	current_speed = -0.7*((linearXVel-92)/92);
   }
   else if(linearXVel > 70 and linearXVel > 110)
   {
	current_speed = 0.0;
   }
   else
   {
        current_speed = 1.2 * (1-linearXVel/92);
   }	
   
    ros::spinOnce();               // check for incoming messages
    current_time = ros::Time::now();
    
    //compute odometry in a typical way given the velocities of the robot
    double dt = (current_time - last_time).toSec();

    th = th + angVelZImu * dt; 

    double delta_x = (vx * cos(th) - vy * sin(th)) * dt;
    double delta_y = (vx * sin(th) + vy * cos(th)) * dt;
   // double delta_th = vth * dt;

    x += delta_x;
    y += delta_y;
    //th += delta_th;

    //since all odometry is 6DOF we'll need a quaternion created from yaw
    geometry_msgs::Quaternion odom_quat = tf::createQuaternionMsgFromYaw(0);

    //first, we'll publish the transform over tf
    geometry_msgs::TransformStamped odom_trans;
    odom_trans.header.stamp = current_time;
    odom_trans.header.frame_id = "odom";
    odom_trans.child_frame_id = "base_link";

    odom_trans.transform.translation.x = x;
    odom_trans.transform.translation.y = y;
    odom_trans.transform.translation.z = 0.0;
    odom_trans.transform.rotation = odom_quat;

    //send the transform
    odom_broadcaster.sendTransform(odom_trans);

    //next, we'll publish the odometry message over ROS
    nav_msgs::Odometry odom;
    odom.header.stamp = current_time;
    odom.header.frame_id = "odom";

    //set the position
    odom.pose.pose.position.x = x;
    odom.pose.pose.position.y = y;
    odom.pose.pose.position.z = 0.0;
    odom.pose.pose.orientation = odom_quat;

    //set the velocity
    odom.child_frame_id = "base_link";
    odom.twist.twist.linear.x = vx;
    odom.twist.twist.linear.y = vy;
    odom.twist.twist.angular.z = 0.0;

    //publish the message
    odom_pub.publish(odom);

    last_time = current_time;
    r.sleep();
  }
}
