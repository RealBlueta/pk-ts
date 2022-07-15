import { Lexer, Token } from './lexer.ts';
import { Parser, BlockNode } from './parser.ts';

function main(): number {
    const tokens: Token[] = Lexer.lex("11 + 13");
    const ast: BlockNode = Parser.parse(tokens);
    console.log('AST:');
    console.log(ast);
    Deno.writeTextFileSync('ast.json', JSON.stringify(ast, null, 4))
    return 0;
}

Deno.exit(main());