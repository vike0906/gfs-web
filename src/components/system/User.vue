<template>
  <div class="template">
    <a-row>
      <a-col :span="24" style="text-align: left;padding: .5rem;">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>系统管理</a-breadcrumb-item>
          <a-breadcrumb-item>用户管理</a-breadcrumb-item>
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
            rowKey="id"
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
                    <a-button icon="user-add" shape="circle" @click="showAddUserModal"></a-button>
                  </div>
                  <div v-else>
                    <a-button icon="user-add" @click="showAddUserModal">新增</a-button>
                  </div>
                </a-col>
                <a-col :xs="20" :sm="18" :md="12" :lg="7" :xl="5" style="text-align: right;">
                  <a-input-search
                    placeholder="用户姓名/登陆名"
                    style="width: 200px"
                    v-model="queryStr"
                    @search="onSearch"
                  />
                </a-col>
              </a-row>
            </div>
            <div slot="action" slot-scope="text, record" style="text-align: center">
              <a-button icon="edit" @click="showEditUserModal(record)" size="small">编辑</a-button>
              <a-button type="danger" icon="delete" @click="deleteUser(record.id)" size="small">删除</a-button>
            </div>
            <div slot="status" slot-scope="text">
              <span v-if="text==1" style="color:green;">正常</span>
              <span v-else style="color:red;">禁用</span>
            </div>
            <div slot="createTime" slot-scope="text, record">
              <span>{{record.createTime|formatDateTime}}</span>
            </div>
          </a-table>
        </a-col>
      </a-row>
      <a-modal
        :title="modalTitle"
        :visible="visible"
        @ok="saveUser"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        cancelText="取消"
        :okText="okText"
        okType="primary"
        :destroyOnClose="true"
      >
        <a-row>
          <a-col
            :xs="{span: 24, offset:0}"
            :sm="{span: 24, offset:0}"
            :md="{span: 24, offset:0}"
            :lg="{span: 23, offset:1}"
            :xl="{span: 22, offset:2}"
          >
            <a-form :form="form">
              <div v-show="addInfo">
                <p>
                  <a-icon type="info-circle" />&nbsp;新增用户初始密码为
                  <strong>123456</strong>，建议初次登录后立即更改
                </p>
                <br />
              </div>

              <a-form-item label="用户名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入用户名称' }] }]"
                  type="text"
                  placeholder="输入用户名称"
                />
              </a-form-item>
              <a-form-item label="登陆名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['loginName', { rules: [{ required: true, message: '请输入登陆名称' }] }]"
                  type="text"
                  placeholder="输入登陆名称"
                  :disabled="isLN"
                />
              </a-form-item>
              <a-form-item label="用户角色" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-select
                  v-decorator="[ 'roleId', { rules: [{ required: true, message: '请选择用户角色' }] }, ]"
                  placeholder="选择用户角色"
                > 
                <a-select-option v-for="item in roleList" :key="item.id" :value="item.id+''" >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="用户状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-select
                  v-decorator="[ 'status', { rules: [{ required: true, message: '请选择用户状态' }] }]"
                  placeholder="选择用户状态"
                >
                  <a-select-option value='1'>正常</a-select-option>
                  <a-select-option value='2'>禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-modal>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/system";
import { formatDateTime } from "@/utils/util";
const columns = [
  {
    title: "用户名称",
    dataIndex: "name"
  },
  {
    title: "登录名",
    dataIndex: "loginName"
  },
  {
    title: "用户角色",
    dataIndex: "role.name"
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "创建时间",
    width: "15%",
    dataIndex: "createTime",
    sorter: true,
    scopedSlots: { customRender: "createTime" }
  },
  {
    title: "操作",
    width: "15%",
    dataIndex: "action",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      data: [],
      pagination: {
        total:0,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`
      },
      loading: false,
      columns,
      queryStr: "",
      modalTitle: "",
      okText: "",
      visible: false,
      confirmLoading: false,
      roleList:[],
      editId:-1,
      addInfo: false,
      isLN:false,
      form: this.$form.createForm(this, { name: "saveUser" })
    };
  },
  computed: {
    scroll: function() {
      let screenSize = this.$store.getters.getScreenSize;
      if (screenSize <= 1000) {
        return { x: 1000, y: 280 };
      } else {
        return { x: 0, y: 0 };
      }
    },
    screenSize: function() {
      return this.$store.getters.getScreenSize;
    }
  },
  methods: {
    saveUser() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            id: this.editId,
            name: values.name,
            loginName: values.loginName,
            roleId: values.roleId,
            status: values.status
          };
          api.saveUser(params).then(response => {
            this.confirmLoading = false;
              if (response) {
                if (response.code == 0) {
                  this.visible = false;
                  this.$message.success(response.message);
                  this.getUsers();
                }
              }
            })
            .catch(err => {
              console.log(err);
              this.confirmLoading = false;
            });
        }else{
          this.confirmLoading = false;
        }
      });
      
    },
    showAddUserModal() {
      this.getRoleList();
      this.isLN=false;
      this.editId=-1;
      this.form.getFieldDecorator('roleId', {initialValue:'2'});
      this.form.getFieldDecorator('status', {initialValue:'1'});
      this.modalTitle = "新增用户";
      this.okText = "确认添加";
      this.visible = true;
      this.addInfo = true;
    },
    showEditUserModal(record) {
      this.getRoleList();
      this.isLN=true;
      this.editId=record.id;
      this.form.getFieldDecorator('name', {initialValue:record.name});
      this.form.getFieldDecorator('loginName', {initialValue:record.loginName});
      this.form.getFieldDecorator('roleId', {initialValue:record.role.id+''});
      this.form.getFieldDecorator('status', {initialValue:record.status+''});
      this.modalTitle = "编辑用户";
      this.okText = "确认修改";
      this.visible = true;
      this.addInfo = false;
    },
    handleCancel(e) {
      this.visible = false;
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
      this.getUsers(params);
    },
    onSearch() {
      let queryStr = this.queryStr ? this.queryStr : null;
      let params = { queryStr: queryStr, limit: 15 };
      this.getUsers(params);
    },
    getRoleList(){
      api.getActiveRole().then(response=>{
        if (response) {
            if (response.code == 0) {
              this.roleList = response.content;
            }
          }
      }).catch(err=>{
        console.log(err);
      });
    },
    getUsers(params) {
      this.loading = true;
      api.getUsers(params).then(response => {
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
    },
    deleteUser: function(id) {
      let that = this;
      this.$confirm({
          title: '确认删除该用户?',
          content: '删除后该用户将无法继续登录平台',
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            let params = {id:id}
            api.deleteUser(params).then(response=>{
              if(response){
                if(response.code==0){
                  that.$message.success(response.message);
                  that.getUsers();
                }
              }
            }).catch(err=>{
              console.log(err);
            });
            return new Promise((resolve, reject) => { resolve(true);});
          },
        });
    }
  },
  mounted() {
    this.getUsers();
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
  width: 100%;
  height: 100%;
  padding: 5px;
}
.template {
  width: 100%;
  height: 100%;
}
</style>