<script setup>
const handleClick = () => {
  alert("ボタンがクリックされました")
}

const handleMouseover = () => {
  alert("マウスオーバーされました")
}
</script>

<template>
  <h1>Sample4</h1>
  <button @click="handleClick">click</button>
  <button @mouseover="handleMouseover">mouseover</button>
</template>




