/**
 * Builds the next sequential business code from backend records.
 *
 * @param {Array<Object>} records - Existing backend records already loaded by a store.
 * @param {string} field - Field containing the current business code.
 * @param {string} prefix - Code prefix, for example `MR`, `PO`, `QT`, `INC` or `INV`.
 * @param {number} [year=new Date().getFullYear()] - Year segment used by business codes.
 * @param {number} [width=5] - Numeric suffix width.
 * @returns {string} Next code preserving the `PREFIX-YYYY-00000` format.
 */
export const buildNextBusinessCode = (
    records,
    field,
    prefix,
    year = new Date().getFullYear(),
    width = 5
) => {
    const maxSequence = (records || []).reduce((max, record) => {
        const value = String(record?.[field] || '');
        const match = value.match(/(\d+)$/);
        const sequence = match ? Number(match[1]) : Number(record?.id || 0);
        return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
    }, 0);

    return `${prefix}-${year}-${String(maxSequence + 1).padStart(width, '0')}`;
};

/**
 * Builds the next sequential code without a year segment.
 *
 * @param {Array<Object>} records - Existing backend records already loaded by a store.
 * @param {string} field - Field containing the current code.
 * @param {string} prefix - Code prefix, for example `INV`.
 * @param {number} [width=3] - Numeric suffix width.
 * @returns {string} Next code preserving the `PREFIX-000` format.
 */
export const buildNextPlainCode = (records, field, prefix, width = 3) => {
    const maxSequence = (records || []).reduce((max, record) => {
        const value = String(record?.[field] || '');
        const match = value.match(/(\d+)$/);
        const sequence = match ? Number(match[1]) : Number(record?.id || 0);
        return Number.isFinite(sequence) ? Math.max(max, sequence) : max;
    }, 0);

    return `${prefix}-${String(maxSequence + 1).padStart(width, '0')}`;
};
