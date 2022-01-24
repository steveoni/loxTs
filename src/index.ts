import Lox from "./lox"

function main(){
  const args = process.argv.slice(2)
  const code = new Lox(args)
}
main()