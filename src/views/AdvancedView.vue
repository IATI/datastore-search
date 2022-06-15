<template>
  <div class="h-full">
    <div class="mx-6 pt-6 mx-auto advanced:hidden">
      <p class="text-orange-600 text-left">
        Sorry, the advanced filter page isn't available for devices with smaller
        screens.
      </p>
      <p class="pt-6 text-left">
        Please
        <router-link to="/simple" class="hover:underline text-blue-600"
          >try the Simple Search</router-link
        >
        instead, or switch to a device with a larger screen.
      </p>
    </div>
    <div class="h-full split invisible advanced:visible">
      <div id="split-0"><SideBar /></div>
      <div id="split-1"><ResultList /></div>
    </div>
  </div>
</template>

<script>
import Split from "split.js";
import SideBar from "../components/SideBar.vue";
import ResultList from "../components/ResultList.vue";

export default {
  name: "LandingView",
  components: {
    SideBar,
    ResultList,
  },
  inject: ["global"],
  mounted: function () {
    Split(["#split-0", "#split-1"], {
      sizes: [40, 60],
      minSize: 450,
      expandToMin: true,
      gutterAlign: "start",
    });
  },
  unmounted: function () {
    this.global.resetResults();
  },
};
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
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
  cursor: col-resize;
}
</style>
