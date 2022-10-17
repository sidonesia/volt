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
					config_view  = self.mgdDB.db_config.find({
						"value" : config.G_CHARGING_TIME_TRIGGER
					})
					for config_tm_rec in config_view:
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
						config_rec  = self.mgdDB.db_config.find_one({
							"value" : config.G_GPIO_BATTERY_CHARGE_SETUP
						})
						gpio_status             = config_rec["data"]["gpio_setup_state"]
						gpio_battery_charge_pin = config_rec["data"]["battery_charge_pin"]
						battery_device_pid   	= config_rec["data"]["battery_device_pid"]
						battery_charge_state    = GPIO.input( gpio_battery_charge_pin )
				
						threshold_data          = config_tm_rec ["data"]
						lower_bottom_threshold  = threshold_data["lower_bottom_threshold"]
						lower_top_threshold     = threshold_data["lower_top_threshold"]
						lower_threshold_start   = threshold_data["lower_threshold_start_tm_range"]
						lower_threshold_end     = threshold_data["lower_threshold_end_tm_range"]

						print ("=== --- ===")

						print ( "lower_bottom_threshold :" +\
							str(lower_bottom_threshold) + " " +\
								str(type( lower_bottom_threshold)))

						print ( "lower_top_threshold :" +\
							str(lower_top_threshold)  + " " +\
								str(type( lower_top_threshold) ))

						print ( "lower_threshold_start :" +\
							str(lower_threshold_start)  + " " +\
								str(type( lower_threshold_start)) )

						print ( "lower_threshold_end :" +\
							str(lower_threshold_end)  + " " +\
								str(type( lower_threshold_end) ))

						print ( "hourly_voltage :" +\
							str(hourly_voltage)  + " " +\
								str(type( hourly_voltage) ))

						print ( "hour :" + str(clock_hour)  +\
							" " + str(type( clock_hour) ))

						print ( "minute :" + str(clock_minute)  +\
							" " + str(type( clock_minute) ))

						print ( "day :" + str(clock_day)  +\
							" " + str(type( clock_day) ))

						print ( "battery_charge_state :" + str(battery_charge_state)  +\
							" " + str(type( battery_charge_state) ))

						print ( "battery_device_pid :" + str(battery_device_pid)  +\
							" " + str(type( battery_device_pid) ))
					

						if battery_charge_state == config.G_BATTERY_CHARGE_OFF:
							if clock_hour > lower_threshold_start and clock_hour < lower_threshold_end:
								if hourly_voltage < lower_bottom_threshold:
									GPIO.output( gpio_battery_charge_pin , config.G_BATTERY_CHARGE_ON  )  
									self.mgdDB.db_config.update_one(
										{ "value" : config.G_GPIO_BATTERY_CHARGE_SETUP  } ,
										{ "$set"  : { 
											"data.gpio_setup_state" : config.G_GPIO_BATTERY_CHARGE_STATE_TRUE
										}}
									)
									self.mgdDB.db_rt_device_state.find_one(
										{ "pid_code" : battery_device_pid },
										{	 "$set"     : { "digital_state" : config.G_BATTERY_CHARGE_ON }}
									)
									print ( "=====------------------------------=====" )
									print ( "=====----- TURNING ON CHARGER -----=====" )
									print ( "voltage: " + str( hourly_voltage 		  ))
									print ( "lower:   " + str( lower_bottom_threshold ))
									print ( "start_tm:" + str( lower_threshold_start  ))
									print ( "end_tm:  " + str( lower_threshold_end    ))
									print ( "=====------------------------------=====" )
								# end if
							# end if
						# end if
						if battery_charge_state == config.G_BATTERY_CHARGE_ON:
							if clock_hour > lower_threshold_start and clock_hour < lower_threshold_end:
								if hourly_voltage >= lower_top_threshold:
									GPIO.output( gpio_battery_charge_pin , config.G_BATTERY_CHARGE_OFF )
									self.mgdDB.db_config.update_one(
										{ "value" : config.G_GPIO_BATTERY_CHARGE_SETUP  } ,
										{ "$set"  : { 
											"data.gpio_setup_state" : config.G_GPIO_BATTERY_CHARGE_STATE_FALSE
										}}
									)
									self.mgdDB.db_rt_device_state.find_one(
										{ "pid_code" : battery_device_pid },
										{ "$set"     : { "digital_state" : config.G_BATTERY_CHARGE_OFF }}
									)
									print ( "=====-------------------------------=====" )
									print ( "=====----- TURNING OFF CHARGER -----=====" )
									print ( "voltage: " + str( hourly_voltage 		   ))
									print ( "lower:   " + str( lower_bottom_threshold  ))
									print ( "start_tm:" + str( lower_threshold_start   ))
									print ( "end_tm:  " + str( lower_threshold_end     ))
									print ( "=====-------------------------------=====" )
                            	# end if
							# end if
                    	# end if
					# end for
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
