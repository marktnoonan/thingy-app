<template>
  <div class="avocado-info">
    <button
      @click="noJs = !noJs"
      style="position: fixed; left: 30px; top: 10px"
    >
      "Toggle JS"
    </button>
    <!-- NO-JS example -->
    <article v-if="diagramData && noJs">
      <h2>{{ diagramData.title }}</h2>
      <p>{{ diagramData.subtitle }}</p>
      <section
        v-for="layer in diagramData.layers"
        :key="layer.name"
        style="border-bottom: 1px solid #eee; margin-bottom: 12px"
      >
        <header>
          <div class="swatch" :style="{ backgroundColor: layer.color }">
            <img width="76" :src="require(`@/assets/${layer.image}`)" alt="" />
          </div>
          <h3>{{ layer.name }}</h3>
        </header>
        <ul>
          <li v-for="point in layer.points" :key="point.heading">
            <h4>{{ point.heading }}</h4>
            <p>{{ point.description }}</p>
            <ul>
              <li v-for="link in point.links" :key="link.href">
                <a :href="link.href">{{ link.text }}</a>
              </li>
            </ul>
          </li>
        </ul>
      </section>
    </article>
    <div v-else>
      <tabs v-model="activeTab" class="tab-container" :key="tabWrapperKey">
        <tab-list class="tabs-list" :label="diagramData.title">
          <tab v-for="layer in diagramData.layers" :key="layer.name">
            ⬤
            <span class="sr-only">{{ layer.name }}</span>
          </tab>
        </tab-list>
        <tab-panel
          v-for="(layer, index) in diagramData.layers"
          :key="layer.name"
          class="tab-panel"
        >
          <div class="image-container">
            <img
              :src="require(`@/assets/${layer.image}`)"
              :style="{
                borderColor: layer.color,
              }"
              alt=""
              width="400"
            />
            <transition name="fade-slow" mode="out-in">
              <div class="popover-layer" v-if="activeTab === index">
                {{ activeTab === index }}
                {{ activeTab }} {{ index }}
                <Popover v-for="point in layer.points" :key="point.name">
                  <PopoverButton
                    class="popover-activator"
                    :style="{
                      top: `${point.position.y}%`,
                      left: `${point.position.x}%`,
                    }"
                    >i
                  </PopoverButton>
                  <transition name="fade">
                    <PopoverPanel
                      class="popover-panel"
                      :style="{
                        top: `${point.position.y + 3}%`,
                        left: `${point.position.x + 6}%`,
                      }"
                    >
                      <img
                        v-if="point.image"
                        width="50"
                        :src="require(`@/assets/${point.image}`)"
                      />
                      <h3>
                        <b>{{ point.heading }}</b>
                      </h3>
                      <p>{{ point.description }}</p>
                      <ul>
                        <li v-for="link in point.links" :key="link.href">
                          <a :href="link.href">
                            {{ link.text }}
                          </a>
                        </li>
                      </ul>
                    </PopoverPanel>
                  </transition>
                </Popover>
              </div>
              <div v-else>Loading</div>
            </transition>
          </div>
        </tab-panel>
      </tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import diagramData from "../json/data";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { useWindowScroll } from "@vueuse/core";

const noJs = ref(false);
const activeTab = ref(0);
const tabWrapperKey = ref(false);
const { y: scrollY } = useWindowScroll();

watch(scrollY, (val) => {
  if (val > 20 && val < 200) {
    if (activeTab.value != 1) {
      activeTab.value = 1;
      tabWrapperKey.value = !tabWrapperKey.value;
    }
  } else if (val > 199) {
    if (activeTab.value != 2) {
      activeTab.value = 2;
      tabWrapperKey.value = !tabWrapperKey.value;
    }
  } else if (activeTab.value != 0) {
    activeTab.value = 0;
    tabWrapperKey.value = !tabWrapperKey.value;
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.avocado-info {
  max-width: 800px;
  margin: auto;
}

.swatch {
  height: 60px;
  width: 60px;
  border-radius: 50px;
  display: grid;
  align-content: center;
  overflow: hidden;
}

.image-container {
  position: relative;
  margin: auto;
}

.image-container > img {
  border-radius: 50px/40px;
  border: 3px solid;
  box-shadow: 0 0 0 2px;
}

.popover-layer {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
}

.popover-activator {
  position: absolute;
  border: 2px solid black;
  border-radius: 30px;
  height: 20px;
  width: 20px;
  padding: 0;
  background-color: rgb(171, 235, 235);
}

.popover-panel {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  border-radius: 0 8px 8px 8px;
  padding: 12px;
  width: 300px;
  text-align: left;
  z-index: 800;
}

.popover-panel a {
  color: #215c41;
}

.tab-container {
  width: 500px;
  margin: 20px auto;
  padding-left: 20px;
  display: flex;
  position: fixed;
  left: -2px;
}

.tabs-list {
  list-style: none;
  text-align: right;
  width: 80px;
}

.tabs__tab {
  transition: all 0.3s linear;
}

.tabs__tab.is-active {
  color: #215c41;
}

h3 {
  margin: 0;
}

ul {
  list-style-type: none;
  padding-left: 0;
  text-align: left;
  margin: 0;
}

li {
  padding-left: 0;
}

a {
  color: #42b983;
  text-decoration: none;
}

section header {
  display: flex;
  align-items: center;
}

section header > * {
  margin-right: 12px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  left: 0;
}

.fade-slow-enter-active,
.fade-slow-leave-active {
  transition: opacity 0.6s linear 1s;
}

.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}

.tab-panel {
  position: absolute;
}

.tab-panel.is-active {
  animation: fade-in 1s forwards;
}
.tab-panel:not(.is-active) {
  animation: fade-in 1s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    left: 130px;
  }
  100% {
    opacity: 1;
    left: 120px;
  }
}
</style>
