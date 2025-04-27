<template>
  <div>
    <!-- Hero Section -->
    <v-parallax
      src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      height="400"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-center"
      >
        <div class="bg-surface bg-opacity-75 px-12 py-8 rounded-lg">
          <h1 class="text-h2 font-weight-light text-primary mb-4">
            Nuestros Servicios
          </h1>
          <h4 class="text-subtitle-1 text-primary font-weight-regular">
            Descubre el camino hacia tu bienestar integral
          </h4>
        </div>
      </div>
    </v-parallax>

    <!-- Services Section -->
    <v-container class="py-16">
      <v-row>
        <v-col
          v-for="service in services"
          :key="service.title"
          cols="12"
          class="mb-16"
        >
          <v-row
            align="center"
            :class="service.reverse ? 'flex-row-reverse' : ''"
          >
            <v-col cols="12" md="6">
              <v-img :src="service.image" height="400" cover class="rounded-lg">
                <template v-slot:placeholder>
                  <v-row align="center" justify="center" class="fill-height">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-col>
            <v-col cols="12" md="6" class="px-md-8">
              <h2 class="text-h3 font-weight-light text-primary mb-6">
                {{ service.title }}
              </h2>
              <p class="text-body-1 text-medium-emphasis mb-6">
                {{ service.description }}
              </p>
              <v-list>
                <v-list-item
                  v-for="benefit in service.benefits"
                  :key="benefit"
                  class="px-0"
                >
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-4"
                      >mdi-check-circle</v-icon
                    >
                  </template>
                  <v-list-item-title>{{ benefit }}</v-list-item-title>
                </v-list-item>
              </v-list>
              <v-btn
                color="primary"
                size="large"
                class="mt-8"
                to="/contacto"
                variant="outlined"
              >
                Reservar Cita
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <v-container fluid class="bg-secondary py-16">
      <v-row justify="center">
        <v-col cols="12" md="8" class="text-center">
          <h2 class="text-h4 font-weight-light text-primary mb-8">
            ¿Listo para comenzar tu viaje hacia el bienestar?
          </h2>
          <p class="text-body-1 text-primary mb-8">
            Nuestro equipo de terapeutas profesionales está aquí para guiarte en
            tu camino hacia una mejor salud y bienestar. Contáctanos hoy para
            programar tu primera sesión.
          </p>
          <v-btn color="primary" variant="outlined" size="large" to="/contacto">
            Contactar Ahora
          </v-btn>
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
      "Nuestro masaje terapéutico está diseñado para aliviar el dolor muscular, reducir el estrés y mejorar la circulación. Cada sesión se personaliza según tus necesidades específicas, utilizando una combinación de técnicas probadas.",
    image:
      "https://res.cloudinary.com/dku13l2ep/image/upload/v1745765044/JARTATE/Ciudad/lecheria/indios/imgs/terapeuta1_q4muhu.png",
    benefits: [
      "Alivio del dolor muscular y articular",
      "Reducción del estrés y la ansiedad",
      "Mejora de la circulación sanguínea",
      "Aumento de la flexibilidad",
    ],
    reverse: false,
  },
  {
    title: "Aromaterapia",
    description:
      "La aromaterapia combina el poder curativo de los aceites esenciales con técnicas de masaje suave para crear una experiencia profundamente relajante y terapéutica. Cada aceite se selecciona cuidadosamente por sus propiedades específicas.",
    image:
      "https://res.cloudinary.com/dku13l2ep/image/upload/v1745765043/JARTATE/Ciudad/lecheria/indios/imgs/mila2_nyq4ji.jpg",
    benefits: [
      "Equilibrio emocional y mental",
      "Mejora del sueño y relajación",
      "Fortalecimiento del sistema inmunológico",
      "Desintoxicación natural",
    ],
    reverse: true,
  },
  {
    title: "Reflexología",
    description:
      "La reflexología es una terapia holística que estimula puntos específicos en los pies, manos y orejas que corresponden a diferentes órganos y sistemas del cuerpo. Esta técnica promueve la sanación natural y el equilibrio.",
    image:
      "https://res.cloudinary.com/dku13l2ep/image/upload/v1745765044/JARTATE/Ciudad/lecheria/indios/imgs/terapeuta2_pxbumi.jpg",
    benefits: [
      "Reducción del estrés y la tensión",
      "Mejora de la circulación",
      "Equilibrio energético",
      "Promoción de la auto-sanación",
    ],
    reverse: false,
  },
];

useHead({
  title: "Servicios - InDios Therapy",
  meta: [
    {
      name: "description",
      content:
        "Descubre nuestra amplia gama de servicios terapéuticos, incluyendo masajes, aromaterapia y reflexología. Tratamientos personalizados para tu bienestar.",
    },
  ],
});
</script>
