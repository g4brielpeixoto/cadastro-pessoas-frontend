import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../utils/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    pessoas: [],
    pessoa: null,
    grupos: [],
    telefones: []
  },
  mutations: {
    SET_PESSOAS(state, payload) {
      state.pessoas = payload
    },
    SET_PESSOA(state, payload) {
      state.pessoa = payload
    },
    DELETE_PESSOA(state, payload) {
      state.pessoas = state.pessoas.filter((pessoa) => pessoa.id != payload)
    },
    SET_GRUPOS(state, payload) {
      state.grupos = payload
    }
  },
  actions: {
    async getPessoas(context) {
      await axios.get('/pessoa').then((response) => context.commit('SET_PESSOAS', response.data))
    },
    async getGrupos(context) {
      await axios.get('/grupo').then((response) => context.commit('SET_GRUPOS', response.data))
    },
    async getPessoa(context, pessoaId) {
      await axios
        .get(`/pessoa/${pessoaId}`)
        .then((response) => context.commit('SET_PESSOA', response.data))
    },
    async deletePessoa(context, pessoaId) {
      await axios.delete(`/pessoa/${pessoaId}`).then(() => {
        context.commit('DELETE_PESSOA', pessoaId)
      })
    }
  },
  getters: {
    pessoas(state) {
      return state.pessoas
    },
    pessoa(state) {
      return state.pessoa
    },
    grupos(state) {
      return state.grupos
    }
  }
})
