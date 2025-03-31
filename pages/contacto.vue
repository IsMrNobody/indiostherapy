<template>
  <div>
    <!-- Hero Section -->
    <v-parallax
      src="https://images.unsplash.com/photo-1552693673-1bf958298935?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
      height="400"
    >
      <div class="d-flex flex-column fill-height justify-center align-center text-center">
        <div class="bg-surface bg-opacity-75 px-12 py-8 rounded-lg">
          <h1 class="text-h2 font-weight-light text-primary mb-4">
            Contáctanos
          </h1>
          <h4 class="text-subtitle-1 text-primary font-weight-regular">
            Estamos aquí para ayudarte en tu camino hacia el bienestar
          </h4>
        </div>
      </div>
    </v-parallax>

    <v-container class="py-16">
      <v-row>
        <!-- Contact Form -->
        <v-col cols="12" md="7">
          <h2 class="text-h4 font-weight-light text-primary mb-8">Agenda tu Cita</h2>
          <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.nombre"
                  label="Nombre"
                  :rules="[rules.required]"
                  variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.apellido"
                  label="Apellido"
                  :rules="[rules.required]"
                  variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.email"
                  label="Correo Electrónico"
                  :rules="[rules.required, rules.email]"
                  variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.telefono"
                  label="Teléfono"
                  :rules="[rules.required]"
                  variant="outlined"
                  color="primary"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="form.servicio"
                  :items="servicios"
                  label="Servicio de Interés"
                  :rules="[rules.required]"
                  variant="outlined"
                  color="primary"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="form.mensaje"
                  label="Mensaje"
                  :rules="[rules.required]"
                  variant="outlined"
                  color="primary"
                  rows="4"
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="loading"
                  :disabled="!isFormValid"
                >
                  Enviar Mensaje
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-col>

        <!-- Contact Information -->
        <v-col cols="12" md="5" class="pl-md-8">
          <v-card class="pa-8 bg-surface rounded-lg">
            <h3 class="text-h5 font-weight-light text-primary mb-6">Información de Contacto</h3>
            
            <div class="mb-6">
              <v-list>
                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-4">mdi-map-marker</v-icon>
                  </template>
                  <v-list-item-title>Av. Principal #123, Ciudad</v-list-item-title>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-4">mdi-phone</v-icon>
                  </template>
                  <v-list-item-title>+1 234 567 890</v-list-item-title>
                </v-list-item>

                <v-list-item class="px-0">
                  <template v-slot:prepend>
                    <v-icon color="primary" class="mr-4">mdi-email</v-icon>
                  </template>
                  <v-list-item-title>contacto@indiostherapy.com</v-list-item-title>
                </v-list-item>
              </v-list>
            </div>

            <h4 class="text-h6 font-weight-light text-primary mb-4">Horario de Atención</h4>
            <v-list>
              <v-list-item class="px-0">
                <template v-slot:prepend>
                  <v-icon color="primary" class="mr-4">mdi-clock</v-icon>
                </template>
                <v-list-item-title>
                  Lunes a Viernes: 9:00 AM - 7:00 PM<br>
                  Sábados: 9:00 AM - 2:00 PM<br>
                  Domingos: Cerrado
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-btn
              color="green"
              size="large"
              block
              class="mt-8"
              href="https://wa.me/1234567890"
              target="_blank"
              prepend-icon="mdi-whatsapp"
            >
              Contactar por WhatsApp
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const isFormValid = ref(false)
const loading = ref(false)

const form = ref({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  servicio: '',
  mensaje: ''
})

const servicios = [
  'Masaje Terapéutico',
  'Aromaterapia',
  'Reflexología'
]

const rules = {
  required: v => !!v || 'Este campo es requerido',
  email: v => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido'
}

const handleSubmit = async () => {
  loading.value = true
  // Aquí iría la lógica para enviar el formulario
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
  // Mostrar mensaje de éxito
  alert('Mensaje enviado con éxito')
  // Limpiar formulario
  Object.keys(form.value).forEach(key => form.value[key] = '')
}

useHead({
  title: 'Contacto - InDios Therapy',
  meta: [
    {
      name: 'description',
      content: 'Contáctanos para agendar tu cita de terapia o masaje. Ofrecemos servicios personalizados para tu bienestar físico y mental.'
    }
  ]
})
</script>