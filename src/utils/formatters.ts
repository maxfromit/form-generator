const getUpperCasedDataKey = (dataKey?: string) =>
  dataKey ? dataKey.charAt(0).toUpperCase() + dataKey.slice(1) : ''

const replaceDashesWithSpaces = (text: string) =>
  text && typeof text === 'string' ? text.replace(/-/g, ' ') : ''

const convertDataKeyToTitle = (dataKey?: string) =>
  replaceDashesWithSpaces(getUpperCasedDataKey(dataKey))

export { convertDataKeyToTitle }
