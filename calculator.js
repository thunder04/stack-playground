const PI_DIVIDED_BY_180 = Math.PI / 180

const CONSTANTS = {
    LOG10E: Math.LOG10E, LOG2E: Math.LOG2E, PI: Math.PI,
    E: Math.E, LN10: Math.LN10, LN2: Math.LN2,
    SQRT1_2: Math.SQRT1_2, SQRT2: Math.SQRT2,
    get RANDOM() { return Math.random() }
}

const FUNCTIONS = {
    abs: Math.abs, acos: Math.acos, acosh: Math.acosh, asin: Math.asin,
    asinh: Math.asinh, atan: Math.atan, atanh: Math.atanh, ceil: Math.ceil,
    cbrt: Math.cbrt, expm1: Math.expm1, clz32: Math.clz32, cos: Math.cos,
    cosh: Math.cosh, exp: Math.exp, floor: Math.floor, fround: Math.fround,
    log: Math.log, log1p: Math.log1p, log2: Math.log2, log10: Math.log10,
    round: Math.round, sign: Math.sign, sin: Math.sin, sinh: Math.sinh,
    sqrt: Math.sqrt, tan: Math.tan, tanh: Math.tanh, trunc: Math.trunc,
    rad: (a) => a * PI_DIVIDED_BY_180
}

const isAlphabetic = (token) => (token >= 'a' && token <= 'z') || (token >= 'A' && token <= 'Z');
const isAlphanumeric = (token) => isNumeric(token) || isAlphabetic(token);
const isNumeric = (token) => token >= '0' && token <= '9';

function getOPweight(op) {
    if (op in FUNCTIONS) return 4;

    switch (op) {
        case '+':
        case '-':
            return 1;
        case '*':
        case '/':
        case '%':
            return 2;
        case '^':
            return 3;
        default: return 0;
    }
}

function evaluate(op, stack) {
    const b = stack.pop();
    if (b == undefined) {
        throw 'Invalid infix expression';
    }

    if (op in FUNCTIONS) {
        return FUNCTIONS[ op ](b);
    }

    const a = stack.pop();
    if (a == undefined) {
        throw 'Invalid infix expression';
    }

    switch (op) {
        case '+': return a + b;
        case '-': return a - b;

        case '*': return a * b;
        case '/':
            if (b === 0) throw 'Dividend may not be divided by 0';
            return a / b;
        case '%': return a % b;

        case '^': return a ** b;
        default: throw `Unimplemented operator '${op}'`;
    }
}

function* infixToPostfix(exp) {
    const opStack = [];

    for (var i = 0, len = exp.length; i < len; ++i) {
        var token = exp[ i ];

        if (token === ' ' || token === '\n' || token === '\r')
            continue;

        if (token === '-' && i + 1 < len && isNumeric(exp[ i + 1 ])) {
            do token += exp[ ++i ];
            while (i + 1 < len && isNumeric(exp[ i + 1 ]));
            yield +token;
            continue;
        }

        if (isNumeric(token)) {
            while (i + 1 < len && isNumeric(exp[ i + 1 ]))
                token += exp[ ++i ];
            yield +token;
            continue;
        }

        if (isAlphabetic(token)) {
            while (i + 1 < len && isAlphanumeric(exp[ i + 1 ]))
                token += exp[ ++i ];

            if (token in CONSTANTS) {
                yield CONSTANTS[ token ];
                continue;
            }
        }

        const charWeight = getOPweight(token)

        if (charWeight) {
            var top;

            while (opStack.length !== 0 && (top = opStack[ opStack.length - 1 ]) !== '(' && (
                token === '^' ? getOPweight(top) > charWeight : getOPweight(top) >= charWeight
            )) yield opStack.pop();

            opStack.push(token);
        } else if (token === '(') {
            opStack.push(token);
        } else if (token === ')') {
            while (opStack.length !== 0 && opStack[ opStack.length - 1 ] !== '(')
                yield opStack.pop();

            if (opStack.pop() !== '(') throw 'Cannot parse an expression with unbalanced parentheses';
        } else throw `Unexpected token '${token}' at position ${(i + 1) - token.length}`;
    }

    while (opStack.length !== 0)
        yield opStack.pop();
}

function infixEvaluate(exp) {
    const stack = []

    for (const token of infixToPostfix(exp)) {
        if (typeof token === 'number')
            stack.push(token)
        else if (getOPweight(token))
            stack.push(evaluate(token, stack));
    }

    return stack.pop() ?? null;
}

[
    '((112 + 566 * (477 / 442) - 100) * 50 ^ 0) + 1 % 10',
    '(112 + 566) * (477 / 442) - 100',

    'tan(sqrt((3 ^ (2 * 10)) + 6 ^ 3) + 2)',
    'tan(sqrt((3 ^ 2 * 10) + 6 ^ 3) + 2)',
    'log10(100)',

    'RANDOM * 10 / PI',
    'LN2 + E',

    '2 ^ 3 ^ 4',
    '0 ^ 1',
    '1 ^ 0',

    '-5 + -10',
    '10 - -20',
    '10 - 20',
    '10--20',
    '-20',
].forEach(exp => console.log(`${exp} ->`, infixEvaluate(exp)))