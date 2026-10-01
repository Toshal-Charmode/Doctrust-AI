import { ValidationCheck, Discrepancy, Severity, CheckStatus } from '../../types/validation.types.js';
import { ExtractedFields, LineItem } from '../../types/document.types.js';

export interface DocumentComparisonInput {
  id: string;
  filename: string;
  documentType: string;
  fields: ExtractedFields;
}

export function normalizeString(str?: string | null): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(inc|llc|ltd|corp|corporation|co|company|incorporated|limited)\b/g, '')
    .trim();
}

export function normalizeIdentifier(id?: string | null): string {
  if (!id) return '';
  return id.toUpperCase().replace(/[\s\-_]/g, '').trim();
}

/**
 * Compare Vendor Names across documents
 */
export function compareVendors(docs: DocumentComparisonInput[]): ValidationCheck {
  const vendors = docs.map((d) => ({
    docType: d.documentType,
    raw: d.fields.vendorName,
    norm: normalizeString(d.fields.vendorName),
  }));

  const validVendors = vendors.filter((v) => v.norm.length > 0);

  if (validVendors.length < 2) {
    return {
      field: 'vendorName',
      status: 'MISSING',
      message: 'Vendor name is missing from one or more documents for cross-comparison.',
      severity: 'MEDIUM',
    };
  }

  const primaryVendor = validVendors[0];
  const mismatch = validVendors.find((v) => v.norm !== primaryVendor.norm);

  if (mismatch) {
    return {
      field: 'vendorName',
      status: 'MISMATCH',
      expectedValue: primaryVendor.raw,
      actualValue: mismatch.raw,
      severity: 'HIGH',
      message: `Vendor mismatch: '${primaryVendor.raw}' (${primaryVendor.docType}) does not match '${mismatch.raw}' (${mismatch.docType}).`,
    };
  }

  return {
    field: 'vendorName',
    status: 'MATCH',
    expectedValue: primaryVendor.raw,
    actualValue: primaryVendor.raw,
    message: `Vendor '${primaryVendor.raw}' verified across all documents.`,
  };
}

/**
 * Compare Purchase Order Number cross-references
 */
export function comparePoNumbers(docs: DocumentComparisonInput[]): ValidationCheck {
  const poDoc = docs.find((d) => d.documentType === 'PURCHASE_ORDER');
  const invoiceDoc = docs.find((d) => d.documentType === 'INVOICE');
  const drDoc = docs.find((d) => d.documentType === 'DELIVERY_RECEIPT');

  const expectedPo = normalizeIdentifier(poDoc?.fields.documentNumber || poDoc?.fields.poNumber);

  if (!expectedPo) {
    return {
      field: 'poNumber',
      status: 'NOT_APPLICABLE',
      message: 'No purchase order reference baseline available in selection.',
    };
  }

  const comparisons: { docType: string; actual: string | null | undefined }[] = [];
  if (invoiceDoc) comparisons.push({ docType: 'Invoice', actual: invoiceDoc.fields.poNumber });
  if (drDoc) comparisons.push({ docType: 'Delivery Receipt', actual: drDoc.fields.poNumber });

  for (const comp of comparisons) {
    const actualNorm = normalizeIdentifier(comp.actual);
    if (!actualNorm) {
      return {
        field: 'poNumber',
        status: 'MISSING',
        expectedValue: poDoc?.fields.documentNumber || poDoc?.fields.poNumber,
        actualValue: null,
        severity: 'MEDIUM',
        message: `${comp.docType} is missing purchase order reference '${poDoc?.fields.documentNumber || expectedPo}'.`,
      };
    }
    if (actualNorm !== expectedPo) {
      return {
        field: 'poNumber',
        status: 'MISMATCH',
        expectedValue: poDoc?.fields.documentNumber || expectedPo,
        actualValue: comp.actual,
        severity: 'HIGH',
        message: `${comp.docType} references PO '${comp.actual}', but authorized PO is '${poDoc?.fields.documentNumber || expectedPo}'.`,
      };
    }
  }

  return {
    field: 'poNumber',
    status: 'MATCH',
    expectedValue: poDoc?.fields.documentNumber || expectedPo,
    actualValue: poDoc?.fields.documentNumber || expectedPo,
    message: `PO Number '${poDoc?.fields.documentNumber || expectedPo}' matches across procurement documents.`,
  };
}

/**
 * Compare Currency
 */
export function compareCurrency(docs: DocumentComparisonInput[]): ValidationCheck {
  const currencies = docs
    .map((d) => ({ docType: d.documentType, currency: d.fields.currency?.toUpperCase() }))
    .filter((c) => !!c.currency);

  if (currencies.length < 2) {
    return {
      field: 'currency',
      status: 'MATCH',
      message: 'Currency format consistent.',
    };
  }

  const base = currencies[0].currency;
  const mismatch = currencies.find((c) => c.currency !== base);

  if (mismatch) {
    return {
      field: 'currency',
      status: 'MISMATCH',
      expectedValue: base,
      actualValue: mismatch.currency,
      severity: 'HIGH',
      message: `Currency mismatch: ${currencies[0].docType} is in ${base} while ${mismatch.docType} is in ${mismatch.currency}.`,
    };
  }

  return {
    field: 'currency',
    status: 'MATCH',
    expectedValue: base,
    actualValue: base,
    message: `Currency consistent (${base}) across documents.`,
  };
}

/**
 * Compare Totals with configurable tolerance (default 0.01)
 */
export function compareTotals(
  docs: DocumentComparisonInput[],
  tolerance: number = 0.01
): ValidationCheck {
  const poDoc = docs.find((d) => d.documentType === 'PURCHASE_ORDER');
  const invoiceDoc = docs.find((d) => d.documentType === 'INVOICE');
  const quoteDoc = docs.find((d) => d.documentType === 'QUOTATION');

  const baselineDoc = poDoc || quoteDoc;
  if (!baselineDoc || !invoiceDoc) {
    return {
      field: 'totalAmount',
      status: 'NOT_APPLICABLE',
      message: 'Requires both an authorized baseline (PO/Quote) and an Invoice to compare totals.',
    };
  }

  const expectedTotal = Number(baselineDoc.fields.total);
  const actualTotal = Number(invoiceDoc.fields.total);

  if (isNaN(expectedTotal) || isNaN(actualTotal)) {
    return {
      field: 'totalAmount',
      status: 'MISSING',
      message: 'Total amount is missing on one of the documents.',
      severity: 'HIGH',
    };
  }

  const diff = Number((actualTotal - expectedTotal).toFixed(2));
  const absDiff = Math.abs(diff);

  if (absDiff > tolerance) {
    const pct = ((diff / expectedTotal) * 100).toFixed(1);
    const severity: Severity = absDiff > 100 ? 'HIGH' : 'MEDIUM';
    return {
      field: 'totalAmount',
      status: 'MISMATCH',
      expectedValue: expectedTotal,
      actualValue: actualTotal,
      difference: diff,
      severity,
      message: `Total amount mismatch: Invoice total ($${actualTotal.toLocaleString()}) exceeds ${baselineDoc.documentType} authorized total ($${expectedTotal.toLocaleString()}) by $${diff.toLocaleString()} (${pct}% variance).`,
    };
  }

  return {
    field: 'totalAmount',
    status: 'MATCH',
    expectedValue: expectedTotal,
    actualValue: actualTotal,
    difference: 0,
    message: `Financial total ($${actualTotal.toLocaleString()}) matches authorized total within tolerance.`,
  };
}

/**
 * Compare Quantities across PO, DR, and Invoice
 */
export function compareQuantities(docs: DocumentComparisonInput[]): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const poDoc = docs.find((d) => d.documentType === 'PURCHASE_ORDER');
  const invoiceDoc = docs.find((d) => d.documentType === 'INVOICE');
  const drDoc = docs.find((d) => d.documentType === 'DELIVERY_RECEIPT');

  // Overall quantity check
  if (poDoc && invoiceDoc) {
    const poQty = poDoc.fields.totalQuantity ?? calculateTotalQuantity(poDoc.fields.lineItems);
    const invQty = invoiceDoc.fields.totalQuantity ?? calculateTotalQuantity(invoiceDoc.fields.lineItems);

    if (poQty !== null && invQty !== null) {
      const diff = invQty - poQty;
      if (diff !== 0) {
        checks.push({
          field: 'quantity',
          status: 'MISMATCH',
          expectedValue: poQty,
          actualValue: invQty,
          difference: diff,
          severity: 'HIGH',
          message: `Invoice quantity (${invQty}) ${diff > 0 ? 'exceeds' : 'is less than'} authorized purchase order quantity (${poQty}) by ${Math.abs(diff)} unit(s).`,
        });
      } else {
        checks.push({
          field: 'quantity',
          status: 'MATCH',
          expectedValue: poQty,
          actualValue: invQty,
          message: `Total billed quantity (${invQty} units) matches authorized purchase order quantity.`,
        });
      }
    }
  }

  // Delivery receipt intake vs Invoice
  if (drDoc && invoiceDoc) {
    const drQty = drDoc.fields.totalQuantity ?? calculateTotalQuantity(drDoc.fields.lineItems);
    const invQty = invoiceDoc.fields.totalQuantity ?? calculateTotalQuantity(invoiceDoc.fields.lineItems);

    if (drQty !== null && invQty !== null && drQty !== invQty) {
      const diff = invQty - drQty;
      checks.push({
        field: 'deliveryQuantity',
        status: 'MISMATCH',
        expectedValue: drQty,
        actualValue: invQty,
        difference: diff,
        severity: 'HIGH',
        message: `Invoiced quantity (${invQty}) does not match physical delivery receipt intake (${drQty}). Difference: ${diff} units.`,
      });
    }
  }

  return checks;
}

/**
 * Compare Itemized Line Items
 */
export function compareLineItems(docs: DocumentComparisonInput[]): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const poDoc = docs.find((d) => d.documentType === 'PURCHASE_ORDER');
  const invoiceDoc = docs.find((d) => d.documentType === 'INVOICE');

  if (!poDoc || !invoiceDoc) return checks;

  const poItems: LineItem[] = poDoc.fields.lineItems || [];
  const invItems: LineItem[] = invoiceDoc.fields.lineItems || [];

  if (poItems.length === 0 || invItems.length === 0) return checks;

  // Match items by description similarity
  for (const invItem of invItems) {
    const normInvDesc = normalizeString(invItem.description);
    const matchedPoItem = poItems.find((p) => {
      const normPoDesc = normalizeString(p.description);
      return normInvDesc.includes(normPoDesc) || normPoDesc.includes(normInvDesc);
    });

    if (matchedPoItem) {
      // Unit price check
      if (
        matchedPoItem.unitPrice !== null &&
        invItem.unitPrice !== null &&
        Math.abs(invItem.unitPrice - matchedPoItem.unitPrice) > 0.01
      ) {
        checks.push({
          field: `lineItemUnitPrice:${invItem.description.slice(0, 25)}`,
          status: 'MISMATCH',
          expectedValue: matchedPoItem.unitPrice,
          actualValue: invItem.unitPrice,
          difference: Number((invItem.unitPrice - matchedPoItem.unitPrice).toFixed(2)),
          severity: 'HIGH',
          message: `Unit price discrepancy for '${invItem.description}': Invoiced at $${invItem.unitPrice}, but PO authorized $${matchedPoItem.unitPrice}.`,
        });
      }

      // Quantity check
      if (
        matchedPoItem.quantity !== null &&
        invItem.quantity !== null &&
        invItem.quantity !== matchedPoItem.quantity
      ) {
        checks.push({
          field: `lineItemQuantity:${invItem.description.slice(0, 25)}`,
          status: 'MISMATCH',
          expectedValue: matchedPoItem.quantity,
          actualValue: invItem.quantity,
          difference: invItem.quantity - matchedPoItem.quantity,
          severity: 'HIGH',
          message: `Line item quantity discrepancy for '${invItem.description}': Invoiced ${invItem.quantity} units vs PO authorized ${matchedPoItem.quantity} units.`,
        });
      }
    }
  }

  return checks;
}

/**
 * Compare Dates and Chronology
 */
export function compareDates(docs: DocumentComparisonInput[]): ValidationCheck[] {
  const checks: ValidationCheck[] = [];
  const poDoc = docs.find((d) => d.documentType === 'PURCHASE_ORDER');
  const invoiceDoc = docs.find((d) => d.documentType === 'INVOICE');
  const drDoc = docs.find((d) => d.documentType === 'DELIVERY_RECEIPT');

  const poDate = poDoc?.fields.documentDate || poDoc?.fields.orderDate;
  const invDate = invoiceDoc?.fields.documentDate || invoiceDoc?.fields.invoiceDate;
  const drDate = drDoc?.fields.documentDate || drDoc?.fields.deliveryDate;

  // Invoice date should be on or after PO date
  if (poDate && invDate) {
    if (new Date(invDate).getTime() < new Date(poDate).getTime()) {
      checks.push({
        field: 'dateChronology',
        status: 'MISMATCH',
        expectedValue: `>= ${poDate}`,
        actualValue: invDate,
        severity: 'MEDIUM',
        message: `Chronology anomaly: Invoice date (${invDate}) precedes purchase order issue date (${poDate}).`,
      });
    } else {
      checks.push({
        field: 'dateChronology',
        status: 'MATCH',
        expectedValue: `>= ${poDate}`,
        actualValue: invDate,
        message: `Date sequence valid (PO date ${poDate} precedes Invoice date ${invDate}).`,
      });
    }
  }

  // Delivery receipt date should be on or after PO date
  if (poDate && drDate) {
    if (new Date(drDate).getTime() < new Date(poDate).getTime()) {
      checks.push({
        field: 'deliveryDateChronology',
        status: 'MISMATCH',
        expectedValue: `>= ${poDate}`,
        actualValue: drDate,
        severity: 'MEDIUM',
        message: `Chronology anomaly: Delivery receipt intake date (${drDate}) precedes PO issue date (${poDate}).`,
      });
    }
  }

  return checks;
}

function calculateTotalQuantity(lineItems?: LineItem[]): number | null {
  if (!lineItems || lineItems.length === 0) return null;
  const total = lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  return total > 0 ? total : null;
}

export default {
  compareVendors,
  comparePoNumbers,
  compareCurrency,
  compareTotals,
  compareQuantities,
  compareLineItems,
  compareDates,
};
