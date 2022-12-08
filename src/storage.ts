export default class {
  public static setItem(itemId: string, state: any) {
    const stateString = JSON.stringify(state)
    localStorage.setItem(itemId, stateString)
    const storageEvent = new CustomEvent('storage', { detail: state })
    window.dispatchEvent(storageEvent)
  }

  public static getItem(itemId: string) {
    const value = localStorage.getItem(itemId)
    if (!value) return null
    return JSON.parse(value)
  }
}
