const { expect } = require('chai');
const { uniqWith } = require('lodash');
const { isFieldDuplicated, loadAllFiles } = require('../../utils/utils');
const { createAssertExists } = require('../../utils/assertBuilders');

const assertEventExists = createAssertExists('Event');

const getAuthorisationCaseEventDefinitions = loadAllFiles('AuthorisationCaseEvent');
const getCaseEventDefinitions = loadAllFiles('CaseEvent');

describe('AuthorisationCaseEvent', () => {
  describe('NonProd:', () => {
    let nonProd = [];
    let allEventsForNonProd = [];

    before(() => {
      nonProd = getAuthorisationCaseEventDefinitions([
        'AuthorisationCaseEvent',
        'AuthorisationCaseEvent-deemed-and-dispensed-nonprod',
        'AuthorisationCaseEvent-general-referral-nonprod',
        'AuthorisationCaseEvent-alternative-service-nonprod',
        'AuthorisationCaseEvent-nonprod'
      ]);

      allEventsForNonProd = getCaseEventDefinitions([
        'CaseEvent',
        'CaseEvent-deemed-and-dispensed-nonprod',
        'CaseEvent-general-email-nonprod',
        'CaseEvent-general-order-nonprod',
        'CaseEvent-general-referral-nonprod',
        'CaseEvent-nonprod',
        'CaseEvent-alternative-service-nonprod'
      ]);
    });

    it('should contain a unique case type, case event ID and role (no duplicates) for non-prod', () => {
      const uniqResult = uniqWith(nonProd, isFieldDuplicated('CaseEventID'));

      expect(uniqResult).to.eql(nonProd);
    });

    it('should use existing events', () => {
      assertEventExists(nonProd, allEventsForNonProd);
    });
  });

  describe('Prod:', () => {
    let prodOnly = [];
    let allEventsForProd = [];

    before(() => {
      prodOnly = getAuthorisationCaseEventDefinitions([
        'AuthorisationCaseEvent',
        'AuthorisationCaseEvent-prod'
      ]);

      allEventsForProd = getCaseEventDefinitions(
        [
          'CaseEvent',
          'CaseEvent-prod'
        ]);
    });

    it('should contain a unique case type, case event ID and role (no duplicates)', () => {
      const uniqResult = uniqWith(prodOnly, isFieldDuplicated('CaseEventID'));

      expect(uniqResult).to.eql(prodOnly);
    });

    it('should use existing events', () => {
      assertEventExists(prodOnly, allEventsForProd);
    });
  });
});
