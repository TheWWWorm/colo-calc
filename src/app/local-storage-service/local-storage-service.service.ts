import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key));
  }

  public getUnparsed(key: string): string {
    return localStorage.getItem(key);
  }

  public set<T>(key: string, value: T) {
    let parsable = true;
    try {
      JSON.parse(value as unknown as string);
    } catch (error) {
      parsable = false;
    }
    localStorage.setItem(key, parsable ? value as unknown as string : JSON.stringify(value));
  }

}
