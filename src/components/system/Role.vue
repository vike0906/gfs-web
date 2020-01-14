<template>
  <div class="template">
    <a-row>
      <a-col :span="24" style="text-align: left;padding: .5rem;">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>系统管理</a-breadcrumb-item>
          <a-breadcrumb-item>角色管理</a-breadcrumb-item>
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
                    <a-button icon="plus-circle" shape="circle" @click="showAddRoleModal"></a-button>
                  </div>
                  <div v-else>
                    <a-button icon="plus-circle" @click="showAddRoleModal">新增</a-button>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div slot="action" slot-scope="text, record" style="text-align: center">
              <a-button icon="edit" @click="showEditRoleModal(record)" size="small">编辑</a-button>
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
        @ok="saveRole"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        cancelText="取消"
        :okText="okText"
        okType="primary"
        :destroyOnClose="true"
      >
        <a-form :form="form">
          <a-row>
            <a-col
              :xs="{span: 24, offset:0}"
              :sm="{span: 24, offset:0}"
              :md="{span: 24, offset:0}"
              :lg="{span: 24, offset:0}"
              :xl="{span: 22, offset:1}"
            >
              <a-alert message="角色编码为角色后台识别标识，相同编码的角色在后台具有相同的权限控制" type="info" showIcon />
              <br />
            </a-col>
            <a-col
              :xs="{span: 24, offset:0}"
              :sm="{span: 24, offset:0}"
              :md="{span: 24, offset:0}"
              :lg="{span: 23, offset:1}"
              :xl="{span: 22, offset:2}"
            >
              <a-form-item label="角色名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入角色名称' }] }]"
                  type="text"
                  placeholder="输入角色名称"
                />
              </a-form-item>
              <a-form-item label="角色编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['code', { rules: [{ required: true, message: '请输入角色编码' }] }]"
                  type="text"
                  placeholder="输入角色编码"
                />
              </a-form-item>
              <a-form-item label="角色状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-select
                  v-decorator="[ 'status', { rules: [{ required: true, message: '请选择角色状态' }] }]"
                  placeholder="选择角色状态"
                >
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">禁用</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="角色权限" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-tree
                  checkable
                  :treeData="treeData"
                  :defaultExpandedKeys="expandedKeys"
                  :defaultCheckedKeys="checkedKeys"
                  @check="this.onCheck"
                >
                </a-tree>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/system";
import { formatDateTime } from "@/utils/util";
const columns = [
  {
    title: "角色名称",
    dataIndex: "name"
  },
  {
    title: "角色编号",
    dataIndex: "code"
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
      modalTitle: "",
      okText: "",
      visible: false,
      confirmLoading: false,
      editId: -1,
      form: this.$form.createForm(this, { name: "saveRole" }),
      
      treeData:[],
      expandedKeys:[],
      checkedKeys:[],
      checkActions:[],
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
    onCheck(checkedKeys, info) {
      this.checkActions = checkedKeys;
    },
    saveRole() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            id: this.editId,
            name: values.name,
            code: values.code,
            status: values.status,
            actions: this.checkActions
          };
          api.saveRole(params).then(response => {
              this.confirmLoading = false;
              if (response) {
                if (response.code == 0) {
                  this.visible = false;
                  this.$message.success(response.message);
                  this.getRoles();
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
    showAddRoleModal() {
      api.getActiveAction().then(response=>{
        if(response){
          if(response.code==0){
            let treeDataVo = response.content;
            this.treeData = treeDataVo.tree;
            this.expandedKeys =treeDataVo.expandedKeys;
            this.checkedKeys =treeDataVo.checkedKeys;
            
            this.editId = -1;
            this.form.getFieldDecorator("status", { initialValue: "1" });
            this.modalTitle = "新增角色";
            this.okText = "确认添加";
            this.visible = true;
          }
        }
      }).catch(err=>{console.log(err)});
    },
    showEditRoleModal(record) {
      let params = {roleId:record.id};
      api.getActiveAction(params).then(response=>{
        if(response){
          if(response.code==0){
            let treeDataVo = response.content;
            this.treeData = treeDataVo.tree;
            this.expandedKeys =treeDataVo.expandedKeys;
            this.checkedKeys =treeDataVo.checkedKeys;
            this.checkActions = treeDataVo.checkedKeys;
            
            this.editId = record.id;
            this.form.getFieldDecorator("name", { initialValue: record.name });
            this.form.getFieldDecorator("code", { initialValue: record.code });
            this.form.getFieldDecorator("status", {
              initialValue: record.status + ""
            });
            this.modalTitle = "编辑角色";
            this.okText = "确认修改";
            this.visible = true;
          }
        }
      }).catch(err=>{console.log(err)});
      
    },
    handleCancel(e) {
      this.visible = false;
    },
    handleTableChange: function(pagination, filters, sorter) {
      let limit = pagination.pageSize ? pagination.pageSize : null;
      let pageNo = pagination.current ? pagination.current : null;
      let order = sorter.field ? sorter.field : null;
      let direction = sorter.order ? sorter.order : null;
      let params = {
        order: order,
        direction: direction,
        pageNo: pageNo,
        limit: limit
      };
      this.getRoles(params);
    },
    getRoles(params) {
      this.loading = true;
      api
        .getRoles(params)
        .then(response => {
          if (response) {
            if (response.code == 0) {
              this.data = response.content.content;
              this.pagination.total = response.content.totalElements;
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    }
  },
  mounted() {
    this.getRoles();
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
.welcome {
  margin-top: 3rem;
  text-align: center;
  font-size: 2rem;
}
.template {
  width: 100%;
  height: 100%;
}
</style>