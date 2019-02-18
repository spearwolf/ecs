# `@spearwolf/ecs`

An _entity component system_ library for javascript.

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

## What is an Entity and how does play together?

```js

// first, you need a system
// .. and the system needs to know your components
const ecs = new ECS([ Foo, Bar ]);

// then you can create an entity with your components
const entity = ecs.createEntity([Foo, Bar]);

// as result you will get an object with 'foo' and 'bar' properties
// both props are pointing to their components intances

entity.foo // is an instance of Foo
entity.bar // is an instance of Bar

entity.id // each entity has an unique id!

// now we can play with our entity ..

entity.bar.hello() // => 'hej!'

entity.emit('action') // emit the event 'action'

// => 'moin moin!'
// => 'hej!'

```
