<template>
  <div>
    <label>Choose input language</label><br />
    <select v-model="inputLanguage">
      <option v-for="language in languageList" :value="language.code" :key="language.code">
        {{ language.name }}
      </option></select
    ><br />
    <label>Input text</label><br />
    <textarea v-model="inputText"></textarea><br />
    <label>Choose output language</label><br />
    <select v-model="outputLanguage">
      <option v-for="language in languageList" :value="language.code" :key="language.code">
        {{ language.name }}
      </option></select
    ><br />
    <button @click="translateText">Translate</button><br />
    <p>
      {{ outputText }}
    </p>
  </div>
</template>

<script>
import axios from 'axios'
import languageList from '../data/languages.js'

export default {
  data() {
    return {
      inputText: '',
      outputText: '',
      languageList,
      inputLanguage: '',
      outputLanguage: ''
    }
  },
  methods: {
    translateText() {
      const encodedParams = new URLSearchParams()
      encodedParams.append('q', this.inputText)
      encodedParams.append('target', this.outputLanguage)
      encodedParams.append('source', this.inputLanguage)

      const options = {
        method: 'POST',
        url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Accept-Encoding': 'application/gzip',
          'X-RapidAPI-Key': '97d71aea4emshe9cd36f1015a5c4p17cfe0jsn039ff4af3c8f',
          'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
        },
        data: encodedParams
      }
      axios
        .request(options)
        .then( (response) => {
          this.outputText = response.data.data.translations[0].translatedText
        })
        .catch( (error) => {
          console.error(error)
        })
    }
  },
  mounted() {}
}
</script>
