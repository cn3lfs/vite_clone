<script setup lang="ts">
import { ref, reactive } from "vue";
import request from "@/util/umiRequest";
import { login } from "@/api/user";
import { useRouter } from "vue-router";

const form = reactive({
  username: "chuchen",
  password: "zd123456",
  tenantCode: "",
  grant_type: "password",
});

const formRef = ref(null);

const router = useRouter();

const handleLogin = () => {
  login(form).then((res) => {
    localStorage.setItem("Authorization", res.access_token);
    localStorage.setItem("userName", res.userName);

    router.push({ path: "/home" });
  });
};
</script>

<template>
  <div>
    <el-form ref="formRef" :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
