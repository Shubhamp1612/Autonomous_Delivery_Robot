# Autonomous_Delivery_Robot

## ROS

ROS is the operating system for our robot. The official source for all information related to ROS can be found at the ROS wiki :http://wiki.ros.org/ROS

## ROS installation

1. ROS has various distributions which are supported. The current recommended distributions are: ROS Kinetic or ROS Melodic

2. Please note the ubuntu version you install on the Jetson TX2, affects the ROS distribution you can install.</br>
-> ROS Kinetic ONLY supports Wily (Ubuntu 15.10), Xenial (Ubuntu 16.04) and Jessie (Debian 8) for debian packages.</br>
-> ROS Melodic is primarily targeted at the Ubuntu 18.04 (Bionic) release.

3. Depending on your use case and the list of packages you requuire you need to choose the ROS distribution and the supported ubuntu version. </br>
** Please note we faced some problems when some packages were not fully supported in melodic and were only supported in kinetic. So spend a good amount of time on research as to which ROS version support is there for your required ROS packages.

For ROS kinetic installation:</br>
-> http://wiki.ros.org/kinetic/Installation/Ubuntu

For ROS melodic installation:</br>
-> http://wiki.ros.org/melodic/Installation/Ubuntu

## Using ROS

Some important steps to be followed when using ROS are as follows:

1. Creating a ROS workspace:</br>
--> http://wiki.ros.org/ROS/Tutorials/InstallingandConfiguringROSEnvironment

2. Creating a ROS package:</br>
--> http://wiki.ros.org/ROS/Tutorials/CreatingPackage

3. Creating subsriber and publisher nodes:</br>
--> http://wiki.ros.org/ROS/Tutorials/WritingPublisherSubscriber%28c%2B%2B%29

For other related tutorials refer: http://wiki.ros.org/ROS/Tutorials

## RPLidar

1. To run rplidar node:</br>
--> **roslaunch rplidar_ros rplidar.launch**

2. To view lidar laser scan results on rviz:</br>
--> **roslaunch rplidar_ros view_rplidar.launch**

3. To test obstacle detection in a range of 60 degrees use following command.</br>
--> **rosrun rplidar_ros rplidarNodeClient** </br>
  By doing this, the car would stop if a obstacle is detected within a certain range only. The code for below can be modified as required using the file 'rplidar_ros/src/client.cpp'.
  

## Arduino

1. For instructions and tutorials on arduino setup, follow the official ros tutorials: </br> http://wiki.ros.org/rosserial_arduino/Tutorials

2. First load the arduino code in file jetsoncar.ino onto the arduino board using the arduino IDE.

3. Once the code is loaded, run the rosserial_arduino node using the following command : </br>
**rosrun rosserial_arduino serial_node.py _port:=/dev/ttyUSB0**. , where you need to replace ttyUSB0 with the appropriate port number to which arduino is attached to.


## Generating map using Hector Slam

Hector slam contains ROS packages related to performing SLAM in unstructured environments.</br>

1. Clone repository: https://github.com/tu-darmstadt-ros-pkg/hector_slam for installation and usage.

2. In your catkin workspace run source /devel/setup.bash

3. In catkin_ws/src/rplidar_hector_slam/hector_slam/hector_mapping/launch/mapping_default.launch
replace the second last line with: </br>
  <node pkg="tf" type="static_transform_publisher" name="base_to_laser_broadcaster" args="0 0 0 0 0 0 base_link laser 100" />
  the third line with
  <arg name="base_frame" default="base_link"/>
  the fourth line with
  <arg name="odom_frame" default="base_link"/>
  
4. In catkin_ws/src/rplidar_hector_slam/hector_slam/hector_slam_launch/launch/tutorial.launch
replace the third line with </br>
<param name="/use_sim_time" value="false"/>

5. Run roslaunch rplidar_ros rplidar.launch

6. Run roslaunch hector_slam_launch tutorial.launch.  </br>
--> This command will open up rviz with slam data. To create a map move the robot in the environment using rc car remote or teleop operations on keyboard. As the car moves, it will generate the map using the RPlidar scans.


## Saving the map

1. When the map is generated using hector slam, we need to save the map for further use in our robot navigation.

2. To save the map run the following command in a new terminal: </br>
**rosrun map_server map_saver -f 'file'** (where 'file' is any location for ex: /tmp/my_map will save map files with name my_map.pgm and my_map.yaml in the /tmp folder)

3. Now you can shutdown the hector_slam node after saving the map.

4. To load the map in rviz, run the following command: </br>
**rosrun map_server map_server /tmp/my_map.yaml**  

5. Then open rviz using command:
**rosrun rviz rviz** 

6. Then add a Map display in rviz, and point it to the topic /map and the previously saved map will be visible in rviz.



## ROS Navigation Stack

A 2D navigation stack that takes in information from odometry, sensor streams, and a goal pose and outputs safe velocity commands that are sent to a mobile base. </br>
Refer : http://wiki.ros.org/navigation


