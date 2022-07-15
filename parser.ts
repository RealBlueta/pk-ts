import { Token, TokenType } from './lexer.ts';

// Nodes
export class Node {
    constructor() {}
}

export class BlockNode extends Node {
    private type = 'block_node';
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
    private type = 'binary_node';
    constructor(public lhs: Node, public rhs: Node, public op: string) {
        super();
    }
}

export class LiteralNode extends Node {
    private type = 'literal_node';
    constructor(public value: string | number) {
        super();
    }
}

// Todo
function todo(...args: unknown[]) {
    console.assert(false, 'Parser', ...args);
    Deno.exit(1);
}

// Parser
export class Parser {
    private tokens: Token[] = [];
    private body: BlockNode = new BlockNode;
    // deno-lint-ignore no-inferrable-types
    private cursor: number = 0;

    // Parse Function
    private parse_node(): Node {
        const token = this.get_token();
        switch (token.type) {
            case TokenType.Integer: {
                return new LiteralNode(token.value);
            } 

            case TokenType.String: {
                return new LiteralNode(token.value);
            } 

            case TokenType.Identifier: {
                todo('ast identifier');
            } break;

            case TokenType.Operator: {
                const op = token.value;
                this.eat(); // consume op

                const lhs = this.parse_node();
                if (!lhs) {
                    todo('implement left hand operator');
                }

                const rhs = this.parse_node();
                if (!rhs) throw new Error('invalid binary operation, missing right hand side');

                return new BinaryNode(lhs, rhs, op);
            } 

            case TokenType.LeftParen: {
                this.eat(); // eat left paren
                const paren_block = new BlockNode;
                while (!this.is_eof() && !this.is_right_paren()) {
                    paren_block.push_node(this.parse_node());
                    this.eat();
                }
                if (this.is_eof() || !this.is_right_paren()) 
                    throw new Error('Expected ) but got ' + (this.get_token() || 'EOF'));
                return paren_block;
            } 

            case TokenType.RightParen: {
                throw new Error('Unexpected Right Paren');
            } 

            default: {
                throw todo(`unexpected (token::${token.type} -> { ${token.value} })`);
            } 
        }
        throw new Error('unexpected AST???');
    }

    // is
    private is_eof(): boolean {
        return !this.get_token();
    }

    private is_left_paren(): boolean {
        return this.get_token() && this.get_token().type == TokenType.LeftParen;
    }

    private is_right_paren(): boolean {
        return this.get_token() && this.get_token().type == TokenType.RightParen;
    }

    // Other
    private get_token(offset = 0): Token {
        return this.tokens[this.cursor + offset];
    }

    private eat(): void {
        this.cursor += 1; 
    }

    static parse(tokens: Token[]): BlockNode {
        return new Parser().parse(tokens);
    }

    parse(tokens: Token[]): BlockNode {
        this.tokens = tokens;
        this.body = new BlockNode;
        this.cursor = 0;
        while (this.cursor < this.tokens.length) {
            this.body.push_node(this.parse_node());
            this.eat();
        }
        return this.body;
    }
}