<template>
  <div class="d-flex">
    <v-text-field
      @change="telefoneMudou = true"
      v-model="telefone.telefone"
      outlined
      rounded
      label="Telefone"
      :disabled="!editando"
      class="mb-0"
      @blur="atualizar()"
      autofocus
      v-mask="['(##) ####-####', '(##) #####-####']"
      :error="campoVazio"
    />
    <v-btn v-show="editando" icon class="mt-2" @click="atualizar()" :disabled="campoVazio">
      <v-icon color="green">mdi-check</v-icon>
    </v-btn>

    <v-btn v-show="!editando" icon class="mt-2" @click="editando = true">
      <v-icon color="green">mdi-pencil</v-icon>
    </v-btn>

    <v-btn icon class="mt-2" @click="deletar()" :disabled="bloquearDelete">
      <v-icon color="red">mdi-close</v-icon>
    </v-btn>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  directives: { mask },
  props: ['telefone', 'bloquearDelete'],
  data() {
    return {
      editando: false,
      telefoneMudou: false,
      bloquearAtualizar: false
    }
  },
  methods: {
    atualizar() {
      this.editando = false
      if (!this.campoVazio) {
        if (this.telefoneMudou) this.$emit('atualizar', this.telefone)
      } else this.bloquearAtualizar = true
    },
    deletar() {
      if (!this.campoVazio) this.$emit('deletar', this.telefone)
      else this.$emit('deletarCampoVazio', this.telefone)
    }
  },
  computed: {
    campoVazio() {
      if (this.telefone.telefone === '') {
        this.$emit('telefoneVazio')
        return true
      }
      this.$emit('telefonePreenchido')
      return false
    }
  }
}
</script>
