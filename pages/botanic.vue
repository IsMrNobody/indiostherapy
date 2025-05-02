<template>
  <div class="botanic-page">
    <div class="content-container">
      <!-- Animación de planta creciendo -->
      <div class="plant-animation-wrapper">
        <GrowingPlantAnimation />
      </div>

      <h1 class="title">Jardín Botánico Virtual</h1>

      <div v-if="!loading" class="search-container">
        <input
          v-model="searchTerm"
          @keyup.enter="searchPlantFromInput"
          type="text"
          class="search-input"
          placeholder="Busca una planta medicinal..."
        />
        <button @click="searchPlantFromInput" class="search-button">
          <span class="search-icon">🔍</span>
        </button>
      </div>

      <div
        v-if="result && !loading && !searchTerm && showResult"
        class="info-cards-container"
      >
        <div class="info-card">
          <h3>Variedades</h3>
          <ul>
            <li
              v-for="(variedad, index) in result.varieties"
              :key="index"
              @click="searchTerm = `${result.name} ${variedad}`"
              style="
                cursor: pointer;
                text-decoration: underline;
                color: #2b5d42;
              "
              title="Buscar esta variedad"
            >
              {{ variedad }}
            </li>
          </ul>
        </div>

        <div class="info-card">
          <h3>Otros Nombres</h3>
          <ul>
            <li
              v-for="(nombre, index) in result.othersNames"
              :key="index"
              @click="searchTerm = nombre"
              style="
                cursor: pointer;
                text-decoration: underline;
                color: #2b5d42;
              "
              title="Buscar por este nombre"
            >
              {{ nombre }}
            </li>
          </ul>
        </div>

        <div class="info-card">
          <h3>Ingredientes Activos</h3>
          <ul>
            <li
              v-for="(ingrediente, index) in result.activeIngredients"
              :key="index"
            >
              {{ ingrediente }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-animation"></div>
        <p>Explorando el jardín botánico...</p>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div
        v-if="result && !loading && !searchTerm && showResult"
        class="result-container"
      >
        <button class="close-result" @click="showResult = false">
          &times;
        </button>
        <div class="plant-card">
          <div class="plant-header">
            <h2>{{ result.name }} - {{ result.scientificName }}</h2>
          </div>

          <div class="plant-content">
            <div class="plant-image-container">
              <img
                :src="result.imageUrl"
                alt="Imagen de la planta"
                class="plant-image"
                @click="openImageModal"
              />
            </div>

            <div class="plant-info">
              <div class="info-section">
                <h3>Descripción General</h3>
                <p>{{ result.description }}</p>
              </div>

              <div class="info-section">
                <h3>Partes de la Planta</h3>
                <h4>Raíz:</h4>
                <p>{{ result.root }}</p>
                <h4>Tallo:</h4>
                <p>{{ result.stem }}</p>
                <h4>Hojas:</h4>
                <p>{{ result.leaves }}</p>
                <h4>Flor:</h4>
                <p>{{ result.flower }}</p>
                <h4>Fruto:</h4>
                <p>{{ result.fruit }}</p>
                <h4>Semilla:</h4>
                <p>{{ result.seed }}</p>
              </div>

              <div class="info-section">
                <h3>Propiedades Medicinales</h3>
                <ul>
                  <li
                    v-for="(property, index) in result.properties"
                    :key="index"
                  >
                    {{ property }}
                  </li>
                </ul>
              </div>

              <div class="info-section">
                <h3>Usos Tradicionales</h3>
                <p>{{ result.traditionalUses }}</p>
              </div>

              <div class="info-section">
                <h3>Cómo Usarla</h3>
                <p>{{ result.howToUse }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PlantSlider debajo del resultado de búsqueda -->
      <PlantSlider
        v-if="!loading"
        ref="plantSliderRef"
        :search-term="searchTerm"
      />
    </div>

    <!-- Modal para visualizar la imagen ampliada -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="modal-content">
        <span class="close-button" @click="closeImageModal">&times;</span>
        <img
          :src="result?.imageUrl"
          alt="Imagen ampliada de la planta"
          class="modal-image"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from "vue";
import { GoogleGenAI, Modality } from "@google/genai";
import GrowingPlantAnimation from "../components/GrowingPlantAnimation.vue";
import { useNuxtApp } from "#app";
import sweetApi from "../plugins/sweetApi";
import PlantSlider from "~/components/PlantSlider.vue";
import { uploadToCloudinary } from "~/utils/uploadToCloudinary.js";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

// Inicializar el store
// const store = useStore();

// Acceder a la ruta actual para obtener parámetros
const route = useRoute();

// Referencias para las animaciones
const plantSliderRef = ref(null);

// Estado de la búsqueda
const searchTerm = ref("");
// Usar el estado del store
const loading = ref(false);
const error = ref("");
const result = ref(null);

// Estado del modal de imagen
const showImageModal = ref(false);

// Estado del resultado
const showResult = ref(true);

// Configuración de la API de Gemini
const API_KEY = process.env.API_GEM; // Usando la variable de entorno
const genAI = new GoogleGenAI({ apiKey: API_KEY });

const CLOUDINARY_CLOUD_NAME = "dku13l2ep"; // <-- Cloud name actualizado
const CLOUDINARY_UPLOAD_PRESET = "unsigned_indiostherapy"; // <-- Cambia esto por tu upload_preset unsigned

// Funciones para el modal de imagen
function openImageModal() {
  showImageModal.value = true;
  document.body.style.overflow = "hidden"; // Prevenir scroll cuando el modal está abierto
}

function closeImageModal() {
  showImageModal.value = false;
  document.body.style.overflow = "auto"; // Restaurar scroll
}

// Función para generar imagen con Gemini
async function generatePlantImage(plantName) {
  try {
    // Crear el prompt para la generación de imagen
    const prompt = `Una ilustración botánica profesional y detallada de la planta medicinal "${plantName}". 
    Muestra la planta completa incluyendo hojas, flores y/o frutos si tiene. 
    La imagen debe ser clara, con buena iluminación, sobre un fondo blanco beige. (no incluyas texto en la imagen)`;

    // Usar el modelo de generación de imágenes de Gemini
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    // Extraer la imagen de la respuesta
    let imageUrl = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("No se pudo generar la imagen");
    }

    return imageUrl;
  } catch (e) {
    console.error("Error al generar imagen:", e);
    // Usar una imagen de respaldo si falla la generación
    return `https://source.unsplash.com/random/?${encodeURIComponent(
      plantName + ",medicinal,plant,herb"
    )}`;
  }
}

// Función auxiliar para búsqueda desde el input
function searchPlantFromInput() {
  if (searchTerm.value && searchTerm.value.trim()) {
    searchPlant(searchTerm.value.trim());
  }
}

// Función para buscar información de plantas
async function searchPlant(manualTerm = null) {
  const termToSearch = manualTerm || searchTerm.value;

  // Verificar que termToSearch sea una cadena de texto válida
  if (
    !termToSearch ||
    typeof termToSearch !== "string" ||
    !termToSearch.trim()
  ) {
    error.value = "Por favor, ingresa el nombre de una planta";
    return;
  }

  // Obtener lista de plantas registradas
  let registeredPlants = [];
  try {
    if (plantSliderRef.value && plantSliderRef.value.fetchPlants) {
      await plantSliderRef.value.fetchPlants();
      // El componente expone 'plants' como variable reactiva
      registeredPlants = plantSliderRef.value.$.setupState.plants || [];
    }
  } catch (err) {
    console.error("Error al obtener plantas registradas:", err);
  }

  try {
    loading.value = true;
    showResult.value = true;
    error.value = "";

    // Construir el prompt para Gemini enfocado solo en plantas medicinales
    const prompt = `Proporciona información detallada sobre la planta medicinal "${termToSearch}" en formato JSON estrictamente.\n
        La respuesta debe incluir:\n{
          "name": "Nombre completo de la planta",
          "othersNames": ["otro nombre 1", "otro nombre 2", "etc"],
          "varieties": ["variedad 1", "variedad 2", "etc"],
          "activeIngredients": ["ingrediente activo 1", "ingrediente activo 2", "etc"],
          "scientificName": "Nombre científico",
          "familyName": "Nombre de la familia",
          "specieName": "Nombre de la especie",
          "description": "Descripción general de la planta",
          "root": "Descripción de la raíz",
          "stem": "Descripción del tallo",
          "leaves": "Descripción de las hojas",
          "flower": "Descripción de la flor",
          "fruit": "Descripción del fruto",
          "seed": "Descripción de la semilla",
          "properties": ["propiedad medicinal 1", "propiedad medicinal 2", "etc"],
          "traditionalUses": "Usos tradicionales en medicina natural",
          "howToUse": "Forma recomendada de preparación y uso",
          "imageUrl": ""
        }\n
        No incluyas información que no esté relacionada con medicina natural o propiedades medicinales.\nDeja el campo imageUrl vacío, yo lo llenaré después.`;

    if (API_KEY) {
      // Usar el modelo Gemini para información textual
      const textModel = genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      const response = await textModel;
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

        const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textResponse;
        const parsedResult = JSON.parse(jsonStr);

        // Asegurar que propiedades siempre sea un array
        if (
          !parsedResult.properties ||
          !Array.isArray(parsedResult.properties) ||
          parsedResult.properties.length === 0
        ) {
          parsedResult.properties = [
            "Información sobre propiedades no disponible",
          ];
        }

        // Generar imagen con Gemini
        const searchTermForImage =
          parsedResult.scientificName || parsedResult.name || termToSearch;

        try {
          parsedResult.imageUrl = await generatePlantImage(searchTermForImage);
        } catch (imageError) {
          console.error(
            "Error al generar imagen, usando respaldo:",
            imageError
          );
          // Si falla la generación de imágenes, usar Unsplash como respaldo
          parsedResult.imageUrl = `https://source.unsplash.com/random/?${encodeURIComponent(
            searchTermForImage + ",medicinal,plant,herb"
          )}`;
        }

        // <-- AQUI ASIGNAMOS EL RESULTADO PARA QUE SE MUESTRE EN EL TEMPLATE
        result.value = parsedResult;

        let imageUrlToSend = "";
        if (
          parsedResult.imageUrl &&
          parsedResult.imageUrl.startsWith("data:image/")
        ) {
          // Es base64, sube a Cloudinary
          try {
            imageUrlToSend = await uploadToCloudinary(
              parsedResult.imageUrl,
              CLOUDINARY_CLOUD_NAME,
              CLOUDINARY_UPLOAD_PRESET
            );
          } catch (e) {
            console.error("Error subiendo a Cloudinary:", e);
            imageUrlToSend = "";
          }
        } else {
          imageUrlToSend = parsedResult.imageUrl || "";
        }

        // Normalizar nombres para comparar
        const normalize = (s) => (s || "").toString().trim().toLowerCase();
        const nombreNueva = normalize(parsedResult.name);
        const nombreCientificoNueva = normalize(parsedResult.scientificName);
        const variedadesNueva = Array.isArray(parsedResult.varieties)
          ? parsedResult.varieties.map(normalize)
          : [];

        // Buscar si ya existe por nombre, nombre científico o variedad
        const yaExiste = registeredPlants.some((p) => {
          const n = normalize(p.nombre);
          const nc = normalize(p.nombreCientifico);
          // Revisar si alguna variedad ya está registrada
          const variedadRegistrada = variedadesNueva.some(
            (v) => v && (n === v || nc === v)
          );
          return (
            n === nombreNueva ||
            nc === nombreCientificoNueva ||
            variedadRegistrada
          );
        });

        const plantPayload = {
          nombre: parsedResult.name || "",
          otrosNombres: parsedResult.othersNames || "",
          descripcion: parsedResult.description || "",
          nombreCientifico: parsedResult.scientificName || "",
          familia: parsedResult.familyName || "",
          especie: parsedResult.specieName || "",
          ingredientesActivos: parsedResult.activeIngredients || "",
          raiz: parsedResult.root || "",
          tallo: parsedResult.stem || "",
          variedades: parsedResult.varieties || "",
          hojas: parsedResult.leaves || "",
          flor: parsedResult.flower || "",
          fruta: parsedResult.fruit || "",
          semilla: parsedResult.seed || "",
          propiedadesMedicinales: (parsedResult.properties || []).join(", "),
          usosTradicionales: parsedResult.traditionalUses || "",
          comoUsarla: parsedResult.howToUse || "",
          active: true,
          img: {
            url: imageUrlToSend,
          },
        };

        // Solo crear si NO existe
        if (!yaExiste && plantPayload !== null) {
          try {
            const { $sweetApi } = useNuxtApp();
            await $sweetApi.createPlant(plantPayload);
            console.log("Planta enviada a la API", plantPayload);
            // Actualizar slider de plantas si existe
            if (plantSliderRef.value && plantSliderRef.value.fetchPlants) {
              await plantSliderRef.value.fetchPlants();
            }
          } catch (apiError) {
            console.error("Error al enviar la planta a la API:", apiError);
          }
        } else if (yaExiste) {
          console.log(
            "La planta o alguna variedad ya está registrada. No se crea duplicado."
          );
        }
      } catch (jsonError) {
        error.value =
          "No se pudo procesar la información de la planta. Intenta de nuevo.";
        result.value = null;
        return;
      }
    }
  } catch (err) {
    error.value = "Error en la búsqueda o conexión.";
    result.value = null;
  } finally {
    loading.value = false;
  }

  // Limpiar el campo de búsqueda después de buscar (para mostrar el resultado)
  searchTerm.value = "";

  // Esperar un tick para asegurar que el slider se actualice correctamente
  await nextTick();
  // Actualizar el slider para que muestre la planta recién agregada
  try {
    if (plantSliderRef.value && plantSliderRef.value.fetchPlants) {
      await plantSliderRef.value.fetchPlants();
    }
  } catch (err) {
    console.error("Error al actualizar el slider:", err);
  }
}

onMounted(async () => {
  // Verificar si hay un parámetro de búsqueda en la URL
  if (route.query.search) {
    const searchQuery = route.query.search;
    searchTerm.value = searchQuery;
    // Ejecutar la búsqueda con el parámetro de la URL
    // await searchPlant(searchQuery);
  }
  // Si no hay parámetro en URL, verificar localStorage
  // else if (
  //   typeof window !== "undefined" &&
  //   localStorage.getItem("plant_search")
  // ) {
  //   const searchQuery = localStorage.getItem("plant_search");
  //   // Limpiar localStorage después de usarlo
  //   localStorage.removeItem("plant_search");
  //   // Ejecutar la búsqueda
  //   await searchPlant(searchQuery);
  // }

  // Preservar los datos médicos si existen
  preserveMedicalData();
});

// Función para preservar los datos médicos cuando se navega a esta página
function preserveMedicalData() {
  if (typeof window !== "undefined" && localStorage.getItem("medical_data")) {
    // No eliminamos los datos médicos del localStorage para permitir
    // que estén disponibles cuando el usuario regrese a la página medical

    // Si tenemos acceso al store medical, podríamos también guardar los datos allí
    try {
      if (typeof useStore !== "undefined") {
        const store = useStore();
        if (store && store.state && store.state.medical) {
          const medicalData = JSON.parse(localStorage.getItem("medical_data"));
          if (medicalData && Object.keys(medicalData).length > 0) {
            store.commit("medical/setResult", medicalData);
          }
        }
      }
    } catch (error) {
      console.error("Error al preservar datos médicos en el store:", error);
    }
  }
}
</script>

<style scoped>
.botanic-page {
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #305a36;
  background: linear-gradient(135deg, #d4e8c7 0%, #a8c78e 100%);
}

.content-container {
  position: relative;
  z-index: 10;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
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
  max-width: 600px;
  padding: 1rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.search-button {
  position: absolute;
  right: calc(50% - 280px);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #306844;
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

.plant-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.plant-card:hover {
  transform: translateY(-5px);
}

.plant-header {
  background: linear-gradient(90deg, #2b5d42 0%, #3c7755 100%);
  color: white;
  padding: 1.5rem;
  text-align: center;
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
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.plant-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: rgba(255, 255, 255, 0.7);
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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

@media (max-width: 600px) {
  .title {
    font-size: 2.5rem;
  }

  .search-button {
    right: 10px;
  }
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

@media (max-width: 600px) {
  .modal-content {
    width: 95%;
  }
}

.plant-animation-wrapper {
  width: 140px;
  height: 140px;
  margin: 0 auto;
  margin-bottom: -10px;
  padding-top: 20px;
}

.info-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1.5rem 0;
}

.info-card {
  flex: 1;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.info-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.info-card h3 {
  color: #2b5d42;
  margin-top: 0;
  border-bottom: 2px solid #a8c78e;
  padding-bottom: 0.5rem;
  margin-bottom: 0.8rem;
}

.info-card ul {
  margin: 0;
  padding-left: 1.2rem;
}

.info-card li {
  margin-bottom: 0.5rem;
}
</style>
