<template>
  <v-app>
    <v-app-bar app color="surface" elevation="1">
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
        color="primary"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="text-primary font-weight-light text-h5">
        InDios Therapy
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="hidden-sm-and-down">
        <v-btn to="/" text color="primary">Inicio</v-btn>
        <v-btn to="/servicios" text color="primary">Servicios</v-btn>
        <v-btn to="/sobre-nosotros" text color="primary">Sobre Nosotros</v-btn>
        <v-btn to="/productos" text color="primary">Productos</v-btn>
        <v-btn to="/botanic" text color="success">Jardín Botánico</v-btn>
        <!-- <v-btn to="/medical" text color="success">Remedios Naturales</v-btn> -->
        <v-btn to="/contacto" text color="primary">Contacto</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item class="py-4 px-4">
          <v-list-item-title class="text-h6 text-primary"
            >InDios Therapy</v-list-item-title
          >
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item to="/" title="Inicio" color="primary"></v-list-item>
        <v-list-item
          to="/servicios"
          title="Servicios"
          color="primary"
        ></v-list-item>
        <v-list-item
          to="/sobre-nosotros"
          title="Sobre Nosotros"
          color="primary"
        ></v-list-item>
        <v-list-item
          to="/productos"
          title="Productos"
          color="primary"
        ></v-list-item>
        <v-list-item
          to="/botanic"
          title="Jardín Botánico"
          color="success"
        ></v-list-item>
        <v-list-item
          to="/medical"
          title="Remedios Naturales"
          color="success"
        ></v-list-item>
        <v-list-item
          to="/contacto"
          title="Contacto"
          color="primary"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>

    <v-footer class="bg-surface text-center d-flex flex-column">
      <div>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          class="mx-4"
          icon
          color="primary"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </div>
      <div class="pt-4 text-primary">
        {{ currentYear }} — <strong>InDios Therapy</strong>
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
const drawer = ref(false);
const icons = ["mdi-facebook", "mdi-twitter", "mdi-instagram"];
const currentYear = ref("");

onMounted(() => {
  currentYear.value = new Date().getFullYear();
});
</script>
