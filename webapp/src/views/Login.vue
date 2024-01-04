<template>
  <div class="form-signin text-center mt-5">
    <!-- Source: https://icons.getbootstrap.com/ License: https://github.com/twbs/icons/blob/main/LICENSE.md -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="72"
      fill="currentColor"
      class="bi bi-shield-lock mb-2"
      viewBox="0 0 16 16"
    >
      <path
        d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"
      />
      <path
        d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"
      />
    </svg>
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
    <div v-if="error != ''" class="alert alert-danger" role="alert">
      {{ error }}
    </div>
    <div class="form-group">
      <label for="username" class="sr-only">Username</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <!-- Source: https://icons.getbootstrap.com/ License: https://github.com/twbs/icons/blob/main/LICENSE.md -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
              /></svg
          ></span>
        </div>
        <input
          type="text"
          name="username"
          class="form-control"
          v-model="username"
          placeholder="Username"
          required
          autofocus
        />
      </div>
    </div>

    <div class="form-group">
      <label for="username" class="sr-only">Password</label>
      <div class="input-group">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <!-- Source: https://icons.getbootstrap.com/ License: https://github.com/twbs/icons/blob/main/LICENSE.md -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-shield-lock-fill"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z"
              /></svg
          ></span>
        </div>
        <input
          type="password"
          name="password"
          class="form-control"
          v-model="password"
          placeholder="Password"
          required
          autofocus
        />
      </div>
    </div>
    <div class="form-group">
      <button
        class="btn btn-primary btn-block"
        type="submit"
        v-on:click="login"
      >
        Sign in
      </button>
    </div>
  </div>
</template>

<script>
import { loginUser } from "../utils/auth";

export default {
  name: "loginView",
  data() {
    return {
      error: "",
      username: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        this.error = "";
        await loginUser(this.username, this.password);
        this.$router.push("/");
      } catch (err) {
        this.error = JSON.stringify(err);
      }
    },
  },
};
</script>

<style scoped>
body {
  display: -ms-flexbox;
  display: -webkit-box;
  display: flex;
  -ms-flex-align: center;
  -ms-flex-pack: center;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.btn {
  background-color: #ec7211;
  border-color: #ec7211;
}

.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
/* 
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.input-group {
  margin: 1rem;
}

.input-group label {
  margin-right: 0.5rem;
} */
</style>

