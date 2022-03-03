<template>
  <v-card width="550" class="pa-10 mx-auto ma-8 d-flex rounded-xl flex-column">
    <v-row class="mb-6 mt-4 mr-4 align-self-end">
      <v-btn rounded color="red" class="mr-3" to="/" small>
        <v-icon class="pr-2">mdi-cancel</v-icon>
        Cancelar
      </v-btn>
      <v-btn @click="novaPessoa()" :disabled="validaInputs()" rounded color="green" small>
        <v-icon class="pr-2">mdi-floppy</v-icon>
        Salvar
      </v-btn>
    </v-row>
    <v-text-field @change="validaInputs()" v-model="nome" outlined rounded label="Nome" />
    <v-combobox
      @change="validaInputs()"
      v-model="grupo"
      :items="items"
      label="Grupo"
      rounded
      outlined
    />
    <v-radio-group class="align-self-center" v-model="tipo" row>
      <v-radio label="Pessoa física" value="F" />
      <v-radio label="Pessoa jurídica" value="J" />
    </v-radio-group>
    <div v-if="tipo == 'F'">
      <v-text-field
        @change="validaInputs()"
        v-model="cpf"
        outlined
        rounded
        label="CPF"
        v-mask="'###.###.###-##'"
      />
      <v-text-field v-model="identidade" outlined rounded label="Identidade" />
    </div>
    <div v-else>
      <v-text-field
        @change="validaInputs()"
        v-model="cnpj"
        outlined
        rounded
        label="CNPJ"
        v-mask="'##.###.###/####-##'"
      />
      <v-text-field v-model="inscricaoEstadual" outlined rounded label="Inscrição Estadual" />
    </div>
    <div v-for="input in inputsTelefone" :key="input">
      <v-text-field
        @change="validaInputs()"
        v-model="telefones[input - 1]"
        outlined
        rounded
        label="Telefone"
        v-mask="['(##) ####-####', '(##) #####-####']"
      />
    </div>
    <v-btn
      @click="inputsTelefone++"
      v-if="telefones != ''"
      rounded
      width="fit-content"
      class="align-self-end"
    >
      <v-icon class="pr-2">mdi-phone-plus</v-icon>
      Mais um telefone
    </v-btn>
  </v-card>
</template>

<script>
import axios from '../utils/axios'
import { mask } from 'vue-the-mask'

export default {
  directives: { mask },
  metaInfo: {
    title: 'Cadastro de pessoas | Cadastrar'
  },
  data() {
    return {
      nome: '',
      tipo: 'F',
      grupo: '',
      cpf: '',
      identidade: '',
      cnpj: '',
      inscricaoEstadual: '',
      telefones: [],
      inputsTelefone: 1
    }
  },
  methods: {
    async novaPessoa() {
      if (this.tipo === 'F') {
        const pessoaFisica = {
          nome: this.nome,
          tipo: this.tipo,
          grupoId: this.grupo.id,
          cpf: this.cpf,
          identidade: this.identidade,
          telefones: this.telefones
        }
        await axios.post('/pessoa', pessoaFisica)
      }
      if (this.tipo === 'J') {
        const pessoaJuridica = {
          nome: this.nome,
          tipo: this.tipo,
          grupoId: this.grupo.id,
          cnpj: this.cnpj,
          inscricaoEstadual: this.inscricaoEstadual,
          telefones: this.telefones
        }
        await axios.post('/pessoa', pessoaJuridica)
      }
      this.$router.push('/')
    },
    validaInputs() {
      if (this.tipo === 'F') {
        if (
          this.nome == '' ||
          this.grupo == '' ||
          this.cpf == '' ||
          this.identidade == '' ||
          this.telefones.length === 0
        )
          return true
        return false
      }
      if (this.tipo === 'J') {
        if (
          this.nome == '' ||
          this.grupo == '' ||
          this.cnpj == '' ||
          this.inscricaoEstadual == '' ||
          this.telefones.length === 0
        )
          return true
        return false
      }
    }
  },
  computed: {
    grupos() {
      return this.$store.getters.grupos
    },
    items() {
      const items = []
      this.grupos.forEach((grupo) => {
        items.push({
          text: grupo.descricao,
          id: grupo.id
        })
      })
      return items
    }
  }
}
</script>
