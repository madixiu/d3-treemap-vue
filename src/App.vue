<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Main</router-link> |
      <router-link to="/other">Other</router-link> |
      <router-link to="/tooltip">Tooltip</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: "Vazir";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #2c3e50; */
}
</style>
