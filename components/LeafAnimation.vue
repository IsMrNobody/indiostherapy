<template>
  <div class="leaf-animation-container">
    <svg
      class="leaf-svg"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref="leafPath"
        class="leaf-path"
        d="M100,20 C120,20 160,40 160,100 C160,160 120,180 100,180 C80,180 40,160 40,100 C40,40 80,20 100,20 Z"
        fill="none"
        stroke="#2b5d42"
        stroke-width="2"
      />
      <path
        ref="leafVein"
        class="leaf-vein"
        d="M100,20 C100,20 100,100 100,180"
        fill="none"
        stroke="#2b5d42"
        stroke-width="1.5"
      />
      <path
        v-for="(vein, index) in 8"
        :key="index"
        class="leaf-side-vein"
        :d="`M100,${30 + index * 20} C${index % 2 === 0 ? 130 : 70},${
          40 + index * 20
        } ${index % 2 === 0 ? 140 : 60},${50 + index * 20}`"
        fill="none"
        stroke="#2b5d42"
        stroke-width="1"
        :style="{ animationDelay: `${index * 0.2}s` }"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const leafPath = ref(null);
const leafVein = ref(null);

onMounted(() => {
  startAnimation();
});

function startAnimation() {
  // Asegurar que las referencias están disponibles
  if (!leafPath.value || !leafVein.value) return;

  // La animación se manejará principalmente con CSS
}
</script>

<style scoped>
.leaf-animation-container {
  width: 150px;
  height: 150px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.leaf-svg {
  width: 100%;
  height: 100%;
  transform-origin: center;
  animation: leafFloat 6s ease-in-out infinite;
}

.leaf-path {
  stroke-dasharray: 600;
  stroke-dashoffset: 600;
  animation: drawLeaf 3s ease-out forwards,
    leafGlow 4s ease-in-out 3s infinite alternate;
}

.leaf-vein {
  stroke-dasharray: 160;
  stroke-dashoffset: 160;
  animation: drawVein 2s ease-out 1s forwards;
}

.leaf-side-vein {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: drawSideVein 1.5s ease-out 2s forwards;
  opacity: 0.8;
}

@keyframes drawLeaf {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes drawVein {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes drawSideVein {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes leafFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(2deg);
  }
  75% {
    transform: translateY(10px) rotate(-2deg);
  }
}

@keyframes leafGlow {
  from {
    stroke: #2b5d42;
    filter: drop-shadow(0 0 2px rgba(43, 93, 66, 0.3));
  }
  to {
    stroke: #3c7755;
    filter: drop-shadow(0 0 8px rgba(43, 93, 66, 0.8));
  }
}
</style>
