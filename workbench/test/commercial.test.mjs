import test from 'node:test';
import assert from 'node:assert/strict';
import {financialSummary,parseMoney} from '../worker/customers.mjs';
test('money preserves cents and currency precision',()=>{assert.equal(parseMoney('1234.56','AUD'),123456);assert.equal(parseMoney('1234','JPY'),1234);assert.throws(()=>parseMoney('1.23','JPY'));assert.throws(()=>parseMoney('1.234','USD'));assert.throws(()=>parseMoney('-1','AUD'));assert.throws(()=>parseMoney('12','XXX'));});
test('unprovided payment history never implies zero paid or a balance',()=>{const s=financialSummary({amount_minor:10000,currency:'AUD',payments_complete:0},[]);assert.equal(s.balance,null);assert.deepEqual(s.received,{});});
test('verified complete payment history determines balance without mixing currencies',()=>{const o={amount_minor:10000,currency:'AUD',payments_complete:1};assert.equal(financialSummary(o,[{currency:'AUD',amount_minor:2500}]).balance,7500);assert.equal(financialSummary(o,[{currency:'USD',amount_minor:2500}]).balance,null);assert.equal(financialSummary({...o,amount_minor:null},[]).balance,null);});
