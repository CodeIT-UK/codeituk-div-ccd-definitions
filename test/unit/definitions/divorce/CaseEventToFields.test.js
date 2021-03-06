const { expect, assert } = require('chai');
const { find } = require('lodash');
const { loadAllFiles } = require('../../utils/utils');

const getCaseEventToFieldDefinitions = loadAllFiles('CaseEventToFields');
const getCaseEventDefinitions = loadAllFiles('CaseEvent');
const getCaseFieldDefinitions = loadAllFiles('CaseField');

function assertHasOnlyValidEventIds(caseEventToFieldsFile, caseEventFile) {
  const errors = [];
  caseEventToFieldsFile.forEach(caseEventToFieldsEntry => {
    try {
      expect(find(caseEventFile, ['ID', caseEventToFieldsEntry.CaseEventID])).to.be.an('object');
    } catch (error) {
      errors.push(`Event ID ${caseEventToFieldsEntry.CaseEventID} is not valid`);
    }
  });
  if (errors.length) {
    assert.fail(`Found invalid case IDs - ${errors}`);
  }
}

function assertHasOnlyValidFieldIds(caseEventToFieldsFile, caseFieldFile) {
  const errors = [];
  caseEventToFieldsFile.forEach(caseEventToFieldsEntry => {
    try {
      expect(find(caseFieldFile, ['ID', caseEventToFieldsEntry.CaseFieldID])).to.be.an('object');
    } catch (error) {
      errors.push(`Field ID ${caseEventToFieldsEntry.CaseFieldID} is not valid`);
    }
  });
  if (errors.length) {
    assert.fail(`Found invalid field IDs - ${errors}`);
  }
}

function assertEventCallBacksDefinedInTheFirstField(caseEventToFieldsFile) {
  const errors = [];
  caseEventToFieldsFile.forEach(caseEventToFieldsEntry => {
    try {
      if (caseEventToFieldsEntry.CallBackURLMidEvent) {
        expect(caseEventToFieldsEntry.PageFieldDisplayOrder).to.eq(1);
      }
    } catch (error) {
      errors.push(`Field ID ${caseEventToFieldsEntry.CaseFieldID} defines callback, but is not the first field`);
    }
  });

  if (errors.length) {
    assert.fail(`Found invalid field IDs - ${errors}`);
  }
}

function assertRetriesTimeoutURLMidEventIsAddedForAllCallbacks(caseEventToFieldsFile) {
  const errors = [];
  caseEventToFieldsFile.forEach(caseEventToFieldsEntry => {
    try {
      // this field is ignored by CCD
      expect(caseEventToFieldsEntry.RetriesTimeoutURLMidEvent).not.to.be.an('string');
    } catch (error) {
      errors.push(`Field ID ${caseEventToFieldsEntry.CaseFieldID} defines callback without RetriesTimeoutURLMidEvent\n`);
    }
  });

  if (errors.length) {
    assert.fail(`Found invalid field IDs - ${errors}`);
  }
}

describe('CaseEventToFields (non-prod)', () => {
  let caseEventToFieldsNonProd = [];
  let caseEventNonProd = [];
  let caseFieldNonProd = [];

  before(() => {
    caseEventToFieldsNonProd = getCaseEventToFieldDefinitions([
      'CaseEventToFields',
      'CaseEventToFields-deemed-and-dispensed-nonprod',
      'CaseEventToFields-general-order-nonprod',
      'CaseEventToFields-general-email-nonprod',
      'CaseEventToFields-general-referral-nonprod',
      'CaseEventToFields-nonprod'
    ]);

    caseEventNonProd = getCaseEventDefinitions([
      'CaseEvent',
      'CaseEvent-deemed-and-dispensed-nonprod',
      'CaseEvent-general-order-nonprod',
      'CaseEvent-general-email-nonprod',
      'CaseEvent-general-referral-nonprod',
      'CaseEvent-nonprod'
    ]);

    caseFieldNonProd = getCaseFieldDefinitions([
      'CaseField',
      'CaseField-deemed-and-dispensed-nonprod',
      'CaseField-general-order-nonprod',
      'CaseField-general-email-nonprod',
      'CaseField-general-referral-nonprod'
    ]);
  });

  it('should contain valid event IDs', () => {
    assertHasOnlyValidEventIds(caseEventToFieldsNonProd, caseEventNonProd);
  });

  it('should contain valid field IDs', () => {
    assertHasOnlyValidFieldIds(caseEventToFieldsNonProd, caseFieldNonProd);
  });

  describe('CallBackURLMidEvent', () => {
    it('(if defined) is added to the first field on page', () => {
      assertEventCallBacksDefinedInTheFirstField(caseEventToFieldsNonProd);
    });

    it('RetriesTimeoutURLMidEvent is never defined', () => {
      assertRetriesTimeoutURLMidEventIsAddedForAllCallbacks(caseEventToFieldsNonProd);
    });
  });
});

describe('CaseEventToFields (prod)', () => {
  let caseEventToFieldsProd = [];
  let caseEventProd = [];
  let caseFieldProd = [];

  before(() => {
    caseEventToFieldsProd = getCaseEventToFieldDefinitions([
      'CaseEventToFields',
      'CaseEventToFields-prod'
    ]);

    caseEventProd = getCaseEventDefinitions([
      'CaseEvent',
      'CaseEvent-prod'
    ]);

    caseFieldProd = getCaseFieldDefinitions([
      'CaseField',
      'CaseField-prod'
    ]);
  });

  it('should contain valid event IDs', () => {
    assertHasOnlyValidEventIds(caseEventToFieldsProd, caseEventProd);
  });

  it('should contain valid field IDs', () => {
    assertHasOnlyValidFieldIds(caseEventToFieldsProd, caseFieldProd);
  });

  describe('CallBackURLMidEvent', () => {
    it('(if defined) is added to the first field on page', () => {
      assertEventCallBacksDefinedInTheFirstField(caseEventToFieldsProd);
    });

    it('RetriesTimeoutURLMidEvent is never defined', () => {
      assertRetriesTimeoutURLMidEventIsAddedForAllCallbacks(caseEventToFieldsProd);
    });
  });
});
