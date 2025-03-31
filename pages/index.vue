<template>
  <div>
    <!-- Hero Section -->
    <v-parallax
      src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      height="600"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-center"
      >
        <div class="bg-surface bg-opacity-75 px-12 py-8 rounded-lg">
          <h1 class="text-h2 font-weight-light text-primary mb-4">
            Salud y Bienestar Integral
          </h1>
          <h4 class="text-subtitle-1 text-primary font-weight-regular">
            Descubre el poder sanador de nuestras terapias personalizadas
          </h4>
        </div>
      </div>
    </v-parallax>

    <!-- Services Preview -->
    <v-container class="py-16">
      <h2 class="text-center text-h4 font-weight-light text-primary mb-12">
        Nuestros Servicios
      </h2>
      <v-row>
        <v-col
          v-for="service in services"
          :key="service.title"
          cols="12"
          md="4"
        >
          <v-card class="mx-auto rounded-lg" elevation="2" theme="light">
            <v-img :src="service.image" height="250" cover class="rounded-t-lg">
              <template v-slot:placeholder>
                <v-row align="center" justify="center" class="fill-height">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
            <v-card-title class="text-primary pt-4">{{
              service.title
            }}</v-card-title>
            <v-card-text class="text-medium-emphasis">{{
              service.description
            }}</v-card-text>
            <v-card-actions class="pb-4">
              <v-btn
                color="primary"
                variant="outlined"
                class="mx-4"
                :to="'/servicios'"
              >
                Descubrir más
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- About Preview -->
    <v-container fluid class="bg-secondary py-16">
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h4 font-weight-light text-primary mb-8">
            Por qué elegirnos
          </h2>
          <p class="text-body-1 text-primary mb-8">
            En InDios Therapy, combinamos técnicas ancestrales con métodos
            modernos para proporcionar una experiencia terapéutica única.
            Nuestro equipo de profesionales certificados está dedicado a guiarte
            en tu camino hacia el bienestar integral.
          </p>
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            class="mt-4"
            to="/sobre-nosotros"
          >
            Conoce más sobre nosotros
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Productos Destacados -->
    <v-container class="py-16">
      <h2 class="text-center text-h4 font-weight-light text-primary mb-12">
        Productos Destacados
      </h2>
      <v-row>
        <v-col cols="12" md="10" lg="8" class="mx-auto">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-card class="mx-auto rounded-lg" elevation="2" theme="light">
                <v-img
                  src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  height="200"
                  cover
                  class="rounded-t-lg"
                ></v-img>
                <v-card-title class="text-primary"
                  >Aceites Esenciales</v-card-title
                >
                <v-card-text class="text-medium-emphasis"
                  >Descubre el poder terapéutico de nuestros aceites esenciales
                  de la más alta calidad.</v-card-text
                >
                <v-card-actions class="pb-4">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    class="mx-4"
                    :to="'/productos'"
                  >
                    Ver productos
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card class="mx-auto rounded-lg" elevation="2" theme="light">
                <v-img
                  src="https://images.unsplash.com/photo-1607006344380-b6775a0824ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  height="200"
                  cover
                  class="rounded-t-lg"
                ></v-img>
                <v-card-title class="text-primary"
                  >Jabones Artesanales</v-card-title
                >
                <v-card-text class="text-medium-emphasis"
                  >Elaborados con ingredientes naturales que cuidan y nutren tu
                  piel de forma natural.</v-card-text
                >
                <v-card-actions class="pb-4">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    class="mx-4"
                    :to="'/productos'"
                  >
                    Ver productos
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-card class="mx-auto rounded-lg" elevation="2" theme="light">
                <v-img
                  src="https://images.unsplash.com/photo-1608263153703-caa6b0fd7c7c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                  height="200"
                  cover
                  class="rounded-t-lg"
                ></v-img>
                <v-card-title class="text-primary"
                  >Velas Aromáticas</v-card-title
                >
                <v-card-text class="text-medium-emphasis"
                  >Crea ambientes de paz y armonía con nuestras velas elaboradas
                  con ceras naturales.</v-card-text
                >
                <v-card-actions class="pb-4">
                  <v-btn
                    color="primary"
                    variant="outlined"
                    class="mx-4"
                    :to="'/productos'"
                  >
                    Ver productos
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const services = [
  {
    title: "Masaje Terapéutico",
    description:
      "Técnicas especializadas para aliviar el dolor y la tensión muscular, adaptadas a tus necesidades específicas.",
    image:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
  {
    title: "Aromaterapia",
    description:
      "Experimenta el poder curativo de los aceites esenciales en un ambiente de completa relajación.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
  {
    title: "Reflexología",
    description:
      "Terapia holística que estimula puntos específicos para restaurar el equilibrio natural de tu cuerpo.",
    image:
      "https://images.unsplash.com/photo-1519824145371-296894a0daa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  },
];

useHead({
  title: "InDios Therapy - Terapias Corporales y Bienestar",
  meta: [
    {
      name: "description",
      content:
        "Centro especializado en terapias corporales y masajes terapéuticos. Descubre nuestros tratamientos personalizados para tu bienestar integral.",
    },
  ],
});
</script>
