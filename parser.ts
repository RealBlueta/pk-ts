import { Token, TokenType } from './lexer.ts';

// Nodes
export class Node {
    constructor() {}
}

export class BlockNode extends Node {
    public nodes: Node[];
    constructor() {
        super();
        this.nodes = [];
    }

    push_node(node: Node): number {
        return this.nodes.push(node);
    }

    pop_node(): Node | undefined {
        return this.nodes.pop();
    }
}

export class BinaryNode extends Node {
    constructor(public lhs: Node, public rhs: Node, public op: string) {
        super();
    }
}

export class LiteralNode extends Node {
    constructor(public value: string | number) {
        super();
    }
}

// Todo
function todo(...args: unknown[]) {
    console.assert(false, ...args);
    Deno.exit(1);
}

// Parser
export class Parser {
    private tokens: Token[] = [];
    private body: BlockNode = new BlockNode;
    // deno-lint-ignore no-inferrable-types
    private cursor: number = 0;

    // Parse Function
    private advance_parse() {
        const token = this.current_token();
        switch (token.type) {
            case TokenType.Integer: {
                this.body.push_node(new LiteralNode(token.value));
                this.cursor += 1;
            } break;

            case TokenType.String: {
                this.body.push_node(new LiteralNode(token.value));
                this.cursor += 1;
            } break;

            case TokenType.Identifier: {
                todo('ast identifier');
            } break;

            case TokenType.Operator: {
                const op = token.value;
                this.cursor += 1; // consume op

                const lhs = this.body.pop_node();
                if (!lhs) {
                    todo('implement left hand operator');
                }

                this.advance_parse();

                const rhs = this.body.pop_node();
                if (!rhs) throw new Error('invalid binary operation, missing right hand side');

                this.body.push_node(new BinaryNode(lhs!, rhs, op));
            } break;

            case TokenType.Parenthesis: {
                todo('ast parens');
            } break;

            default: {
                todo(`unexpected (token::${token.type} -> { ${token.value} })`);
            } break;
        }
    }

    // Other
    private current_token(): Token {
        return this.tokens[this.cursor];
    }

    private peek(): Token {
        return this.tokens[this.cursor + 1];
    }

    static parse(tokens: Token[]): BlockNode {
        return new Parser().parse(tokens);
    }

    parse(tokens: Token[]): BlockNode {
        this.tokens = tokens;
        this.body = new BlockNode;
        this.cursor = 0;
        while (this.cursor < this.tokens.length) {
            this.advance_parse();
        }
        return this.body;
    }
}