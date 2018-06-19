// @flow

export function stringToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== str.length; ++i) {
    view[i] = str.charCodeAt(i) & 0xff;
  }
  return buf;
}

export function arrayBufferToBinaryString(content: ArrayBuffer): string {
  const bytes = new Uint8Array(content);
  const length = bytes.byteLength;
  let binary = '';
  let i = -1;
  while (++i < length) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}
