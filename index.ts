import { Lexer, Token } from './lexer.ts';
import { Parser, BlockNode } from './parser.ts';

export function todo(...args: string[]) {
    const err: Error = new Error(...args);
    err.stack = undefined;
    return err;
}

function main(): number {
    const tokens: Token[] = Lexer.lex("(1 + 5 / 2)");
    const ast: BlockNode = Parser.parse(tokens);
    console.log('AST:');
    console.log(ast);
    Deno.writeTextFileSync('ast.json', JSON.stringify(ast, null, 4))
    return 0;
}

Deno.exit(main());