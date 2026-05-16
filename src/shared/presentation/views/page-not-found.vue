<template>
  <div class="flex flex-column align-items-center justify-content-center min-h-screen text-center p-5">
    <i class="pi pi-exclamation-triangle text-8xl text-orange-500 mb-4"></i>
    <h1 class="text-6xl font-bold mb-2">{{ $t('page-not-found.title') }}</h1>
    <p class="text-xl text-gray-600 mb-5">
      {{ $t('page-not-found.content', { 'unavailable-route': $route.path }) }}
    </p>
    <pv-button :label="$t('page-not-found.go-home')" icon="pi pi-home" @click="$router.push('/home')" />
  </div>
</template>

<script setup>
</script>