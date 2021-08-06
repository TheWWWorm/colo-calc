import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public get<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key));
  }

  public set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

}
