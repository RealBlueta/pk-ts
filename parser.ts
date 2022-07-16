import { todo } from './index.ts';
import { OPERATORS, Token, TokenType } from './lexer.ts';

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

type Operator = '+' | '-' | '/' | '*' | '%';
export class BinaryNode extends Node {
    private type = 'binary_node';
    constructor(public lhs: Node, public op: Operator, public rhs: Node) {
        super();
    }
}

export class LiteralNode extends Node {
    private type = 'literal_node';
    constructor(public value: string | number) {
        super();
    }
}

export class GroupedExpressionNode extends Node {
    private type = 'grouped_expression_node';
    constructor(public expression?: Node) {
        super();
    }
}

// Parser
export class Parser {
    private tokens: Token[] = [];
    private body: BlockNode = new BlockNode;
    // deno-lint-ignore no-inferrable-types
    private cursor: number = 0;

    // Parse Function
    private parse_integer(): Node {
        return new LiteralNode(this.get_token().value);
    }

    private parse_string(): Node {
        return new LiteralNode(this.get_token().value);
    }

    private parse_identifier(): Node {
        throw todo('ast identifier');
    }

    private parse_operator(): Node {
        const op = this.get_token().value;
        this.eat(); // eat op tok

        if (!(OPERATORS.includes(op))) throw new Error('invalid operator: ' + op);

        const lhs = this.body.pop_node();
        if (!lhs) {
            throw todo('implement left hand operator');
        }

        const rhs = this.parse_expression();
        if (!rhs) throw new Error('invalid binary operation, missing right hand side');

        return new BinaryNode(lhs!, op, rhs);
    }

    private parse_left_paren(): Node {
        this.eat(); // eat left paren tok
        const paren_expr = new GroupedExpressionNode;
        const block = new BlockNode;
        while (!this.is_eof() && !this.is_right_paren()) {
            block.push_node(this.parse_expression());
            this.eat();
        }
        if (this.is_eof() || !this.is_right_paren()) 
            throw new Error('Expected ) but got ' + (this.get_token() || 'EOF'));
        paren_expr.expression = block;
        return paren_expr;
    }

    private parse_right_paren(): Node {
        throw new Error('Unexpected Right Paren');
    }

    private parse_expression(): Node {
        const token = this.get_token();
        if (!token)
            throw new Error('eof?');
        switch (token.type) {
            case TokenType.Integer: return this.parse_integer();
            case TokenType.String: return this.parse_integer();
            case TokenType.Identifier: return this.parse_identifier();
            case TokenType.Operator: return this.parse_operator();
            case TokenType.LeftParen: return this.parse_left_paren();
            case TokenType.RightParen: return this.parse_right_paren();
            default: throw todo(`unexpected (token::${token.type} -> { ${token.value} })`);
        }
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
            this.body.push_node(this.parse_expression());
            this.eat();
        }
        return this.body;
    }
}