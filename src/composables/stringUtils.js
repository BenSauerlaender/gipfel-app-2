export function useStringUtils() {
  const truncate = (str, length) => {
    if (!str || str.length <= length) return str
    return str.slice(0, length - 3) + '...'
  }

  return { truncate }
}
