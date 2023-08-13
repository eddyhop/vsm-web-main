<template>
    <div class="modal">
      <div class="modal__title">
        <span>You are being logged out due to inactivity</span>
      </div>
    </div>
</template>
<script>
import {logout, removeToken} from "@/utils/cookie";

export default {
  data() {
    return {
      time: 2000
    }
  },
  computed: {
    isIdle() {
      return this.$store.state.idleVue.isIdle;
    }
  },
  created() {
    let timerId = setInterval(() => {
      this.time -= 1000;
      if (!this.$store.state.idleVue.isIdle) clearInterval(timerId);
      if (this.time < 1) {
        logout();
        sessionStorage.removeItem("userData");
        sessionStorage.removeItem("menuData");
        removeToken();
        sessionStorage.removeItem("tenantValue")
        this.$router.push("/login");
        this.$router.options.isAddDynamicMenuRoutes = false;
        localStorage.setItem("show1",localStorage.getItem("checkedValue1"));
        clearInterval(timerId);
      }
    }, 1000);
  }
};
</script>
<style lang="postcss" scoped>
.overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  align-items: center;
  width: 100%;
  box-shadow: 1px 2px 4px rgba(34, 39, 68, 0.12);
  border-radius: 4px;
  background-color: #FFFFFF;
  @apply bg-white p-2;
}
.modal__title {
  color: #1e2228;
  font-family: arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  align-items: center;
  @apply flex items-center justify-between p-3 font-bold;
}
.modal__text {
  color: #1e2228;
  font-family: arial, sans-serif;
  font-size: 14px;
}
</style>