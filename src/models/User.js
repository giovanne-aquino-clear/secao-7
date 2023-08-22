import firebase, { Firebase } from './../util/Firebase'
import { ClassEvents } from '../util/ClassEvents';

export  class User extends ClassEvents {

        static getRef(){

            return Firebase.db().collection('/users');
    
        }

        static findByEmail(email){

        return User.getRef().doc(email)

        }

}