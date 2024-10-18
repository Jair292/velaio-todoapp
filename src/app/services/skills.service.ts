import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  #http = inject(HttpClient);

  requestSkills() {
    return this.#http.get<string[]>('/api/skills')
  }
}
