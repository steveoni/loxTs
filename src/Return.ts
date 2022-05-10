export default class Return extends Error {
  readonly value: any

  constructor(value: any) {
    super(null)
    this.value = value
    this.name = "Return Error"
  }
}