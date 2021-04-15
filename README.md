# Small-Engine-Dynamometer

Small Engine Dynamometer. The following repository contains the code used to connect to the Arduino over whatever COM port the USB is connected to.

To see the instruction manual on how to use the Dynamometer, see InstructionManual.pdf inside of the Instruction Manual folder. This contains directions on how to use and shows circuits used for the Arduino (if it requires any troubleshooting). I've also included the whole capstone report in case there is any more depth needed for the project. The following project folder is a Nodejs backend which listens to the Arduino, then sends the data to the front end (React app) through websockets.

Note: The COM port and Baud rate need to be set properly for Arduino to connect to Nodejs. For the main Arduino file (named ArduinoCode), it includes a library called HX711.h. This is the load cell amplifier driver board. I've included it in this repository, but you will need to have Arduino installed, and place the HX711 folder inside of your Arduino/libraries folder for it to work properly.

If you have any questions, contact me at olin.anderson@ucalgary.ca
