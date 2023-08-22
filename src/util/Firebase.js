import firebase from 'firebase';


export class Firebase{  

    constructor(){

        this._config = {  apiKey: "AIzaSyDo5aTzioKNbCrhrRJlsFHGSZZbvyuBLKM",
        authDomain: "whatsapp-clone-6d9b3.firebaseapp.com",
        projectId: "whatsapp-clone-6d9b3",
        storageBucket: "whatsapp-clone-6d9b3.appspot.com",
        messagingSenderId: "296327048740",
        appId: "1:296327048740:web:42c5c5fc4472f29292f2b1",
        measurementId: "G-ZY662N1LTP"}

        this.init();

    }

    init(){ 

        if(!this._initialized){
            firebase.initializeApp(this._config);
            firebase.firestore().settings({
                timestampsInSnapshot: true
            });

            this._initialized = true;   

        }

    }

    static db(){
        return firebase.firestore();

    }

    static hd(){
        return firebase.storage();
    }

    initAuth(){

        return new Promise ((s,f)=>{
            
            let provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
            .then(result=>{
                let token = result.credential.acessToken;
                let user = result.user;

                s({
                    user, token
                });
            })

            .catch(err=>{
                f(err);
            });

        })

    }

}