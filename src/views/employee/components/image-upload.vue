<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <img v-if="value" :src="value" class="avatar" />
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>
<script>
import COS from "cos-js-sdk-v5";

export default {
  name: "image-upload",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    //检查函数，判断文件大小和类型，return true继续上传 false 停止上传
    beforeAvatarUpload(file) {
      // jpeg png gif bmp

      const isJPG = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/tif",
      ].includes(file.type);
      const isLt5M = file.size / 1024 / 1024 < 5; // 5M

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG PNG GIF BMP 格式!");
      }
      if (!isLt5M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isJPG && isLt5M;
    },
    //图片上传
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>