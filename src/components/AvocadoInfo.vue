<template>
  <suspense>
    <div class="avocado-info" :class="typeToDisplay">
      <button
        @click="noJs = !noJs"
        style="position: fixed; left: 30px; top: 10px"
      >
        "Toggle JS"
      </button>
      <!-- <div
        style="
          position: absolute;
          background-color: white;
          top: 0;
          z-index: 20000;
          text-align: left;
          padding: 12px;
        "
      >
        Active Tab: {{ activeTab }}
        <br />
        What we are showing: {{ typeToDisplay }}
      </div> -->
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
              <img
                v-if="point.image"
                width="40"
                :src="require(`@/assets/${point.image}`)"
              />
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

      <!-- tabs example -->
      <div v-else>
        <div>
          <tabs v-model="activeTab" class="tab-container" :key="activeTab">
            <tab-list class="tabs-list" :label="diagramData.title">
              <tab
                v-for="layer in diagramData.layers"
                :key="layer.name"
                @click="handleTabClick"
              >
                <span>⬤</span>
              </tab>
            </tab-list>
            <tab-panel
              v-for="layer in diagramData.layers"
              :key="layer.name"
              class="tab-panel"
            >
              <div class="image-container">
                <img
                  :src="require(`@/assets/${layer.image}`)"
                  :style="{
                    borderColor: layer.color,
                  }"
                  alt
                  width="400"
                  height="400"
                />

                <div class="popover-layer">
                  <Popover v-for="point in layer.points" :key="point.name">
                    <PopoverButton
                      class="popover-activator"
                      :style="{
                        top: `${point.position.y}%`,
                        left: `${point.position.x}%`,
                      }"
                    >
                      <span aria-hidden="true">i</span>
                    </PopoverButton>
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
                          <a :href="link.href">{{ link.text }}</a>
                        </li>
                      </ul>
                    </PopoverPanel>
                  </Popover>
                </div>
              </div>
            </tab-panel>
          </tabs>
        </div>
        <div class="greensock-deck">
          <img
            class="greensock-deck-image"
            v-for="(layer, i) in [...diagramData.layers].reverse()"
            :class="'greensock-image-' + i"
            :key="layer.name"
            :src="require(`@/assets/${layer.image}`)"
            :style="{
              borderColor: layer.color,
            }"
            width="400"
            height="400"
            alt
          />
        </div>
      </div>
    </div>
  </suspense>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from "vue";
import diagramData from "../json/data";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let timeline: gsap.core.Timeline;
const typeToDisplay = ref("tabs");

onMounted(() => {
  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      markers: false,
      scrub: true,
      pin: true,
      start: "-20",
      end: "+580",
    },
  });

  diagramData.layers.forEach((item: never, index: number) => {
    const layerPosition = diagramData.layers.length - index - 1;
    if (index === diagramData.layers.length - 1) {
      return;
    }
    timeline.fromTo(
      `.greensock-image-${layerPosition}`,
      {
        opacity: 1,
      },
      {
        scale: 1.06,
        x: 10,
        y: -10,
        rotate: -4,
        opacity: 0,
        duration: 1,
        ease: "sine",
        onStart() {
          activeTab.value = index + 1;
          typeToDisplay.value = "animation";
        },
        onComplete() {
          typeToDisplay.value = "tabs";
        },
        onReverseComplete() {
          activeTab.value = index;
          typeToDisplay.value = "tabs";
        },
        onUpdate() {
          if (timeline.scrollTrigger?.direction === -1) {
            typeToDisplay.value = "animation";
          }
        },
      },
      `+=1`
    );
  });
});

const noJs = ref(false);
const activeTab = ref(0);

const handleTabClick = () => {
  nextTick().then(() => {
    timeline.scrollTrigger?.scroll(
      (activeTab.value * 600) / (diagramData.layers.length - 1)
    );
  });
};
</script>

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
}

.avocado-info.animation .popover-layer,
.avocado-info.animation .image-container > img {
  display: none;
}

.popover-layer {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 300;
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

.greensock-deck {
  position: absolute;
  z-index: 200;
  pointer-events: none;
  left: 118px;
  top: 82 px;
}
.avocado-info.tabs .greensock-deck {
  opacity: 0;
}

.greensock-deck-image {
  position: absolute;
  border-radius: 50px/40px;
  border: 3px solid;
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
/* 
.tab-panel.is-active {
  animation: fade-in 0.6s forwards;
}
.tab-panel:not(.is-active) {
  animation: fade-in 0.6s reverse;
} */

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
