import { todo } from './index.ts';

// Location
class Location {
    constructor(public cursor: number, public row: number, public col: number) {}
    format(file: string): string { return `${file}:${this.row}:${this.col}`; }
    clone(): Location { return new Location(this.cursor, this.row, this.col); }
}

// Token
export enum TokenType {
    Integer = 'integer',
    String = 'string',
    Identifier = 'identifier',
    Operator = 'operator',
    LeftParen = 'left_paren',
    RightParen = 'right_paren'
}

export class Token {
    // deno-lint-ignore no-explicit-any
    public constructor(public type: TokenType, public location: Location, public value?: any) {}
}

// Lexums
export const NEW_LINE: string[] = '\n\r'.split('');
export const NUMBERS: string[] = '0123456789'.split('');
export const ALPHABET: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'.split(''); 
export const OPERATORS: string[] = '+-/*%'.split('');
export const STRING_LITERALS: string[] = '\'"'.split('');
export const PARENTHESIS: string[] = '()'.split('');
export const BRACKETS: string[] = '{}[]'.split('');

// Lexer
export class Lexer {
    private src = "";
    private location: Location = new Location(0, 0, 0);
    private tokens: Token[] = [];

    // Lex Functions
    private lex_space(): void {
        this.increment();
    }

    private lex_newline(): void {
        this.location.row++;
        this.increment();
        this.location.col = 0;
    }
    
    private lex_operator(): void {
        this.tokens.push(new Token(TokenType.Operator, this.location.clone(), this.get_char()));
        this.increment();
    }

    private lex_numbers(): void {
        let number = '';
        while (NUMBERS.includes(this.get_char())) {
            number += this.get_char();
            this.increment();
        }
        this.tokens.push(new Token(TokenType.Integer, this.location.clone(), Number(number)));
    }

    private lex_identifier(): void {
        throw todo('implemenet identifier');
    }

    private lex_string(): void {
        throw todo('implemenet string');
    }

    private lex_parens(): void {
        const paren = this.get_char();
        let type: TokenType;
        if (paren == '(') type = TokenType.LeftParen; 
        if (paren == ')') type = TokenType.RightParen; 
        this.tokens.push(new Token(type!, this.location.clone()));
        this.increment();
    }

    private lex_brackets(): void {
        throw todo('implemenet brackets');
    }

    // Other
    private get_char(offset = 0): string {
        return this.src[this.location.cursor + offset];
    }

    private increment(): void {
        this.location.col++;
        this.location.cursor++;
    }

    static lex(src: string): Token[] {
        return new Lexer().lex(src);
    }

    lex(src: string): Token[] {
        this.src = src;
        this.location = new Location(0, 0, 0);
        this.tokens = [];
        while (this.location.cursor < this.src.length) {
            if ([' '].includes(this.get_char())) { this.lex_space(); }
            if (NEW_LINE.includes(this.get_char())) { this.lex_newline(); continue; }
            if (OPERATORS.includes(this.get_char())) { this.lex_operator(); continue; }
            if (NUMBERS.includes(this.get_char())) { this.lex_numbers(); continue; }
            if (ALPHABET.includes(this.get_char())) { this.lex_identifier(); continue; }
            if (STRING_LITERALS.includes(this.get_char())) { this.lex_string(); continue; }
            if (PARENTHESIS.includes(this.get_char())) { this.lex_parens(); continue; }
            if (BRACKETS.includes(this.get_char())) { this.lex_brackets(); continue; }
            throw todo('implement', this.get_char());
        }
        return this.tokens;
    }
}