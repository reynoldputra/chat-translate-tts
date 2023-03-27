class SpeechSynthesisRecorder {
  constructor({ text = '', utteranceOptions = {}, recorderOptions = {}, dataType = '' }) {
    if (text === '') throw new Error('no words to synthesize')
    this.dataType = dataType
    this.text = text
    this.mimeType = MediaRecorder.isTypeSupported('audio/webm; codecs=opus')
      ? 'audio/webm; codecs=opus'
      : 'audio/ogg; codecs=opus'
    this.utterance = new SpeechSynthesisUtterance(this.text)
    this.speechSynthesis = window.speechSynthesis
    this.audioNode = new Audio()
    this.chunks = []
    if (utteranceOptions) {
      if (utteranceOptions.voice) {
        this.speechSynthesis.onvoiceschanged = (e) => {
          const voice = this.speechSynthesis
            .getVoices()
            .find(({ name: _name }) => _name === utteranceOptions.voice)
          this.utterance.voice = voice
        }
        this.speechSynthesis.getVoices()
      }
      let { lang, rate, pitch, volume } = utteranceOptions
      Object.assign(this.utterance, {
        lang,
        rate,
        pitch,
        volume
      })
    }
    console.log(this.utterance)
    this.audioNode.controls = 'controls'
    document.body.appendChild(this.audioNode)
  }
  async start(text = '') {
    if (text) this.text = text
    if (this.text === '') throw new Error('no words to synthesize')

    return new Promise(async (resolve) => {
      const audioContext = new AudioContext()
      const mediaStreamDestination = audioContext.createMediaStreamDestination()
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream)
      let chunks = []

      const startRecording = () => {
        chunks = []
        mediaRecorder.start()
      }

      const stopRecording = () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop()
        }
      }

      mediaRecorder.addEventListener('dataavailable', (event) => {
        chunks.push(event.data)
      })

      mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        const link = document.getElementById('downloadLink')
        link.href = url
        link.download = 'synthesized-audio.wav'
        document.getElementById('downloadLink').textContent = link.download
      })

      const utterance = new SpeechSynthesisUtterance('Hello, world!')

      utterance.addEventListener('start', () => {
        console.log('Starting recording SpeechSynthesisUtterance')
        startRecording()
      })

      utterance.addEventListener('end', () => {
        console.log('Ending recording SpeechSynthesisUtterance')
        stopRecording()
      })

      const source = audioContext.createMediaStreamSource(mediaStreamDestination.stream)
      source.connect(audioContext.destination)

      speechSynthesis.speak(utterance)
    })
  }
}
export default SpeechSynthesisRecorder
