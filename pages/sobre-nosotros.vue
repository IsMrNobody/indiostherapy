<template>
  <div>
    <!-- Hero Section -->
    <v-parallax
      src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      height="500"
    >
      <div
        class="d-flex flex-column fill-height justify-center align-center text-center"
      >
        <div class="bg-surface bg-opacity-80 px-12 py-8 rounded-lg">
          <h1 class="text-h2 font-weight-light text-primary mb-4">
            Nuestro Camino Sanador
          </h1>
          <h4 class="text-subtitle-1 text-primary font-weight-regular">
            Armonizando cuerpo y espíritu a través de la sabiduría natural
          </h4>
        </div>
      </div>
    </v-parallax>

    <!-- Nuestra Filosofía -->
    <v-container class="py-12">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8" class="text-center">
          <h2 class="text-h4 font-weight-light text-primary mb-6">
            Nuestra Filosofía
          </h2>
          <p class="text-body-1 mb-8">
            En InDios Therapy, hemos construido un refugio donde la sabiduría
            ancestral de la naturaleza se encuentra con las técnicas modernas de
            terapia corporal. Creemos profundamente que cada ser humano es
            único, y por ello, cada tratamiento debe ser tan individual como la
            persona que lo recibe.
          </p>
          <p class="text-body-1 mb-8">
            Nuestra misión es acompañarte en un viaje de autodescubrimiento,
            donde el poder curativo de las plantas, el tacto terapéutico y las
            energías naturales confluyen para restaurar el equilibrio que la
            vida moderna a menudo nos arrebata.
          </p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Conexión con la Naturaleza -->
    <v-container fluid class="bg-secondary py-12">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-row>
            <v-col cols="12" md="6" order="2" order-md="1">
              <div class="pa-4">
                <h2 class="text-h4 font-weight-light text-primary mb-6">
                  Nuestro Vínculo con la Naturaleza
                </h2>
                <p class="text-body-1 mb-4">
                  Las plantas medicinales, los aceites esenciales y los
                  elementos naturales son nuestros aliados en cada terapia que
                  ofrecemos. Extraemos de la naturaleza sus propiedades
                  curativas más puras para aplicarlas con reverencia y
                  conocimiento.
                </p>
                <p class="text-body-1 mb-4">
                  Cada esencia, cada extracto y cada técnica manual que
                  utilizamos ha sido seleccionada para honrar la sabiduría de la
                  tierra y potenciar tu capacidad innata de sanación.
                </p>
              </div>
            </v-col>
            <v-col cols="12" md="6" order="1" order-md="2">
              <v-img
                src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                height="400"
                class="rounded-lg"
                cover
              ></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <!-- Nuestro Equipo -->
    <v-container class="py-12">
      <h2 class="text-center text-h4 font-weight-light text-primary mb-10">
        Terapeutas
      </h2>
      <v-row>
        <v-col
          v-for="(therapist, index) in therapists"
          :key="index"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card class="mx-auto rounded-lg" elevation="2" theme="light">
            <v-img
              :src="therapist.image"
              height="300"
              cover
              class="rounded-t-lg"
            ></v-img>
            <v-card-title class="text-primary">{{
              therapist.name
            }}</v-card-title>
            <v-card-subtitle>{{ therapist.specialty }}</v-card-subtitle>
            <v-card-text class="text-medium-emphasis">{{
              therapist.bio
            }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Nuestra Promesa -->
    <v-container fluid class="bg-surface-variant py-12">
      <v-row justify="center" align="center">
        <v-col cols="12" md="6" lg="5">
          <v-img
            src="https://res.cloudinary.com/dku13l2ep/image/upload/v1711725270/JARTATE/Ciudad/lecheria/indios/inD-white_ufc8ol.png"
            width="250"
            class="rounded-lg mx-auto"
          ></v-img>
        </v-col>
        <v-col cols="12" md="6" lg="5">
          <div class="pa-4">
            <h2 class="text-h4 font-weight-light text-primary mb-6">
              Nuestra Promesa
            </h2>
            <p class="text-body-1 mb-4">
              En InDios Therapy, nos comprometemos a escuchar tu cuerpo,
              entender tus necesidades y ofrecerte un espacio de paz donde
              puedas reconectarte con tu esencia natural.
            </p>
            <p class="text-body-1 mb-6">
              Cada sesión es una oportunidad para liberarte del estrés
              acumulado, aliviar dolencias físicas y emocionales, y emprender un
              camino hacia un bienestar más profundo y duradero.
            </p>
            <v-btn
              color="primary"
              variant="outlined"
              size="large"
              to="/contacto"
            >
              Agenda tu consulta
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Testimonios -->
    <v-container class="py-12">
      <h2 class="text-center text-h4 font-weight-light text-primary mb-10">
        Lo que dicen nuestros clientes
      </h2>
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <v-carousel hide-delimiters show-arrows="hover" height="300">
            <v-carousel-item v-for="(testimonial, i) in testimonials" :key="i">
              <v-sheet
                height="100%"
                class="d-flex flex-column align-center justify-center text-center pa-4"
              >
                <v-avatar class="mb-4" size="80">
                  <v-img :src="testimonial.avatar" cover></v-img>
                </v-avatar>
                <div class="text-body-1 mb-4 font-italic">
                  "{{ testimonial.text }}"
                </div>
                <div class="text-subtitle-1 text-primary font-weight-medium">
                  {{ testimonial.name }}
                </div>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const therapists = [
  {
    name: "Milagro Navas",
    specialty: "Terapeuta Holística",
    bio: "Con más de 15 años de experiencia, Milagro combina la sabiduría de las plantas medicinales con técnicas de masaje terapéutico para crear experiencias de sanación únicas.",
    image: "/mila2.jpg",
  },
  //   {
  //     name: "Milagro Navas",
  //     specialty: "Especialista en Masaje Tailandés",
  //     bio: "Milagro ha perfeccionado sus técnicas de masaje en Tailandia, donde aprendió a trabajar con las líneas energéticas del cuerpo para liberar bloqueos y restaurar el flujo natural.",
  //     image: "/mila.jpg",
  //   },
  //   {
  //     name: "Laura Torres",
  //     specialty: "Aromaterapia y Reflexología",
  //     bio: "Apasionada por los aceites esenciales, Laura crea mezclas personalizadas que complementan sus sesiones de reflexología para un enfoque verdaderamente holístico.",
  //     image:
  //       "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80",
  //   },
];

const testimonials = [
  {
    name: "Ana García",
    text: "Las sesiones de terapia en InDios han transformado mi vida. He encontrado alivio para mi dolor crónico de espalda de una manera que nunca imaginé posible. El enfoque natural y personalizado marca la diferencia.",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Carlos Rodríguez",
    text: "Llegué con escepticismo, pero después de mi primera sesión de aromaterapia, sentí una paz interior que no había experimentado en años. El ambiente, los terapeutas y las técnicas son excepcionales.",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Sofía López",
    text: "Como persona que sufre de ansiedad, encontrar InDios Therapy ha sido un regalo. Las técnicas que combinan lo mejor de la naturaleza con terapias corporales me han ayudado a encontrar equilibrio.",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

useHead({
  title: "Sobre Nosotros - InDios Therapy",
  meta: [
    {
      name: "description",
      content:
        "Conoce nuestra filosofía de bienestar que integra la sabiduría de la naturaleza con terapias corporales para un equilibrio integral.",
    },
  ],
});
</script>

<style scoped>
.bg-opacity-80 {
  background-color: rgba(255, 255, 255, 0.85);
}
</style>
