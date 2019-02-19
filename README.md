# `@spearwolf/ecs`

An [entity component system](https://en.wikipedia.org/wiki/Entity_component_system) for javascript.

## What is a Component?

```js

@Component({
  name: 'foo'
})
class Foo {

  // constructor(entity)
  
  onHello = () => {
    console.log('moin moin!');
  };

  connectToEntity(entity) {
    entity.on('hello', this.onHello);
  }

  disconnectFromEntity(entity) {
    entity.off(this.onHello);
  }

  // destroy()

}

@Component({
  name: 'bar'
})
class Bar {

  // constructor(entity)

  hello() {
    console.log('hej!');
  }

  connectToEntity(entity) {
    entity.on(this);
  }

  disconnectFromEntity(entity) {
    entity.off(this);
  }

  // destroy()

}

```

## What is an Entity and how does it play together?

```js

// first, you need a system
// .. and the system needs to know about the components
const ecs = new ECS([ Foo, Bar ]);

// then you can create an entity and attach some components to it
const entity = ecs.createEntity([Foo, Bar]);

// as a result you will get an object with 'foo' and 'bar' properties
// both properties are pointing to their component instances

entity.foo // is an instance of Foo
entity.bar // is an instance of Bar

entity.id // each entity has an unique id!

// now we can play with our entity ..

entity.bar.hello() // => 'hej!'

entity.emit('hello') // emit the event 'action'

// => 'moin moin!'
// => 'hej!'

```
