function balancedParenthesis(str) {
    const stack = []

    for (var i = 0, len = str.length; i < len; ++i) {
        const token = str[ i ]

        switch (token) {
            case '(': case '{': case '[':
                stack.push(token)
                break
            case ')': case '}': case ']':
                if (stack.length === 0)
                    return false

                const top = stack[ stack.length - 1 ]

                if (
                    (top === '(' && token !== ')') ||
                    (top === '{' && token !== '}') ||
                    (top === '[' && token !== ']')
                ) return false

                stack.pop()
        }
    }

    return stack.length === 0
}


console.log('balancedParenthesis', {
    '({{{{{{{{()()[]()[]}}}}}}}})': balancedParenthesis('({{{{{{{{()()[]()[]}}}}}}}})'),
    '{[(])}': balancedParenthesis('{[(])}')
})