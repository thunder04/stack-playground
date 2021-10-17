import Stack from './Stack.mjs'

function balancedParenthesis(str) {
    const stack = new Stack()

    for (var i = 0, len = str.length; i < len; ++i) {
        const token = str[ i ]

        switch (token) {
            case '(': case '{': case '[':
                stack.push(token)
                break
            case ')': case '}': case ']':
                if (stack.isEmpty())
                    return false

                const top = stack.peek()

                if (
                    (top === '(' && token !== ')') ||
                    (top === '{' && token !== '}') ||
                    (top === '[' && token !== ']')
                ) return false

                stack.pop()
        }
    }

    return stack.isEmpty()
}


console.log('balancedParenthesis', {
    '({{{{{{{{()()[]()[]}}}}}}}})': balancedParenthesis('({{{{{{{{()()[]()[]}}}}}}}})'),
    '{[(])}': balancedParenthesis('{[(])}')
})