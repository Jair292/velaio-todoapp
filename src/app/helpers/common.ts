import { InjectionToken } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";

export const trackByFn = (index: number) => {
  return index;
}

export const FORM_SUBMIT_TOKEN = new InjectionToken<Subject<void> | BehaviorSubject<void>>('FORM_SUBMIT_TOKEN');
