export function isValidMessage(data: any) {
  return data && data.type && data.payLoad;
};