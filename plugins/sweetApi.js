import axios from 'axios'

// Usamos una función para crear un closure y mantener las variables estáticas
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const SWEET_API_URL = config.public.sweetApiUrl
  const USER_ID = process.env.USER_ID || '6437b7e2da3a9a0c46b4c58d'

  // Usar axios directamente
  const sweetApi = {
    async restaurante() {
      try {
        const respuesta = await axios.get(`${SWEET_API_URL}/merchant/${USER_ID}`)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async productos() {
      try {
        const respuesta = await axios.get(`${SWEET_API_URL}/product/user/${USER_ID}`)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async sendOrder(data) {
      try {
        const respuesta = await axios.post(`${SWEET_API_URL}/order/create`, data)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async createPlant(data) {
      try {
        const respuesta = await axios.post(`${SWEET_API_URL}/plant/create`, data)
        return respuesta.data
      } catch (error) {
        return error
      }
    },
    
    async getPlants() {
      try {
        const respuesta = await axios.get(`${SWEET_API_URL}/plant`)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async deletePlant(id) {
      try {
        const respuesta = await axios.delete(`${SWEET_API_URL}/plant/${id}`)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async getOrders(id) {
      try {
        const respuesta = await axios.get(`${SWEET_API_URL}/order/${id}`)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async getOrderById(id) {
      try {
        const respuesta = await axios.get(`${SWEET_API_URL}/order/user/${id}`)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async paypal(data) {
      try {
        const respuesta = await axios.post(`${SWEET_API_URL}/payment/create-order`, data)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async sendComment(payload) {
      try {
        const respuesta = await axios.post(`${SWEET_API_URL}/order/contact`, payload)
        return respuesta
      } catch (error) {
        return error
      }
    },

    async checkOrder(id, check) {
      try {
        const respuesta = await axios.post(`${SWEET_API_URL}/payment/check/${id}`, check)
        return respuesta.data
      } catch (error) {
        return error
      }
    },

    async editOrder(data) {
      try {
        const respuesta = await axios.put(`${SWEET_API_URL}/order/${data.id}`, data)
        return respuesta.data
      } catch (error) {
        return error
      }
    }
  }

  // Proveer el objeto sweetApi para que esté disponible como $sweetApi
  nuxtApp.provide('sweetApi', sweetApi)
})

// También exportar las funciones de forma individual para compatibilidad con código existente
// Estos métodos utilizan axios directamente, no la instancia configurada
const SWEET_API_URL = process.env.SWEET_API_URL || process.env.NUXT_PUBLIC_SWEET_API_URL
const USER_ID = process.env.USER_ID || '6437b7e2da3a9a0c46b4c58d'

export const restaurante = async () => {
  try {
    const respuesta = await axios.get(`${SWEET_API_URL}/merchant/${USER_ID}`)
    return respuesta.data
  } catch (error) {
    return error
  }
}

export const productos = async () => {
  try {
    const respuesta = await axios.get(`${SWEET_API_URL}/product/user/${USER_ID}`)
    return respuesta.data
  } catch (error) {
    return error
  }
}

export const createPlant = async (data) => {
  try {
    const respuesta = await axios.post(`${SWEET_API_URL}/plant/create`, data)
    return respuesta.data
  } catch (error) {
    return error
  }
}

export const getOrders = async (id) => {
  try {
    const respuesta = await axios.get(`${SWEET_API_URL}/order/${id}`)
    return respuesta.data
  } catch (error) {
    return error
  }
}

export const getOrderById = async (id) => {
  try {
    const respuesta = await axios.get(`${SWEET_API_URL}/order/user/${id}`)
    return respuesta.data
  } catch (error) {
    return error
  }
}

export const paypal = async (data) => {
  try {
    const respuesta = await axios.post(`${SWEET_API_URL}/payment/create-order`, data)
    return respuesta.data
  } catch (error) {
    return error
  }
}

export const sendComment = async (payload) => {
  try {
    const respuesta = await axios.post(`${SWEET_API_URL}/order/contact`, payload)
    return respuesta
  } catch (error) {
    return error
  }
}

export const checkOrder = async (id, check) => {
  try {
    const respuesta = await axios.post(`${SWEET_API_URL}/payment/check/${id}`, check)
    return respuesta.data
  } catch (error) {
    return error
  }
}

export const editOrder = async (data) => {
  try {
    const respuesta = await axios.put(`${SWEET_API_URL}/order/${data.id}`, data)
    return respuesta.data
  } catch (error) {
    return error
  }
}