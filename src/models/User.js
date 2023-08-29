import firebase, { Firebase } from './../util/Firebase'
import { Model } from './Model';

export  class User extends Model {

    get name() { return this._data.name; }
    set name(value) { this._data.name = value; }

    get email() { return this._data.email; }
    set email(value) { this._data.email = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }
    
    get chatId() { return this._data.chatId; }
    set chatId(value) { this._data.chatId = value; }


    constructor(id){
        super();
        if (id) this.getById(id);
    }


        getById(id){
            return new Promise((s,f)=>{
                User.findByEmail(id).onSnapshot(doc=>{

                    this.fromJSON(doc.data());
               
                    s(doc);
                    
                }); 
            });
        }

        save(){
            return User.findByEmail(this.email).set(this.toJSON());
        }

        static getRef(){

            return Firebase.db().collection('/users');
    
        }

        static getContactsRef(id){
            return User.getRef()
                .doc(id)
                .collection('contacts');
        }

        static findByEmail(email){

        return User.getRef().doc(email)

        }

        addContact(contact){

            return User.getContactsRef(this.email)
            .doc(btoa(contact.email))
            .set(contact.toJSON());

        }

        updateLastMessage(filter = "", selectedContactEmail){
            return new Promise((s,f)=>{
                User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs=>{
                    console.log('DOCS::::', docs)
    
                    docs.forEach(doc=>{
                        
                        let data = doc.data()
                        let id = doc.id
    
                        if(data.email === selectedContactEmail){
                            s({data, id})
                        }
    
                    })
                })
            })
        }
       
    

        getContacts(filter = '') {

            return new Promise((resolve, reject) => {
    
                User.getContactsRef(this.email).where('name', '>=', filter).onSnapshot(docs =>{
    
                    let conctats = [];
                    docs.forEach(doc => {
    
                        let data = doc.data();
    
                        data.id = doc.id;
    
                        conctats.push(data);
    
                    });
    
                    this.trigger('contactschange', docs)
    
                    resolve(conctats)
    
                });
    
            }); 
    
        }

}