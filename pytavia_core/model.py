import copy

# replace last 'x' occurrences of old to new
# source: https://stackoverflow.com/questions/2556108/rreplace-how-to-replace-the-last-occurrence-of-an-expression-in-a-string
def rreplace(s, old, new, occurrence):
    li = s.rsplit(old, occurrence)
    return new.join(li)

class mongo_model:

    def __init__(self, record, lookup, db_handle):
        self._mongo_record  = copy.deepcopy(record)
        self._lookup_record = copy.deepcopy(lookup)
        self._db_handle     = db_handle
    # end def

    def put(self, key, value):
        if not (key in self._lookup_record):
            raise ValueError('SETTING_NON_EXISTING_FIELD', key, value)
        # end if
        if isinstance(value, type(self)):  # if value is a mongo_model
            self._mongo_record[key] = copy.deepcopy(value.get())
        else:
            self._mongo_record[key] = copy.deepcopy(value)
    # end def

    def get(self):
        return self._mongo_record
    # end def	

    def delete(self , query):
        collection_name = self._lookup_record["__db__name__"]
        self._db_handle[collection_name].remove( query )
    # end def

    def insert(self, lock=None):
        collection_name = self._lookup_record["__db__name__"]
        # del self._mongo_record["__db__name__"]
        self._mongo_record.pop('__db__name__', None)  # safely delete the key. prevents KeyError when with_transaction retries the transaction
        if lock == None:
            self._db_handle[collection_name].insert_one(  
                self._mongo_record
            )
        else:
            self._db_handle[collection_name].insert_one(  
                self._mongo_record,
                session=lock
            )
        # end if
    # end def

    def update(self, query):
        collection_name = self._lookup_record["__db__name__"]
        self._db_handle[collection_name].update(
            query, 
            { "$set" : self._mongo_record }
        )
    # end def
# end class

# for deep /  global updates
def _traverse_db_paths(field, table_ref_names, paths, curr_path):
    for key, value in field.items():
        value_type = type(value)
        if key in table_ref_names:              # found a referenced record!!
            if value_type == dict and "pkey" in value:
                paths.append({
                    # curr_path + key + "." : list(value.keys())
                    curr_path + key + "." : value
                })
            elif value_type == list and "pkey" in value[0]:
                paths.append({
                    # curr_path + key + ".$[elem]." : list(value[0].keys())
                    curr_path + key + ".$[elem]." : value[0]
                })
            else:                               # means that the table is referenced as a pkey -- we do not support globally updating pkey
                continue
        
        if value_type == dict:
            _traverse_db_paths(value, table_ref_names, paths, curr_path + key + ".")
        elif value_type == list and len(value) != 0 and type(value[0]) == dict:
            _traverse_db_paths(value[0], table_ref_names, paths, curr_path + key + ".$[].")

def get_db_table_paths(db):
    update_paths = {}
    table_fks = {}
    for table in db:
        update_paths[table] = []
        if "__db__referenced__names__" not in db[table]:
            continue
        for ref_table in db:
            paths = []
            _traverse_db_paths(db[ref_table], db[table]["__db__referenced__names__"], paths, "")
            if ref_table not in table_fks:
                table_fks[ref_table] = []
            for p in paths:
                temp_keys = []
                for k in p:
                    if "$[]" in k and "$[elem]" not in k:
                        temp_keys.append(k)
                for k in temp_keys:
                    p[rreplace(k,'$[]','$[elem]', 1)] = p.pop(k)
            table_fks[ref_table] += paths
            if len(paths) > 0:
                update_paths[table].append({
                    ref_table : paths
                })
    return update_paths, table_fks

# Define the models/collections here for the mongo db
db = {
    # SYSTEM TABLES WITH _sys_, do not modify
    "db_sys_resume_history"             : {
        "resume_token"                  : {},
        "handler_name"                  : "",
        "collection"                    : "",
        "operation_type"                : "",
        "database"                      : "",
        "document_key"                  : "",
        "cluster_time"                  : 0 ,
        "rec_timestamp"                 : "",
    },

    # USER TABLES BELOW HERE, MODIFYABLE
    "db_user"                           : {
        "username"                      : "",
        "password"                      : "",
        "role"                          : "",
        "last_login"                    : 0 ,
    },
    "db_application_sys_log"            : {
        "fk_app_id"                     : "",
        "fk_user_id"                    : "",
        "fk_app_user_id"                : "",
        "status"                        : "",
        "status_timestamp"              : "",
        "updated_by"                    : "", 
        "pkey"                          : "",
        "misc"                          : {},
    },
    # peak hours , off peak hours 
    # switch to mains value 
    "db_configuration"                  : {
        "name"                          : "",
        "value"                         : "",
        "desc"                          : "",
        "status"                        : "",
        "misc"                          : {},
        "data"                          : {},
    },
    "db_dashboard_rt"                   : {
        "power_usage_out"               : 0 ,
        "power_solar_panel_in"          : 0 ,
        "power_ac_in"                   : 0 ,
        "current_usage_out"             : 0 ,
        "current_solar_panel_in"        : 0 ,
        "current_ac_in"                 : 0 ,
        "last_updated"                  : 0 ,
        "battery_voltage"               : 0 ,
        "battery_soc"                   : 0 ,
        "year"                          : "",
        "year_month"                    : "",
        "year_month_day"                : "",
        "misc_data"                     : {},
    },
    # AC charging
    # switch from battery low voltage to higher voltage
    # AC power usage | DC power usage switch
    "db_system_status"                  : {
        "equipment"                     : "",
        "status"                        : "",
        "analog_value"                  : 0 ,
        "desc"                          : "",
        "last_update_time"              : "",
        "prev_status"                   : "",
    }
    "db_gen_raw_log"                    : {
        "type"                          : ""
        "year"                          : ""
        "year_month"                    : "",
        "year_month_date"               : "",
        "year_month_date_hour"          : "",
        "year_month_date_hour_minute"   : "",
        "hour"                          : "",
        "minute"                        : "",
        "current"                       : 0 ,
        "power"                         : 0 ,
    },
    "db_usage_raw_log"                  : {
        "year"                          : ""
        "year_month"                    : "",
        "year_month_date"               : "",
        "year_month_date_hour"          : "",
        "year_month_date_hour_minute"   : "",
        "hour"                          : "",
        "minute"                        : "",
        "current"                       : 0 ,
        "voltage"                       : 0 ,
        "shunt_voltage"                 : 0 ,
        "power"                         : 0 ,
    }
    "db_usage_hourly_log"           : {
        "year"                          : ""
        "year_month"                    : "",
        "year_month_date"               : "",
        "year_month_date_hour"          : "",
        "year_month_date_hour_minute"   : "",
        "day"                           : "",
        "hour"                          : "",
        "minute"                        : "",
        "avg_current"                   : 0 ,
        "avg_shunt_voltage"             : 0 ,
        "avg_voltage"                   : 0 ,
        "avg_power"                     : 0 ,
        "reading_count"                 : 0 
    },
    "db_usage_daily_log"            : {
        "year"                          : ""
        "year_month"                    : "",
        "year_month_date"               : "",
        "day"                           : "",
        "avg_current"                   : 0 ,
        "avg_voltage"                   : 0 ,
        "avg_shunt_voltage"             : 0 ,
        "total_power"                   : 0 ,
        "reading_count"                 : 0 ,
        "avg_current"                   : 0 ,
        "avg_shunt_voltage"             : 0 ,
        "avg_voltage"                   : 0 ,
        "avg_power"                     : 0 ,
        "reading_count"                 : 0
    },
    "db_usage_monthly_log"          : {
        "year"                          : ""
        "year_month"                    : "",
        "avg_current"                   : 0 ,
        "avg_voltage"                   : 0 ,
        "avg_shunt_voltage"             : 0 ,
        "avg_power"                     : 0 ,
        "reading_count"                 : 0
    },
    "db_usage_yearly_log"           : {
        "year"                          : ""
        "avg_current"                   : 0 ,
        "avg_voltage"                   : 0 ,
        "avg_shunt_voltage"             : 0 ,
        "avg_power"                     : 0 ,
        "reading_count"                 : 0
    },
    "db_solar_gen_daily_log"            : {
        "solar_gen_channel"             : ""
        "current"                       : "",
        "voltage"
    },
    "db_solar_gen_monthly_log"          : {
        "solar_gen_channel"             : ""
    },
    "db_solar_gen_yearly_log"           : {
        "solar_gen_channel"             : ""
    },
   
} 
