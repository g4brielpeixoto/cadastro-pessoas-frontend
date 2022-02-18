<template>
  <v-dialog
    @click:outside="$emit('cancelar')"
    @keydown.esc="$emit('cancelar')"
    v-model="dialogo"
    justify="center"
    max-width="300"
  >
    <v-card class="rounded-xl">
      <v-card-title class="text-h5"> {{ mensagem || null }} </v-card-title>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="$emit('cancelar')"> Cancelar </v-btn>
        <v-btn color="red" text @click="$emit('confirmar')"> Confirmar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['dialogo', 'mensagem']
}
</script>
