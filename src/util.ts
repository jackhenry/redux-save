/**
 * Returns true if the passed value is "plain" object, i.e. an object whose
 * prototype is the root `Object.prototype`. This includes objects created
 * using object literals, but not for instance for class instances.
 *
 * @param {any} value The value to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 *
 * @public
 */
function isPlainObject(value: unknown): value is object {
  if (typeof value !== "object" || value === null) return false;

  let proto = Object.getPrototypeOf(value);
  if (proto === null) return true;

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}

/**
 * Tests if value is a plain type that can be serialized by redux
 * @param {any} value
 * @returns {boolean} True if argument is a plain type that can be serialized by redux
 */
function isPlain(value: any) {
  return (
    typeof value === "undefined" ||
    value === null ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "number" ||
    Array.isArray(value) ||
    isPlainObject(value)
  );
}

/**
 * Tests if argument is serializable by
 * @param value value to test if serializable by redux
 * @returns true if serializable by redux, otherwise false
 */
export const isSerializableByRedux = (value: any) => isPlain(value);
