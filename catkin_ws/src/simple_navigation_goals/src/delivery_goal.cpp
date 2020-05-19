#include <ros/ros.h>
#include <move_base_msgs/MoveBaseAction.h>
#include <actionlib/client/simple_action_client.h>
#include "std_msgs/String.h"


typedef actionlib::SimpleActionClient<move_base_msgs::MoveBaseAction> MoveBaseClient;

bool newOrder = false;
float destinationX = 0.0;
float destinationY = 0.0;

void ordersCallback(const std_msgs::String::ConstPtr& order)
{
  string address = order->data.c_str(); 
  ROS_INFO("Got new order:" + address);
  //Got the co-ordinates from map.pgm file in RVIZ by publishing on clicked_point topic
  //Access these co-ordinates from coordinates.txt file
  if(address == "restaurant") 
  {
      destinationX = -6.386510849;
      destinationY = -0.99866604805;
  }
  else
  {
      destinationX = -4.62662029266;
      destinationY = -5.01337146759;
  }
  
  newOrder = true;		
}

int main(int argc, char** argv){
  ros::init(argc, argv, "simple_navigation_goals");

  ros::NodeHandle n;
  ros::Subscriber subInitialPose = n.subscribe<std_msgs::String>("orders", 1000, ordersCallback);

  if(newOrder == true)
  {
	  //tell the action client that we want to spin a thread by default
	  MoveBaseClient ac("move_base", true);

	  
	  //wait for the action server to come up
	  while(!ac.waitForServer(ros::Duration(5.0))){
	    ROS_INFO("Waiting for the move_base action server to come up");
	  }

	  move_base_msgs::MoveBaseGoal goal;

	  //we'll send a goal to the robot to move 1 meter forward
	  goal.target_pose.header.frame_id = "base_link";
	  goal.target_pose.header.stamp = ros::Time::now();

	  goal.target_pose.pose.position.x = destinationX;
	  goal.target_pose.pose.position.x = destinationy;
	  goal.target_pose.pose.orientation.w = 1.0;

	  ROS_INFO("Sending goal");
	  ac.sendGoal(goal);

	  ac.waitForResult();

	  if(ac.getState() == actionlib::SimpleClientGoalState::SUCCEEDED)
	    ROS_INFO("Hooray, the base moved 1 meter forward");
	  else
	    ROS_INFO("The base failed to move forward 1 meter for some reason");
  }
  return 0;
}
