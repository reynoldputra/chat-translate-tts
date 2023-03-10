<template>
  <div>
    <label>Input text</label><br />
    <textarea v-model="input.text"></textarea><br />
    <label>Choose language</label><br />
    <select v-model="input.lang">
      <option v-for="(lang, idx) in langs" :value="lang.langCode" :id="idx" :key="idx">
        {{ lang.lang + " - " + lang.langCode }}
      </option>
    </select><br />
    <div v-if="input.lang">
      <label>Choose voice type</label><br />
      <select v-model="input.name">
        <option v-for="(name, idx) in names[input.lang]" :value="idx" :id="idx" :key="idx">{{ name }}</option>
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
      names: [],
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
      console.log(this.input.text)
      console.log(this.langs[this.input.name].voice)
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
        voice.voice = this.langs[this.input.name].voice
        tts.speak(voice)
      })
      // console.log(this.input.text)
      // const tts = window.speechSynthesis
      // const voice = new SpeechSynthesisUtterance(this.input.text)
      // tts.speak(voice)
    },
    getVoiceList() {
      const tts = window.speechSynthesis
      const voices = tts.getVoices()
      voices.forEach((voice) => { 
        let originName = voice.name
        let langCode =  voice.lang
        let lang = originName.split(" - ")[1] 
        let name = originName.split(" - ")[0]
        let langObj = {
          langCode, lang, originName, voice
        }
        if(!this.langs.some((langObj) => {
          if (langObj.langCode == langCode) return true
          else false
        })) this.langs.push(langObj)
        if(!this.names[langCode]) this.names[langCode] = new Array()
        this.names[langCode].push(name)
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
