<template>
  <div class="template">
    <div class="content">
      <br><br>
      <a-row>
        <a-col class="statistics-warrpe" :span="24">
          <div id="myChart" style="width:100%;height:400px;"></div>
        </a-col>
      </a-row>
      <br><br>
      <a-row :gutter="{ xs: 8, sm: 16, md: 32, lg: 64, xl: 128}">
        <a-col class="home-card-warrpe" :xs="24" :sm="12" :md="6" :lg="6" :xl="{span:5,offset:2}">
          <a-card class="home-card" :bordered="false">
            <a-statistic title="本月访问次数" :value="112893" style="margin-right: 50px" />
          </a-card>
        </a-col>
        <a-col class="home-card-warrpe" :xs="24" :sm="12" :md="6" :lg="6" :xl="5">
          <a-card class="home-card"  :bordered="false">
            <a-statistic title="上月访问次数" :value="112893" style="margin-right: 50px" />
          </a-card>
        </a-col>
        <a-col class="home-card-warrpe" :xs="24" :sm="12" :md="6" :lg="6" :xl="5">
          <a-card class="home-card"  :bordered="false">
            <a-statistic title="当前任务数量" :value="2" style="margin-right: 50px" />
          </a-card>
        </a-col>
        <a-col class="home-card-warrpe" :xs="24" :sm="12" :md="6" :lg="6" :xl="5">
          <a-card class="home-card"  :bordered="false">
            <a-statistic title="全部任务数量" :value="23" style="margin-right: 50px" />
          </a-card>
        </a-col>
      </a-row>
      
      
      
    </div>
  </div>
</template>
<script>
import * as api from "@/api/system";
import { formatDate } from "@/utils/util";

export default {
  data:function(){
    return {
      statistics:[],
      mychart:{}
    };
  },
  created(){
    //do nothing...
  },
  mounted() {
    this.getStatistics();
    let timer = false;
    const that = this;
    window.addEventListener('resize',()=>that.mychart.resize(),false);
  },
  methods:{
    getStatistics(){
      api.getStatistics().then(response=>{
        if(response){
          this.statistics = response.content;
          this.drawLine();
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    drawLine(){
        // 基于准备好的dom，初始化echarts实例
        this.mychart = echarts.init(document.getElementById('myChart'));
        let data = this.statistics;

        let dateList = data.map(function (item) {
            return formatDate(item.date);
        });
        let valueList = data.map(function (item) {
            return item.count;
        });
        let colors = ['#5793f3', '#675bba','#d14a61', ];
        
        let option = {
            // color: colors,
            // title: {
            //     left: 'left',
            //     text: '近30日用户登录次数'
            // },
            visualMap: {
                show: true,
                type: 'continuous',
                min: 0,
                max: 400
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            legend: {
                    data:['近30日用户登录次数']
            },
            
            xAxis: {
                type: "category",
                data: dateList,
                axisTick: {
                  alignWithLabel: true
                }
            },
            yAxis: {
                type: "value",
                splitLine: {show: false}
            },
            
            series: [
            //   {
            //     name: '近30日用户登录次数',
            //     type: 'line',
            //     data: valueList,
            //     showSymbol: false,
            //     smooth: true,
            // },
            {
                name: '近30日用户登录次数',
                type: 'bar',
                data: valueList,
                showSymbol: false,
                smooth: true,
            }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        this.mychart.setOption(option);
    }
  }
};
</script>
<style scoped>
.content {
  background-color: #f5f5f6;
  /* background-color: #fff; */
  width: 100%;
  height: 100%;
  padding: 10px;
}
.home-card-warrpe {
  text-align: center;
}

.home-card {
  padding-top: 10px;
  font-size: 1.2rem;
  text-align: left;
  box-shadow: 3px 3px 5px #7f8183;
  /* background-color: #1890ff; */
  
  
  /* width: 300px; */
  /* background-color: aquamarine */
}
/* .home-card .ant-card-head{
  font-size: 1.2rem;
  text-align: left;
} */
.template {
  width: 100%;
  height: 100%;
}
</style>