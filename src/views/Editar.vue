<template>
  <v-card width="550" class="pa-10 mx-auto ma-8 d-flex rounded-xl flex-column">
    <v-row class="mb-6 mt-4 mr-4 align-self-end">
      <v-btn rounded color="red" class="mr-3" to="/" small>
        <v-icon class="pr-2">mdi-cancel</v-icon>
        Cancelar
      </v-btn>
      <v-btn @click="atualizarPessoa()" :disabled="validaInputs()" rounded color="green" small>
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
        @change="validaInputs"
        v-model="cnpj"
        outlined
        rounded
        label="CNPJ"
        v-mask="'##.###.###/####-##'"
      />
      <v-text-field v-model="inscricaoEstadual" outlined rounded label="Inscrição Estadual" />
    </div>

    <CaixaDialogo
      :dialogo="dialogo"
      :mensagem="`Confirmar remoção de ${telefoneDeletar.telefone} ?`"
      @cancelar="dialogo = false"
      @confirmar="deleteTelefone(telefoneDeletar.id)"
    />

    <div v-for="telefone in telefones" :key="telefone.id">
      <InputEditarTelefone
        :telefone="telefone"
        @atualizar="atualizarTelefone"
        @deletar="abrirDialogo"
        :bloquearDelete="bloquearDelete"
        @telefoneVazio="telefoneVazio = true"
        @telefonePreenchido="telefoneVazio = false"
        @deletarCampoVazio="deletarCampoVazio()"
      />
    </div>
    <v-btn
      @click="adicionarTelefone()"
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
import { InputEditarTelefone, CaixaDialogo } from '../components'
import { mask } from 'vue-the-mask'

export default {
  components: { InputEditarTelefone, CaixaDialogo },
  metaInfo: {
    title: 'Cadastro de pessoas | Atualizar'
  },
  directives: { mask },
  data() {
    return {
      id: null,
      nome: '',
      tipo: '',
      grupo: '',
      cpf: '',
      identidade: '',
      cnpj: '',
      inscricaoEstadual: '',
      telefones: [],
      dialogo: false,
      telefoneDeletar: {
        id: null,
        telefone: null
      },
      telefoneVazio: false
    }
  },
  methods: {
    async atualizarPessoa() {
      const pessoa = {}

      if (this.nome) pessoa.nome = this.nome
      if (this.grupoId) pessoa.grupoId = this.grupo.id

      if (this.tipo === 'F') {
        if (this.cpf) pessoa.cpf = this.cpf
        if (this.identidade) pessoa.identidade = this.identidade
        await axios.put(`/pessoa/${this.id}`, pessoa)
      }
      if (this.tipo === 'J') {
        if (this.cpnj) pessoa.cnpj = this.cnpj
        if (this.inscricaoEstadual) pessoa.inscricaoEstadual = this.inscricaoEstadual
        await axios.put(`/pessoa/${this.id}`, pessoa)
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
          this.telefones.length === 0 ||
          this.telefoneVazio
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
          this.telefones.length === 0 ||
          this.telefoneVazio
        )
          return true
        return false
      }
    },

    async atualizarTelefone(telefone) {
      if (telefone.id)
        await axios.put(`/telefone/${this.id}/${telefone.id}`, { telefone: telefone.telefone })
      else await axios.put(`/telefone/${this.id}`, { telefone: telefone.telefone })
    },

    async deleteTelefone(telefoneId) {
      await axios.delete(`/telefone/${this.id}/${telefoneId}`)
      this.telefones = this.telefones.filter((telefone) => telefone.id !== telefoneId)
      this.dialogo = false
    },

    abrirDialogo(telefone) {
      this.telefoneDeletar = telefone
      this.dialogo = true
    },

    adicionarTelefone() {
      this.telefones.push({ pessoa_id: this.id, telefone: '' })
    },

    deletarCampoVazio() {
      this.telefones.pop()
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
    },

    bloquearDelete() {
      if (this.telefones.length === 1) return true
      return false
    }
  },
  async mounted() {
    await this.$store.dispatch('getGrupos')
    await this.$store.dispatch('getPessoa', this.$route.params.pessoaId)

    const pessoa = this.$store.getters.pessoa
    this.id = pessoa.id
    this.nome = pessoa.nome
    this.grupo = pessoa.grupo.descricao
    if (pessoa.tipo == 'F') {
      this.tipo = 'F'
      this.cpf = pessoa.pessoaFisica.cpf
      this.identidade = pessoa.pessoaFisica.identidade
    } else {
      this.tipo = 'J'
      this.cnpj = pessoa.pessoaJuridica.cnpj
      this.inscricaoEstadual = pessoa.pessoaJuridica.inscricao_estadual
    }
    this.telefones = pessoa.telefone
  }
}
</script>
