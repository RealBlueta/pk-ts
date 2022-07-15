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

// Todo
function todo(...args: unknown[]) {
    console.assert(false, 'Lexer:', ...args);
    Deno.exit(1);
}

// Lexums
const NEW_LINE: string[] = '\n\r'.split('');
const NUMBERS: string[] = '0123456789'.split('');
const ALPHABET: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'.split(''); 
const OPERATORS: string[] = '+-/*%'.split('');
const STRING_LITERALS: string[] = '\'"'.split('');
const PARENTHESIS: string[] = '()'.split('');
const BRACKETS: string[] = '{}[]'.split('');

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
        this.tokens.push(new Token(TokenType.Operator, this.location.clone(), this.current_char()));
        this.increment();
    }

    private lex_numbers(): void {
        let number = '';
        while (NUMBERS.includes(this.current_char())) {
            number += this.current_char();
            this.increment();
        }
        this.tokens.push(new Token(TokenType.Integer, this.location.clone(), Number(number)));
    }

    private lex_identifier(): void {
        todo('implemenet identifier');
    }

    private lex_string(): void {
        todo('implemenet string');
    }

    private lex_parens(): void {
        const paren = this.current_char();
        let type: TokenType;
        if (paren == '(') type = TokenType.LeftParen; 
        if (paren == ')') type = TokenType.RightParen; 
        this.tokens.push(new Token(type!, this.location.clone()));
        this.increment();
    }

    private lex_brackets(): void {
        todo('implemenet brackets');
    }

    // Other
    private current_char(): string {
        return this.src[this.location.cursor];
    }

    private peek(): string {
        return this.src[this.location.cursor + 1];
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
            if ([' '].includes(this.current_char())) { this.lex_space(); }
            if (NEW_LINE.includes(this.current_char())) { this.lex_newline(); continue; }
            if (OPERATORS.includes(this.current_char())) { this.lex_operator(); continue; }
            if (NUMBERS.includes(this.current_char())) { this.lex_numbers(); continue; }
            if (ALPHABET.includes(this.current_char())) { this.lex_identifier(); continue; }
            if (STRING_LITERALS.includes(this.current_char())) { this.lex_string(); continue; }
            if (PARENTHESIS.includes(this.current_char())) { this.lex_parens(); continue; }
            if (BRACKETS.includes(this.current_char())) { this.lex_brackets(); continue; }
            todo('implement', this.current_char());
            this.increment();
        }
        return this.tokens;
    }
}