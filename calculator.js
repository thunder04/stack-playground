const CONSTANTS = {
    get RANDOM() { return Math.random() },
    PI: Math.PI,
    E: Math.E
}

const isAlphabetic = (ch) => (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
const isSpace = (ch) => ch === ' ' || ch === '\n' || ch === '\r';
const isAlphanumeric = (ch) => isNumeric(ch) || isAlphabetic(ch);
const isNumeric = (ch) => ch >= '0' && ch <= '9';

function getOPweight(op) {
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
        case 'floor': case 'ceil': case 'sqrt':
        case 'tan': case 'abs': case 'cos':
        case 'log': case 'sin': case 'tan':
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
            if (b === 0) throw 'Dividend may not be divided by 0';
            return a / b;
        case '%': return a % b;

        case '^': return a ** b;

        case 'floor': return Math.floor(a)
        case 'ceil': return Math.ceil(a)
        case 'sqrt': return Math.sqrt(a)
        case 'tan': return Math.tan(a)
        case 'abs': return Math.abs(a)
        case 'cos': return Math.cos(a)
        case 'log': return Math.log(a)
        case 'sin': return Math.sin(a)
        case 'tan': return Math.tan(a)
        default: throw `Unknown operator '${op}'`;
    }
}

function* infixToPostfix(exp) {
    const opStack = [];

    for (var i = 0, len = exp.length; i < len; ++i) {
        var token = exp[ i ];

        if (isSpace(token))
            continue;

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
            var top = opStack[ opStack.length - 1 ];

            while (opStack.length !== 0 && top !== '(' && getOPweight(top) >= charWeight) {
                yield opStack.pop();
                top = opStack[ opStack.length - 1 ];
            }

            opStack.push(token);
        } else if (token === '(') {
            opStack.push(token);
        } else if (token === ')') {
            while (opStack.length !== 0 && opStack[ opStack.length - 1 ] !== '(')
                yield opStack.pop();

            if (opStack.pop() !== '(') throw 'Cannot parse an expression with mismatched parenthesis';
        } else throw `Unexpected token '${token}' in position ${i}`;
    }

    while (opStack.length !== 0)
        yield opStack.pop();
}
function infixEvaluate(exp) {
    const stack = []

    for (const token of infixToPostfix(exp)) {
        if (typeof token === 'number') {
            stack.push(token)
            continue
        }

        if (getOPweight(token)) {

        }
    }

    return stack.pop() || 0;
}

infixEvaluate('tan(sqrt((3 ^ 2 * 2) + 4 ^ 2))')


function infixEvaluatee(exp) {
    const opStack = [];

    for (const token of infixToPostfix(exp)) {
        switch (typeof token) {
            case 'number':
                opStack.push(token);
                break;
            case 'function':
                console.log(opStack)
                //What to do here???
                break;
            case 'string':
                if (getOPweight(token) > 0) {
                    const op2 = opStack.pop(), op1 = opStack.pop();

                    if (op1 === undefined || op2 === undefined)
                        throw new Error('Invalid expression');
                    opStack.push(evaluate(token, op1, op2));
                }
        }
    }

    return opStack.pop() || 0;
}

//console.log(infixEvaluate('((112 + 566 * (477 / 442) - 100) * 50 ^ 0) + 1 % 10'));
//console.log(infixEvaluate('(112 + 566) * (477 / 442) - 100'));
//console.log(infixEvaluate('RANDOM * 10 / PI'));