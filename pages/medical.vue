<template>
  <v-container fluid class="medical-page pa-0">
    <v-container class="content-container">
      <!-- Animación de curación -->
      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <div class="healing-animation-wrapper">
            <GrowingPlantAnimation />
          </div>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" class="text-center">
          <h1 class="title">Buscador de Remedios Naturales</h1>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" md="8" lg="6">
          <div class="search-container">
            <input
              v-model="searchTerm"
              @keyup.enter="searchMedical"
              type="text"
              class="search-input"
              placeholder="Busca un síntoma o dolencia..."
            />
            <button @click="searchMedical" class="search-button">
              <span class="search-icon">🔍</span>
            </button>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="loading" justify="center">
        <v-col cols="12" class="text-center">
          <div class="loading">
            <div class="loading-animation"></div>
            <p>Buscando remedios naturales...</p>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="error" justify="center">
        <v-col cols="12" md="8">
          <div class="error-message">
            {{ error }}
          </div>
        </v-col>
      </v-row>

      <!-- Usa el componente MedicalResult si hay resultados -->
      <MedicalResult
        v-if="medicalResult && !loading"
        @generate-more="generateMorePlants"
        @loading-plant="handlePlantLoading"
        :loading-more="generatingMore"
        :medicalData="medicalResult"
      />
    </v-container>
  </v-container>
</template>

<script>
import { GoogleGenAI } from "@google/genai";
import GrowingPlantAnimation from "../components/GrowingPlantAnimation.vue";
import MedicalResult from "../components/MedicalResult.vue";
import { useRuntimeConfig } from "nuxt/app";

export default {
  components: {
    GrowingPlantAnimation,
    MedicalResult,
  },

  data() {
    return {
      // Estado de la búsqueda
      searchTerm: "",
      generatingMore: false,
      plantLoading: false,
      // Configuración de la API de Gemini
      API_KEY: useRuntimeConfig().public.API_GEM,
      genAI: null,
      // Variables locales como respaldo por si el store no está disponible
      _loading: false,
      _error: "",
      _result: null,
    };
  },

  computed: {
    loading() {
      if (!this.$store || !this.$store.state || !this.$store.state.medical) {
        return this._loading;
      }
      return this.$store.state.medical.loading;
    },
    error() {
      if (!this.$store || !this.$store.state || !this.$store.state.medical) {
        return this._error;
      }
      return this.$store.state.medical.error;
    },
    medicalResult() {
      if (!this.$store || !this.$store.state || !this.$store.state.medical) {
        return this._result;
      }
      return this.$store.state.medical.result;
    },
  },

  created() {
    // Inicializar la API de Gemini
    if (process.client) {
      try {
        this.genAI = new GoogleGenAI({ apiKey: this.API_KEY });
        console.log("API de Gemini inicializada correctamente");

        // Verificar si hay datos guardados en localStorage
        this.checkStoredData();
      } catch (error) {
        console.error("Error al inicializar la API de Gemini:", error);
      }
    }
  },

  methods: {
    // Verificar si hay datos guardados al navegar entre páginas
    checkStoredData() {
      // Primero verificar si hay datos en el store
      if (
        this.$store &&
        this.$store.state &&
        this.$store.state.medical &&
        this.$store.state.medical.result
      ) {
        // Si hay datos en el store, usarlos
        console.log("Recuperando datos desde el store de Vuex");
        // No necesitamos hacer nada porque los computed ya están conectados al store
        return;
      }

      // Si no hay datos en el store, verificar localStorage
      if (
        typeof window !== "undefined" &&
        localStorage.getItem("medical_data")
      ) {
        try {
          const storedData = JSON.parse(localStorage.getItem("medical_data"));
          if (storedData && Object.keys(storedData).length > 0) {
            console.log("Recuperando datos desde localStorage");
            // Guardar los datos recuperados en el store
            this.safeCommit("medical/setResult", storedData);
          }
        } catch (error) {
          console.error("Error al recuperar datos de localStorage:", error);
        }
      }
    },

    // Métodos seguros para interactuar con el store
    safeCommit(mutation, payload) {
      if (this.$store && this.$store.state && this.$store.state.medical) {
        this.$store.commit(mutation, payload);
      } else {
        // Manejo alternativo si el store no está disponible
        if (mutation === "medical/setLoading") {
          this._loading = payload;
        } else if (mutation === "medical/setError") {
          this._error = payload;
        } else if (mutation === "medical/setResult") {
          this._result = payload;
        } else if (mutation === "medical/clearResult") {
          this._result = null;
        }
      }
    },

    // Manejador para el evento de carga de planta
    handlePlantLoading(isLoading) {
      this.plantLoading = isLoading;
    },

    // Función para buscar síntomas y plantas relacionadas
    async searchMedical() {
      if (!this.searchTerm.trim()) {
        this.safeCommit(
          "medical/setError",
          "Por favor, ingresa un síntoma o dolencia"
        );
        return;
      }

      try {
        this.safeCommit("medical/setLoading", true);
        this.safeCommit("medical/setError", "");

        // Construir el prompt para Gemini enfocado en síntomas y remedios naturales
        const prompt = `Proporciona información detallada sobre el síntoma o dolencia "${this.searchTerm}" y sugiere plantas medicinales que pueden ayudar a tratarlo. La respuesta debe estar en formato JSON estrictamente.\n
          La respuesta debe incluir:\n{
            "symptom": "Nombre del síntoma o dolencia",
            "description": "Descripción detallada del síntoma o dolencia",
            "possibleCauses": ["causa 1", "causa 2", "etc"],
            "recommendedPlants": [
              {
                "name": "Nombre de la planta 1",
                "scientificName": "Nombre científico 1",
                "varieties": ["variedad 1", "variedad 2"],
                "othersNames": ["otro nombre 1", "otro nombre 2"],
                "activeIngredients": ["ingrediente activo 1", "ingrediente activo 2"],
                "properties": "Propiedades medicinales específicas para este síntoma",
                "howToUse": "Forma recomendada de preparación y uso para este síntoma",
                "imageUrl": ""
              },
              {
                "name": "Nombre de la planta 2",
                "scientificName": "Nombre científico 2",
                "varieties": ["variedad 1", "variedad 2"],
                "othersNames": ["otro nombre 1", "otro nombre 2"],
                "activeIngredients": ["ingrediente activo 1", "ingrediente activo 2"],
                "properties": "Propiedades medicinales específicas para este síntoma",
                "howToUse": "Forma recomendada de preparación y uso para este síntoma",
                "imageUrl": ""
              }
            ],
            "additionalRecommendations": "Consejos adicionales no basados en plantas (cambios en la dieta, hábitos, etc.)"
          }\n
          Asegúrate de recomendar solo plantas con propiedades científicamente documentadas para este síntoma específico.\nDeja los campos imageUrl vacíos, yo los llenaré después con imágenes por defecto.`;

        if (this.API_KEY) {
          // Usar el modelo Gemini para información textual
          const textModel = this.genAI.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });

          const response = await textModel;
          // console.log(response);
          let textResponse = "";

          // Extraer el texto de la respuesta
          for (const part of response.candidates[0].content.parts) {
            if (part.text) {
              textResponse += part.text;
            }
          }

          try {
            // Intentar extraer el JSON de la respuesta
            const jsonMatch =
              textResponse.match(/```json\n([\s\S]*?)\n```/) ||
              textResponse.match(/{[\s\S]*?}/);

            const jsonStr = jsonMatch
              ? jsonMatch[1] || jsonMatch[0]
              : textResponse;
            const parsedResult = JSON.parse(jsonStr);
            console.log(parsedResult);

            // Agregar imágenes por defecto a las plantas recomendadas
            if (Array.isArray(parsedResult.recommendedPlants)) {
              for (const plant of parsedResult.recommendedPlants) {
                // Usar imágenes de Unsplash como respaldo
                plant.imageUrl = `https://source.unsplash.com/random/?${encodeURIComponent(
                  plant.name + ",medicinal,plant,herb"
                )}`;
              }
            }

            // Guardar el resultado en el store
            this.safeCommit("medical/setResult", parsedResult);
          } catch (jsonError) {
            console.error("Error al procesar JSON:", jsonError);
            this.safeCommit(
              "medical/setError",
              "No se pudo procesar la información. Intenta de nuevo."
            );
            return;
          }
        }
      } catch (err) {
        console.error("Error en la búsqueda:", err);
        this.safeCommit("medical/setError", "Error en la búsqueda o conexión.");
      } finally {
        this.safeCommit("medical/setLoading", false);
      }

      // Limpiar el campo de búsqueda después de buscar
      this.searchTerm = "";
    },

    // Función para generar más plantas medicinales alternativas
    async generateMorePlants() {
      if (
        !this.medicalResult ||
        !this.medicalResult.symptom ||
        this.generatingMore
      ) {
        return;
      }

      try {
        this.generatingMore = true;

        // Construir el prompt para Gemini enfocado en plantas alternativas para el mismo síntoma
        const symptom = this.medicalResult.symptom;
        const existingPlants = this.medicalResult.recommendedPlants
          .map((p) => p.name)
          .join(", ");

        const prompt = `Proporciona 3-4 plantas medicinales ADICIONALES (diferentes a las ya mencionadas: ${existingPlants}) que pueden ayudar a tratar el síntoma o dolencia "${symptom}". La respuesta debe estar en formato JSON estrictamente.\n
          La respuesta debe incluir SOLO un array de plantas alternativas:\n{
            "alternativePlants": [
              {
                "name": "Nombre de la planta 1",
                "scientificName": "Nombre científico 1",
                "varieties": ["variedad 1", "variedad 2"],
                "othersNames": ["otro nombre 1", "otro nombre 2"],
                "activeIngredients": ["ingrediente activo 1", "ingrediente activo 2"],
                "properties": "Propiedades medicinales específicas para este síntoma",
                "howToUse": "Forma recomendada de preparación y uso para este síntoma"
              },
              {
                "name": "Nombre de la planta 2",
                "scientificName": "Nombre científico 2",
                "varieties": ["variedad 1", "variedad 2"],
                "othersNames": ["otro nombre 1", "otro nombre 2"],
                "activeIngredients": ["ingrediente activo 1", "ingrediente activo 2"],
                "properties": "Propiedades medicinales específicas para este síntoma",
                "howToUse": "Forma recomendada de preparación y uso para este síntoma"
              }
            ]
          }\n
          Asegúrate de recomendar solo plantas con propiedades científicamente documentadas para este síntoma específico que sean DIFERENTES a las ya mencionadas.`;

        // Usar el modelo Gemini para obtener plantas alternativas
        const textModel = this.genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });

        const response = await textModel;
        console.log(response);
        let textResponse = "";

        // Extraer el texto de la respuesta
        for (const part of response.candidates[0].content.parts) {
          if (part.text) {
            textResponse += part.text;
          }
        }

        // Procesar la respuesta
        try {
          // Intentar extraer el JSON de la respuesta
          const jsonMatch =
            textResponse.match(/```json\n([\s\S]*?)\n```/) ||
            textResponse.match(/{[\s\S]*?}/);

          const jsonStr = jsonMatch
            ? jsonMatch[1] || jsonMatch[0]
            : textResponse;
          const parsedResult = JSON.parse(jsonStr);

          // Verificar que el resultado contenga plantas alternativas
          if (
            parsedResult.alternativePlants &&
            Array.isArray(parsedResult.alternativePlants)
          ) {
            // Agregar imágenes a las nuevas plantas
            for (const plant of parsedResult.alternativePlants) {
              plant.imageUrl = `https://source.unsplash.com/random/?${encodeURIComponent(
                plant.name + ",medicinal,plant,herb"
              )}`;
            }

            // Agregar las nuevas plantas a la lista existente en el store
            if (this.$store && this.$store.state && this.$store.state.medical) {
              this.$store.commit(
                "medical/addMorePlants",
                parsedResult.alternativePlants
              );
            } else if (this._result && this._result.recommendedPlants) {
              // Manejo local si el store no está disponible
              this._result.recommendedPlants = [
                ...this._result.recommendedPlants,
                ...parsedResult.alternativePlants,
              ];
            }
          }
        } catch (jsonError) {
          console.error(
            "Error al procesar JSON de plantas alternativas:",
            jsonError
          );
        }
      } catch (err) {
        console.error("Error al generar plantas alternativas:", err);
      } finally {
        this.generatingMore = false;
      }
    },
  },
};
</script>

<style scoped>
.medical-page {
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #3e2723;
  background: linear-gradient(135deg, #f5f5dc 0%, #deb887 100%);
}

.content-container {
  max-width: 1200px;
  padding: 2rem;
}

.title {
  margin: 2rem 0;
  font-size: 3.5rem;
  color: #1e3f26;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-weight: 800;
  letter-spacing: -1px;
}

.search-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 30px;
  background: rgba(255, 248, 225, 0.9);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 250, 240, 0.98);
}

.search-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #33691e;
  transition: all 0.2s ease;
}

.search-button:hover {
  transform: translateY(-50%) scale(1.1);
}

.loading {
  text-align: center;
  margin: 3rem 0;
}

.loading-animation {
  display: inline-block;
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #306844;
  animation: spin 1s infinite ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  text-align: center;
  color: #e63946;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  margin: 2rem auto;
  max-width: 600px;
}

.healing-animation-wrapper {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  margin-bottom: -10px;
  padding-top: 20px;
}
</style>
