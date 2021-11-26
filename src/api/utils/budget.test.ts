import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import {
  makeBudgetSimpleEndpoint,
  makeBudgetCroiseEndpoint,
  makeNomenEndpoint,
} from './budget';

const _budgetsEndpoint = suite('budgetsEndpoint');

const budgetParams = {
  ident: ['20006340200107'],
  siren: ['200063402', '217400100', '217400118'],
  year: 2020,
};

_budgetsEndpoint(
  'makeBudgetSimpleEndpoint should return endpoint with budget parameters',
  () => {
    assert.is(
      makeBudgetSimpleEndpoint(budgetParams),
      'api/records/1.0/search?dataset=balances-comptables-des-communes-en-2020&q=ident:20006340200107&siren:200063402 OR 217400100 OR 217400118&rows=10000',
    );
  },
);

_budgetsEndpoint(
  'makeBudgetCroiseEndpoint should return endpoint with budget parameters',
  () => {
    assert.is(
      makeBudgetCroiseEndpoint(budgetParams),
      'api/records/1.0/search?dataset=balances-comptables-des-collectivites-et-des-etablissements-publics-locaux-avec7&q=ident:20006340200107&siren:200063402 OR 217400100 OR 217400118&rows=10000',
    );
  },
);

_budgetsEndpoint(
  'makeNomenEndpoint should return endpoint with budget parameters',
  () => {
    assert.is(
      makeNomenEndpoint(2020, 'M14', 10),
      '2020/M14/M14_COM_500_3500.xml',
    );
  },
);

_budgetsEndpoint.run();
