/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';

import getComponentName from '../getComponentName';
import { Children } from '../../components';

describe('getComponentName', () => {
  describe('component constructor', () => {
    it('componentName as static function', () => {
      assert.strictEqual(getComponentName(Children), Children.componentName);
    });
    it('componentName as static property', () => {
      class C { }
      C.componentName = 'foo';
      assert.strictEqual(getComponentName(C), 'foo');
    });
  });
  it('string', () => {
    assert.strictEqual(getComponentName('bar'), 'bar');
  });
  it('other values should return undefined', () => {
    assert.strictEqual(getComponentName(), undefined);
    assert.strictEqual(getComponentName(null), undefined);
    assert.strictEqual(getComponentName({}), undefined);
    assert.strictEqual(getComponentName(function () {}), undefined); // eslint-disable-line
    assert.strictEqual(getComponentName(class {}), undefined);
  });
});
