import { ClassEvents } from "../util/ClassEvents";

export class MicrophoneController extends ClassEvents{

    constructor(audioEl){

        super();

        this._mimeType = 'audio/webm';
        this._available = false;

    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(stream=> {

        this._available = true; 
        this._stream = stream;
        this.trigger('ready', this._stream);
        
    
    }).catch(err=>{
        console.error(err);
  });
 }

 isAvailable(){

    return this._available

 }

 stop(){
    this._stream.getTracks().forEach(track => {

        track.stop();
        
    });
        
    }

 startRecorder(options = {}){

    
    if (this._available) {

        this.startTimer();

        this._mediaRecorder = new MediaRecorder(this._stream, Object.assign(options, {
            mimeType: 'audio/webm'
        }));

        this._recordedChunks = [];

        this._mediaRecorder.addEventListener('dataavailable', e => {

            if (e.data.size > 0) this._recordedChunks.push(e.data);

        });

        this._mediaRecorder.addEventListener('stop', () => {

            let blob = new Blob(this._recordedChunks, {
                type: 'audio/webm'
            });

            let cx = new AudioContext();

            var fileReader = new FileReader();
            
            fileReader.onload = e => {

                cx.decodeAudioData(fileReader.result).then(decode => {

                    let file = new File([blob], 'rec' + new Date().getTime() + '.webm', {
                        type: 'audio/webm',
                        lastModified: Date.now()
                    });

                    this.trigger('recorded', file, decode);

                });

            };

            fileReader.readAsArrayBuffer(blob);                

        });

        this._mediaRecorder.start();

    }

}

 stopRecorder(){

    if(this.isAvailable()){

        this._mediaRecorder.stop();
        this.stop();
        this.stopTimer();
    }

 }

 startTimer(){

    let start = Date.now();
    this._recordMicrophoneInterval = setInterval(() => {

        this.trigger('recordtimer', Date.now() - start);

    },100);


 }

 stopTimer(){

    clearInterval(this._recordMicrophoneInterval); 
 }

}