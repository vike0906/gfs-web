<template>
  <div class="template">
    <a-row>
      <a-col :span="24" style="text-align: left;padding: .5rem;">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>资源管理</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <div class="content">
      <a-row>
        <a-col :span="24">
          <a-table
            :columns="columns"
            :dataSource="data"
            rowKey="id"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            :scroll="scroll"
            bordered
          >
            <div slot="title">
              <a-row class="option" type="flex" justify="space-between" align="middle">
                <a-col :span="2" style="text-align: left;">
                  <a-select defaultValue=""   @change="exchangeChange">
                    <a-select-option value="">全部交易所</a-select-option>
                    <a-select-option value="sh">上海交易所</a-select-option>
                    <a-select-option value="sz">深圳交易所</a-select-option>
                  </a-select>
                </a-col>
                <a-col :xs="20" :sm="18" :md="12" :lg="7" :xl="5" style="text-align: right;">
                  <a-input-search 
                    placeholder="股票代码/名称"
                    :style="searchWith"
                    v-model="queryStr"
                    @search="onSearch"
                  />
                </a-col>
              </a-row>
            </div>
            <div slot="lastPrice" slot-scope="text,record">
              <span v-if="record.change > 0" style="color:red;">{{text}}</span>
              <span v-else-if="record.change < 0" style="color:green;">{{text}}</span>
              <span v-else style="color:black;">{{text}}</span>
            </div>
            <div slot="change" slot-scope="text">
              <span v-if="text > 0" style="color:red;">{{text}}%</span>
              <span v-else-if="text < 0" style="color:green;">{{text}}%</span>
              <span v-else style="color:black;">{{text}}%</span>
            </div>
            <div slot="changeAmount" slot-scope="text">
              <span v-if="text > 0" style="color:red;">{{text}}</span>
              <span v-else-if="text < 0" style="color:green;">{{text}}</span>
              <span v-else style="color:black;">{{text}}</span>
            </div>
            <div slot="turnoverRate" slot-scope="text">
              <span >{{text}}%</span>
            </div>
            <div slot="changeSixty" slot-scope="text">
              <span v-if="text > 0" style="color:red;">{{text}}%</span>
              <span v-else-if="text < 0" style="color:green;">{{text}}%</span>
              <span v-else style="color:black;">{{text}}%</span>
            </div>
            <div slot="changeBeginYear" slot-scope="text">
              <span v-if="text > 0" style="color:red;">{{text}}%</span>
              <span v-else-if="text < 0" style="color:green;">{{text}}%</span>
              <span v-else style="color:black;">{{text}}%</span>
            </div>
            <div slot="circulationMarketValue" slot-scope="text">
              <span >{{text|numberFilter}}</span>
            </div>
            <div slot="totalValue" slot-scope="text">
              <span >{{text|numberFilter}}</span>
            </div>
            <div slot="isExist" slot-scope="text">
              <span v-if="text==1" style="color:green;">正常</span>
              <span v-else style="color:red;">已删除</span>
            </div>
            <div slot="createTime" slot-scope="text, record">
              <span>{{record.createTime|formatDateTime}}</span>
            </div>
          </a-table>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/stock";
import { formatDateTime } from "@/utils/util";
const columns = [
  {
    title: "股票代码",
    sorter: true,
    dataIndex: "code"
  },
  {
    title: "股票名称",
    dataIndex: "name"
  },
  {
    title: "交易所",
    dataIndex: "exchange"
  },
  {
    title: "最新价",
    dataIndex: "lastPrice",
    sorter: true,
    scopedSlots: { customRender: "lastPrice" }
  },
  {
    title: "涨跌幅",
    dataIndex: "change",
    sorter: true,
    scopedSlots: { customRender: "change" }
  },
  {
    title: "涨跌额度",
    dataIndex: "changeAmount",
    sorter: true,
    scopedSlots: { customRender: "changeAmount" }
  },
  {
    title: "换手率",
    sorter: true,
    dataIndex: "turnoverRate",
    scopedSlots: { customRender: "turnoverRate" }
  },
  {
    title: "市盈率(PE)",
    sorter: true,
    dataIndex: "pe"
  },
  {
    title: "市净率(PB)",
    sorter: true,
    dataIndex: "pb"
  },
  {
    title: "60日涨跌幅",
    dataIndex: "changeSixty",
    sorter: true,
    scopedSlots: { customRender: "changeSixty" }
  },
  {
    title: "年初至今涨跌幅",
    dataIndex: "changeBeginYear",
    sorter: true,
    scopedSlots: { customRender: "changeBeginYear" }
  },
  {
    title: "流通市值",
    sorter: true,
    dataIndex: "circulationMarketValue",
    scopedSlots: { customRender: "circulationMarketValue" }
  },
  {
    title: "总市值",
    sorter: true,
    dataIndex: "totalValue",
    scopedSlots: { customRender: "totalValue" }
  },
  {
    title: "状态",
    dataIndex: "isExist",
    scopedSlots: {customRender: "isExist"}
  },
  {
    title: "更新时间",
    dataIndex: "createTime",
    sorter: true,
    scopedSlots: { customRender: "createTime" }
  }
];

export default {
  data() {
    return {
      data: [],
      pagination: {
        total:0,
        defaultPageSize: 10,
        showTotal: total=>`共 ${total} 条数据`
      },
      loading: false,
      columns,
      exchange:"",
      queryStr: "",
      searchWith: "width:200px;"
    };
  },
  computed: {
    scroll: function() {
      let screenSize = this.$store.getters.getScreenSize;
      if (screenSize <= 1000) {
        this.searchWith="width:150px;";
        return { x: 1000, y: 280 };
      } else {
        this.searchWith="width:200px;";
        return { x: 0, y: 0 };
      }
    }
  },
  methods: {
    handleTableChange: function(pagination, filters, sorter) {
      let limit = pagination.pageSize ? pagination.pageSize : null;
      let pageNo = pagination.current ? pagination.current : null;
      let order = sorter.field ? sorter.field : null;
      let direction = sorter.order ? sorter.order : null;
      let params = {
        exchange: this.exchange,
        queryStr: this.queryStr,
        order: order,
        direction: direction,
        pageNo: pageNo,
        limit: limit
      };
      this.getBase(params);
    },
    onSearch() {
      let params = {exchange: this.exchange, queryStr: this.queryStr, limit: 10 };
      this.getBase(params);
    },
    exchangeChange(value){
      this.exchange = value;
      let params = {exchange: value, queryStr: this.queryStr, limit: 10 };
      this.getBase(params);
    },
    getBase(params) {
      this.loading = true;
      api.getBase(params).then(response => {
          if (response) {
            if (response.code == 0) {
              this.data = response.content.content;
              this.pagination.total = response.content.totalElements;
            }
          }
          this.loading = false;
        }).catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  },
  mounted() {
    this.getBase();
  },
  filters: {
    formatDateTime: function(time) {
      if (time != null && time != "") {
        var date = new Date(time);
        return formatDateTime(date);
      } else {
        return "";
      }
    },
    numberFilter: function(number){
      return parseFloat(number/100000000).toFixed(2)+'亿';
    }
  }
};
</script>
<style scoped>
.content {
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 5px;
}
.template{
    width: 100%;
    height: 100%;
}
</style>