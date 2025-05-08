<!-- src/components/TitleBar.vue -->
<template>
  <div class="title-bar">
    <div class="title">Modern Calculator</div>
    <div class="window-controls">
      <button @click="minimizeWindow" class="control-button minimize">
        <span class="mdi mdi-minus"></span>
      </button>
      <button @click="closeWindow" class="control-button close">
        <span class="mdi mdi-close"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBar',
  methods: {
    minimizeWindow() {
      window.electron.window.minimize();
    },
    closeWindow() {
      window.electron.window.close();
    }
  }
}
</script>

<style scoped>
.title-bar {
  -webkit-app-region: drag;
  height: 32px;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  color: white;
  user-select: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.title {
  font-size: 14px;
  margin-left: 8px;
}

.window-controls {
  -webkit-app-region: no-drag;
  display: flex;
  gap: 4px;
}

.control-button {
  background: transparent;
  border: none;
  width: 32px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.close:hover {
  background: #e81123;
}

.control-button span {
  font-size: 18px;
}
</style> 