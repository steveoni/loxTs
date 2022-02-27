import { write, writeFileSync } from 'fs';

export default class GenerateAst {
  constructor(args: string[]) {
    if (args.length != 1) {
      console.log("Usage: generate_ast <output directory>")
      process.exit(64)
    }
    const outputDir = args[0];
    GenerateAst.defineAst(outputDir, 'Expr',  {
      Binary   : "left: Expr, operator: Token, right: Expr",
      Grouping : "expression: Expr",
      Literal  : "value: string | number | boolean",
      Unary    : "operator: Token, right: Expr"
    });
  }

  private static defineAst(outputDir: string, baseName: string, types: {[key: string]: string}): void {
    const path = outputDir + "/" + baseName + ".ts";
    const writer = []
    writer.push('import { Token } from "./tokens";\n\n\n')
    writer.push(`export interface ${baseName} {\n`)
    writer.push(`  accept<R>(visitor: Visitor<R>): R\n`)
    writer.push(`}\n\n`)

    GenerateAst.defineVisitor(writer, baseName, types);

    for (const className of Object.keys(types)) {
      const fields = types[className]
      GenerateAst.defineType(writer, baseName, className, fields)
    }

    writeFileSync(path, writer.join(""))
  }

  private static defineType(writer: string[], baseName, className: string, fieldList: string): void {
    const fields: string[] = fieldList.split(", ")
    writer.push(`export class ${className + baseName } implements ${baseName} {\n`)
    for(const field of fields) {
      writer.push(`  ${field}\n`)
    }

    writer.push(`  constructor ( ${fieldList} ) {\n`)
    for( const field of fields) {
      const name: string = field.split(":")[0]
      writer.push(`    this.${name} = ${name};\n`);
    }
    writer.push("  }\n\n")

    writer.push("  accept<R>(visitor: Visitor<R>): R{\n")
    writer.push(`    return visitor.visit${className + baseName} (this);\n`)
    writer.push(`  }\n`)

    writer.push("}\n\n")
  }

  private static defineVisitor(writer: string[], baseName: string, types: {[key: string]: string}): void {
    writer.push("export interface Visitor<R> {\n");

    for (const type of Object.keys(types)) {
      writer.push(`  visit${type}${baseName} ( expr: ${type}${baseName} ): R\n`)
    }
    writer.push("  }\n\n")
  }

  
}