#include "respeaker.h"

boolean isRecordingStarted = false;

void setup() {
  respeaker.begin();
  respeaker.attach_touch_handler(touch_event);  // add touch event handler
}

void loop() {
  while (Serial.available() && Serial1.availableForWrite()) {
    Serial1.write((char)Serial.read());
  }
  while (Serial1.available() && Serial.availableForWrite()) {
    Serial.write((char)Serial1.read());
  }
}

// id: 0 ~ 7 - touch sensor id; event: 1 - touch, 0 - release
void touch_event(uint8_t id, uint8_t event) {
  if (event) {
    respeaker.pixels().set_pixel(0, Pixels::wheel(id * 32));

    if(!isRecordingStarted){
      Serial1.println("start-recording");
      isRecordingStarted = true;
    }
  } else {
    respeaker.pixels().set_pixel(0, 0);

    isRecordingStarted = false;
  }
  
  respeaker.pixels().update();
}
