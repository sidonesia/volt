#!/usr/bin/env python

from    ina219 import INA219
from    ina219 import DeviceRangeError
from    time import sleep

import  json
import  time
import  pymongo
import  sys
import  urllib.parse
import  base64
import  datetime

import  logging
import  traceback
import  time
import  numpy as np

sys.path.append("pytavia_core"    )
sys.path.append("pytavia_settings")
sys.path.append("pytavia_stdlib"  )
sys.path.append("pytavia_storage" )
sys.path.append("pytavia_modules" )

from pytavia_core import pytavia_event_handler
from pytavia_core import database
from pytavia_core import config
from pytavia_core import bulk_db_multi

class usage_process:

    ina_device        = None
    voltage_range     = None 
    voltage_gain      = None 
    shunt_ohms        = None
    max_expected_amps = None
    device_address    = None

    mgdDB = database.get_db_conn(config.mainDB)

    def __init__(self, params):
        self.device_address     = params["device_address"]
        config_rec              = self.mgdDB.db_config.find_one({
            "value"               : "SHUNT",
            "data.shunt_address"  : self.device_address
        })
        self.shunt_ohms         = config_rec["data"]["ohms"    ]
        self.max_expected_amps  = config_rec["data"]["max_amps"]

        # create the ina device 
        self.ina_device = INA219(
            self.shunt_ohms,
            self.max_expected_amps,
            address=self.device_address
        )
        # set the ina device configuration params
        self.ina_device.configure( 
            self.ina_device.RANGE_16V ,  self.ina_device.GAIN_2_80MV 
        )
    # end def

    def execute(self, params):
        response = helper.response_msg(
            "READ_SENSOR_SUCCESS",
            "READ SENSOR SUCCESS", {},
            "0000"
        )
        try:
            bus_voltage = self.ina_device.voltage()
            while True:
                power_list          = []
                current_list        = []
                voltage_list        = []
                shunt_voltage_list  = []

                # get how many samples to read
                read_config_rec     = self.mgdDB.db_config.find_one({
                    "value"             : "SHUNT",
                    "data.shunt_address": self.device_address 
                })
                read_samples        = read_config_rec["data"]["samples"]
                capture_delay       = read_config_rec["data"]["capture_delay"]
                shunt_voltage_drop  = read_config_rec["data"]["shunt_voltage_drop"]
                shunt_max_amps      = read_config_rec["data"]["max_amps"]
                amps_diff_constant  = read_config_rec["data"]["amps_diff_constant"]
                amps_diff_threshold = read_config_rec["data"]["amps_diff_threshold"]

                amps_diff_constant  = int  ( amps_diff_constant  )
                amps_diff_threshold = int  ( amps_diff_threshold )
                amps_per_milli_volt = float( shunt_max_amps ) / float ( shunt_voltage_drop ) 

                for sample in range(0, read_samples ):
                    shunt_voltage        = self.ina_device.shunt_voltage()
                    shunt_voltage_scaled = (shunt_voltage * amps_per_milli_volt / config.G_MILLI_UNIT )
                    voltage              = self.ina_device.voltage() + shunt_voltage_scaled
                    current              = self.ina_device.current()

                    voltage       = round( voltage , 3 )
                    current       = round( current , 3 )
                    shunt_voltage = round ( shunt_voltage , 3 )

                    # dont take into consideration any negative current flows 
                    # dont take into consideration any negative shunt voltages
                    if ( current > 0 ) and ( shunt_voltage > 0 ):
                        watts = voltage * current
                        power_list.append  ( watts   )
                        amp_list.append    ( current )
                        voltage_list.append( voltage )
                        shunt_voltage_list.append( shunt_voltage )
                    # end if
                    sleep ( float( capture_delay ) )
                # end for

                # get all the collected data and process
                voltage_avg         = (sum(voltage_list) / len( voltage_list ))
                shunt_voltage_avg   = (sum(shunt_voltage_list) / len( shunt_voltage_list ))
                amp_avg             = (sum(amp_list) / len(amp_list) / config.G_MILLI_UNIT)
                # 
                # Some notes:
                #   When the amps drawn is greater then 10amps the shunt & amps reading 
                #   always has a 4 amps difference in reading from the battery meter.
                #
                # However:
                #   When the reading is below 10 amps , the power, voltage and amps matches 
                #   the battery meter. Don't know why so hard coding this for now
                #   need to see if there is a generalised reason why this is happening
                #       ANNOYING but this will do for now :(
                #
                if amp_avg > amps_diff_threshold:
                    amp_avg = amp_avg - amps_diff_constant 
                # end if
                power_avg       = voltage_avg * amp_avg
                write_response  = self.write_usage({
                    "power"         : power_avg,
                    "voltage"       : voltage_avg,
                    "shunt_voltage" : shunt_voltage_avg,
                    "current"       : amp_avg
                })
                write_status_code = write_response.get("status_code")
                if write_status_code != "0000":
                    # write to the error database 
                    pass
                # end if
            # end while
        except:
            exception = traceback.format_exc()
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "READ_SENSOR_FAILED" )
            response.put( "desc"        , "READ SENSOR FAILED " + str( exception )  )
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
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "WRITE_SENSOR_FAILED" )
            response.put( "desc"        , "WRITE SENSOR FAILED " + str( exception )  )
        # end try
        return response
    # end def

    def write_analytics( self, params ):
        response = helper.response_msg(
            "WRITE_HOUR_SENSOR_SUCCESS",
            "WRITE HOUR SENSOR SUCCESS", {},
            "0000"
        )
        power               = params["power"]
        voltage             = params["voltage"]
        shunt_voltage       = params["shunt_voltage"]
        current             = params["current"]

        metric_scope        = params["metric_scope"]
        metric_scope_value  = params["metric_scope_value"]
        metric_table        = params["metric_table"]

        power               = float( power )
        voltage             = float( voltage )
        shunt_voltage       = float( shunt_voltage )
        current             = float( current )
        try:
            tm_response              = self.time_gen({})
            tm_data                  = tm_response.get("data")
            year                     = tm_data["year"]
            year_month               = tm_data["year_month"]
            year_month_date          = tm_data["year_month_date"]
            year_month_date_hour     = tm_data["year_month_date_hour"]
            year_month_date_hour_min = tm_data["year_month_date_hour_min"]
            hour                     = tm_data["hour"]
            minute                   = tm_data["minute"]
            day                      = tm_data["day"]
            metric_log_rec           = self.mgdDB[metric_table].find_one({
                metric_scope : metric_scope_value
            })

            off_peak_conf = self.mgdDB.db_config.find_one({
                "value" : "OFF_PEAK_RATE"
            })
            on_peak_conf = self.mgdDB.db_config.find_one({
                "value" : "ON_PEAK_RATE"
            })
            off_peak_cost  = off_peak_conf["data"]["cost"]
            off_peak_start = off_peak_conf["data"]["start"]
            off_peak_end   = off_peak_conf["data"]["end"]

            on_peak_cost   = on_peak_conf ["data"]["cost"]
            on_peak_start  = on_peak_conf ["data"]["start"]
            on_peak_end    = on_peak_conf ["data"]["end"]

            if metric_log_rec == None:
            total_nominal_cost = 0
                if hour >= off_peak_start  and hour < off_peak_end:
                    total_nominal_cost = float(off_peak_cost) * ( power / 1000 ) # per kwh
                else:
                    total_nominal_cost = float(on_peak_cost) * ( power / 1000 ) # per kwh
                # end if
                mdl_hourly_log = database.new( self.mgdDB, "db_usage_hourly_log" )
                mdl_hourly_log.put ( "year" , year )
                mdl_hourly_log.put ( "year_month" , year_month )
                mdl_hourly_log.put ( "year_month_date" , year_month_date )
                mdl_hourly_log.put ( "year_month_date_hour" , year_month_date_hour)
                mdl_hourly_log.put ( "year_month_date_hour_minute" , year_month_date_hour_min )
                mdl_hourly_log.put ( "day" , day )
                mdl_hourly_log.put ( "hour" , hour )
                mdl_hourly_log.put ( "minute" , minute )
                mdl_hourly_log.put ( "avg_current" , current )
                mdl_hourly_log.put ( "avg_shunt_voltage" , shunt_voltage )
                mdl_hourly_log.put ( "avg_voltage" , voltage )
                mdl_hourly_log.put ( "avg_power" , power )
                mdl_hourly_log.put ( "reading_count" , 1 )
                mdl_hourly_log.put ( "total_off_peak_cost" , off_peak_cost )
                mdl_hourly_log.put ( "total_on_peak_cost" , on_peak_cost )
                mdl_hourly_log.put ( "total_nominal_cost" , total_nominal_cost )

                response.put( "data" , {
                    "action_data" : mdl_hourly_log,
                    "action_type" : "INSERT"
                })
            else:
                avg_current         = metric_log_rec["avg_current"]
                avg_shunt_voltage   = metric_log_rec["avg_shunt_voltage"]
                avg_voltage         = metric_log_rec["avg_voltage"]
                avg_power           = metric_log_rec["avg_power"]
                reading_count       = metric_log_rec["reading_count"]
                total_nominal_cost  = ""

                reading_count       = reading_count + 1
                avg_current         = ((avg_current + current)) / reading_count 
                avg_shunt_voltage   = ((avg_shunt_voltage + shunt_voltage)) / reading_count 
                avg_voltage         = ((avg_voltage + voltage)) / reading_count 
                avg_power           = ((avg_power + power)) / reading_count 
                total_nominal_cost  = 

                if hour >= off_peak_start  and hour < off_peak_end:
                    total_nominal_cost = float(off_peak_cost) * ( avg_power / 1000 ) # per kwh
                else:
                    total_nominal_cost = float(on_peak_cost) * ( avg_power / 1000 ) # per kwh
                # end if
                update_data = {
                    "avg_current" : avg_current ,
                    "avg_shunt_voltage" : avg_shunt_voltage ,
                    "avg_voltage" : avg_voltage ,
                    "avg_power" : avg_power ,
                    "reading_count" : reading_count ,
                    "total_nominal_cost" : total_nominal_cost
                }
                response.put( "data" , {
                    "action_data" : update_data,
                    "action_type" : "UPDATE"
                })
            # end if
        except:
            exception = traceback.format_exc()
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "WRITE_SENSOR_FAILED" )
            response.put( "desc"        , "WRITE SENSOR FAILED " + str( exception )  )
        # end try
        return response
    # end def

    def write_usage(self, params):
        response = helper.response_msg(
            "WRITE_SENSOR_SUCCESS",
            "WRITE SENSOR SUCCESS", {},
            "0000"
        )
        power         = params["power"]
        voltage       = params["voltage"]
        shunt_voltage = params["shunt_voltage"]
        current       = params["current"]

        power         = float( power ) 
        voltage       = float( voltage ) 
        shunt_voltage = float( shunt_voltage ) 
        current       = float( current ) 
        try:
            tm_response              = self.time_gen({})
            tm_data                  = tm_response.get("data")
            year                     = tm_data["year"]
            year_month               = tm_data["year_month"]
            year_month_date          = tm_data["year_month_date"]
            year_month_date_hour     = tm_data["year_month_date_hour"]
            year_month_date_hour_min = tm_data["year_month_date_hour_min"]
            hour                     = tm_data["hour"]
            minute                   = tm_data["minute"]

            off_peak_conf = self.mgdDB.db_config.find_one({
                "value" : "OFF_PEAK_RATE"
            })
            on_peak_conf = self.mgdDB.db_config.find_one({
                "value" : "ON_PEAK_RATE"
            })
            high_battery_voltage_rec = self.mgdDB.db_config.find_one({
                "value" : "HIGH_BATTERY_VOLTAGE"
            })
            low_battery_voltage_rec = self.mgdDB.db_config.find_one({
                "value" : "LOW_BATTERY_VOLTAGE"
            })
            off_peak_cost        = off_peak_conf["data"]["cost"]
            on_peak_cost         = on_peak_conf ["data"]["cost"]
            low_battery_voltage  = low_battery_voltage_rec  ["data"]["voltage"]
            high_battery_voltage = hight_battery_voltage_rec["data"]["voltage"]

            # ---------------------------------------------
            # SETUP THE BULK MULTI OBJECT HERE
            # ---------------------------------------------

            # update the raw data
            mdl_usage_raw_log = database.new( self.mgdDB , "db_usage_raw_log" )
            mdl_usage_raw_log.put( "year" , year )
            mdl_usage_raw_log.put( "year_month" , year_month )
            mdl_usage_raw_log.put( "year_month_date" , year_month_date )
            mdl_usage_raw_log.put( "year_month_date_hour" , year_month_date_hour )
            mdl_usage_raw_log.put( "year_month_date_hour_minute" , year_month_date_hour_minute )
            mdl_usage_raw_log.put( "hour" , hour )
            mdl_usage_raw_log.put( "minute" , minute )
            mdl_usage_raw_log.put( "current" , current )
            mdl_usage_raw_log.put( "voltage" , voltage )
            mdl_usage_raw_log.put( "shunt_voltage" , shunt_voltage )
            mdl_usage_raw_log.put( "power" , power )
            mdl_usage_raw_log.put( "off_peak_cost" , off_peak_cost )
            mdl_usage_raw_log.put( "on_peak_cost" , on_peak_cost )

            hour_analytic_resp = self.write_analytics({
                "power"             : power,
                "voltage"           : voltage,
                "shunt_voltage"     : shunt_voltage,
                "current"           : current,
                "metric_scope_value": year_month_date_hour,
                "metric_scope"      : "year_month_date_hour",
                "metric_scope_table": "db_usage_hourly_log"
            })
            daily_analytic_resp = self.write_analytics({
                "power"             : power,
                "voltage"           : voltage,
                "shunt_voltage"     : shunt_voltage,
                "current"           : current,
                "metric_scope_value": year_month_date,
                "metric_scope"      : "year_month_date",
                "metric_scope_table": "db_usage_daily_log"
            })
            monthly_analytic_resp = self.write_analytics({
                "power"             : power,
                "voltage"           : voltage,
                "shunt_voltage"     : shunt_voltage,
                "current"           : current,
                "metric_scope_value": year_month,
                "metric_scope"      : "year_month",
                "metric_scope_table": "db_usage_monthly_log"
            })
            yearly_analytic_resp = self.write_analytics({
                "power"             : power,
                "voltage"           : voltage,
                "shunt_voltage"     : shunt_voltage,
                "current"           : current,
                "metric_scope_value": year,
                "metric_scope"      : "year",
                "metric_scope_table": "db_usage_yearly_log"
            })

            # ------------------------------------------------------------
            # HERE WE GET ALL THE DATA AND WE DO THE BULK MULTI UPDATE
            # ------------------------------------------------------------
            # update the realtime table data

            battery_soc = float(( float(voltage) / float(high_battery_voltage))) * 100
            battery_soc = round( battery_soc, 3 )
            self.mgdDB.db_rt_dashboard.update(
                {   "pkey" : "" }, 
                {
                    "power_usage_out"   : power ,
                    "current_usage_out" : current ,
                    "battery_voltage"   : voltage ,
                    "battery_soc"       : battery_soc ,
                    "year"              : year ,
                    "year_month"        : year_month ,
                    "year_month_date"   : year_month_date ,
                }
            )
        except:
            exception = traceback.format_exc()
            self.webapp.logger.debug( exception )
            response.put( "status_code" , "9999" )
            response.put( "status"      , "WRITE_SENSOR_FAILED" )
            response.put( "desc"        , "WRITE SENSOR FAILED " + str( exception )  )
        # end try
        return response
    # end def
# end class


if __name__ == "__main__":
    usage_process.usage_process().execute( {} )
# end if
