import { generateAiValidationExplanation } from '../ai/geminiService.js';

/**
 * Normalize string for comparison (trim, lowercase, remove punctuation)
 */
function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

function calculateTotalQuantity(lineItems) {
  if (!lineItems || !Array.isArray(lineItems)) return 0;
  return lineItems.reduce((acc, item) => acc + (parseFloat(item.quantity) || 0), 0);
}

/**
 * Perform comprehensive cross-document reconciliation and comparison
 */
export async function validateDocuments(rawDocuments) {
  if (!rawDocuments || rawDocuments.length < 2) {
    throw new Error('At least 2 documents are required for cross-document validation');
  }

  // Normalize all documents to a consistent camelCase structure
  const documents = rawDocuments.map((d) => {
    const ext = d.extracted || {};
    return {
      id: d.id,
      originalName: d.originalName || d.original_name,
      documentType: d.documentType || d.document_type,
      extracted: {
        vendorName: ext.vendorName || ext.vendor_name || null,
        vendorAddress: ext.vendorAddress || ext.vendor_address || null,
        documentNumber:
          ext.documentNumber ||
          ext.document_number ||
          ext.invoiceNumber ||
          ext.poNumber ||
          ext.receiptNumber ||
          null,
        poNumber: ext.poNumber || ext.po_number || null,
        documentDate:
          ext.documentDate ||
          ext.document_date ||
          ext.orderDate ||
          ext.invoiceDate ||
          null,
        dueDate: ext.dueDate || ext.due_date || null,
        deliveryDate: ext.deliveryDate || ext.delivery_date || null,
        currency: ext.currency || 'USD',
        subtotal: ext.subtotal ? parseFloat(ext.subtotal) : null,
        tax: ext.tax !== undefined && ext.tax !== null ? parseFloat(ext.tax) : null,
        total: ext.total ? parseFloat(ext.total) : null,
        totalQuantity:
          ext.totalQuantity ||
          ext.total_quantity ||
          calculateTotalQuantity(ext.lineItems || ext.line_items),
        receivedBy: ext.receivedBy || ext.received_by || null,
        lineItems: ext.lineItems || ext.line_items || [],
      },
    };
  });

  const checks = [];
  const discrepancies = [];

  // Identify document roles
  const poDoc = documents.find((d) => d.documentType === 'PURCHASE_ORDER');
  const invoiceDoc = documents.find((d) => d.documentType === 'INVOICE');
  const deliveryDoc = documents.find((d) => d.documentType === 'DELIVERY_RECEIPT');
  const quoteDoc = documents.find((d) => d.documentType === 'QUOTATION');

  const docTypes = documents.map((d) => d.documentType).join(' + ');

  // 1. VENDOR CHECK
  const vendors = documents
    .map((d) => ({
      doc: d.originalName,
      type: d.documentType,
      vendor: d.extracted?.vendorName,
    }))
    .filter((v) => Boolean(v.vendor));

  if (vendors.length > 1) {
    const primaryNormalized = normalizeString(vendors[0].vendor);
    const vendorMismatch = vendors.find((v) => {
      const norm = normalizeString(v.vendor);
      return !norm.includes(primaryNormalized) && !primaryNormalized.includes(norm);
    });

    if (vendorMismatch) {
      checks.push({
        field: 'vendorName',
        label: 'Vendor Name',
        status: 'MISMATCH',
        details: `Vendor name discrepancy: '${vendors[0].vendor}' (${vendors[0].type}) vs '${vendorMismatch.vendor}' (${vendorMismatch.type})`,
        severity: 'HIGH',
      });
      discrepancies.push({
        field: 'vendorName',
        expectedValue: vendors[0].vendor,
        actualValue: vendorMismatch.vendor,
        difference: 'Vendor identity mismatch',
        severity: 'HIGH',
        explanation: `Document vendor '${vendorMismatch.vendor}' does not match the contracting vendor '${vendors[0].vendor}'. Risk of rogue supplier or fraudulent billing.`,
      });
    } else {
      checks.push({
        field: 'vendorName',
        label: 'Vendor Name',
        status: 'MATCH',
        details: `Vendor matches across documents: '${vendors[0].vendor}'`,
      });
    }
  } else if (vendors.length === 1) {
    checks.push({
      field: 'vendorName',
      label: 'Vendor Name',
      status: 'MISSING',
      details: 'Vendor name could only be extracted from one document.',
      severity: 'MEDIUM',
    });
  }

  // 2. PO NUMBER REFERENCE CHECK
  if (poDoc) {
    const poNum = poDoc.extracted?.documentNumber || poDoc.extracted?.poNumber;
    if (poNum) {
      if (invoiceDoc) {
        const invPoRef = invoiceDoc.extracted?.poNumber;
        if (!invPoRef) {
          checks.push({
            field: 'poNumber',
            label: 'PO Number Reference',
            status: 'MISSING',
            details: `Invoice does not state the associated Purchase Order number (Expected: ${poNum}).`,
            severity: 'MEDIUM',
          });
          discrepancies.push({
            field: 'poNumber',
            expectedValue: poNum,
            actualValue: 'Not specified',
            difference: 'Missing PO Reference',
            severity: 'MEDIUM',
            explanation: `The invoice does not reference approved PO ${poNum}, risking unapproved invoice processing.`,
          });
        } else if (normalizeString(invPoRef) === normalizeString(poNum)) {
          checks.push({
            field: 'poNumber',
            label: 'PO Number Reference',
            status: 'MATCH',
            details: `Invoice correctly references Purchase Order: ${poNum}`,
          });
        } else {
          checks.push({
            field: 'poNumber',
            label: 'PO Number Reference',
            status: 'MISMATCH',
            details: `Invoice references PO '${invPoRef}', but approved PO is '${poNum}'.`,
            severity: 'HIGH',
          });
          discrepancies.push({
            field: 'poNumber',
            expectedValue: poNum,
            actualValue: invPoRef,
            difference: `Mismatch: ${poNum} vs ${invPoRef}`,
            severity: 'HIGH',
            explanation: `The invoice references '${invPoRef}' which does not correspond to authorized PO '${poNum}'.`,
          });
        }
      }

      if (deliveryDoc) {
        const delPoRef = deliveryDoc.extracted?.poNumber;
        if (delPoRef && normalizeString(delPoRef) === normalizeString(poNum)) {
          checks.push({
            field: 'deliveryPoReference',
            label: 'Delivery PO Reference',
            status: 'MATCH',
            details: `Delivery receipt references authorized Purchase Order: ${poNum}`,
          });
        }
      }
    }
  }

  // 3. INVOICE NUMBER CHECK
  if (invoiceDoc) {
    const invNum = invoiceDoc.extracted?.documentNumber;
    if (invNum) {
      checks.push({
        field: 'invoiceNumber',
        label: 'Invoice Number',
        status: 'MATCH',
        details: `Valid invoice number detected: ${invNum}`,
      });
    } else {
      checks.push({
        field: 'invoiceNumber',
        label: 'Invoice Number',
        status: 'MISSING',
        details: 'Invoice is missing a clear document/invoice reference number.',
        severity: 'MEDIUM',
      });
      discrepancies.push({
        field: 'invoiceNumber',
        expectedValue: 'Valid Invoice Number',
        actualValue: 'None',
        difference: 'Missing required invoice identifier',
        severity: 'MEDIUM',
        explanation: 'The invoice document lacks a distinct unique invoice number required for accounts payable audit.',
      });
    }
  }

  // 4. CURRENCY CHECK
  const currencies = documents.map((d) => ({
    doc: d.originalName,
    currency: d.extracted?.currency || 'USD',
  }));
  const baseCurrency = currencies[0].currency;
  const currencyMismatch = currencies.find((c) => c.currency !== baseCurrency);

  if (currencyMismatch) {
    checks.push({
      field: 'currency',
      label: 'Currency',
      status: 'MISMATCH',
      details: `Currency conflict: ${baseCurrency} vs ${currencyMismatch.currency}`,
      severity: 'HIGH',
    });
    discrepancies.push({
      field: 'currency',
      expectedValue: baseCurrency,
      actualValue: currencyMismatch.currency,
      difference: `Currency mismatch: ${baseCurrency} vs ${currencyMismatch.currency}`,
      severity: 'HIGH',
      explanation: `Documents are billed in mixed currencies (${baseCurrency} and ${currencyMismatch.currency}), creating exchange rate exposure.`,
    });
  } else {
    checks.push({
      field: 'currency',
      label: 'Currency',
      status: 'MATCH',
      details: `Consistent currency across all documents (${baseCurrency})`,
    });
  }

  // 5. QUANTITY RECONCILIATION (PO vs Invoice vs Delivery Receipt)
  if (poDoc && invoiceDoc) {
    const poQty = poDoc.extracted?.totalQuantity || calculateTotalQuantity(poDoc.extracted?.lineItems);
    const invQty = invoiceDoc.extracted?.totalQuantity || calculateTotalQuantity(invoiceDoc.extracted?.lineItems);

    if (poQty > 0 && invQty > 0) {
      if (invQty === poQty) {
        checks.push({
          field: 'quantity',
          label: 'Quantity Reconciliation',
          status: 'MATCH',
          details: `Invoiced quantity matches approved purchase order (${invQty} units).`,
        });
      } else {
        const diff = invQty - poQty;
        const diffSign = diff > 0 ? `+${diff}` : `${diff}`;
        checks.push({
          field: 'quantity',
          label: 'Quantity Reconciliation',
          status: 'MISMATCH',
          details: `Invoice bills for ${invQty} units while PO authorizes ${poQty} units (${diffSign} units).`,
          severity: 'HIGH',
        });
        discrepancies.push({
          field: 'quantity',
          expectedValue: `${poQty} units (from PO)`,
          actualValue: `${invQty} units (from Invoice)`,
          difference: `${diffSign} units variance`,
          severity: 'HIGH',
          explanation:
            diff > 0
              ? `The invoiced quantity (${invQty} units) exceeds the quantity approved in the purchase order (${poQty} units) by ${diff} units.`
              : `The invoiced quantity (${invQty} units) is less than the authorized purchase order (${poQty} units).`,
        });
      }
    }

    if (deliveryDoc) {
      const delQty = deliveryDoc.extracted?.totalQuantity || calculateTotalQuantity(deliveryDoc.extracted?.lineItems);
      if (delQty > 0 && invQty > 0) {
        if (delQty === invQty) {
          checks.push({
            field: 'deliveredQuantity',
            label: 'Delivered vs Invoiced Units',
            status: 'MATCH',
            details: `Goods receipt confirms all ${invQty} invoiced units were physically delivered.`,
          });
        } else {
          const deliveredDiff = invQty - delQty;
          checks.push({
            field: 'deliveredQuantity',
            label: 'Delivered vs Invoiced Units',
            status: 'MISMATCH',
            details: `Invoice bills for ${invQty} units, but warehouse receiving confirms only ${delQty} units received.`,
            severity: 'HIGH',
          });
          discrepancies.push({
            field: 'deliveredQuantity',
            expectedValue: `${delQty} units delivered`,
            actualValue: `${invQty} units invoiced`,
            difference: `${deliveredDiff > 0 ? '+' : ''}${deliveredDiff} units overbilled without delivery`,
            severity: 'HIGH',
            explanation: `The invoice charges for ${invQty} units, but delivery receipt confirms receipt of only ${delQty} units. Risk of payment for undelivered goods.`,
          });
        }
      }
    }
  }

  // 6. TOTAL AMOUNT CHECK (PO vs Invoice)
  if (poDoc && invoiceDoc) {
    const poTotal = parseFloat(poDoc.extracted?.total || 0);
    const invTotal = parseFloat(invoiceDoc.extracted?.total || 0);

    if (poTotal > 0 && invTotal > 0) {
      const diff = Math.abs(invTotal - poTotal);
      if (diff <= 0.01) {
        checks.push({
          field: 'totalAmount',
          label: 'Total Amount',
          status: 'MATCH',
          details: `Invoice total matches approved Purchase Order amount ($${invTotal.toLocaleString()}).`,
        });
      } else {
        const variance = invTotal - poTotal;
        const varianceSign = variance > 0 ? `+$${variance.toFixed(2)}` : `-$${Math.abs(variance).toFixed(2)}`;
        checks.push({
          field: 'totalAmount',
          label: 'Total Amount',
          status: 'MISMATCH',
          details: `Invoice total ($${invTotal.toLocaleString()}) does not match PO authorized total ($${poTotal.toLocaleString()}) (${varianceSign}).`,
          severity: 'HIGH',
        });
        discrepancies.push({
          field: 'totalAmount',
          expectedValue: `$${poTotal.toLocaleString()}`,
          actualValue: `$${invTotal.toLocaleString()}`,
          difference: `${varianceSign} variance`,
          severity: 'HIGH',
          explanation: `Invoice total exceeds approved purchase order by ${varianceSign}. Invoices must strictly align with agreed budget allocations.`,
        });
      }
    }
  }

  // 7. LINE ITEMS & UNIT PRICING CHECK
  if (poDoc && invoiceDoc) {
    const poItems = poDoc.extracted?.lineItems || [];
    const invItems = invoiceDoc.extracted?.lineItems || [];

    if (poItems.length > 0 && invItems.length > 0) {
      let priceMismatchFound = false;

      invItems.forEach((invItem) => {
        const matchingPoItem = poItems.find(
          (p) =>
            normalizeString(p.description).includes(normalizeString(invItem.description)) ||
            normalizeString(invItem.description).includes(normalizeString(p.description))
        );

        if (matchingPoItem) {
          const invPrice = parseFloat(invItem.unitPrice || 0);
          const poPrice = parseFloat(matchingPoItem.unitPrice || 0);

          if (invPrice > 0 && poPrice > 0 && Math.abs(invPrice - poPrice) > 0.01) {
            priceMismatchFound = true;
            checks.push({
              field: 'unitPrice',
              label: `Unit Price (${invItem.description})`,
              status: 'MISMATCH',
              details: `Billed unit price ($${invPrice}) does not match agreed PO unit price ($${poPrice}).`,
              severity: 'HIGH',
            });
            discrepancies.push({
              field: 'unitPrice',
              expectedValue: `$${poPrice.toFixed(2)}`,
              actualValue: `$${invPrice.toFixed(2)}`,
              difference: `$${(invPrice - poPrice).toFixed(2)} unit price variance`,
              severity: 'HIGH',
              explanation: `Unit price billed for '${invItem.description}' ($${invPrice}) deviates from agreed PO rate ($${poPrice}).`,
            });
          }
        }
      });

      if (!priceMismatchFound) {
        checks.push({
          field: 'unitPrice',
          label: 'Item Unit Pricing',
          status: 'MATCH',
          details: 'All matched line item unit prices match agreed Purchase Order rates.',
        });
      }
    }
  }

  // 8. DATE ORDER VALIDATION
  if (poDoc && invoiceDoc) {
    const poDate = poDoc.extracted?.documentDate;
    const invDate = invoiceDoc.extracted?.documentDate;

    if (poDate && invDate) {
      const poTime = new Date(poDate).getTime();
      const invTime = new Date(invDate).getTime();

      if (!isNaN(poTime) && !isNaN(invTime)) {
        if (invTime < poTime) {
          checks.push({
            field: 'dates',
            label: 'Chronology of Dates',
            status: 'MISMATCH',
            details: `Invoice date (${invDate}) predates Purchase Order issuance date (${poDate}).`,
            severity: 'MEDIUM',
          });
          discrepancies.push({
            field: 'dates',
            expectedValue: `After or on ${poDate}`,
            actualValue: invDate,
            difference: 'Invoice dated prior to PO issuance',
            severity: 'MEDIUM',
            explanation: `The invoice is dated before the purchase order was officially issued (${invDate} < ${poDate}), which violates procurement governance.`,
          });
        } else {
          checks.push({
            field: 'dates',
            label: 'Chronology of Dates',
            status: 'MATCH',
            details: `Invoice date (${invDate}) chronologically follows authorized PO date (${poDate}).`,
          });
        }
      }
    }
  }

  // 9. DELIVERY CONFIRMATION CHECK
  if (deliveryDoc) {
    const receivedBy = deliveryDoc.extracted?.receivedBy;
    if (receivedBy) {
      checks.push({
        field: 'deliveryReceipt',
        label: 'Delivery Confirmation',
        status: 'MATCH',
        details: `Goods receipt confirmed and verified by: ${receivedBy}`,
      });
    } else {
      checks.push({
        field: 'deliveryReceipt',
        label: 'Delivery Confirmation',
        status: 'MISSING',
        details: 'Delivery receipt does not indicate receiving manager signature.',
        severity: 'LOW',
      });
    }
  }

  // Determine overall status
  const hasHighSeverity = discrepancies.some((d) => d.severity === 'HIGH');
  const hasMediumSeverity = discrepancies.some((d) => d.severity === 'MEDIUM');

  let overallStatus = 'MATCH';
  if (hasHighSeverity) {
    overallStatus = 'CRITICAL_MISMATCH';
  } else if (hasMediumSeverity || discrepancies.length > 0) {
    overallStatus = 'REVIEW_REQUIRED';
  }

  // Generate Executive AI Explanation
  const aiExplanation = await generateAiValidationExplanation(checks, discrepancies, documents);

  // Recommended Action
  let recommendedAction = 'Approved for payment release and ERP entry.';
  if (overallStatus === 'CRITICAL_MISMATCH') {
    recommendedAction =
      'HOLD PAYMENT. Issue discrepancy notice to vendor requesting credit note or revised invoice matching approved PO quantities and rates.';
  } else if (overallStatus === 'REVIEW_REQUIRED') {
    recommendedAction =
      'Route to procurement supervisor for secondary variance approval before invoice approval.';
  }

  return {
    overallStatus,
    title: `3-Way Match Validation: ${docTypes}`,
    checks,
    discrepancies,
    discrepancyCount: discrepancies.length,
    aiExplanation,
    recommendedAction,
  };
}

export default {
  validateDocuments,
};
