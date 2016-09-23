ReSpeaker Messenger: Sending Slack and Telegram messenges using ReSpeaker Voice Interaction Board
===

My previous project using ReSpeaker was a Home Automation project to control different lights using your voice. This projects is about sending messages to Slack or Telegram using voice input and read out the message from the messenger. User can touch button 1 to send Slack message and touch button 7 to send Telegram message. For Telegram message, first you need to initiate the chat from Telegram client. This is because to send a message to Telegram you need the `userid` of the receiving person.

How it works
--
This project uses [Slack](https://slack.com/), [Telegram](https://telegram.org/), [MQTT](http://mqtt.org/), [hook.io](http://hook.io/) and [ReSpeaker](http://respeaker.io/). 

In case of Slack messenger, We set an Outgoing Webhook to a *hook.io* microservice written in Node.js. This Node.js script receives the text and publish MQTT message with a specified topic. The Python script running on ReSpeaker subscribe this topic and upon receiving this message, the text is converted to audio using Microsoft Cognitive Computing Text to Speech API. This is read out uinsg PyAudio.

In case of Telegram, the ReSpeaker python application use [Telepot](https://github.com/nickoala/telepot) Python library to integrate Telegram API. Whenever a message is received the text is send to Microsoft Cognitive Service API and the receiving audio is played using PyAudio.

We have two applications running on the ReSpeaker, on Arduino Sketch and Python script. The Arduino Sketch receives touch event and send to the Python Script using Serial to start recording the voice input. The following section explains how to communicate from Arduino to Python script.

How to communicate from Arduino to Python
--
As you know ReSpeaker has two UART connections, "*serial*" and "*serial1*". The serial is connected to the USB port. The serial1 can be used to communicate from Arduino to the Python script. The serial1 is connected to the UART_RXD2 and UART_TXD2 of MT7688. So you can just open the Serial port `/dev/ttyS2` and read the incoming data. The following test script opens the `/dev/ttyS2` port and reads strings (*Thanks to Jerry of Seeedstudio for suggesting this*). 

    import serial
	import io
    
    port = '/dev/ttyS2'
    baud = 57600
    
    ser = serial.Serial(port, baud, timeout=1)
    sio = io.TextIOWrapper(io.BufferedRWPair(ser, ser))
    
    if ser.isOpen():
    	print(ser.name + ' is open...')
    
    while True:
    	serialdata = sio.readline()
    	print(serialdata)

