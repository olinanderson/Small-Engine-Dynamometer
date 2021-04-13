
/*
   -------------------------------------------------------------------------------------
   HX711_ADC
   Arduino library for HX711 24-Bit Analog-to-Digital Converter for Weight Scales
   Olav Kallhovd sept2017
   -------------------------------------------------------------------------------------
*/

/*
   Settling time (number of samples) and data filtering can be adjusted in the config.h file
   For calibration and storing the calibration value in eeprom, see example file "Calibration.ino"

   The update() function checks for new data and starts the next conversion. In order to acheive maximum effective
   sample rate, update() should be called at least as often as the HX711 sample rate; >10Hz@10SPS, >80Hz@80SPS.
   If you have other time consuming code running (i.e. a graphical LCD), consider calling update() from an interrupt routine,
   see example file "Read_1x_load_cell_interrupt_driven.ino".

   This is an example sketch on how to use this library
*/

#include <HX711_ADC.h>

//pins:
const int HX711_dout = 6; //mcu > HX711 dout pin
const int HX711_sck = 5;  //mcu > HX711 sck pin
const int hall_pin = 3;

//HX711 constructor:
HX711_ADC LoadCell(HX711_dout, HX711_sck);

// Global Variables
unsigned long t = 0;
// set number of hall trips for RPM reading (higher improves accuracy, lower improves refresh rate)
float hall_thresh = 20.0;

void setup()
{
  Serial.begin(115200);
  delay(10);

  Serial.println();
  Serial.println("Starting...");

  // RPM
  // make the hall pin an input:
  pinMode(hall_pin, INPUT);

  // FORCE
  LoadCell.begin();
  float calibrationValue;      // calibration value (see example file "Calibration.ino")
  calibrationValue = -6364.12; // uncomment this if you want to set the calibration value in the sketch

  unsigned long stabilizingtime = 2000; // preciscion right after power-up can be improved by adding a few seconds of stabilizing time
  boolean _tare = true;                 //set this to false if you don't want tare to be performed in the next step
  LoadCell.start(stabilizingtime, _tare);
  if (LoadCell.getTareTimeoutFlag())
  {
    Serial.println("Timeout, check MCU>HX711 wiring and pin designations");
    while (1)
      ;
  }
  else
  {
    LoadCell.setCalFactor(calibrationValue); // set calibration value (float)
    Serial.println("Startup is complete");
  }
}

void loop()
{
  //// RPM
  //// ================================
  // preallocate values for tach
  float hall_count = 1.0;
  float start = micros();
  bool on_state = false;
  // counting number of times the hall sensor is tripped
  // but without double counting during the same trip
  while (true) {
    if (digitalRead(hall_pin) == 0) {
      if (on_state == false) {
        on_state = true;
        hall_count += 1.0;
      }
    } else {
      on_state = false;
    }

    if (hall_count >= hall_thresh) {
      break;
    }
  }

  // print information about Time and RPM
  float end_time = micros();
  float time_passed = ((end_time - start) / 1000000.0);
  // Serial.print("Time Passed: ");
  // Serial.print(time_passed);
  // Serial.println("s");
  float rpm_val = (hall_count / time_passed) * 60.0;
  // Serial.print(rpm_val);
  // Serial.println(" RPM");
  delay(1);        // delay in between reads for stability

  String rpmString = rpm_val + String(" rpm, ");
  String timeString = String("Time Passed: ") + time_passed + String(" s");

  //// FORCE
  //// ================================
  static boolean newDataReady = 0;
  const int serialPrintInterval = 1000; //increase value to slow down serial print activity

  // check for new data/start next conversion:
  if (LoadCell.update())
    newDataReady = true;

  // get smoothed value from the dataset:
  if (newDataReady)
  {
    if (millis() > t + serialPrintInterval)
    {
      float i = LoadCell.getData();

      String forceString = i + String(" lb-ft");
      Serial.print(rpmString);
      Serial.print(forceString);
      Serial.println(timeString);
      newDataReady = 0;
      t = millis();
    }
  }

  // receive command from serial terminal, send 't' to initiate tare operation:
  if (Serial.available() > 0)
  {
    char inByte = Serial.read();
    if (inByte == 't')
      LoadCell.tareNoDelay();
  }

  // check if last tare operation is complete:
  if (LoadCell.getTareStatus() == true)
  {
    Serial.println("Tare complete");
  }
}
