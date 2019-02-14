/**
 * 管理员权限端口配置
 */
module.exports = function () {
    /**
     * dataHost: 正常数据端口
     * dataPort: 正常数据端口
     * cityHost: 获取城市
     * redisHost: 获取权限 && redis
     * redisPort: 获取权限 && redis
     */
    this.requestOption={
        native:{
            cityHost:"",
            redisHost:"",
            redisPort:"",
            baseURL: "",
            dataHost:"",
            dataPort:"",
        },

        dev:{
            cityHost:"",
            redisHost:"",
            redisPort:"",
            baseURL: "",
            dataHost:"",
            dataPort:"",
        },

        test:{
            cityHost:"",
            redisHost:"",
            redisPort:"",
            baseURL: "",
            dataHost:"",
            dataPort:"",
        },
        online:{
            cityHost:"",
            redisHost:"",
            redisPort:"",
            baseURL: "",
            dataHost:"",
            dataPort:"",
        }
    }
}