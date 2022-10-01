#!/usr/bin/env python

# Advanced - Manual Gain, High Resolution Example

from ina219 import INA219
from ina219 import DeviceRangeError
from time import sleep
import logging
import traceback
import time

import numpy as np


# Set the constants that were calculated
SHUNT_OHMS = 0.00025
MAX_EXPECTED_AMPS = 300

def read():
	# Instantiate the ina object with the above constants
    ina = INA219(SHUNT_OHMS,MAX_EXPECTED_AMPS,address=0x40)
    ina.configure(ina.RANGE_16V, ina.GAIN_2_80MV)
    #ina.configure()
		
    bus_voltage = ina.voltage()
    while ( True ) :
        try:
            power_list = []
            amp_list = []
            voltage_list = []
            shunt_voltage_list = []
            for idx in range(0,2000):
                shunt_voltage = ina.shunt_voltage()
                voltage  = ina.voltage() + (shunt_voltage*4/1000)
                current = ina.current()
                #watts = ina.power()
                if current > 0 and shunt_voltage > 0:
                    watts = voltage * current
                    power_list.append( watts )
                    amp_list.append( current )
                    #print ("     " + str( current ))
                    voltage_list.append( voltage )
                    shunt_voltage_list.append( shunt_voltage )
                # end if
                #sleep ( 0.3 ) 
                sleep ( 0.0001 ) 
            # end for
            #print ( amp_list )
            #amp_list = np.array(amp_list)
            #amp_list = amp_list[(amp_list>np.quantile(amp_list,0.1)) & (amp_list<np.quantile(amp_list,0.9))].tolist()
            #amp_list = amp_list[(amp_list<np.quantile(amp_list,0.9))].tolist()
            #print ( " " )
            #print (amp_list)

            voltage_avg = (sum(voltage_list) / len( voltage_list ))
            amp_avg = ((sum(amp_list) / len(amp_list)) / 1000)
            if amp_avg > 10:
                amp_avg = amp_avg - 4
            # end if
            shunt_voltage_avg = (sum(shunt_voltage_list) / len( shunt_voltage_list ))

            power_avg = voltage_avg * amp_avg


            #power_avg = (sum(power_list) / len( power_list ))
            print ( "power_avg " + str(round(power_avg,3)) + " watts" )
            print ( "voltage_avg " + str(round(voltage_avg,3)) + " V" )
            print ( "shunt_voltage_avg " + str(round(shunt_voltage_avg,3)) + " mV" )
            print ( "amp_avg " + str(round(amp_avg,3)) + " A" )
            print ( " " )
        except DeviceRangeError as e:
            print(traceback.format_exc())
            print("Current overflow")
        sleep ( 1 ) 
    # end while


if __name__ == "__main__":
    read()
