const expect = require('chai').expect;
const assert = require('chai').assert;
const { uniq, uniqWith, map, filter } = require('lodash');

const caseTypeTab = Object.assign(require('definitions/divorce/json/CaseTypeTab'), {});
const caseField = Object.assign(require('definitions/divorce/json/CaseField'), {});

const tabIds = uniq(map(caseTypeTab, 'TabID'));

describe('CaseTypeTab', () => {
  it('should contain a unique case field ID per tab ID (no duplicate field in a tab)', () => {
    const uniqResult = uniqWith(
      caseTypeTab,
      (field1, field2) => {
        return field1.TabID === field2.TabID && field1.CaseFieldID === field2.CaseFieldID;
      }
    );
    expect(uniqResult).to.eql(caseTypeTab);
  });
  it('should contain a unique tab field display order ID field tab ID (no duplicate field order in a tab)', () => {
    tabIds.forEach(tabId => {
      const allFieldsPerTab = filter(caseTypeTab, field => {
        return field.TabID === tabId;
      });
      const uniqResults = uniqWith(
        allFieldsPerTab,
        (field1, field2) => {
          return field1.TabFieldDisplayOrder === field2.TabFieldDisplayOrder;
        }
      );
      expect(uniqResults).to.eql(allFieldsPerTab);
    });
  });
  it('should contain a proper sequence for TabFieldDisplayOrder with no gaps', () => {
    tabIds.forEach(tabId => {
      const allFieldsPerTab = filter(caseTypeTab, field => {
        return field.TabID === tabId;
      });
      const allTabFieldDisplayOrderNumbers = map(allFieldsPerTab, field => {
        return field.TabFieldDisplayOrder;
      }).sort((a, b) => {
        return a - b;
      });
      for (let i = 1; i < allTabFieldDisplayOrderNumbers.length; i++) {
        if (allTabFieldDisplayOrderNumbers[i] - allTabFieldDisplayOrderNumbers[i - 1] !== 1) {
          assert.fail(`Missing/unordered TabFieldDisplayOrder sequence number in TabID ${tabId} - expected ${allTabFieldDisplayOrderNumbers[i - 1] + 1} but got ${allTabFieldDisplayOrderNumbers[i]}`);
        }
      }
    });
  });

  const expected = {
    History: 1,
    petitionDetails: 2,
    aosDetails: 3,
    dnDetails: 4,
    outcomeOfDnDetails: 5,
    DecreeAbsolute: 6,
    paymentDetails: 7,
    documents: 8,
    confidentialPetitioner: 9,
    confidentialRespondent: 10,
    confidentialCoRespondent: 11,
    notes: 12,
    marriageCertificate: 13,
    coRespondent: 14,
    SolicitorCoRespondent: 15,
    LinkedCase: 16,
    General: 1
  };
  tabIds.forEach(tabId => {
    it(`all ${tabId} fields should have the expected tab order ${expected[tabId]}`, () => {
      const allTabFields = uniq(filter(caseTypeTab, field => {
        return field.TabID === tabId;
      }));
      const allTabOrders = uniq(map(allTabFields, 'TabDisplayOrder'));
      expect(allTabOrders).to.eql([expected[tabId]]);
    });
  });

  it('should contain a valid Tab IDs', () => {
    expect(tabIds).to.eql([
      'History',
      'General',
      'petitionDetails',
      'aosDetails',
      'dnDetails',
      'outcomeOfDnDetails',
      'DecreeAbsolute',
      'paymentDetails',
      'documents',
      'confidentialPetitioner',
      'confidentialRespondent',
      'confidentialCoRespondent',
      'notes',
      'marriageCertificate',
      'coRespondent',
      'SolicitorCoRespondent',
      'LinkedCase'
    ]);
  });
  it('should contain a valid case field IDs', () => {
    const validFields = uniq(map(caseField, 'ID'));
    const objectsWithInvalidCaseId = filter(caseTypeTab, field => {
      return validFields.indexOf(field.CaseFieldID) === -1;
    });
    expect(objectsWithInvalidCaseId).to.eql([]);
  });
});