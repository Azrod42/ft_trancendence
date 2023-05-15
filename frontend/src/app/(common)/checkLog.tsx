'use client'
import Api from '../api/api';
import { createContext } from 'vm';
import { islog } from '../auth/auth.api';


interface CheckLoginProps {

}

export  function isUserLog() {
	Api.init();
	let data = islog();
	return data;
}

export function isPromise(p: any) {
	return p && Object.prototype.toString.call(p) === "[object Promise]";
  }
