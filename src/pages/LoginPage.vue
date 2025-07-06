<template>
  <div class="q-pa-md flex flex-center column" style="min-height: 100vh">
    <q-card class="q-pa-lg" style="width: 350px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Anmelden</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="username"
            label="Benutzername"
            :error="!!usernameError"
            :error-message="usernameError"
            autocomplete="username"
          />
          <q-input
            filled
            v-model="password"
            label="Passwort"
            type="password"
            :error="!!passwordError"
            :error-message="passwordError"
            autocomplete="current-password"
          />
          <div v-if="error" class="text-negative q-mb-md">{{ error }}</div>
          <q-btn
            type="submit"
            color="primary"
            label="Anmelden"
            :loading="loading"
            class="full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const usernameError = ref('')
const passwordError = ref('')
const userStore = useUserStore()
const router = useRouter()

if (userStore.loggedIn) {
  router.push('/')
} else {
  userStore.refreshAccessToken().then(() => {
    router.push('/')
  })
}

async function onSubmit() {
  error.value = ''
  usernameError.value = ''
  passwordError.value = ''
  if (!username.value) {
    usernameError.value = 'Username is required.'
    return
  }
  if (!password.value) {
    passwordError.value = 'Password is required.'
    return
  }
  loading.value = true
  try {
    await userStore.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.message || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
