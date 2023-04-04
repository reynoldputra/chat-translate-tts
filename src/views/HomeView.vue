<template>
  <div class="h-screen  py-4 flex flex-col bg-blue-200">
    <div class="px-10">
      <img class="w-48" src="../assets/img/logo.png" />
    </div>
    <div class="flex flex-grow justify-between px-10">
      <div class="h-full px-6 py-16 flex flex-col text-[#2B4FA0] justify-between items-center text-center gap-4">
        <div class="flex justify-between items-center flex-grow">
          <img class="w-60" src="../assets/img/img-1.png" alt="">
        </div>
        <div>
          <div class="flex gap-4">
            <div>
              <p class="pb-2 text-[#2B4FA0] font-bold">First person language</p>
              <select v-model="input.lang.first" @change="onLangChange(1)" class="py-2 w-18 px-16 rounded-[28px]" name="" id="">
                <option v-for="(lang, idx) in langCode" :value="lang.code">{{ lang.name }}</option>
              </select>
            </div>
            <div>
              <p class="pb-2 text-[#2B4FA0] font-bold">Second person language</p>
              <select v-model="input.lang.second" @change="onLangChange(0)" class="py-2 px-16 w-18 rounded-[28px]" name="" id="">
                <option v-for="(lang, idx) in langCode" :value="lang.code">{{ lang.name }}</option>
              </select>
            </div>
          </div>
          <div>
            <div>
              <p class="pb-2 text-[#2B4FA0] font-bold">Choose voice for {{input.langName.first}}</p>
              <select v-model="input.voice.first" class="py-2 px-6 rounded-[28px]" name="" id="">
                <option v-for="(lang, idx) in languageList" :value="lang.voice">{{ lang.voice }}</option>
              </select>
            </div>
            <div>
              <p class="pb-2 text-[#2B4FA0] font-bold pt-4">Choose voice for {{input.langName.second}}</p>
              <select v-model="input.voice.second" class="py-2 px-6 rounded-[28px]" name="" id="">
                <option v-for="(lang, idx) in languageList" :value="lang.voice">{{ lang.voice }}</option>
              </select>
            </div>
          </div>
        </div> 
      </div>
      <div class="w-[850px] rounded-[32px] p-10 bg-blue-100 flex flex-col justify-between">
        <div>
          <div v-for="chat in chats">
            <div v-if="chat.person == 1" class="flex mb-8">
              <div class="my-auto w-8 h-8 text-center pt-1 font-bold mr-4 rounded-full bg-white" > 
                1
              </div>
              <div class="bg-white rounded-[24px] py-2 px-4 rounded-bl-sm w-fit min-w-[400px]">
                <p class="text-sm text-slate-600">{{chat.textInput}}</p>
                <p class="text-md font-bold">{{chat.textOutput}}</p>
              </div>
              <div class="w-8 h-8 my-auto ml-12 rounded-full bg-white"  @click="playVoice(chat)">
                <img src="../assets/img/speaker.png" class=" w-4 m-auto my-auto py-2 " alt="" />
              </div>
              <div class="w-8 h-8 my-auto ml-4 rounded-full bg-white"  @click="download(chat)">
                <img src="../assets/img/download.png" class="w-4 m-auto my-auto py-2" alt="" />
              </div>
            </div>
            <div v-if="chat.person == 2" class="flex justify-end mb-8 text-white">
              <div class="w-8 h-8 my-auto mr-4 rounded-full bg-[#2B4FA0]"  @click="playVoice(chat)">
                <img src="../assets/img/speaker-white.png" class=" w-4 m-auto my-auto py-2" alt="" />
              </div>
              <div class="w-8 h-8 my-auto mr-12 rounded-full bg-white"  @click="download(chat)">
                <img src="../assets/img/download.png" class="w-4 m-auto my-auto py-2" alt="" />
              </div>
              <div class="bg-[#2B4FA0] rounded-[24px] py-2 px-4 rounded-br-sm w-fit min-w-[400px]">
                <p class="text-sm text-blue-200">{{chat.textInput}}</p>
                <p class="text-md font-bold">{{chat.textOutput}}</p>
              </div>
              <div class="my-auto w-8 h-8 text-center pt-1 font-bold ml-4 rounded-full bg-[#2B4FA0]" >
                2
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white p-2 pl-8 flex justify-between rounded-[60px]">
          <div class="flex">
            <div @click="changePerson(1)" class="cursor-pointer font-bold rounded-full w-10 h-10 my-auto text-center border-black border-4 pt-1"
              :class="[person == 1 ? 'bg-black text-white' : '']"
            >
              1
            </div>
            <div @click="changePerson(2)" class="cursor-pointer border-4 text-[#2B4FA0] font-bold rounded-full ml-4 w-10 h-10 my-auto border-[#2B4FA0] text-center pt-1"
              :class="[person == 2 ? 'bg-[#2B4FA0] text-white' : '']"
            >
              2
            </div>
            <input v-model="input.text" class=" w-[500px] px-4 text-sm ml-6" type="text" placeholder="Type your text here ..." />
          </div>
          <div class="rounded-full bg-blue-300 p-3">
            <input type="file" id="selectedFile" style="display: none;" @change="onFileSelected" />
            <img src="../assets/img/files.png" alt="" class="w-6"  onclick="document.getElementById('selectedFile').click();" />
          </div>
          <div @click="translate" class="rounded-full bg-blue-300 p-3">
            <img src="../assets/img/sent.png" alt="" class="w-6" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <a id="temp" class="hidden"></a>
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
          first : 'en',
          second : 'id'
        },
        langName : {
          first : 'English',
          second : 'Bahasa Indonesia'
        },
        text : null,
        voice : {
          first :  languageList[0].voice,
          second :  languageList[0].voice
        },
      },
      output : {
        text : null
      },
      person: 1,
      chats : [
        {
          textInput : "Halo",
          textOutput : "Halloo",
          person : 1
        },
        {
          textInput : "Halo",
          textOutput : "Halloo",
          person : 2
        }
      ],
      voiceList : [],
      selectedFile: null,
      fileContent: null,
      langCode : [
        {
          code : "en",
          name : "English" 
        },
        {
          code : "it",
          name : "Italy" 
        },
        {
          code : "ja",
          name : "Japan" 
        },
        {
          code : "id",
          name : "Indonesia" 
        },
      ] 
    } 
  },
  methods: {
    changePerson(i) {
      this.person = i;
      console.log(this.person)
    },
    onLangChange(first){
      
      if(first) {
        let found = this.langCode.find((v) => {
          console.log(v)
          return v.code == this.input.lang.first
        })
        console.log(found)
        this.input.langName.first = found.name
      } else {
        let found = this.langCode.find((v) => {
          console.log(v)
          return v.code == this.input.lang.second
        })
        console.log(found)
        this.input.langName.second = found.name
      }
    },
    translate() {
      console.log(this.input)
      const encodedParams = new URLSearchParams()
      encodedParams.append('text', this.input.text)
      console.log(this.person)
      if(this.person == 1) {
        encodedParams.append('target_language', this.input.lang.second)
        encodedParams.append('source_language', this.input.lang.first)
      } else {
        encodedParams.append('target_language', this.input.lang.first)
        encodedParams.append('source_language', this.input.lang.second)
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
      let choosedVoice = null;
      const voiceList = this.voiceList
      let inputVoice = null
      if(chat.person == 1) inputVoice = this.input.voice.first
      else inputVoice = this.input.voice.second
      voiceList.forEach(voice => {
        if(voice.name == inputVoice ) choosedVoice = voice
      })
      await new Promise((resolve, reject) => {
        const tts = window.speechSynthesis
        this.isPlay = true
        tts.addEventListener('ended', () => {
          console.log('done')
          this.isPlay = false
          resolve(voice)
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
      console.log(voices)
      this.voiceList = voices
    },
    onFileSelected(event) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.input.text = reader.result;
      };
      reader.readAsText(file);
    },
    async download(chat) {
      console.log(chat)
      let choosedVoice = null;
      const voiceList = this.voiceList
      let inputVoice = null
      if(chat.person == 1) inputVoice = this.input.voice.first
      else inputVoice = this.input.voice.second
      voiceList.forEach(voice => {
        if(voice.name == inputVoice ) choosedVoice = voice
      })
      const voice = new SpeechSynthesisUtterance(chat.textOutput)
      voice.voice = choosedVoice
      console.log(voice)

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream)
          const audioData = []
          mediaRecorder.addEventListener('dataavailable', (event) => {
            audioData.push(event.data)
          })
          mediaRecorder.addEventListener('stop', () => {
            const blob = new Blob(audioData, { type: 'audio/wav' })
            const url = URL.createObjectURL(blob)
            const link = document.getElementById('temp')
            link.href = url
            link.download = 'synthesized-audio.wav'
            link.textContent = link.download
            console.log(link)
            link.click()
          })
          mediaRecorder.start()
          voice.addEventListener('end', () => {
            console.log('end')
            mediaRecorder.stop()
          })
          speechSynthesis.speak(voice)
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
