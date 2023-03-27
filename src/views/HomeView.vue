<template>
  <div class="h-screen bg-blue-200">
    <div class="px-10 py-4">
      <img src="../assets/img/logo.png" />
    </div>
    <div class="flex justify-between px-10">
      <div class="h-full p-6 flex flex-col text-[#2B4FA0] justify-end items-center text-center gap-4">
        <img class="w-60" src="../assets/img/img-1.png" alt="">
        <div class="flex gap-4">
          <div>
            <p class="pb-2 text-[#2B4FA0] font-bold">First person language</p>
            <select v-model="input.lang.first" class="py-2 w-18 px-16 rounded-[28px]" name="" id="">
              <option v-for="(lang, idx) in languageList" :value="idx">{{ lang.name }}</option>
            </select>
          </div>
          <div>
            <p class="pb-2 text-[#2B4FA0] font-bold">Second person language</p>
            <select v-model="input.lang.second" class="py-2 px-16 w-18 rounded-[28px]" name="" id="">
              <option v-for="(lang, idx) in languageList" :value="idx">{{ lang.name }}</option>
            </select>
          </div>
        </div>
        <div>
          <div>
            <p class="pb-2 text-[#2B4FA0] font-bold">Choose first person voice</p>
            <select v-model="input.voice.first" class="py-2 px-6 rounded-[28px]" name="" id="">
              <option v-for="(lang, idx) in languageList" :value="lang.voice">{{ lang.voice }}</option>
            </select>
          </div>
          <div>
            <p class="pb-2 text-[#2B4FA0] font-bold pt-4">Choose second person voice</p>
            <select v-model="input.voice.second" class="py-2 px-6 rounded-[28px]" name="" id="">
              <option v-for="(lang, idx) in languageList" :value="lang.voice">{{ lang.voice }}</option>
            </select>
          </div>
        </div>
          <p class="text-[#2B4FA0] font-bold">Person is typing ... </p>
          <p class="bg-white py-4 px-8 rounded-full text-lg text-[#2B4FA0] font-bold">{{person}}</p>
      </div>
      <div class="w-[850px] rounded-[32px] p-10 bg-blue-100 flex flex-col justify-between">
        <div>
          <div v-for="chat in chats">
            <div v-if="chat.person == 1" class="flex mb-8">
              <div class="bg-white rounded-[24px] py-2 px-4 rounded-bl-sm w-fit min-w-[400px]">
                <p class="text-sm text-slate-600">{{chat.textInput}}</p>
                <p class="text-md font-bold">{{chat.textOutput}}</p>
              </div>
              <div class="w-12 h-12 my-auto ml-12 rounded-full bg-white"  @click="playVoice(chat)">
                <img src="../assets/img/speaker.png" class=" w-6 m-auto my-auto py-3 " alt="" />
              </div>
            </div>
            <div v-if="chat.person == 2" class="flex justify-end mb-8 text-white">
              <div class="w-12 h-12 my-auto mr-12 rounded-full bg-[#2B4FA0]"  @click="playVoice(chat)">
                <img src="../assets/img/speaker-white.png" class=" w-6 m-auto my-auto py-3" alt="" />
              </div>
              <div class="bg-[#2B4FA0] rounded-[24px] py-2 px-4 rounded-br-sm w-fit min-w-[400px]">
                <p class="text-sm text-blue-200">{{chat.textInput}}</p>
                <p class="text-md font-bold">{{chat.textOutput}}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white p-2 pl-8 flex justify-between rounded-[60px]">
          <div class="flex">
            <div @click="changePerson(1)" class="font-bold rounded-full w-8 h-8 my-auto text-center bg-blue-300 pt-1">
              1
            </div>
            <div @click="changePerson(2)" class="bg-[#2B4FA0] text-white font-bold rounded-full ml-4 w-8 h-8 my-auto text-center pt-1">
              2
            </div>
            <input v-model="input.text" class=" w-[500px] px-4 text-sm ml-6" type="text" placeholder="Type your text here ..." />
          </div>
          <div @click="translate" class="rounded-full bg-blue-300 p-3">
            <img src="../assets/img/sent.png" alt="" class="w-6" />
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
        voice : {
          first :  languageList[0].voice,
          first :  languageList[0].voice
        }

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
          this.input.text = ""
        })
        .catch( (error) => {
          console.error(error)
        })

    },
    async playVoice(chat) {
      console.log(chat)
      let choosedVoice = null;
      const voiceList = this.voiceList
      let inputVoice = null
      if(chat.person == 1) inputVoice = this.input.voice.first
      else inputVoice = this.input.voice.second
      voiceList.forEach(voice => {
        if(voice.name == inputVoice ) choosedVoice = voice
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
        const voice = new SpeechSynthesisUtterance(chat.textOutput)
        voice.voice = choosedVoice
        console.log(voice)
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
