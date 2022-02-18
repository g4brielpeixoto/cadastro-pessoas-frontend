<template>
  <v-container class="mt-8 d-flex flex-column">
    <v-btn class="align-self-center" color="green" rounded width="fit-content" to="/formulario">
      <v-icon class="pr-2">mdi-account-plus</v-icon>
      Nova Pessoa
    </v-btn>
    <v-row v-show="estadoVazio" class="grey--text align-self-center ma-10">
      <v-icon color="grey">mdi-account</v-icon>
      <h2 class="grey--text ml-4">Nenhuma pessoa cadastrada</h2>
    </v-row>

    <CaixaDialogo
      :dialogo="dialogo"
      :mensagem="`Confirmar remoção de ${pessoaDeletar.nome} ?`"
      @cancelar="dialogo = false"
      @confirmar="deletePessoa(pessoaDeletar.id)"
    />

    <div class="mt-8" v-for="pessoa in pessoas" :key="pessoa.id">
      <v-card class="mx-auto pt-2 pb-4 pl-3 pr-1 rounded-xl" width="500">
        <v-card-text>
          <p class="text-h4 text--primary">{{ pessoa.nome }}</p>
          <v-row class="mx-1 d-flex align-center justify-space-between">
            <div>
              {{ imprimeAtributosPessoa(pessoa) }}
            </div>
            <div>
              <v-btn icon small :to="`/editar/${pessoa.id}`">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small @click="abrirDialogo(pessoa)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script>
import CaixaDialogo from '../components/CaixaDialogo.vue'

export default {
  components: { CaixaDialogo },
  data() {
    return {
      dialogo: false,
      pessoaDeletar: {
        id: null,
        nome: null
      }
    }
  },
  methods: {
    abrirDialogo(pessoa) {
      this.pessoaDeletar = pessoa
      this.dialogo = true
    },
    async deletePessoa(pessoaId) {
      await this.$store.dispatch('deletePessoa', pessoaId)
      this.dialogo = false
    },
    imprimeAtributosPessoa(pessoa) {
      if (pessoa.tipo === 'F') {
        return `Pessoa física | ${pessoa.pessoaFisica.cpf} | ${pessoa.pessoaFisica.identidade}`
      }
      return `Pessoa jurídica | ${pessoa.pessoaJuridica.cnpj} | ${pessoa.pessoaJuridica.inscricao_estadual}`
    }
  },
  computed: {
    pessoas() {
      const pessoas = this.$store.getters.pessoas
      return pessoas
    },
    estadoVazio() {
      if (this.pessoas.length === 0) return true
      return false
    }
  },
  async mounted() {
    await this.$store.dispatch('getPessoas')
    await this.$store.dispatch('getGrupos')
  }
}
</script>
