# `@spearwolf/ecs`

An [entity component system](https://en.wikipedia.org/wiki/Entity_component_system) for javascript.

## What does a Component look like?

```js

@Component({
  name: 'foo'
})
class Foo {

  hello() => {
    console.log('moin moin!');
  };

  connectToEntity(entity) {
    entity.on('hello', this);
  }

  disconnectFromEntity(entity) {
    entity.off(this);
  }

}

@Component({
  name: 'bar'
})
class Bar {

  initialize(message) {
    this.message = message;
  }

  sayHello = () => {
    console.log(this.message);
  }

  connectToEntity(entity) {
    entity.on('hello', this.sayHello);
  }

  disconnectFromEntity(entity) {
    entity.off(this.sayHello);
  }

  // destroy()

}

```

## What is an Entity and how does it play together?

```js

// first, you need an entrypoint
// .. where you can register your components
const ecs = new ECS([ Foo, Bar ]);

// then you can create an entity and attach some components to it
const entity = ecs.createEntity([
  Foo,
  [Bar, "hej!"], // our Bar component needs some configuration
]);

// as a result you will get an object with 'foo' and 'bar' properties
// both properties are pointing to their component instances

entity.foo // is an instance of Foo
entity.bar // is an instance of Bar

entity.id // each entity has an unique id!

// now we can play with our entity ..

entity.bar.sayHello() // => 'hej!'

entity.emit('hello') // emit the event 'action'

// => 'moin moin!'
// => 'hej!'

```
