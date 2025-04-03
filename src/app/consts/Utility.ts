export function stringiFy(value:any) {
    if (value === undefined) {
      return "";
    }
    if (value === "0") {
      return "";
    }
    return value;
  }