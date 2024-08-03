<template>
  <div id="app">
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: 'Roboto', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

main {
  flex-grow: 1;
  overflow: hidden;
}

/* 全局样式 */
h1, h2, h3, h4, h5, h6 {
  font-weight: 500;
}

button {
  background-color: #4a0e4e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #6a1c6e;
}

input, select {
  border: 1px solid #e0e0e0;
  padding: 8px;
  border-radius: 4px;
  font-size: 14px;
}

/* 可以添加更多全局样式 */
</style>