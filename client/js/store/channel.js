import $ from 'jquery';
import { observable, action, computed ,configure,runInAction} from "mobx";
configure({enforceActions:'always'})

//observable data 注册一个数据，这个数据将会成为一个可mobx监测的数据
//整站公用渠道（合作方）选择框
export default class ChannelStore {
    @observable demo=['关于我们1','关于我们2','关于我们3','关于我们4','启动11服务器，可以点击搜索获取省份数据。'];
    @observable channelArr = [];

    @action getChanel = () => {
        let that=this;
        $.ajax({
            type:"get", 
            url:"/common/getAllProvince", 
            async:true,
            dataType: "JSON", 
            success:function(res){
                var _data=res.data;
                runInAction(() => {
                    that.channelArr=_data.data?_data.data:[]
                });
           }
       })
    }
}
