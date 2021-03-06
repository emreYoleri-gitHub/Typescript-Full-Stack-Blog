import firebase from 'firebase/compat';
import { auth } from '../config/firebase';
import IUser from '../interfaces/user';
import axios from 'axios';
import config from '../config/config';
import logging from '../config/logging';

export const SignInWithSocialMedia = (provider: firebase.auth.AuthProvider) =>
    new Promise<firebase.auth.UserCredential>((resolve, reject) => {
        auth.signInWithPopup(provider)
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });

export const Authenticate = async (uid: string, name: string, fire_token: string, callback: (error: string | null, user: IUser | null) => void) => {
    try {
        const response = await axios({
            method: 'POST',
            url: `${config.server.url}/users/login`,
            data: {
                uid,
                name
            },
            headers: { authorization: `Bearer ${fire_token}` }
        });

        /*  axios.post(`${config.server.url}/users/login` , {uid,name} , {
            headers : {
                authorization: `Bearer ${fire_token}`
            }
        }) */

        if (response.status === 200 || response.status === 201 || response.status === 304) {
            logging.info('Successfuly authenicated. ');
            callback(null, response.data.user);
        } else {
            logging.warn('Unable to authenicate.');
            callback('Unable to authenicate.', null);
        }
    } catch (error) {
        logging.error(error);
        callback('Unable to authenicate.', null);
    }
};

export const Validate = async (fire_token: string, callback: (error: string | null, user: IUser | null) => void) => {
    try {
        const response = await axios.get(`${config.server.url}/users/validate`, {
            headers: {
                authorization: `Bearer ${fire_token}`
            }
        });

        if (response.status === 200 || response.status === 304) {
            logging.info('Successfuly validated. ');
            callback(null, response.data.user);
        } else {
            logging.warn('Unable to validate.');
            callback('Unable to validate.', null);
        }
    } catch (error) {
        logging.error(error);
        callback('Unable to validate.', null);
    }
};
