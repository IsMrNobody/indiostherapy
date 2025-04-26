<template>
  <div class="growing-plant-container">
    <svg
      class="plant-svg"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Tallo principal -->
      <path
        class="stem"
        d="M100,180 Q98,140 105,110 Q110,80 100,50 Q95,30 100,20"
        fill="none"
        stroke="#2b5d42"
        stroke-width="3"
      />

      <!-- Hojas -->
      <path
        class="leaf leaf-1"
        d="M100,150 Q120,140 130,150 Q140,160 120,165 Q110,170 100,150"
        fill="#3c7755"
        stroke="#2b5d42"
        stroke-width="1"
      />

      <path
        class="leaf leaf-2"
        d="M100,130 Q75,125 65,135 Q55,145 75,150 Q90,155 100,130"
        fill="#3c7755"
        stroke="#2b5d42"
        stroke-width="1"
      />

      <path
        class="leaf leaf-3"
        d="M100,110 Q125,100 135,110 Q145,120 125,125 Q110,130 100,110"
        fill="#3c7755"
        stroke="#2b5d42"
        stroke-width="1"
      />

      <path
        class="leaf leaf-4"
        d="M100,90 Q80,80 70,90 Q60,100 80,105 Q95,110 100,90"
        fill="#3c7755"
        stroke="#2b5d42"
        stroke-width="1"
      />

      <!-- Flor -->
      <circle class="flower-center" cx="100" cy="20" r="8" fill="#ffd166" />

      <!-- Pétalos de la flor -->
      <path
        class="petal petal-1"
        d="M100,20 Q110,5 120,10 Q130,15 120,30 Q110,35 100,20"
        fill="#ff6b6b"
        stroke="#d64545"
        stroke-width="1"
      />

      <path
        class="petal petal-2"
        d="M100,20 Q90,5 80,10 Q70,15 80,30 Q90,35 100,20"
        fill="#ff6b6b"
        stroke="#d64545"
        stroke-width="1"
      />

      <path
        class="petal petal-3"
        d="M100,20 Q115,15 120,0 Q125,-15 110,10 Q105,15 100,20"
        fill="#ff6b6b"
        stroke="#d64545"
        stroke-width="1"
      />

      <path
        class="petal petal-4"
        d="M100,20 Q85,15 80,0 Q75,-15 90,10 Q95,15 100,20"
        fill="#ff6b6b"
        stroke="#d64545"
        stroke-width="1"
      />

      <path
        class="petal petal-5"
        d="M100,20 Q105,35 115,40 Q125,45 110,30 Q105,25 100,20"
        fill="#ff6b6b"
        stroke="#d64545"
        stroke-width="1"
      />
    </svg>
  </div>
</template>

<script setup>
// No se necesita lógica JavaScript específica para esta animación
</script>

<style scoped>
.growing-plant-container {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  position: relative;
}

.plant-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* Animación del tallo */
.stem {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: growStem 3s ease-out forwards;
  animation-iteration-count: infinite;
  animation-delay: 0.5s;
}

@keyframes growStem {
  0% {
    stroke-dashoffset: 300;
  }
  70% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

/* Animación de las hojas */
.leaf {
  opacity: 0;
  transform-origin: center;
  animation: growLeaf 5s ease-out infinite;
}

.leaf-1 {
  animation-delay: 1.5s;
}

.leaf-2 {
  animation-delay: 2s;
}

.leaf-3 {
  animation-delay: 2.5s;
}

.leaf-4 {
  animation-delay: 3s;
}

@keyframes growLeaf {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20%,
  70% {
    opacity: 1;
    transform: scale(1);
  }
  90%,
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* Animación de la flor */
.flower-center {
  opacity: 0;
  transform: scale(0);
  animation: bloomCenter 5s ease-out infinite;
  animation-delay: 3.5s;
}

@keyframes bloomCenter {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20%,
  70% {
    opacity: 1;
    transform: scale(1);
  }
  90%,
  100% {
    opacity: 0;
    transform: scale(0);
  }
}

/* Animación de los pétalos */
.petal {
  opacity: 0;
  transform-origin: 100px 20px;
  animation: bloomPetal 5s ease-out infinite;
}

.petal-1 {
  animation-delay: 4s;
}

.petal-2 {
  animation-delay: 4.1s;
}

.petal-3 {
  animation-delay: 4.2s;
}

.petal-4 {
  animation-delay: 4.3s;
}

.petal-5 {
  animation-delay: 4.4s;
}

@keyframes bloomPetal {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-20deg);
  }
  20%,
  70% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  90%,
  100% {
    opacity: 0;
    transform: scale(0) rotate(-20deg);
  }
}
</style>
