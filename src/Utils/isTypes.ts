// src/Utils/isGenericType.ts
// eslint-disable-next-line @typescript-eslint/ban-types
export type GenericType = string | number | object | undefined | null;

export function isGenericType(type: GenericType): type is GenericType {
  if (
    typeof type === 'string' ||
    typeof type === 'number' ||
    typeof type === 'undefined' ||
    type === null
  ) {
    return false;
  }

  return false;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function isObjectType<T extends {}>(
  inputObj: T | GenericType,
  key: keyof T,
): inputObj is T {
  if (isGenericType(inputObj)) {
    return false;
  }

  if (key in inputObj) {
    return true;
  }

  return false;
}
