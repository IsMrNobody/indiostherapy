<template>
  <v-slide-group
    show-arrows
    class="chips-slider"
    center-active
    v-model="internalSelected"
  >
    <template v-if="loading">
      <v-chip class="ma-1" color="grey lighten-2" text-color="grey" pill
        >Cargando...</v-chip
      >
    </template>
    <template v-else-if="error">
      <v-chip class="ma-1" color="red lighten-2" text-color="white" pill>{{
        error
      }}</v-chip>
    </template>
    <template v-else>
      <v-slide-group-item v-for="cat in categories" :key="cat" :value="cat">
        <v-chip
          :color="
            cat === selectedCategory ? 'green darken-2' : 'grey lighten-3'
          "
          :text-color="cat === selectedCategory ? 'white' : 'green darken-2'"
          class="ma-1"
          @click="selectCategory(cat)"
          :outlined="cat !== selectedCategory"
          pill
          style="font-weight: bold; min-width: 100px"
        >
          {{ cat }}
        </v-chip>
      </v-slide-group-item>
      <v-slide-group-item v-if="selectedCategory">
        <v-chip
          class="ma-1"
          color="red lighten-2"
          text-color="white"
          pill
          @click="clearCategory"
          title="Limpiar filtro"
          style="font-weight: bold; min-width: 60px"
        >
          ✕ Limpiar
        </v-chip>
      </v-slide-group-item>
    </template>
  </v-slide-group>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, onMounted } from "vue";
import { GoogleGenAI } from "@google/genai";

const API_KEY = "AIzaSyBK2OnFO1A7zPYJHmyMeDrF9p1LOoyrhgc"; // Necesitarás obtener una clave de API de Google AI Studio
const genAI = new GoogleGenAI({ apiKey: API_KEY });

const props = defineProps({
  plants: {
    type: Array,
    required: true,
  },
  selectedCategory: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:selectedCategory"]);
const internalSelected = ref(props.selectedCategory);
const categories = ref([]); // Palabras clave generadas por Gemini
const loading = ref(false);
const error = ref("");

watch(
  () => props.selectedCategory,
  (val) => {
    internalSelected.value = val;
  }
);

async function fetchGeminiKeywords() {
  let allProps = props.plants.flatMap((p) =>
    Array.isArray(p.propiedadesMedicinales)
      ? p.propiedadesMedicinales
      : typeof p.propiedadesMedicinales === "string"
      ? p.propiedadesMedicinales
          .split(/,|\n/)
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );
  // Limita a 200 propiedades
  allProps = allProps.slice(0, 50);
  // console.log("allProps", allProps);
  if (allProps.length === 0) {
    categories.value = [];
    return;
  }
  loading.value = true;
  error.value = "";
  const prompt = `A partir de esta lista de propiedades medicinales de plantas: ${allProps.join(
    ", "
  )}\nDevuélveme una lista de treinta términos clave únicos existentes en la lista anterior, términos de una palabra cada uno, que representen las categorías principales de propiedades medicinales. Solo términos clave, separados por comas. Responde estrictamente con la lista de términos, sin ningún comentario adicional.`;
  let keywords = [];
  try {
    // Estructura directa tipo genAI.models.generateContent
    const textModel = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("textModel", textModel);
    let textResponse = "";
    if (textModel && textModel.candidates && textModel.candidates[0]) {
      for (const part of textModel.candidates[0].content.parts) {
        if (part.text) textResponse += part.text;
      }
      keywords = textResponse
        .replace(/\n/g, "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  } catch (e) {
    error.value = "Error al conectar con Gemini";
    keywords = [];
  }
  categories.value = keywords;
  loading.value = false;
}

watch(() => props.plants, fetchGeminiKeywords, { deep: true });
onMounted(fetchGeminiKeywords);

function selectCategory(cat) {
  emit("update:selectedCategory", cat);
}

function clearCategory() {
  emit("update:selectedCategory", "");
}
</script>

<style scoped>
.chips-slider {
  margin-bottom: 1rem;
  padding: 0 0.5rem;
  max-width: 100vw;
}
</style>
