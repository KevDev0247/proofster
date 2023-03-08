package utils

func ConvertToMapSlice(interfaceSlice []interface{}) []map[string]interface{} {
    mapSlice := make([]map[string]interface{}, len(interfaceSlice))
    for i, v := range interfaceSlice {
        mapSlice[i] = v.(map[string]interface{})
    }
    return mapSlice
}

func ConvertToStringSlice(interfaceSlice []interface{}) []string {
    stringSlice := make([]string, len(interfaceSlice))
    for i, v := range interfaceSlice {
        stringSlice[i] = v.(string)
    }
    return stringSlice
}
