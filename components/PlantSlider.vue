<template>
  <v-sheet v-if="plants.length > 0" class="pa-4" elevation="1">
    <CategoryChips
      :plants="plants"
      :selected-category="selectedProperty"
      @update:selectedCategory="onPropertyChange"
    />
    <v-row v-if="filteredPlants.length > 0">
      <v-col cols="12">
        <h3 class="mb-2">Explora otras plantas</h3>
        <v-slide-group
          v-model="selectedPlantIndex"
          show-arrows
          class="plant-slider-group"
          center-active
        >
          <v-slide-group-item
            v-for="(plant, idx) in filteredPlants"
            :key="plant._id || idx"
            :value="idx"
          >
            <v-card
              class="mx-2 plant-card"
              :elevation="selectedPlantIndex === idx ? 10 : 2"
              @click="selectPlant(idx)"
              outlined
              :color="selectedPlantIndex === idx ? 'green lighten-4' : 'white'"
              style="cursor: pointer; min-width: 180px; max-width: 220px"
            >
              <v-img
                :src="plant.img?.url || defaultImg"
                height="120"
                class="rounded-t"
                cover
              />
              <v-card-title class="py-2 text-truncate">
                {{ plant.nombre }}
              </v-card-title>
              <v-card-subtitle class="py-0 text-truncate">
                <span v-if="plant.fruta">Fruta: {{ plant.fruta }}</span>
              </v-card-subtitle>
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>

    <v-row v-if="filteredPlants.length === 0">
      <v-col cols="12" class="text-center">
        <div class="not-found-message">
          <v-icon color="grey" size="48">mdi-alert-circle-outline</v-icon>
          <div>No se encontró ninguna planta con ese nombre.</div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="selectedPlant">
      <v-col cols="12">
        <v-expand-transition>
          <v-card class="mt-4" v-if="selectedPlant">
            <div class="plant-card">
              <div class="plant-header">
                <h2>
                  {{ selectedPlant.nombre }} -
                  {{ selectedPlant.nombreCientifico }}
                </h2>
              </div>
              <div class="plant-content">
                <div class="plant-image-container">
                  <img
                    :src="selectedPlant.img?.url || defaultImg"
                    alt="Imagen de la planta"
                    class="plant-image"
                    @click="openImageModal"
                  />
                </div>
                <div class="plant-info">
                  <div class="info-section">
                    <h3>Descripción General</h3>
                    <p>{{ selectedPlant.descripcion }}</p>
                  </div>

                  <!-- Añadir sección de variedades si existen -->
                  <div
                    v-if="
                      selectedPlant.variedades &&
                      selectedPlant.variedades.length > 0
                    "
                    class="info-section"
                  >
                    <h3>Variedades</h3>
                    <ul>
                      <li
                        v-for="(variedad, index) in getArrayFromField(
                          selectedPlant.variedades
                        )"
                        :key="index"
                      >
                        {{ variedad }}
                      </li>
                    </ul>
                  </div>

                  <!-- Añadir sección de otros nombres si existen -->
                  <div
                    v-if="
                      selectedPlant.otrosNombres &&
                      selectedPlant.otrosNombres.length > 0
                    "
                    class="info-section"
                  >
                    <h3>Otros Nombres</h3>
                    <ul>
                      <li
                        v-for="(nombre, index) in getArrayFromField(
                          selectedPlant.otrosNombres
                        )"
                        :key="index"
                      >
                        {{ nombre }}
                      </li>
                    </ul>
                  </div>

                  <!-- Añadir sección de ingredientes activos si existen -->
                  <div
                    v-if="
                      selectedPlant.ingredientesActivos &&
                      selectedPlant.ingredientesActivos.length > 0
                    "
                    class="info-section"
                  >
                    <h3>Ingredientes Activos</h3>
                    <ul>
                      <li
                        v-for="(ingrediente, index) in getArrayFromField(
                          selectedPlant.ingredientesActivos
                        )"
                        :key="index"
                      >
                        {{ ingrediente }}
                      </li>
                    </ul>
                  </div>

                  <div class="info-section">
                    <h3>Partes de la Planta</h3>
                    <h4>Raíz:</h4>
                    <p>{{ selectedPlant.raiz }}</p>
                    <h4>Tallo:</h4>
                    <p>{{ selectedPlant.tallo }}</p>
                    <h4>Hojas:</h4>
                    <p>{{ selectedPlant.hojas }}</p>
                    <h4>Flor:</h4>
                    <p>{{ selectedPlant.flor }}</p>
                    <h4>Fruto:</h4>
                    <p>{{ selectedPlant.fruta }}</p>
                    <h4>Semilla:</h4>
                    <p>{{ selectedPlant.semilla }}</p>
                  </div>
                  <div class="info-section">
                    <h3>Propiedades Medicinales</h3>
                    <ul>
                      <li
                        v-for="(property, index) in propiedadesMedicinalesList"
                        :key="index"
                      >
                        {{ property }}
                      </li>
                    </ul>
                  </div>
                  <div class="info-section">
                    <h3>Usos Tradicionales</h3>
                    <p>{{ selectedPlant.usosTradicionales }}</p>
                  </div>
                  <div class="info-section">
                    <h3>Cómo Usarla</h3>
                    <p>{{ selectedPlant.comoUsarla }}</p>
                  </div>
                  <div class="info-section">
                    <v-btn
                      color="red"
                      dark
                      @click="handleDeletePlant(selectedPlant._id)"
                      style="margin-top: 1rem"
                    >
                      <v-icon left>mdi-delete</v-icon>Eliminar planta
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
            <!-- Modal para visualizar la imagen ampliada -->
            <div
              v-if="showImageModal"
              class="image-modal"
              @click="closeImageModal"
            >
              <div class="modal-content" @click.stop>
                <span class="close-button" @click="closeImageModal"
                  >&times;</span
                >
                <img
                  :src="selectedPlant.img?.url || defaultImg"
                  alt="Imagen ampliada de la planta"
                  class="modal-image"
                />
              </div>
            </div>
          </v-card>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
import { ref, onMounted, defineExpose, computed, watch } from "vue";
import { useNuxtApp } from "#app";
import CategoryChips from "./CategoryChips.vue";

// CORRECCIÓN: defineProps debe asignarse a una variable props
const props = defineProps({
  searchTerm: {
    type: String,
    default: "",
  },
});

const plants = ref([]);
const selectedPlant = ref(null);
const selectedPlantIndex = ref(-1);
const showImageModal = ref(false);
const defaultImg = "/img/plant-default.jpg";

// Propiedad seleccionada para filtrar
const selectedProperty = ref("");

// Extraer propiedades medicinales únicas de las plantas
const plantProperties = computed(() => {
  const props = new Set();
  plants.value.forEach((p) => {
    let propList = [];
    if (Array.isArray(p.propiedadesMedicinales)) {
      propList = p.propiedadesMedicinales;
    } else if (typeof p.propiedadesMedicinales === "string") {
      propList = p.propiedadesMedicinales
        .split(/,|\n/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
    propList.forEach((pr) => props.add(pr));
  });
  return Array.from(props);
});

function onPropertyChange(prop) {
  selectedProperty.value = prop;
}

// Computed para filtrar plantas según searchTerm y propiedad medicinal
const filteredPlants = computed(() => {
  let filtered = plants.value;
  if (selectedProperty.value) {
    filtered = filtered.filter((plant) => {
      let propList = [];
      if (Array.isArray(plant.propiedadesMedicinales)) {
        propList = plant.propiedadesMedicinales;
      } else if (typeof plant.propiedadesMedicinales === "string") {
        propList = plant.propiedadesMedicinales
          .split(/,|\n/)
          .map((s) => s.trim())
          .filter(Boolean);
      }

      // Buscar coincidencias parciales en lugar de coincidencias exactas
      const propertyToFind = selectedProperty.value.toLowerCase();
      return propList.some(
        (prop) =>
          prop.toLowerCase().includes(propertyToFind) ||
          propertyToFind.includes(prop.toLowerCase())
      );
    });
  }
  if (!props.searchTerm) return filtered;
  const term = props.searchTerm.trim().toLowerCase();
  return filtered.filter((plant) => {
    return (
      (plant.nombre && plant.nombre.toLowerCase().includes(term)) ||
      (plant.nombreCientifico &&
        plant.nombreCientifico.toLowerCase().includes(term))
    );
  });
});

// Computed para normalizar propiedadesMedicinales
const propiedadesMedicinalesList = computed(() => {
  if (!selectedPlant.value || !selectedPlant.value.propiedadesMedicinales)
    return [];
  const prop = selectedPlant.value.propiedadesMedicinales;
  if (Array.isArray(prop)) return prop;
  if (typeof prop === "string") {
    // Separar por coma o salto de línea
    return prop
      .split(/,|\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }
  return [];
});

// Selección automática si hay coincidencia única
watch(filteredPlants, (newVal) => {
  if (newVal.length === 1) {
    selectedPlant.value = newVal[0];
    selectedPlantIndex.value = plants.value.findIndex((p) => p === newVal[0]);
  }
});

// Función para convertir campos que pueden ser string o array a array
function getArrayFromField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    // Separar por coma o salto de línea
    return field
      .split(/,|\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

// Método expuesto para chequear si existe una planta
function existsPlantByName(name) {
  const term = name.trim().toLowerCase();
  return plants.value.some(
    (plant) =>
      plant.nombre?.toLowerCase() === term ||
      plant.nombreCientifico?.toLowerCase() === term
  );
}

async function fetchPlants() {
  try {
    const data = await $sweetApi.getPlants();
    plants.value = Array.isArray(data) ? data : [];
  } catch (error) {
    plants.value = [];
  }
}

function selectPlant(idx) {
  selectedPlantIndex.value = idx;
  selectedPlant.value = filteredPlants.value[idx];
}

function openImageModal() {
  showImageModal.value = true;
}
function closeImageModal() {
  showImageModal.value = false;
}

async function handleDeletePlant(id) {
  if (!id) return;
  if (!confirm("¿Seguro que deseas eliminar esta planta?")) return;
  try {
    await $sweetApi.deletePlant(id);
    await fetchPlants();
    selectedPlant.value = null;
    selectedPlantIndex.value = -1;
  } catch (error) {
    alert("Error al eliminar la planta.");
  }
}

onMounted(() => {
  fetchPlants();
});

const { $sweetApi } = useNuxtApp();

defineExpose({ fetchPlants, existsPlantByName });
</script>

<style scoped>
.plant-slider-group {
  min-height: 210px;
}
.plant-card {
  transition: box-shadow 0.2s, border 0.2s;
  border-radius: 10px;
  min-height: 180px;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plant-header h2 {
  margin: 0;
  font-size: 2rem;
}

.plant-content {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

@media (max-width: 768px) {
  .plant-content {
    grid-template-columns: 1fr;
  }
}

.plant-image-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.plant-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.plant-image:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
}

.plant-info {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.info-section h3 {
  margin-top: 0;
  color: #2b5d42;
  font-size: 1.25rem;
  border-bottom: 2px solid #a8c78e;
  padding-bottom: 0.5rem;
}
ul {
  padding-left: 1.2rem;
}
li {
  margin-bottom: 0.5rem;
}

/* Modal de imagen */
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}
.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  animation: fadeIn 0.3s ease;
}
.modal-image {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 5px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
}
.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  font-size: 30px;
  color: white;
  cursor: pointer;
  z-index: 1010;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.not-found-message {
  margin: 2rem 0;
  color: #888;
  font-size: 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
</style>
