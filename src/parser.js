export function lexer (code) {
    var _tokens = code
                    .replace(/[\n\r]/g, ' *nl* ') //removes any new line spaces
                    .split(/[\s]+/) //split based on white spaces
    var tokens = []
    for (var i = 0; i < _tokens.length; i++) {
      var t = _tokens[i]
      if(t.length <= 0 || isNaN(t)) {
        if (t === '*nl*') {
          tokens.push({type: 'newline'})
        } else if(t.length > 0) {
          tokens.push({type: 'word', value: t})
        }
      } else {
        tokens.push({type: 'number', value: t})
      }

    }
 
    if (tokens.length < 1) {
      throw 'No Tokens Found. Try "Paper 10"'
    }
    return tokens
  }

  
  export function parser (tokens) {

    function createDot (current_token, currentPosition, node) {
      var expectedType = ['ob', 'number', 'cb']
      var expectedLength = 4
      currentPosition = currentPosition || 0
      node = node || {type: 'dot'}
  
      if (currentPosition < expectedLength - 1) {
        if (expectedTypeCheck(current_token.type, expectedType[currentPosition])){
          if(currentPosition === 1) {
            node.x = current_token.value
          }
          if(currentPosition === 2) {
            node.y = current_token.value
          }
          currentPosition++
          createDot(tokens.shift(), currentPosition, node)
        } else {
          throw 'Expected ' + expectedType[currentPosition] + ' but found ' + current_token.type + '.'
        }
      }
      return node
    }
  
    function findArguments(command, expectedLength, currentPosition, currentList) {
      currentPosition = currentPosition || 0
      currentList = currentList || []
      while (expectedLength > currentPosition) {
        var token = tokens.shift()

        //error handling
        if (!token) {
          throw command + ' takes ' + expectedLength + ' argument(s). '
        }

        var arg = {
          type: token.type,
          value: token.value
        }
        currentList.push(arg)
        currentPosition++
      }
      return currentList
    }
  
    var AST = {
      type: 'Scribble',
      body: []
    }
    var paper = false
    var pen = false
  
    while (tokens.length > 0) {
      var current_token = tokens.shift()
      if (current_token.type === 'word') {
        switch (current_token.value) {
          case 'Paper' :
            if (paper) {
              throw 'You can not define Paper more than once'
            }
            var expression = {
              type: 'CallExpression',
              name: 'Paper',
              arguments: []
            }
            var args = findArguments('Paper', 1)
            expression.arguments = expression.arguments.concat(args)
            AST.body.push(expression)
            paper = true
            break
          case 'Pen' :
            var expression = {
              type: 'CallExpression',
              name: 'Pen',
              arguments: []
            }
            var args = findArguments('Pen', 1)
            expression.arguments = expression.arguments.concat(args)
            AST.body.push(expression)
            pen = true
            break
          case 'Line':
            if(!paper) {
              // throw 'Please make Paper 1st'
              // TODO : no error message 'You should make paper first'
            }
            if(!pen) {
              // throw 'Please define Pen 1st'
              // TODO : no error message 'You should set pen color first'
            }
            var expression = {
              type: 'CallExpression',
              name: 'Line',
              arguments: []
            }
            var args = findArguments('Line', 4)
            expression.arguments = expression.arguments.concat(args)
            AST.body.push(expression)
            break
          default:
            throw current_token.value + ' is not a valid command'
        }
      } else if (['newline', 'ocb', 'ccb'].indexOf[current_token.type] < 0 ) {
        throw 'Unexpected token type : ' + current_token.type
      }
    }
    return AST
  }