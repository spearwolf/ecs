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
