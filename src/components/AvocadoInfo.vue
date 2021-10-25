<template>
  <div class="avocado-info">
    <!-- Greensock example -->
    <div ref="animationHolder" class="animation-holder">
      Hi! animation holder
      <div class="animate-me"></div>
    </div>

    <div class="container">
      <button @click="playFunction">PLAY</button>
      <button @click="pause">PAUSE</button>
      <button @click="restart">RESTART</button>
    </div>

    <button @click="noJs = !noJs" style="position: fixed; left: 30px; top: 10px">"Toggle JS"</button>
    <button
      @click="diagramType === 'tabs' ? diagramType = 'carousel' : diagramType = 'tabs'"
      style="position: fixed; left: 130px; top: 10px"
    >Toggle diagram type</button>
    Active diagram type: {{ diagramType }}
    <!-- NO-JS example -->
    <div v-if="diagramData && noJs">
      <h2>{{ diagramData.title }}</h2>
      <p>{{ diagramData.subtitle }}</p>
      <article
        v-for="layer in diagramData.layers"
        :key="layer.name"
        style="border-bottom: 1px solid #eee; margin-bottom: 12px"
      >
        <header>
          <div class="swatch" :style="{ backgroundColor: layer.color }">
            <img width="150" :src="require(`@/assets/${layer.image}`)" alt />
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
      </article>
    </div>

    <!-- tabs example -  -->
    <div v-else-if="gimmeTabs">
      <tabs v-model="activeTab" class="tab-container" :key="tabWrapperKey" v-hover="handleHover">
        <tab-list class="tabs-list" :label="diagramData.title">
          <tab v-for="layer in diagramData.layers" :key="layer.name">
            <span aria-hidden>⬤</span>
            <span class="sr-only">{{ layer.name }}</span>
          </tab>
        </tab-list>
        <tab-panel v-for="layer in diagramData.layers" :key="layer.name" class="tab-panel">
          <div class="image-container">
            <img
              :src="require(`@/assets/${layer.image}`)"
              :style="{
                borderColor: layer.color,
              }"
              alt
              width="400"
            />
            <transition name="fade-slow">
              <div class="popover-layer" v-if="revealButtons">
                <Popover v-for="point in layer.points" :key="point.name">
                  <PopoverButton
                    class="popover-activator"
                    :style="{
                      top: `${point.position.y}%`,
                      left: `${point.position.x}%`,
                    }"
                  >
                    <span aria-hidden="true">i</span>
                    <span class="sr-only">{{ point.heading }}</span>
                  </PopoverButton>
                  <transition name="fade">
                    <PopoverPanel
                      class="popover-panel"
                      :style="{
                        top: `${point.position.y + 3}%`,
                        left: `${point.position.x + 6}%`,
                      }"
                    >
                      <img v-if="point.image" width="50" :src="require(`@/assets/${point.image}`)" />
                      <h3>
                        <b>{{ point.heading }}</b>
                      </h3>
                      <p>{{ point.description }}</p>
                      <ul>
                        <li v-for="link in point.links" :key="link.href">
                          <a :href="link.href">{{ link.text }}</a>
                        </li>
                      </ul>
                    </PopoverPanel>
                  </transition>
                </Popover>
              </div>
            </transition>
          </div>
        </tab-panel>
      </tabs>
    </div>

    <!-- carousel example -->
    <div v-else-if="gimmeCarousel">
      <carousel :items-to-show="1" :transition="0">
        <template #slides="{ currentSlide }">
          <slide v-for="(layer, index) in diagramData.layers" :key="layer.name">
            <transition name="fade" mode="out-in">
              <div class="image-container" :key="currentSlide">
                <img
                  :src="require(`@/assets/${layer.image}`)"
                  :style="{
                    borderColor: layer.color,
                  }"
                  alt
                  width="400"
                />
                <div
                  class="popover-layer"
                  v-if="(currentSlide === index) || (currentSlide === -1 && index === 0)"
                >
                  <Popover v-for="point in layer.points" :key="point.name">
                    <PopoverButton
                      class="popover-activator"
                      :style="{
                        top: `${point.position.y}%`,
                        left: `${point.position.x}%`,
                      }"
                    >
                      <span aria-hidden="true">i</span>
                      <span class="sr-only">{{ point.heading }}</span>
                    </PopoverButton>
                    <PopoverPanel
                      class="popover-panel"
                      :style="{
                        top: `${point.position.y + 3}%`,
                        left: `${point.position.x + 6}%`,
                      }"
                    >
                      <img v-if="point.image" width="50" :src="require(`@/assets/${point.image}`)" />
                      <h3>
                        <b>{{ point.heading }}</b>
                      </h3>
                      <p>{{ point.description }}</p>
                      <ul>
                        <li v-for="link in point.links" :key="link.href">
                          <a :href="link.href">{{ link.text }}</a>
                        </li>
                      </ul>
                    </PopoverPanel>
                  </Popover>
                </div>
              </div>
            </transition>
          </slide>
        </template>
        <template #addons>
          <pagination />
        </template>
      </carousel>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, triggerRef, computed, onMounted } from "vue";
import diagramData from "../json/data";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { tryOnUnmounted, useWindowScroll } from "@vueuse/core";
import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination } from 'vue3-carousel';
import { gsap } from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let timeline
const animationHolder = ref(null)

onMounted(() => {
  console.log('MOUNTED!!')
  timeline = gsap.timeline(
    {
      scrollTrigger: {
        trigger: "body",
        markers: true,
        scrub: true,
        pin: true,
        start: 'top'
      },
    }
  );

  timeline.to('.animate-me', {
    x: 750,
    rotation: 360,
    duration: 9,
  })

  timeline.to('.animate-me', {
    x: 500,
    y: 40,
    rotation: 230,
    duration: 9,
  })

  timeline.to('.animate-me', {
    x: 500,
    y: 100,
    rotation: 100,
    duration: 9,
    backgroundColor: 'purple'
  })

  timeline.to('.animate-me', {
    rotation: -560,
    duration: 90,
    backgroundColor: 'green',
    borderRadius: 500,
  })


  timeline.to('.animate-me', {
    scale: 3,
    duration: 9,
    backgroundColor: 'hotpink',
    height: 130,
    width: 130
  })

    timeline.to('.animate-me', {
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    duration: 100
  })

    timeline.to('.animate-me', {
    scale: 1,
    x: 0,
    y: 0,
    rotation: 0,
    duration: 100
  })


})


function playFunction() {
  timeline.play()
}

function pause() {
  timeline.pause()
}

function restart() {
  timeline.restart()
}
const noJs = ref(false);
const activeTab = ref(0);
const tabWrapperKey = ref(false);
const revealButtons = ref(false);
const { y: scrollY } = useWindowScroll();
const handleHover = ({ hovering }: { hovering: boolean }) => {
  revealButtons.value = hovering
}
const diagramType = ref<'tabs' | 'carousel'>('carousel')
const gimmeTabs = computed(() => diagramType.value === 'tabs')
const gimmeCarousel = computed(() => diagramType.value === 'carousel')

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
    triggerRef(activeTab);
  }
});


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.animation-holder {
  height: 200px;
  width: 400px;
  border: 1px solid green;
}

.container {
  padding: 30px;
  border: 2px solid palevioletred;
}

.container button {
  height: 70px;
  width: 70px;
  margin: 40px;
}

.animate-me {
  background-color: red;
  width: 100px;
  height: 50px;
}
.avocado-info {
  max-width: 800px;
  margin: auto;
}

.swatch {
  height: 150px;
  width: 150px;
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
  background: rgba(255, 255, 255, 0.9);
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
  transition: opacity 0.6s linear 0.2s;
}

.fade-slow-leave-active {
  transition: opacity 0.4s;
}

.fade-slow-enter-from,
.fade-slow-leave-to {
  opacity: 0;
}

.tab-panel {
  position: absolute;
  left: 120px;
}

.tab-panel.is-active {
  animation: fade-in 0.6s forwards;
}
.tab-panel:not(.is-active) {
  animation: fade-in 0.6s reverse;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.96);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
