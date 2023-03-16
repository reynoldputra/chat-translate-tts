<template>
  <div>
    <label>Input text</label><br />
    <textarea v-model="input.text"></textarea><br />
    <label>Choose language</label><br />
    <select v-model="input.lang" @change="filterVoiceName">
      <option v-for="(lang, idx) in langs" :value="lang" :id="idx" :key="idx">
        {{ lang }}
      </option>
    </select><br />
    <div v-if="input.lang">
      <label>Choose voice type</label><br />
      <select v-model="input.name">
          <option  v-for="(voice, idx) in voices" :value="idx" :id="idx" :key="idx"  >{{ voice.name  }}</option>
      </select>
    </div>
    <button v-if="input.text != null && input.name != null" @click="playVoice">Play</button>
    <!-- <p v-show="isPlay">Playing ...</p>  -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      voices: [],
      voiceByLang: [],
      langs: [],
      input: {
        text: null,
        lang: null,
        name: null
      },
      isPlay: false
    }
  },
  methods: {
    async playVoice() {
      const choosedVoice = this.voiceByLang[this.input.name]
      await new Promise((resolve, reject) => {
        this.isPlay = true
        const tts = window.speechSynthesis
        tts.addEventListener('ended', () => {
          console.log("done")
          this.isPlay = false
          resolve()
        })
        tts.addEventListener('error', () => {
          this.isPlay = false
          reject()
        })
        const voice = new SpeechSynthesisUtterance(this.input.text)
        voice.voice = choosedVoice 
        tts.speak(voice)
      })
    },
    getVoiceList() {
      const tts = window.speechSynthesis
      const voices = tts.getVoices()
      voices.forEach((voice) => {
        if(!this.langs.includes(voice.lang))
          this.langs.push(voice.lang)
      })
      this.voices = voices 
    },
    filterVoiceName() {
      this.voiceByLang = this.voices.filter((voice) => {
        return voice.lang == this.input.lang
      })  
    }
  },
  mounted() {
    const tts = window.speechSynthesis
    if ('speechSynthesis' in window) {
      tts.addEventListener('voiceschanged', this.getVoiceList)
      tts.getVoices() // Call getVoices() to  the voiceschanged event.
    } else {
      console.log('SpeechSynthesis not supported')
    }
  },
  beforeDestroy() {
    const tts = window.speechSynthesis
    if ('speechSynthesis' in window) {
      tts.removeEventListener('voiceschanged', this.getVoiceList)
    }
  }
}
</script>
