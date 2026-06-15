export function serialize(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (typeof obj.toJSON === "function") {
    return obj.toJSON();
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => serialize(item));
  }
  const res: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      res[key] = serialize(obj[key]);
    }
  }
  return res;
}
