'use client'
import Api from '../api/api';
import { islog } from '../auth/auth.api';

export async function isUserLog() {
	Api.init();
	let data = await islog();
	return data;
}

export function isPromise(p: any) {
	return p && Object.prototype.toString.call(p) === "[object Promise]";
  }
