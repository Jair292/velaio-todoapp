import { ToDo, Person } from "../models/todo";

export const trackByFn = (index: number, item: ToDo | Person | string): number | string => {
    if (typeof item == "string") {
      return item;
    } else if ("id" in item) {
      return item.id;
    } else if ("name" in item) {
      return item.name;
    }

    return index;
}
