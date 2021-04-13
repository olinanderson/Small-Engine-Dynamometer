# Small-Engine-Dynamometer
Small Engine Dynamometer. The following repository contains the code used to connect to the Arduino over whatever COM port the USB is connected to. 

To see the instruction manual on how to use the Dynamometer, see InstructionManual.pdf inside of the Instruction Manual folder. This contains directions on how to use and shows circuits used for the Arduino (if it requires any troubleshooting). The following project folder is a Nodejs backend which listens to the Arduino, then sends the data to the front end (React app) through websockets. 

Please note: The COM port and Baud rate need to be set properly for Arduino to connect to Nodejs. 
