expect = require 'expect.js'
{render, tag, foo, bar} = require('..').bind('foo bar'.split(' '), 'tag')

describe 'custom tag', ->
  it 'should render', ->
    template = -> tag 'custom'
    expect(render template).to.equal '<custom></custom>'
  it 'should render empty given null content', ->
    template = -> tag 'custom', null
    expect(render template).to.equal '<custom></custom>'
  it 'should render with attributes', ->
    template = -> tag 'custom', foo: 'bar', ping: 'pong'
    expect(render template).to.equal '<custom foo="bar" ping="pong"></custom>'
  it 'should render with attributes and content', ->
    template = -> tag 'custom', foo: 'bar', ping: 'pong', 'zag'
    expect(render template).to.equal '<custom foo="bar" ping="pong">zag</custom>'
  it 'should render tag to hyphens', ->
    template = -> tag 'ngInclude', src: 'foo.html'
    expect(render template).to.equal '<ng-include src="foo.html"></ng-include>'
  it 'should render self defined tags', ->
    template = ->
      foo 'boo'
      bar 'kaa'
    expect(render template).to.equal '<foo>boo</foo><bar>kaa</bar>'
