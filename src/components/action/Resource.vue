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
      <!-- <div style="height: 8px;padding-top: 3px;"><hr></div> -->
      <a-row>
        <a-col :span="24">
          <a-table
            :columns="columns"
            :dataSource="data"
            rowKey="ID"
            :pagination="pagination"
            :loading="loading"
            @change="handleTableChange"
            :scroll="scroll"
            bordered
          >
            <div slot="title">
              <a-row class="option" type="flex" justify="space-between" align="middle">
                <a-col :span="4" style="text-align: left;">
                  <div v-if="screenSize<639">
                    <a-button icon="file-add" shape="circle" @click="showAddUserModal"></a-button>
                  </div>
                  <div v-else>
                    <a-button icon="file-add" @click="showUploadModel">添加</a-button>
                  </div>
                </a-col>
                <a-col :xs="20" :sm="18" :md="12" :lg="7" :xl="5" style="text-align: right;">
                  <a-input-search
                    placeholder="索引/文件名"
                    style="width: 200px"
                    v-model="queryStr"
                    @search="onSearch"
                  />
                </a-col>
              </a-row>
            </div>

            <div slot="FileName" slot-scope="text">
              <!-- <span class="text-truncate">{{text}}</span> -->
              <a-tooltip placement="topLeft" :title="text" arrowPointAtCenter>
                <span class="text-truncate">{{text}}</span>
              </a-tooltip>
            </div>
            <div slot="Type" slot-scope="text">
              <span v-if="text==1" style="color:#65bf65;">公开</span>
              <span v-else style="color:#ef444d;">私密</span>
              <!-- //#1c791c -->
            </div>
            <div slot="Size" slot-scope="text">
              <span v-if="text/1024<=1">{{text}}B</span>
              <span v-else-if="text/1024/1024<=1">{{(text/1024).toFixed(2)}}K</span>
              <span v-else-if="text/1024/1024/1024<=1">{{(text/1024/1024).toFixed(2)}}M</span>
              <span v-else-if="text/1024/1024/1024/1024<=1">{{(text/1024/1024/1024).toFixed(2)}}G</span>
            </div>

            <div slot="Resource" slot-scope="text">
              <a-tooltip placement="topLeft" :title="text" arrowPointAtCenter>
                <span class="text-truncate">{{text}}</span>
              </a-tooltip>
            </div>
            <div slot="Status" slot-scope="text">
              <span v-if="text==1" style="color:#65bf65;">已上传</span>
              <span v-else style="color:#3ea23e;">已备份</span>
              <!-- //#1c791c -->
            </div>
            <div slot="CreatedAt" slot-scope="text, record">
              <span>{{record.CreatedAt|formatDateTime}}</span>
            </div>
            <div slot="action" slot-scope="text, record" style="text-align: center">
              <a-button icon="download" @click="downloadResource(record)" size="small">下载</a-button>
              <a-button
                type="danger"
                icon="delete"
                @click="deleteResource(record.ID)"
                size="small"
              >删除</a-button>
            </div>
          </a-table>
        </a-col>
      </a-row>
      <Upload :visible="visible"></Upload>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/resource";
import { formatDateTime } from "@/utils/util";
import Upload from "@/components/component/Upload"
const columnAdmin = [
  {
    title: "文件索引",
    dataIndex: "FileKey",
    scopedSlots: { customRender: "Resource" }
  },
  {
    title: "文件名称",
    dataIndex: "FileName",
    scopedSlots: { customRender: "FileName" }
  },
  {
    title: "所属用户",
    dataIndex: "UserName"
  },
  {
    title: "大小",
    dataIndex: "Size",
    width: "5%",
    sorter: true,
    scopedSlots: { customRender: "Size" }
  },
  {
    title: "权限",
    dataIndex: "Type",
    scopedSlots: { customRender: "Type" }
  },
  {
    title: "资源路径",
    dataIndex: "ResourcePath",
    scopedSlots: { customRender: "Resource" }
  },
  {
    title: "资源名称",
    dataIndex: "ResourceName",
    scopedSlots: { customRender: "Resource" }
  },
  {
    title: "MD5",
    dataIndex: "HashMd5",
    scopedSlots: { customRender: "Resource" }
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" }
  },
  {
    title: "上传时间",
    width: "15%",
    dataIndex: "CreatedAt",
    sorter: true,
    scopedSlots: { customRender: "CreatedAt" }
  },
  {
    title: "操作",
    width: "15%",
    dataIndex: "action",
    scopedSlots: { customRender: "action" }
  }
];
const columnUser = [
  {
    title: "文件索引",
    dataIndex: "FileKey"
  },
  {
    title: "文件名称",
    dataIndex: "FileName",
    scopedSlots: { customRender: "FileName" }
  },
  {
    title: "大小",
    dataIndex: "Size",
    width: "5%",
    sorter: true,
    scopedSlots: { customRender: "Size" }
  },
  {
    title: "权限",
    dataIndex: "Type",
    scopedSlots: { customRender: "Type" }
  },
  {
    title: "MD5",
    dataIndex: "HashMd5"
  },
  {
    title: "状态",
    dataIndex: "Status",
    scopedSlots: { customRender: "Status" }
  },
  {
    title: "上传时间",
    width: "15%",
    dataIndex: "CreatedAt",
    sorter: true,
    scopedSlots: { customRender: "CreatedAt" }
  },
  {
    title: "操作",
    width: "15%",
    dataIndex: "action",
    scopedSlots: { customRender: "action" }
  }
];
export default {
    components: {
      Upload
    },
  data() {
    return {
      data: [],
      pagination: {
        total: 0,
        defaultPageSize: 15,
        showTotal: total => `共 ${total} 条数据`
      },
      loading: false,
      columns: columnUser,
      queryStr: "",

      visible: false,
    };
  },
  computed: {
    scroll: function() {
      let screenSize = this.$store.getters.getScreenSize;
      if (screenSize <= 1800) {
        return { x: 1000, y: 0 };
      } else {
        return { x: 0, y: 0 };
      }
    },
    screenSize: function() {
      return this.$store.getters.getScreenSize;
    }
  },
  methods: {
    handleCancel(e) {
      this.visible = false;
    },
    showUploadModel() {
      this.visible = true;
    },
    downloadResource(record) {
      let token = "";
      if (record.Type == 2) {
        let user = JSON.parse(sessionStorage.getItem("user"));
        token = "?token=" + user.Token;
      }
      let root = this.$API_ROOT.replace("manager", "download/");
      let a = document.createElement("a");
      a.href = root + record.FileKey + token;
      a.click();
    },
    handleTableChange: function(pagination, filters, sorter) {
      let queryStr = this.queryStr ? this.queryStr : null;
      let limit = pagination.pageSize ? pagination.pageSize : null;
      let pageNo = pagination.current ? pagination.current : null;
      let order = sorter.field ? sorter.field : null;
      let direction = sorter.order ? sorter.order : null;
      let params = {
        queryStr: queryStr,
        order: order,
        direction: direction,
        pageNo: pageNo,
        limit: limit
      };
      this.getResource(params);
    },
    onSearch() {
      let queryStr = this.queryStr ? this.queryStr : null;
      let params = { queryStr: queryStr, limit: 15 };
      this.getResource(params);
    },
    getResource(params) {
      this.loading = true;
      api
        .gainResource(params)
        .then(response => {
          if (response) {
            if (response.code == 0) {
              this.data = response.content.Data;
              this.pagination.total = response.content.Total;
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    deleteResource: function(id) {
      let that = this;
      this.$confirm({
        title: "确认删除该文件?",
        content: "删除后不可恢复",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          let params = { id: id };
          api
            .deleteResource(params)
            .then(response => {
              if (response) {
                if (response.code == 0) {
                  that.$message.success(response.message);
                  that.getResource();
                }
              }
            })
            .catch(err => {
              console.log(err);
            });
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        }
      });
    },
    getColumns() {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (user != null && typeof user != "undefined" && user.Role == 1) {
        this.columns = columnAdmin;
      }
    }
  },
  mounted() {
    this.getColumns();
    this.getResource();
  },
  filters: {
    formatDateTime: function(time) {
      if (time != null && time != "") {
        var date = new Date(time);
        return formatDateTime(date);
      } else {
        return "";
      }
    }
  }
};
</script>
<style scoped>
.content {
  background-color: #fff;
  padding: 5px;
  min-height: 100%;
  min-width: 100%;
}
.template {
  width: 100%;
  height: 100%;
}
.text-truncate {
  width: 10.5rem;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>