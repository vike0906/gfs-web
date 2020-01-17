<template>
    <a-modal
        title="文件上传"
        :visible="visible"
        @ok="uploadResource"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        cancelText="取消"
        okText="确认上传"
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
              <p>
                <a-icon type="info-circle" />&nbsp;私密文件客户端下载时需获取授权Token
              </p>
              <br />
              <div class="custom-file">
                <input type="file" class="custom-file-input" id="customFile" @change="fileChange"
                />
                <label class="custom-file-label" for="customFile" id="fileLable">{{fileInfoLable}}</label>
              </div>
              <br /> <br />
              <div class="form-check">
                <input class="form-check-input" type="checkbox" id="isPrivateCheckbox" @click="isPrivateClick">
                <label class="form-check-label" for="isPrivateCheckbox">私密文件</label>
            </div>
             <br /> 
          </a-col>
        </a-row>
      </a-modal>
</template>
<script>
import "@/assets/style/custom.css";
export default {
    name:"Uplaod",
    props: ["visible"],
    data() {
    return {
      confirmLoading: false,
      isPrivate: false,
      file:null,
      fileInfoLable:"选择文件",
    };
  },
  methods: {
    handleCancel(e) {
      // this.visible = false;
      this.fileInfoLable = "选择文件";
      this.$parent.handleCancel();
    },
    showUploadModel() {
      // this.visible = true;
      this.$parent.showUploadModel();
    },
    fileChange(e){
        console.log(e.target.files);
        this.file = e.target.files[0];
        this.fileInfoLable = this.file.name;
    },
    isPrivateClick(item){
        this.isPrivate = event.target.checked;
    },
    uploadResource(){

    }
  }
    
}
</script>
<style scoped>
</style>