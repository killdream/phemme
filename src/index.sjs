// Copyright (c) 2014 Quildreen Motta
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * A small, portable functional language for writing highly concurrent web servers.
 *
 * @module phemme
 */

var read      = require('fs').readFileSync;
var path      = require('path');
var vm        = require('vm');
var escodegen = require('escodegen');
var Parser    = require('./parser').Parser;
var Compiler  = require('./compiler').Compiler;

var doSource = exports = module.exports = function(program) {
  return generate(compile(parse(program)))
};

exports.parse = parse;
function parse(text) {
  return Parser.matchAll(text, 'program')
}

exports.compile = compile;
function compile(ast) {
  return Compiler.match(ast, 'cc')
}

exports.generate = generate;
function generate(ast) {
  return escodegen.generate(ast)
}

exports.run = run;
function run(code) {
  var source  = prelude() + ';\n' + doSource(code) + ';\n' + runner();
  var context = vm.createContext({ process: process
                                 , console: console
                                 , global:  {}
                                 , module:  { exports: {} }})
  vm.runInNewContext(source, context)
}

exports.prelude = prelude
function prelude() {
  return read(path.join(__dirname, '../runtime/index.js'), 'utf-8')
}

function runner() {
  return 'module.exports().main(process.argv.slice(2))'
}
