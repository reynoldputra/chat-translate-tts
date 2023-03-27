<template>
  <div class="min-h-screen bg-blue-200">
    <div class="px-10 py-4">
      <img src="../assets/img/logo.png" />
    </div>
    <div class="flex justify-between h-[750px] px-10">
      <div class="h-full w-1/4 pb-10 flex flex-col text-[#2B4FA0] justify-end items-center text-center gap-8">
        <img src="../assets/img/img-1.png" alt="">
        <div>
          <p class="pb-2 text-[#2B4FA0] font-bold">First person language</p>
          <select v-model="input.lang.first" class="py-2 px-16 rounded-[28px]" name="" id="">
            <option v-for="(lang, idx) in languageList" :value="idx">{{ lang.name }}</option>
          </select>
        </div>
        <div>
          <p class="pb-2 text-[#2B4FA0] font-bold">Second person language</p>
          <select v-model="input.lang.second" class="py-2 px-16 rounded-[28px]" name="" id="">
            <option v-for="(lang, idx) in languageList" :value="idx">{{ lang.name }}</option>
          </select>
        </div>
        <div>
          <p class="pb-2 text-[#2B4FA0] font-bold">Choose voice</p>
          <select v-model="input.voice" class="py-2 px-6 rounded-[28px]" name="" id="">
            <option v-for="(lang, idx) in languageList" :value="lang.voice">{{ lang.voice }}</option>
          </select>
        </div>
          <p class="text-[#2B4FA0] font-bold">Person is typing ... </p>
          <p class="bg-white py-4 px-8 rounded-full text-lg text-[#2B4FA0] font-bold">{{person}}</p>
      </div>
      <div class="w-[1300px] rounded-[60px] p-10 bg-blue-100 flex flex-col justify-between">
        <div>
          <div v-for="chat in chats">
            <div v-if="chat.person == 1" class="flex mb-8">
              <div class="bg-white rounded-[40px] py-8 px-12 rounded-bl-sm w-fit min-w-[600px]">
                <p class="text-slate-600">{{chat.textInput}}</p>
                <p class="text-xl font-bold">{{chat.textOutput}}</p>
              </div>
              <div class="w-16 h-16 my-auto ml-12 rounded-full bg-white"  @click="playVoice(chat.textOutput)">
                <img src="../assets/img/speaker.png" class="m-auto my-auto py-4" alt="" />
              </div>
            </div>
            <div v-if="chat.person ==2" class="flex justify-end mb-8 text-white">
              <div class="w-16 h-16 my-auto mr-12 rounded-full bg-[#2B4FA0]"  @click="playVoice(chat.textOutput)">
                <img src="../assets/img/speaker-white.png" class="m-auto my-auto py-4" alt="" />
              </div>
              <div class="bg-[#2B4FA0] rounded-[40px] py-8 px-12 rounded-br-sm w-fit min-w-[600px]">
                <p class="text-blue-200">{{chat.textInput}}</p>
                <p class="text-xl font-bold">{{chat.textOutput}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white p-4 pl-8 flex justify-between rounded-[60px]">
          <div class="flex">
            <div @click="changePerson(1)" class="font-bold rounded-full w-14 h-14 my-auto text-center bg-blue-300 p-4">
              1
            </div>
            <div @click="changePerson(2)" class="bg-[#2B4FA0] text-white font-bold rounded-full w-14 h-14 my-auto ml-4 text-center p-4">
              2
            </div>
            <input v-model="input.text" class=" w-[500px] px-4 text-xl ml-6" type="text" placeholder="Type your text here ..." />
          </div>
          <div @click="translate" class="rounded-full bg-blue-300 p-4">
            <img src="../assets/img/sent.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import languageList from '../data/languages.js'

export default {
  data() {
    return {
      languageList,
      input : {
        lang : {
          first : 0,
          second : 3
        },
        text : null,
        voice : languageList[0].voice
      },
      output : {
        text : null
      },
      person: 1,
      chats : [
        {
          person : 1,
          textInput : "testing my voice",
          textOutput : "menguji suaraku",
          langCode : "en"
        },
        {
          person : 2,
          textInput : "Hallo apa kabar",
          textOutput : "Hello how are you",
          langCode : "id"
        }
      ],
      voiceList : []
    } 
  },
  methods: {
    changePerson(i) {
      this.person = i;
      console.log(this.person)
    },
    translate() {
      console.log(this.input)
      const encodedParams = new URLSearchParams()
      encodedParams.append('text', this.input.text)
      console.log(this.person)
      if(this.person == 1) {
        encodedParams.append('target_language', this.languageList[this.input.lang.second].translate)
        encodedParams.append('source_language', this.languageList[this.input.lang.first].translate)
      } else {
        encodedParams.append('target_language', this.languageList[this.input.lang.first].translate)
        encodedParams.append('source_language', this.languageList[this.input.lang.second].translate)
      }

      const options = {
        method: 'POST',
        url: 'https://text-translator2.p.rapidapi.com/translate',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': '97d71aea4emshe9cd36f1015a5c4p17cfe0jsn039ff4af3c8f',
          'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        data: encodedParams
      }
      axios
        .request(options)
        .then( (response) => {
          this.output.text = response.data.data.translatedText
          this.chats.push(
            {
              person : this.person,
              textInput : this.input.text,
              textOutput : this.output.text
            } 
          )
          console.log(this.chats)
        })
        .catch( (error) => {
          console.error(error)
        })

    },
    async playVoice(text) {
      let choosedVoice = null;
      const voiceList = this.voiceList
      console.log(this.input.voice)
      voiceList.forEach(voice => {
        console.log(voice.name)
        if(voice.name == this.input.voice) choosedVoice = voice
      })
      console.log(choosedVoice)
      await new Promise((resolve, reject) => {
        const tts = window.speechSynthesis
        this.isPlay = true
        tts.addEventListener('ended', () => {
          console.log('done')
          this.isPlay = false
          resolve()
        })
        tts.addEventListener('error', () => {
          this.isPlay = false
          reject()
        })
        const voice = new SpeechSynthesisUtterance(text)
        voice.voice = choosedVoice
        tts.speak(voice)
      })
    },
    getVoiceList() {
      const tts = window.speechSynthesis
      const voices = tts.getVoices()
      this.voiceList = voices
    },
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
