<template>
  <div>
    <!-- Hero Section -->
    <v-parallax
      src="https://res.cloudinary.com/dku13l2ep/image/upload/v1745768100/JARTATE/Ciudad/lecheria/indios/imgs/pexels-mart-production-8450508_qmlaau.jpg"
      height="400"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-center"
      >
        <div class="bg-surface bg-opacity-80 px-12 py-8 rounded-lg">
          <h1 class="text-h2 font-weight-light text-primary mb-4">
            Nuestros Productos Naturales
          </h1>
          <h4 class="text-subtitle-1 text-primary font-weight-regular">
            Descubre el poder de la naturaleza en cada detalle
          </h4>
        </div>
      </div>
    </v-parallax>

    <!-- Filtros de Categoría -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col cols="12" md="10">
          <div class="text-center mb-8">
            <v-chip-group
              v-model="selectedCategory"
              mandatory
              selected-class="bg-primary text-white"
            >
              <v-chip
                v-for="category in categories"
                :key="category.value"
                :value="category.value"
                filter
                variant="outlined"
                class="ma-2 px-4"
              >
                {{ category.label }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Productos -->
    <v-container class="py-4 mb-12">
      <v-row>
        <v-col
          v-for="product in filteredProducts"
          :key="product.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="mx-auto h-100 d-flex flex-column" elevation="2">
            <v-img :src="product.image" height="250" cover class="align-end">
              <div
                v-if="product.isNew"
                class="bg-primary text-white pa-2 text-caption font-weight-bold position-absolute top-0 end-0 ma-2 rounded"
              >
                NUEVO
              </div>
            </v-img>
            <v-card-title class="pb-1">{{ product.name }}</v-card-title>
            <v-card-subtitle>{{ product.category }}</v-card-subtitle>
            <v-card-text class="text-medium-emphasis pb-0 flex-grow-1">
              {{ product.description }}
            </v-card-text>
            <v-card-text class="pt-0 pb-2">
              <div class="text-primary text-h6 font-weight-bold">
                {{ formatPrice(product.price) }}
              </div>
            </v-card-text>
            <v-card-actions class="pa-4 pt-0">
              <v-btn
                color="primary"
                variant="tonal"
                block
                @click="addToCart(product)"
              >
                Añadir al carrito
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Beneficios -->
    <v-container fluid class="bg-secondary py-12 mb-12">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <h2 class="text-h4 font-weight-light text-primary mb-8">
            Beneficios de Nuestros Productos
          </h2>
          <v-row>
            <v-col
              v-for="(benefit, index) in benefits"
              :key="index"
              cols="12"
              md="4"
            >
              <v-card flat color="transparent" class="text-center">
                <div class="d-flex justify-center mb-4">
                  <v-icon size="48" color="primary">{{ benefit.icon }}</v-icon>
                </div>
                <h3 class="text-h6 font-weight-medium text-primary mb-3">
                  {{ benefit.title }}
                </h3>
                <p class="text-body-2">{{ benefit.text }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Banner de promoción -->
    <v-container class="mb-16">
      <v-card color="primary" class="rounded-lg overflow-hidden">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-img
              src="https://images.unsplash.com/photo-1556760544-74068565f05c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJhbCUyMHByb2R1Y3RzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60"
              height="100%"
              cover
            ></v-img>
          </v-col>
          <v-col cols="12" md="6">
            <div
              class="d-flex flex-column justify-center h-100 pa-8 text-white"
            >
              <h2 class="text-h4 font-weight-light mb-4">
                Kit Completo de Bienestar
              </h2>
              <p class="text-body-1 mb-6">
                Por tiempo limitado, disfruta de un 15% de descuento en nuestro
                kit completo de bienestar, que incluye aceites esenciales, sales
                de baño y jabón artesanal.
              </p>
              <v-btn color="white" variant="outlined" size="large">
                Ver oferta
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedCategory = ref("todos");

const categories = [
  { label: "Todos", value: "todos" },
  { label: "Aceites Esenciales", value: "aceites" },
  { label: "Jabones Artesanales", value: "jabones" },
  { label: "Velas Aromáticas", value: "velas" },
  { label: "Sales de Baño", value: "sales" },
];

const products = [
  {
    id: 1,
    name: "Aceite de Lavanda",
    category: "Aceites Esenciales",
    description:
      "Aceite esencial 100% puro con propiedades relajantes para aliviar el estrés y mejorar el sueño.",
    price: 18.99,
    image:
      "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: true,
  },
  {
    id: 2,
    name: "Aceite de Eucalipto",
    category: "Aceites Esenciales",
    description:
      "Aceite refrescante que ayuda a despejar las vías respiratorias y aliviar la congestión.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1608571423902-ead08829a459?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: false,
  },
  {
    id: 3,
    name: "Jabón de Caléndula",
    category: "Jabones Artesanales",
    description:
      "Jabón suave elaborado con pétalos de caléndula, ideal para pieles sensibles y con propiedades calmantes.",
    price: 8.5,
    image:
      "https://images.unsplash.com/photo-1607006344380-b6775a0824ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: false,
  },
  {
    id: 4,
    name: "Jabón de Avena y Miel",
    category: "Jabones Artesanales",
    description:
      "Jabón nutritivo que exfolia suavemente y nutre la piel seca dejándola suave e hidratada.",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1602164063920-e9a2591d8e48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: false,
  },
  {
    id: 5,
    name: "Vela de Vainilla",
    category: "Velas Aromáticas",
    description:
      "Vela de soja con aroma cálido y dulce que crea un ambiente acogedor y relajante.",
    price: 14.5,
    image:
      "https://images.unsplash.com/photo-1608263153703-caa6b0fd7c7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: false,
  },
  {
    id: 6,
    name: "Vela de Sándalo",
    category: "Velas Aromáticas",
    description:
      "Vela artesanal con aroma terroso y amaderado que ayuda a la meditación y el equilibrio mental.",
    price: 16.99,
    image:
      "https://images.unsplash.com/photo-1574187389072-13566ce726b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: true,
  },
  {
    id: 7,
    name: "Sales de Epsom con Lavanda",
    category: "Sales de Baño",
    description:
      "Sales minerales que alivian dolores musculares y promueven la relajación con aroma a lavanda.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1564410267841-915d8e4d71ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: false,
  },
  {
    id: 8,
    name: "Sales de Mar Muerto",
    category: "Sales de Baño",
    description:
      "Ricas en minerales que purifican y desintoxican la piel mientras alivian la tensión muscular.",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1626397835385-277f5e526fec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    isNew: true,
  },
];

const benefits = [
  {
    icon: "mdi-leaf",
    title: "100% Naturales",
    text: "Todos nuestros productos están elaborados con ingredientes orgánicos certificados, libres de químicos y sustancias sintéticas.",
  },
  {
    icon: "mdi-test-tube",
    title: "Probados Dermatológicamente",
    text: "Garantizamos la seguridad y efectividad de nuestros productos con pruebas dermatológicas que respetan la integridad animal.",
  },
  {
    icon: "mdi-recycle",
    title: "Eco-amigables",
    text: "Comprometidos con el medio ambiente, utilizamos envases reciclables y procesos de producción responsables.",
  },
];

const filteredProducts = computed(() => {
  if (selectedCategory.value === "todos") {
    return products;
  } else {
    return products.filter((product) => {
      const categoryMapping = {
        aceites: "Aceites Esenciales",
        jabones: "Jabones Artesanales",
        velas: "Velas Aromáticas",
        sales: "Sales de Baño",
      };
      return product.category === categoryMapping[selectedCategory.value];
    });
  }
});

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function addToCart(product) {
  // Aquí iría la lógica para añadir productos al carrito
  console.log("Producto añadido:", product.name);
  // Se podría implementar un sistema de notificaciones
}

useHead({
  title: "Productos Naturales - InDios Therapy",
  meta: [
    {
      name: "description",
      content:
        "Descubre nuestra selección de productos naturales para el bienestar: aceites esenciales, jabones artesanales, velas aromáticas y sales de baño.",
    },
  ],
});
</script>

<style scoped>
.bg-opacity-80 {
  background-color: rgba(255, 255, 255, 0.85);
}

.position-absolute {
  position: absolute;
}

.top-0 {
  top: 0;
}

.end-0 {
  right: 0;
}
</style>
