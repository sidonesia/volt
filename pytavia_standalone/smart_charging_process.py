#!/usr/bin/env python

from    time import sleep

import  json
import  time
import  pymongo
import  sys
import  urllib.parse
import  base64
import  datetime
import  RPi.GPIO as GPIO

import  logging
import  traceback
import  time
import  numpy as np

sys.path.append("../pytavia_core"    )
sys.path.append("../pytavia_settings")
sys.path.append("../pytavia_stdlib"  )
sys.path.append("../pytavia_storage" )
sys.path.append("../pytavia_modules" )
sys.path.append("../")

from pytavia_core import pytavia_event_handler
from pytavia_core import database
from pytavia_core import config
from pytavia_core import bulk_db_multi
from pytavia_core import helper

class smart_changing_process:

	mgdDB = database.get_db_conn(config.mainDB)

	def __init__(self, params):
		config_rec  = self.mgdDB.db_config.find_one({
			"value" : config.G_GPIO_BATTERY_CHARGE_SETUP
		})
		gpio_status             = config_rec["data"]["gpio_setup_state"]
		gpio_battery_charge_pin = config_rec["data"]["battery_charge_pin"]
		GPIO.setmode( GPIO.BOARD )
		GPIO.setup  ( gpio_battery_charge_pin , GPIO.OUT )
	# end def

	# NOTE:
	#	- 0 = ON  ( meaning the charging is happening )
	# 	- 1 = OFF ( meaning the charging is not happening ) 
	#
	#	- lower = off-peak
	#	- upper = on-peak
	#
	#	- These main time ranges actuall refer to on-peak and off-peak times
	#		if we are in on-peak: we do x
	#		if we are in off-peak: we do y 
	#
	def execute(self, params):
		response = helper.response_msg(
			"CHARGER_KICKOFF_SUCCESS",
			"CHARGER KICKOFF SUCCESS", {},
			"0000"
		)
		try:
			while True:
				try:
					tm_resp = self.time_gen({})
					tm_data = tm_resp.get("data")
					year_month_date_hour    = tm_data["year_month_date_hour"]
					clock_hour     	        = tm_data["hour"]
					clock_minute   	        = tm_data["minute"]
					clock_day      	        = tm_data["day"]
					usage_hourly_log_rec    = self.mgdDB.db_usage_hourly_log.find_one({
						"year_month_date_hour" : year_month_date_hour
					})
					hourly_voltage          = usage_hourly_log_rec["avg_voltage"]
					config_tm_rec           = self.mgdDB.db_config.find_one({
						"value" : config.G_CHARGING_TIME_TRIGGER
					})
					config_rec  = self.mgdDB.db_config.find_one({
						"value" : config.G_GPIO_BATTERY_CHARGE_SETUP
					})
					threshold_data          = config_tm_rec["data"]
					gpio_status             = config_rec["data"]["gpio_setup_state"]
					gpio_battery_charge_pin = config_rec["data"]["battery_charge_pin"]
					battery_charge_state    = GPIO.input( gpio_battery_charge_pin )
				
					#   we can use this one to float during the day so that when the sun is up and down
					#		it never goes back to the mains and has to wait till we reach 13.5 volts to 
					#		use the battery again so maintain the voltage here between 
					#		12.6 to 12.9 volts (at 12.9 volts it will stop the charger)	
					#
					# - if we are in a given time range and we hit the lower threshold 
					#	we will start the charger if the auto charger is off
					#
					# - if we are during the day then we need to keep balance to make sure it stays on 
					#	batteries once it hits the top limit and we still in this time range
					#   and if charging is still happening then we need to stop the charging
					#   process
					#
					lower_bottom_threshold  = threshold_data["lower_bottom_threshold"]
					lower_top_threshold     = threshold_data["lower_top_threshold"]
					lower_threshold_start   = threshold_data["lower_threshold_start_tm_range"]
					lower_threshold_end     = threshold_data["lower_threshold_end_tm_range"]

					print ("=== --- ===")
					print ( "lower_bottom_threshold :" + str(lower_bottom_threshold) + " " + str(type( lower_bottom_threshold)))
					print ( "lower_top_threshold :" + str(lower_top_threshold)  + " " + str(type( lower_top_threshold) ))
					print ( "lower_threshold_start :" + str(lower_threshold_start)  + " " + str(type( lower_threshold_start)) )
					print ( "lower_threshold_end :" + str(lower_threshold_end)  + " " + str(type( lower_threshold_end) ))
					print ( "hourly_voltage :" + str(hourly_voltage)  + " " + str(type( hourly_voltage) ))
					print ( "hour :" + str(clock_hour)  + " " + str(type( clock_hour) ))
					print ( "minute :" + str(clock_minute)  + " " + str(type( clock_minute) ))
					print ( "day :" + str(clock_day)  + " " + str(type( clock_day) ))
					print ( "battery_charge_state :" + str(battery_charge_state)  + " " + str(type( battery_charge_state) ))
					

					if battery_charge_state == config.G_BATTERY_CHARGE_OFF:
						if clock_hour > lower_threshold_start and clock_hour < lower_threshold_end:
							if hourly_voltage < lower_bottom_threshold:
								GPIO.output( gpio_battery_charge_pin , config.G_BATTERY_CHARGE_ON  )  
								print ( "=====------------------------------=====" )
								print ( "=====----- TURNING ON CHARGER -----=====" )
								print ( "voltage: " + str( hourly_voltage 		  ))
								print ( "lower:   " + str( lower_bottom_threshold ))
								print ( "start_tm:" + str( lower_threshold_start  ))
								print ( "end_tm:  " + str( lower_threshold_end    ))
								print ( "=====------------------------------=====" )
							# end if
					# end if
					if battery_charge_state == config.G_BATTERY_CHARGE_ON:
						if clock_hour > lower_threshold_start and clock_hour < lower_threshold_end:
							if hourly_voltage >= lower_top_threshold:
								GPIO.output( gpio_battery_charge_pin , config.G_BATTERY_CHARGE_OFF )
								print ( "=====-------------------------------=====" )
								print ( "=====----- TURNING OFF CHARGER -----=====" )
								print ( "voltage: " + str( hourly_voltage 		   ))
								print ( "lower:   " + str( lower_bottom_threshold  ))
								print ( "start_tm:" + str( lower_threshold_start   ))
								print ( "end_tm:  " + str( lower_threshold_end     ))
								print ( "=====-------------------------------=====" )
                            # end if
                    # end if
                    #
					# This one we use if the system has switched to mains, we wait till it 
					# 	switch to mains and once it does , we keep it charging until it hits the mains
					#	switch back , once it hits that , we switch the power off 
					#
					# maintain the voltage here from 11.9 volts to 13.4
					#
                    #

					upper_bottom_threshold  = threshold_data["upper_bottom_threshold"]
					upper_top_threshold     = threshold_data["upper_top_threshold"]
					upper_threshold_start   = threshold_data["upper_threshold_start_tm_range"]
					upper_threshold_end     = threshold_data["upper_threshold_end_tm_range"]
					if battery_charge_state == config.G_BATTERY_CHARGE_OFF:
						if clock_hour > upper_threshold_start and clock_hour < upper_threshold_end:
							if hourly_voltage < upper_bottom_threshold:
								GPIO.output( gpio_battery_charge_pin , config.G_BATTERY_CHARGE_ON  )
								print ( "=====------------------------------=====" )
								print ( "=====----- TURNING ON CHARGER -----=====" )
								print ( "voltage: " + str( hourly_voltage         ))
								print ( "lower:   " + str( upper_bottom_threshold ))
								print ( "start_tm:" + str( upper_threshold_start  ))
								print ( "end_tm:  " + str( upper_threshold_end    ))
								print ( "=====------------------------------=====" )
							# end if
						# end if
					# end if
					if battery_charge_state == config.G_BATTERY_CHARGE_ON:
						if clock_hour > upper_threshold_start and clock_hour < upper_threshold_end:
							if hourly_voltage >= upper_top_threshold:
								GPIO.output( gpio_battery_charge_pin , config.G_BATTERY_CHARGE_OFF )
								print ( "=====-------------------------------=====" )
								print ( "=====----- TURNING OFF CHARGER -----=====" )
								print ( "voltage: " + str( hourly_voltage          ))
								print ( "lower:   " + str( upper_bottom_threshold  ))
								print ( "start_tm:" + str( upper_threshold_start   ))
								print ( "end_tm:  " + str( upper_threshold_end     ))
								print ( "=====-------------------------------=====" )
							# end if
						# end if
					# end if
				except:
					exception = traceback.format_exc()
					print( exception )
				# end try
				# pause for 10 seconds and then check the values again
				sleep ( 10 ) 
				print ("===---SLEEP WAIT  ---===")
			# end while
		except:
			exception = traceback.format_exc()
			print( exception )
			response.put( "status_code" , "9999" )
			response.put( "status"      , "CHARGER_KICKOFF_FAILED" )
			response.put( "desc"        , "CHARGER KICKOFF FAILED " + str( exception )  )
		# end try
		return response
	# end def

	def time_gen(self, params):
		response = helper.response_msg(
			"TIME_GEN_SUCCESS",
			"TIME GEN SUCCESS", {},
			"0000"
		)
		try:
			epoch_time               = int(time.time() * 1000)
			today                    = datetime.datetime.now()
			year                     = today.strftime("%Y")
			year_month               = today.strftime("%Y_%m")
			year_month_date          = today.strftime("%Y_%m_%d")
			year_month_date_hour     = today.strftime("%Y_%m_%d_%H")
			year_month_date_hour_min = today.strftime("%Y_%m_%d_%H_%M")
			hour                     = today.strftime("%H")
			minute                   = today.strftime("%M")
			day                      = today.strftime("%A").upper()

			hour                     = int( hour ) 
			minute                   = int( minute ) 

			response.put("data" , {
				"epoch_time"                : epoch_time,
				"year"                      : year,
				"year_month"                : year_month,
				"year_month_date"           : year_month_date,
				"year_month_date_hour"      : year_month_date_hour,
				"year_month_date_hour_min"  : year_month_date_hour_min,
				"hour"                      : hour,
				"minute"                    : minute,
				"day"                       : day,
			})
		except:
			exception = traceback.format_exc()
			print( exception )
			response.put( "status_code" , "9999" )
			response.put( "status"      , "WRITE_SENSOR_FAILED" )
			response.put( "desc"        , "WRITE SENSOR FAILED " + str( exception )  )
		# end try
		return response
		# end def
# end class


if __name__ == "__main__":
    smart_changing_process({}).execute( {} )
# end if
