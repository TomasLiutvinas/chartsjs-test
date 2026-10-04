import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { sourceResults, tomsen, rivals } from './data.js';
import { prepareDrivers, normaliseName, presetSelection } from './utils.js';

test('the complete seven-round source data and Tomas’s known result are preserved', () => {
  // Digest of all original names, points, and source order, verified against
  // graph.js at b30817e before extraction. Catch changes anywhere in the archive.
  assert.equal(createHash('sha256').update(JSON.stringify(sourceResults)).digest('hex'),
    '1181d11e2fd8bdb5773e702f644121972677cb087ef1b560a9670b072baf167d');
  assert.equal(sourceResults.length, 109);
  for (const driver of sourceResults) {
    assert.equal(driver.points.length, 7);
    assert.ok(driver.points.every(point => Number.isInteger(point) && point >= 0));
  }
  const drivers = prepareDrivers(sourceResults);
  const mine = drivers.find(driver => driver.name === tomsen);
  assert.deepEqual(mine.points, [17, 39, 20, 8, 8, 4, 18]);
  assert.deepEqual(mine.cumulative, [17, 56, 76, 84, 92, 96, 114]);
  assert.equal(mine.total, 114);
  assert.equal(mine.rank, 25);
  assert.equal(drivers[0].name, 'Zdislavas Giliunas');
  assert.equal(drivers[0].total, 281);
});

test('rank is based on points rather than legacy row order, with equal ranks for ties', () => {
  const source = [{ name: 'a', points: [3] }, { name: 'b', points: [7] }, { name: 'c', points: [7] }];
  const ranked = prepareDrivers(source);
  assert.deepEqual(ranked.map(driver => [driver.name, driver.rank]), [['b', 1], ['c', 1], ['a', 3]]);
  assert.deepEqual(source.map(driver => driver.name), ['a', 'b', 'c']);
});

test('presets include actual top scores, the original rivals, and the complete field', () => {
  const drivers = prepareDrivers(sourceResults);
  assert.equal(presetSelection('rivals', drivers, rivals, tomsen).size, 5);
  assert.equal(presetSelection('tomsen', drivers, rivals, tomsen).size, 1);
  assert.deepEqual([...presetSelection('top5', drivers, rivals, tomsen)], drivers.slice(0, 5).map(driver => driver.id));
  assert.equal(presetSelection('top25', drivers, rivals, tomsen).size, 25);
  assert.equal(presetSelection('all', drivers, rivals, tomsen).size, 109);
  assert.equal(presetSelection('clear', drivers, rivals, tomsen).size, 0);
});

test('search handles Lithuanian characters without changing display names', () => {
  assert.equal(normaliseName('  Šarūnas Žemaitaitis '), 'sarunas zemaitaitis');
});
