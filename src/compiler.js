import { lexer,parser } from './parser.js';
import { transformer } from './transformer.js';
import { generator } from './generator.js';

var SBN = {}

SBN.VERSION = '0.5.6'
SBN.lexer = lexer
SBN.parser = parser
SBN.transformer = transformer
SBN.generator = generator

SBN.compile = function (code) {
  return this.generator(this.transformer(this.parser(this.lexer(code))))
}

export default SBN

var code = 'Paper 95\nPen 1\nLine 50 15 85 80\nPen 30\nLine 85 80 15 80\nPen 70\nLine 15 80 50 15'
console.log(parser(lexer(code)));
var svg = SBN.compile(code)
var tag=document.getElementById("hello");
tag.innerHTML=svg;
