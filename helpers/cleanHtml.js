const { decode } = require('html-entities');

/**
 *  Gộp chức năng:
 * - Xoá tag HTML
 * - Decode ký tự entity
 */
module.exports = function cleanHtml(input = '') {
  if (typeof input !== 'string') return '';

  //  1. Xoá thẻ HTML bằng regex
  const noHtml = input.replace(/<[^>]*>/g, '');

  //  2. Decode ký tự entity (vd: &agrave; → à)
  const decoded = decode(noHtml);

  return decoded.trim();
};
