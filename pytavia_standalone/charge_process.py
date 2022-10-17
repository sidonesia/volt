import RPi.GPIO as GPIO
import time
import sys

switch = sys.argv[1]
switch = int( switch ) 



charge_pin = 37

GPIO.setmode(GPIO.BOARD)
GPIO.setup(charge_pin,GPIO.OUT)
#GPIO.output(charge_pin, switch)
#GPIO.setup(charge_pin,GPIO.IN)
#status=GPIO.input(charge_pin)
#print ( status ) 

while True:
    GPIO.output(charge_pin, 1)
    print ( "set 1")
    time.sleep (1)
    GPIO.output(charge_pin, 0)
    print ( "set 0")
    time.sleep (1)


