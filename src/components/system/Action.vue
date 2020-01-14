<template>
  <div class="template">
    <a-row>
      <a-col :span="24" style="text-align: left;padding: .5rem;">
        <a-breadcrumb>
          <a-breadcrumb-item>首页</a-breadcrumb-item>
          <a-breadcrumb-item>系统管理</a-breadcrumb-item>
          <a-breadcrumb-item>权限管理</a-breadcrumb-item>
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
                <a-col :span="4" style="text-align: left;">
                  <div v-if="screenSize<639">
                    <a-button icon="plus-circle" shape="circle" @click="showAddActionModal"></a-button>
                  </div>
                  <div v-else>
                    <a-button icon="plus-circle" @click="showAddActionModal">新增</a-button>
                  </div>
                </a-col>
              </a-row>
            </div>
            <div slot="icon" slot-scope="text" style="text-align: center">
              <a-icon v-if="text!=0" :type="text" style="font-size: 1.3rem;"/>
              <a-icon v-else type="link" style="font-size: 1.1rem;"/>
            </div>
            <div slot="type" slot-scope="text" >
              <span v-if="text==0" >一级菜单</span>
              <span v-else >二级菜单</span>
            </div>
            <div slot="createTime" slot-scope="text, record">
              <span>{{record.createTime|formatDateTime}}</span>
            </div>
            <div slot="action" slot-scope="text, record" style="text-align: center">
              <a-button icon="edit" @click="showEditActionModal(record)" size="small">编辑</a-button>
              <a-button icon="delete" type="danger" @click="deleteAction(record.id)" size="small">删除</a-button>
            </div>
          </a-table>
        </a-col>
      </a-row>
      <a-modal
        :title="modalTitle"
        :visible="visible"
        @ok="saveAction"
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
              <a-alert message="排序仅适用于同一父权限的同级权限中" type="info" showIcon />
              <br />
            </a-col>
            <a-col
              :xs="{span: 24, offset:0}"
              :sm="{span: 24, offset:0}"
              :md="{span: 24, offset:0}"
              :lg="{span: 23, offset:1}"
              :xl="{span: 22, offset:2}"
            >
              <a-form-item label="权限名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="['name', { rules: [{ required: true, message: '请输入权限名称' }] }]"
                  type="text"
                  placeholder="输入权限名称"
                />
              </a-form-item>
              <a-form-item label="权限类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-select
                  v-decorator="[ 'type', { rules: [{ required: true, message: '请选择权限类型' }] }]"
                  placeholder="选择权限类型"
                  @change="typeChange"
                  :disabled="isType"
                >
                  <a-select-option value="1">一级菜单</a-select-option>
                  <a-select-option value="2">二级菜单</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item v-show="iconShow" label="图标" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="[ 'icon', { rules: [{ required: true, message: '请输入图标'}] }]"
                  placeholder='请输入图标'
                />
              </a-form-item>
              
              <a-form-item v-show="urlShow" label="上级菜单" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-select
                  v-decorator="[ 'parentId', { rules: [{ required: true, message: '请选择上级菜单' }] }, ]"
                  placeholder="选择上级菜单"
                  :disabled="isType"
                > 
                <a-select-option v-for="item in actionList" :key="item.id" :value="item.id+''" >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item v-show="urlShow" label="路由" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="[ 'url', { rules: [{ required: true, message: '请选择权限路由'}] }]"
                  placeholder="选择权限路由"
                />
              </a-form-item>

              <a-form-item  label="权限排序" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
                <a-input
                  v-decorator="[ 'sort', { rules: [{ required: true, message: '请输入权限排序'}] }]"
                  placeholder="输入权限排序"
                  type="number"
                />
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
    title: "权限名称",
    dataIndex: "name"
  },
  {
    title: "图标",
    dataIndex: "icon",
    scopedSlots: { customRender: "icon" }
  },
  {
    title: "路由",
    dataIndex: "url"
  },
  {
    title: "权限类型",
    dataIndex: "parentId",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "排序",
    dataIndex: "sort"
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
      form: this.$form.createForm(this, { name: "saveAction" }),

      actionList:[],
      isType:true,
      iconShow:false,
      urlShow:false
    }
  },
  methods: {
    typeChange(value) {
      this.typeValue = value;
      if(value==1){
        this.form.getFieldDecorator("url", { initialValue: '#' });
        this.form.getFieldDecorator("icon", { initialValue: '' });
        this.form.getFieldDecorator("parentId", { initialValue:'0'});
        this.iconShow = true;
        this.urlShow = false;
      }else{
        this.form.getFieldDecorator("icon", { initialValue: '0' });
        this.form.getFieldDecorator("url", { initialValue: '' });
        this.form.getFieldDecorator("parentId", { initialValue:''});
        this.iconShow = false;
        this.urlShow = true;
      }
    },
    saveAction() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          let params = {
            id: this.editId,
            name: values.name,
            type: values.type,
            url:values.url,
            icon:values.icon,
            sort:values.sort,
            parentId:values.parentId
          };
          api.saveAction(params).then(response => {
              this.confirmLoading = false;
              if (response) {
                if (response.code == 0) {
                  this.visible = false;
                  this.$message.success(response.message);
                  this.getActions();
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
    showAddActionModal() {
      this.getActionList()
      this.isType = false;
      this.editId = -1;
      this.form.getFieldDecorator("type", { initialValue: '2' });
      this.form.getFieldDecorator("sort", { initialValue: '1' });
      this.form.getFieldDecorator("icon", { initialValue: '0' });
      this.iconShow = false;
      this.urlShow = true;
      this.modalTitle = "新增权限";
      this.okText = "确认添加";
      this.visible = true;
    },
    showEditActionModal(record) {
      this.isType = true;
      this.editId = record.id;
      this.form.getFieldDecorator("name", { initialValue: record.name });
      if(record.parentId==0){
        this.form.getFieldDecorator("type", { initialValue: '1'});
        this.iconShow = true;
        this.urlShow = false;
      }else{
        this.getActionList();
        this.form.getFieldDecorator("type", { initialValue: '2'});
        this.iconShow = false;
        this.urlShow = true;
      }
      this.form.getFieldDecorator("parentId", { initialValue:record.parentId+''});
      this.form.getFieldDecorator("icon", { initialValue: record.icon });
      this.form.getFieldDecorator("url", { initialValue: record.url });
      this.form.getFieldDecorator("sort", { initialValue: record.sort+ '' });
      this.modalTitle = "编辑权限";
      this.okText = "确认修改";
      this.visible = true;
      
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
      this.getActions(params);
    },
    getActionList(){
      let that = this;
      api.getActiveParentAction().then(response=>{
        if (response) {
            if (response.code == 0) {
              that.actionList = response.content;
            }
          }
      }).catch(err=>{
        console.log(err);
      });
    },
    getActions(params) {
      this.loading = true;
      api.getActions(params).then(response => {
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
    },
    deleteAction: function(id) {
      let that = this;
      this.$confirm({
          title: '确认删除该权限?',
          content: '删除后所有拥有此权限的用户此权限也会随之取消',
          okText: '删除',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            let params = {id:id}
            api.deleteAction(params).then(response=>{
              if(response){
                if(response.code==0){
                  that.$message.success(response.message);
                  that.getActions();
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
    this.getActions();
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