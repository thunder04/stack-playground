const CONSTANTS = {
    get RANDOM() { return Math.random() },
    PI: Math.PI,
    E: Math.E
}

const FUNCTIONS = {
    floor: Math.floor,
    ceil: Math.ceil,
    sqrt: Math.sqrt,
    tan: Math.tan,
    abs: Math.abs,
    cos: Math.cos,
    log: Math.log,
    sin: Math.sin,
    tan: Math.tan
}

const isAlphabeticCharacter = (token) => (token >= 'a' && token <= 'z') || (token >= 'A' && token <= 'Z');
const isOpeningParenthesis = (token) => token === '(' || token === '[' || token === '{';
const isClosingParenthesis = (token) => token === ')' || token === ']' || token === '}';
const isNumericCharacter = (token) => token >= '0' && token <= '9';

function getOPweight(op) {
    switch (op) {
        // 1 is reserved for binary operators

        case '+':
        case '-':
            return 2;
        case '*':
        case '/':
        case '%':
            return 3;
        case '^':
            return 4;
        default: return 0;
    }
}

/**
 * @param {string} op 
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
function evaluate(op, a, b) {
    switch (op) {
        case '+': return a + b;
        case '-': return a - b;

        case '*': return a * b;
        case '/':
            if (b === 0) throw new Error('Dividend may not be divided by 0');
            return a / b;
        case '%': return a % b;

        case '^': return a ** b;
        default: throw new Error(`Unknown operator '${op}'`);
    }
}

/** @returns {Generator<string | number | function>} */
function* infixToPostfix(exp) {
    const stack = [];

    for (var i = 0, len = exp.length; i < len; ++i) {
        var token = exp[ i ];

        if (token === ' ') continue;

        if (isNumericCharacter(token)) {
            while (i + 1 < len && isNumericCharacter(exp[ i + 1 ]))
                token += exp[ ++i ];
            yield +token;
            continue;
        }

        if (isAlphabeticCharacter(token)) {
            while (i + 1 < len && isAlphabeticCharacter(exp[ i + 1 ]))
                token += exp[ ++i ];

            if (token in CONSTANTS) {
                yield CONSTANTS[ token ];
                continue;
            }

            if (token in FUNCTIONS) {
                yield FUNCTIONS[ token ];
                continue;
            }
        }

        const charWeight = getOPweight(token);

        if (charWeight > 0) {
            var top = stack[ stack.length - 1 ];

            while (stack.length !== 0 && !isOpeningParenthesis(top) && getOPweight(top) > charWeight) {
                yield stack.pop(); top = stack[ stack.length - 1 ];
            }

            stack.push(token);
        } else if (isOpeningParenthesis(token)) {
            stack.push(token);
        } else if (isClosingParenthesis(token)) {
            while (stack.length !== 0 && !isOpeningParenthesis(stack[ stack.length - 1 ])) {
                yield stack.pop();
            }

            stack.pop();
            break;
        } else throw new Error(`Unexpected token '${token}' in position ${i}`);
    }

    while (stack.length !== 0)
        yield stack.pop();
}

/**
 * @param {string} exp
 * @returns {number}
 */
function infixEvaluate(exp) {
    const stack = [];

    for (const token of infixToPostfix(exp)) {
        switch (typeof token) {
            case 'number':
                stack.push(token);
                break;
            case 'function':
                console.log(stack)
                //What to do here???
                break;
            case 'string':
                if (getOPweight(token) > 0) {
                    const op2 = stack.pop(), op1 = stack.pop();

                    if (op1 === undefined || op2 === undefined)
                        throw new Error('Invalid expression');
                    stack.push(evaluate(token, op1, op2));
                }
        }
    }

    return stack.pop() || 0;
}

console.log(infixEvaluate('((112 + 566 * (477 / 442) - 100) * 50 ^ 0) + 1 % 10'));
console.log(infixEvaluate('RANDOM * 10 / PI'));