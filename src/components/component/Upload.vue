<template>
  <div>
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
            <a-icon type="info-circle" />&nbsp;客户端下载私密文件时需获取授权Token
          </p>
          <br />
          <div class="custom-file">
            <input type="file" class="custom-file-input" id="customFile" @change="fileChange" />
            <label class="custom-file-label" for="customFile" id="fileLable">{{fileInfoLable}}</label>
          </div>
          <br />
          <br />
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="isPrivateCheckbox"
              @click="isPrivateClick"
            />
            <label class="form-check-label" for="isPrivateCheckbox">私密文件</label>
          </div>
          <br />
        </a-col>
      </a-row>
    </a-modal>
    <a-modal
      title="上传进度"
      :visible="progressVisible"
      @ok="stopOrStart"
      @cancel="progressCancel"
      cancelText="取消"
      :okText="progressOk"
      okType="primary"
      :destroyOnClose="true"
      width="800px"
    >
      <a-row>
        <a-col
          :xs="{span: 24, offset:0}"
          :sm="{span: 24, offset:0}"
          :md="{span: 24, offset:0}"
          :lg="{span: 23, offset:1}"
          :xl="{span: 23, offset:1}"
        >
          <br />
          <a-progress :percent="progress" :status="progressActive" :strokeWidth=Number(20) />
          <br />
          <br />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<script>
import Axios from 'axios';
import * as api from "@/api/resource";
import "@/assets/script/spark-md5.min.js"
import "@/assets/style/custom.css";
//公用全局变量
const maxUploadDirectSize = 2 * 1024 * 1024;
const server = "http://localhost:9090";
const uploadToken = "uploadToken"//获取token

//分片上传
const chunkSize = 2097152; // 分块尺寸2MB
let chunkCount = 0;//分块数量，最大支持65535
let currentChunkIndex = 0;//当前块
let existedChunkArray = new Array();//已存在块
let isInit = false;
let bigFileUploadSwitch = true;//分片上传开关
export default {
    name:"Uplaod",
    props: ["visible"],
    data() {
    return {
      confirmLoading: false,
      isPrivate: false,
      file:null,
      fileInfoLable:"选择文件",

      progressVisible:false,
      progress:1,
      progressActive:"normal",
      progressOk:"暂停"
    };
  },
  methods: {
    handleCancel() {
      // this.visible = false;
      this.fileInfoLable = "选择文件";
      this.$parent.handleCancel();
    },
    showUploadModel() {
      // this.visible = true;
      this.$parent.showUploadModel();
    },
    fileChange(e){
        this.file = e.target.files[0];
        this.fileInfoLable = this.file.name;
    },
    isPrivateClick(item){
        this.isPrivate = event.target.checked;
    },
    stopOrStart(){
      //判断当前状态
    },
    async uploadResource(){
      console.log(uploadToken);
      console.log(this.file);
      if(this.file==null||this.file.size<=0){
        this.$message.error("请选择待上传文件");
        return;
      }
      let uploadToken = await this.getTokenforUpload();
      this.handleCancel();
      this.progressVisible = true;
      this.progressActive = "active";
      if(this.file.size<=maxUploadDirectSize){
        //直接上传
        let response = await this.uploadDirect(uploadToken,this.file);
        if(response==0){
           this.progress = 100;
           this.progressVisible = false;
           this.progressActive = "normal";
           this.notification("上传成功","小文件急速上传",true);
           this.$parent.getResource();
        }else{
          console.log(response);
          this.progressVisible = false;
           this.progressActive = "normal";
          this.notification("上传失败","文件上传失败，请稍后重试",false);
        }
      }else{
        //分片上传
        //初始化
        let fileHash = await this.fileMd5(this.file);//计算hash
        chunkCount = Math.ceil(this.file.size / chunkSize);
         let initResponse = await this.uploadInit(server, uploadToken, fileHash, this.file.name, chunkCount);
          if (initResponse.code != 0) {
               console.log(response);
          this.progressVisible = false;
           this.progressActive = "normal";
          this.notification("上传失败","文件上传失败，请稍后重试",false);
              return
          } else if (initResponse.content.isExist == 1) {
              this.progress = 100;
           this.progressVisible = false;
           this.progressActive = "normal";
           this.notification("上传成功","大文件秒传",true);
           this.$parent.getResource();
              return
          } else {
              existedChunkArray = initResponse.content.chunkInfoArray;
          }
          isInit = true;
        //上传分片
        for (; currentChunkIndex < chunkCount;) {
            if(bigFileUploadSwitch==false){
                // resolve(2);
                console.log("已暂停");
                return
            }
            let startIndex = currentChunkIndex * chunkSize;
            let endIndex = ((startIndex + chunkSize) >= this.file.size) ? this.file.size : startIndex + chunkSize;
            let chunkBinary = this.file.slice(startIndex, endIndex);
            let chunkHash = await this.fileMd5(chunkBinary);
            // message(chunkHash);
            console.log(chunkHash);
            if (existedChunkArray.indexOf(chunkHash) < 0) {
                let chunkResponse = await this.uploadChunk(server, uploadToken, fileHash, chunkHash, currentChunkIndex, startIndex, endIndex, chunkBinary);
                console.log(chunkResponse);
                if (chunkResponse.code != 0) {
                    // resolve("块文件上传失败");
                    console.log("块文件上传失败");
                    return
                } else if (chunkResponse.content.chunkHash != chunkHash) {
                    // resolve("块文件回传hash错误，上传失败");
                    console.log("块文件上传失败");
                    return
                }
            } else {
              console.log(chunkHash + "文件已存在");
                // message(chunkHash + "文件已存在");
            }
            currentChunkIndex++;
            this.progress = Math.round(currentChunkIndex / chunkCount * 99);
            
            // processUpdate(p);
        }
        //合并文件
        let mergeResponse = await uploadMerge(server, uploadToken, fileHash)
        if(bigFileUploadSwitch==false){
            resolve("上传取消");
            return
        }
        if (mergeResponse.code == 0) {
            this.progress = 100;
        } else {
            resolve("文件合并失败");
        }
      }
    },
    //大文件初始化
    async uploadInit(server, uploadToken, fileHash, fileName, chunkCount) {
        return new Promise(async resolve => {
            let form = new FormData(); // FormData
            form.append("uploadToken", uploadToken);
            form.append("fileName", fileName);
            form.append("fileHash", fileHash);
            form.append("chunkCount", chunkCount);
            Axios.post(server + "/init", form).then(response=>{
              console.log(response);
              resolve(response.data);
            }).catch(err=>{
              console.log(err);
              resolve("上传失败！")
            });
        });
    },
    //上传文件块
    async uploadChunk(server, uploadToken, fileHash, chunkHash, chunkIndex, chunkStart, chunkEnd, chunkBinary) {
        return new Promise(async resolve => {
            let form = new FormData(); // FormData
            form.append("uploadToken", uploadToken);
            form.append("fileHash", fileHash);
            form.append("chunkHash", chunkHash);
            form.append("chunkIndex", chunkIndex);
            form.append("chunkStart", chunkStart);
            form.append("chunkEnd", chunkEnd);
            form.append("chunkBinary", chunkBinary);

            Axios.post(server + "/chunk", form).then(response=>{
              console.log(response);
              resolve(response.data);
            }).catch(err=>{
              console.log(err);
              resolve("上传失败！")
            });
            
        });
    },
    //请求合并
    async uploadMerge(server, uploadToken, fileHash) {
        return new Promise(async resolve => {
            let form = new FormData(); // FormData
            form.append("uploadToken", uploadToken);
            form.append("fileHash", fileHash);
            
            Axios.post(server + "/merge", form).then(response=>{
              console.log(response);
              resolve(response.data);
            }).catch(err=>{
              console.log(err);
              resolve("上传失败！")
            });
            
        });
    },
    async uploadDirect(uploadToken,file){
      return new Promise(async resolve=>{
        let fileHash = await this.fileMd5(file);
        let form = new FormData(); // FormData
        form.append("uploadToken", uploadToken);
        form.append("fileHash", fileHash);
        form.append("fileBinary", file); // 文件对象
        form.append("fileName", file.name);
        let config = {
          //添加请求头
          headers: { "Content-Type": "multipart/form-data" },
          //添加上传进度监听事件
          onUploadProgress: e => {
            this.progress = parseInt((e.loaded / e.total * 99).toFixed(2));
          }
        };
        Axios.post(server+'/upload', form, config).then(response=>{
          let data = response.data;
          if (data.code == 0 && data.content.hash == fileHash) {
            resolve(0);
          } else {
              resolve("上传失败！");
          }
        }).catch(err=>{
          console.log(err);
          resolve("上传失败！")
        });
      });
    },
    async getTokenforUpload(){
      return new Promise((resolve, reject)=>{
        let permissionType = "public";
        if(this.isPrivate==true){
          permissionType = "private"
        }
        let params = { "permissionType": permissionType };
        api.accreditUpload(params).then(response=>{
          if(response){
            if(response.code==0){
              resolve(response.content)
            }
          }
        }).catch(err=>{
          console.log(err);
        });
      });
    },
    progressCancel(){
      this.progressVisible = false;
    },
    //计算目标文件MD5
    async fileMd5(file) {
      return new Promise((resolve, reject) => {
          let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
          let chunkSize = 2097152; // 每次读取2MB
          let startIndex = 0;
          let endIndex = 0;
          let spark = new SparkMD5.ArrayBuffer();
          function frOnload(e) {
              spark.append(e.target.result);
              if (endIndex < file.size) {
                  readChunk();
              } else {
                  resolve(spark.end());
              }
          };
          function frOnerror() {
              reject("calculate md5 for binary fialed");
          };
          let fileReader = new FileReader();
          fileReader.onload = frOnload;
          fileReader.onerror = frOnerror;
          function readChunk() {
              endIndex = ((startIndex + chunkSize) >= file.size) ? file.size : startIndex + chunkSize;
              fileReader.readAsArrayBuffer(blobSlice.call(file, startIndex, endIndex));
              startIndex = startIndex + chunkSize;
          }
          readChunk();
      });
    },
    notification(message,description,isSuccess){
      let iconInfo = <a-icon type="smile" style="color: #108ee9" />;
      if(isSuccess==false){
         iconInfo = <a-icon type="frown" style="color: #108ee9" />;
      }
      this.$notification.open({
          message: message,
          description: description,
          icon: iconInfo,
        });
    },
  }
    
}
</script>
<style scoped>
</style>