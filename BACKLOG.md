
BACKLOG
=======

## Milestone v1.0

### Features

- [ ] `@Component`
  - [ ] make :name optional (use classname by default)
  - [ ] defaultConfig
  - [ ] add annotations for: initialize, destroy, connect, disconnect, entity...
- [ ] improve Children component:
  - [ ] extend from Array! see https://javascript.info/extend-natives
  - [ ] add optional [_pre_, _post_] events to `deepEmit(..)` ?
- [ ] `ECS`: queries/selectors: _filter by components_ ...
- [ ] `ECS`: export all entites (and do NOT export recursive entities from children component)
- [ ] create documentation for all features (see https://ecsy.io for a good example)
- [ ] add property annotations (see TODOs from source)
- [ ] refactor component.getEntity() to `Component.getEntity(component)`
- [ ] createEntity: allow custom component property names, eg: attachComponent(entity, 'kinder', Children)

## Milestone NEXT

- typescript support (transform all?)
- react-conciler

