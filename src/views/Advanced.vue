<template>
  <div class="h-full split">
      <div id="split-0"><SideBar /></div>
      <div id="split-1"><Results /></div>
  </div>  
</template>

<script>
import Split from 'split.js'
import SideBar from '../components/SideBar.vue'
import Results from '../components/Results.vue'


export default {
  name: 'Landing',
  mounted: function () {
    Split(['#split-0', '#split-1'], {
        sizes: [25, 75],
        minSize: 100,
        gutterAlign: 'start',
    })
  },
  components: {
    SideBar,
    Results
  }
}
</script>

<style>
.split {
    display: flex;
    flex-direction: row;
}

.gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
}

.gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
}
</style>
