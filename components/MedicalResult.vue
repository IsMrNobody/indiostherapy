<template>
  <v-row justify="center">
    <v-col cols="12">
      <div class="result-container">
        <button class="close-result" @click="closeResult">&times;</button>
        <div class="medical-card">
          <div class="medical-header">
            <h2>{{ medicalData.symptom }}</h2>
          </div>

          <v-container class="medical-content">
            <v-row>
              <v-col cols="12">
                <div class="medical-info">
                  <div class="info-section">
                    <h3>Descripción</h3>
                    <p>{{ medicalData.description }}</p>
                  </div>

                  <div class="info-section">
                    <h3>Posibles Causas</h3>
                    <ul>
                      <li
                        v-for="(cause, index) in medicalData.possibleCauses"
                        :key="index"
                      >
                        {{ cause }}
                      </li>
                    </ul>
                  </div>

                  <div class="info-section">
                    <h3>Plantas Medicinales Recomendadas</h3>
                    <div class="recommended-plants">
                      <v-card
                        v-for="(plant, index) in medicalData.recommendedPlants"
                        :key="index"
                        class="herbal-card mb-4"
                        elevation="3"
                      >
                        <v-card-item>
                          <v-card-title class="plant-title">
                            {{ plant.name }}
                            <span class="scientific-name"
                              >({{ plant.scientificName }})</span
                            >
                          </v-card-title>
                          <v-card-text class="plant-text">
                            <div class="property-section">
                              <div class="property-title">Propiedades:</div>
                              <div class="property-content">
                                {{ plant.properties }}
                              </div>
                            </div>

                            <!-- Añadir sección de variedades si existen -->
                            <div
                              v-if="
                                plant.varieties && plant.varieties.length > 0
                              "
                              class="property-section"
                            >
                              <div class="property-title">Variedades:</div>
                              <div class="property-content">
                                <span
                                  v-for="(variedad, i) in plant.varieties"
                                  :key="i"
                                >
                                  {{ variedad
                                  }}{{
                                    i < plant.varieties.length - 1 ? ", " : ""
                                  }}
                                </span>
                              </div>
                            </div>

                            <!-- Añadir sección de otros nombres si existen -->
                            <div
                              v-if="
                                plant.othersNames &&
                                plant.othersNames.length > 0
                              "
                              class="property-section"
                            >
                              <div class="property-title">Otros nombres:</div>
                              <div class="property-content">
                                <span
                                  v-for="(nombre, i) in plant.othersNames"
                                  :key="i"
                                >
                                  {{ nombre
                                  }}{{
                                    i < plant.othersNames.length - 1 ? ", " : ""
                                  }}
                                </span>
                              </div>
                            </div>

                            <!-- Añadir sección de ingredientes activos si existen -->
                            <div
                              v-if="
                                plant.activeIngredients &&
                                plant.activeIngredients.length > 0
                              "
                              class="property-section"
                            >
                              <div class="property-title">
                                Ingredientes activos:
                              </div>
                              <div class="property-content">
                                <span
                                  v-for="(
                                    ingrediente, i
                                  ) in plant.activeIngredients"
                                  :key="i"
                                >
                                  {{ ingrediente
                                  }}{{
                                    i < plant.activeIngredients.length - 1
                                      ? ", "
                                      : ""
                                  }}
                                </span>
                              </div>
                            </div>

                            <div class="property-section">
                              <div class="property-title">Cómo usarla:</div>
                              <div class="property-content">
                                {{ plant.howToUse }}
                              </div>
                            </div>
                            <v-btn
                              class="herb-btn mt-3"
                              @click="viewPlantDetails(plant.name)"
                              variant="tonal"
                            >
                              Ver detalles completos
                            </v-btn>
                          </v-card-text>
                        </v-card-item>
                      </v-card>

                      <!-- Botón para generar más opciones -->
                      <div class="text-center mt-4 mb-2">
                        <v-btn
                          class="more-options-btn"
                          @click="$emit('generate-more')"
                          :loading="loadingMore"
                          :disabled="loadingMore"
                          prepend-icon="mdi-herb"
                          variant="outlined"
                          size="large"
                        >
                          {{
                            loadingMore
                              ? "Buscando más opciones..."
                              : "Mostrar más plantas medicinales"
                          }}
                        </v-btn>
                      </div>
                    </div>
                  </div>

                  <div class="info-section">
                    <h3>Recomendaciones Adicionales</h3>
                    <p>{{ medicalData.additionalRecommendations }}</p>
                  </div>

                  <div class="disclaimer">
                    <p>
                      Nota: Esta información es solo orientativa. Consulta
                      siempre con un profesional de la salud antes de utilizar
                      remedios naturales, especialmente para condiciones graves
                      o crónicas.
                    </p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </v-col>
  </v-row>

  <!-- Modal para visualizar la imagen ampliada -->
  <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
    <div class="modal-content">
      <span class="close-button" @click="closeImageModal">&times;</span>
      <img
        :src="selectedPlant?.imageUrl"
        :alt="selectedPlant?.name"
        class="modal-image"
      />
      <div class="modal-plant-info">
        <h3>{{ selectedPlant?.name }}</h3>
        <p>{{ selectedPlant?.properties }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useNuxtApp } from "#app";

export default {
  props: {
    loadingMore: {
      type: Boolean,
      default: false,
    },
    medicalData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },

  data() {
    return {
      // Estado para modal de imagen
      showImageModal: false,
      selectedPlant: null,
    };
  },

  created() {
    console.log("MedicalResult creado con datos:", this.medicalData);

    // Guardar los datos en el store si no existe ya
    if (
      this.$store &&
      this.$store.state &&
      this.$store.state.medical &&
      !this.$store.state.medical.result &&
      Object.keys(this.medicalData).length > 0
    ) {
      this.$store.commit("medical/setResult", this.medicalData);
    }
  },

  watch: {
    medicalData: {
      handler(newValue) {
        console.log("MedicalResult recibió nuevos datos:", newValue);

        // Actualizar el store cuando cambia medicalData
        if (
          this.$store &&
          this.$store.state &&
          this.$store.state.medical &&
          Object.keys(newValue).length > 0
        ) {
          this.$store.commit("medical/setResult", newValue);
        }
      },
      deep: true,
      immediate: true,
    },
  },

  methods: {
    // Funciones para el modal de imagen
    openImageModal(plant) {
      this.selectedPlant = plant;
      this.showImageModal = true;
      document.body.style.overflow = "hidden"; // Prevenir scroll cuando el modal está abierto
    },

    closeImageModal() {
      this.showImageModal = false;
      document.body.style.overflow = "auto"; // Restaurar scroll
    },

    // Cerrar el resultado
    closeResult() {
      if (this.$store && this.$store.state && this.$store.state.medical) {
        this.$store.commit("medical/clearResult");
      }
    },

    // Función para ver detalles completos de una planta
    async viewPlantDetails(plantName) {
      try {
        // Guardar el nombre de la planta en localStorage para que botanic.vue lo pueda usar
        if (typeof window !== "undefined") {
          localStorage.setItem("plant_search", plantName);

          // También guardar los datos médicos actuales en localStorage
          // para poder recuperarlos si es necesario
          if (this.medicalData && Object.keys(this.medicalData).length > 0) {
            localStorage.setItem(
              "medical_data",
              JSON.stringify(this.medicalData)
            );
          }
        }

        // Asegurar que los datos están en el store antes de navegar
        if (
          this.$store &&
          this.$store.state &&
          this.$store.state.medical &&
          this.medicalData &&
          Object.keys(this.medicalData).length > 0
        ) {
          this.$store.commit("medical/setResult", this.medicalData);
        }

        // Mostrar indicador de carga
        this.$emit("loading-plant", true);

        // Obtener referencia a $sweetApi en un entorno de composición
        const { $sweetApi } = useNuxtApp();

        // Intentar obtener las plantas existentes para verificar si ya existe
        try {
          const plants = await $sweetApi.getPlants();
          const plantExists = plants.some(
            (plant) =>
              plant.nombre?.toLowerCase() === plantName.toLowerCase() ||
              plant.nombreCientifico?.toLowerCase() ===
                plantName.toLowerCase() ||
              (plant.otrosNombres &&
                plant.otrosNombres.some(
                  (nombre) => nombre.toLowerCase() === plantName.toLowerCase()
                ))
          );

          // Si la planta no existe en la base de datos, no hay problema,
          // la página botanic la buscará con la API de Gemini
        } catch (error) {
          console.error("Error al verificar si la planta existe:", error);
          // Continuar con la navegación aunque haya error, botanic se encargará
        }

        // Navegar a la página de plantas con el nombre como parámetro de búsqueda
        this.$router.push({
          path: "/botanic",
          query: { search: plantName },
        });
      } catch (error) {
        console.error("Error al navegar a detalles de la planta:", error);
      } finally {
        // Ocultar indicador de carga después de un tiempo para que se muestre
        // sólo si la navegación es lenta
        setTimeout(() => {
          this.$emit("loading-plant", false);
        }, 500);
      }
    },
  },
};
</script>

<style scoped>
.result-container {
  margin: 2rem 0;
  animation: fadeIn 0.5s ease-out;
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-result {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 2rem;
  color: #305a36;
  cursor: pointer;
  z-index: 10;
  transition: color 0.2s;
}

.close-result:hover {
  color: #a82d2d;
}

.medical-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.medical-card:hover {
  transform: translateY(-5px);
}

.medical-header {
  background: linear-gradient(90deg, #556b2f 0%, #8fbc8f 100%);
  color: #fff8e1;
  padding: 1.5rem;
  text-align: center;
}

.medical-header h2 {
  margin: 0;
  font-size: 2rem;
}

.medical-content {
  padding: 1.5rem;
}

.medical-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: rgba(255, 250, 240, 0.85);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #6d4c41;
}

.info-section h3 {
  margin-top: 0;
  color: #33691e;
  font-size: 1.25rem;
  border-bottom: 2px solid #a1887f;
  padding-bottom: 0.5rem;
}

.recommended-plants {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.herbal-card {
  border-radius: 8px;
  overflow: hidden;
  background-color: #f1f8e9;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.herbal-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(105, 105, 50, 0.2) !important;
}

.plant-title {
  color: #33691e;
  font-size: 1.3rem;
  font-weight: 600;
  padding-bottom: 4px;
  border-bottom: 1px solid #dcedc8;
}

.scientific-name {
  font-style: italic;
  font-weight: normal;
  font-size: 0.9em;
  color: #795548;
  margin-left: 8px;
}

.plant-text {
  color: #3e2723;
  padding-top: 10px;
}

.property-section {
  margin-bottom: 12px;
}

.property-title {
  font-weight: 600;
  color: #558b2f;
  margin-bottom: 2px;
}

.property-content {
  padding-left: 8px;
  border-left: 2px solid #aed581;
}

.herb-btn {
  background-color: #558b2f !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.herb-btn:hover {
  background-color: #33691e !important;
}

.disclaimer {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(255, 243, 224, 0.6);
  border-left: 3px solid #bf360c;
  border-radius: 5px;
  font-size: 0.9rem;
  color: #5d4037;
}

/* Estilos para el modal de imagen */
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 5px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
}

.modal-plant-info {
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 5px;
  width: 100%;
  text-align: center;
}

.modal-plant-info h3 {
  margin-top: 0;
  color: #2b5d42;
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

.more-options-btn {
  border: 2px solid #558b2f !important;
  color: #33691e !important;
  background-color: rgba(241, 248, 233, 0.7) !important;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.more-options-btn:hover {
  background-color: #558b2f !important;
  color: white !important;
  box-shadow: 0 4px 8px rgba(85, 139, 47, 0.3);
}
</style>
