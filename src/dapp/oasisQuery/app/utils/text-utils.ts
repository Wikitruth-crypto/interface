/**
 * Text processing utilities for search, matching, and normalization
 */

/**
 * Options for doing text search
 */
export interface NormalizerOptions {
  /**
   * Should we search in a case-sensitive way?
   *
   * (Defaults to false.)
   */
  caseSensitive?: boolean

  /**
   * Should we do a diacritic sensitive search?
   *
   * (Defaults to false.)
   */
  diacriticSensitive?: boolean
}

/**
 * A basic text normalizer function
 * 
 * @param text - The text to normalize
 * @param options - Normalization options
 * @returns Normalized text
 */
export const normalizeTextForSearch = (text: string, options: NormalizerOptions = {}) => {
  const { caseSensitive = false, diacriticSensitive = false } = options
  const stage1 = diacriticSensitive ? text : text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return caseSensitive ? stage1 : stage1.toLowerCase()
}

/**
 * Store info about where did we found the pattern inside the corpus
 */
export interface PositiveMatchInfo {
  startPos: number
  endPos: number
}

export const NO_MATCH = 'NO_MATCH'

export type MatchInfo = PositiveMatchInfo | typeof NO_MATCH

/**
 * Identify pattern matches within a corpus, also considering normalization
 *
 * If there is no match, an empty array is returned.
 *
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 * 
 * @param rawCorpus - The text to search in
 * @param pattern - Array of patterns to search for
 * @param options - Normalization options
 * @returns Array of match positions
 */
export const findTextMatches = (
  rawCorpus: string | null | undefined,
  pattern: (string | undefined)[],
  options: NormalizerOptions = {},
): PositiveMatchInfo[] => {
  const normalizedCorpus = normalizeTextForSearch(rawCorpus || '', options)
  const matches: PositiveMatchInfo[] = pattern
    .filter((s): s is string => !!s)
    .map(rawPattern => {
      const normalizedPattern = normalizeTextForSearch(rawPattern!, options)
      const matchStart = normalizedCorpus.indexOf(normalizedPattern)
      return matchStart !== -1
        ? {
            startPos: matchStart,
            endPos: matchStart + rawPattern.length,
          }
        : 'NO_MATCH'
    })
    .filter((m): m is PositiveMatchInfo => m !== NO_MATCH)
  return matches
}

/**
 * Identify the first pattern match within a corpus, also considering normalization
 *
 * If there is no match, NO_MATCH is returned.
 *
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 * 
 * @param rawCorpus - The text to search in
 * @param search - Array of patterns to search for
 * @param options - Normalization options
 * @returns Match information or NO_MATCH
 */
export const findTextMatch = (
  rawCorpus: string | null | undefined,
  search: (string | undefined)[],
  options: NormalizerOptions = {},
): MatchInfo => {
  const matches = findTextMatches(rawCorpus, search, options)
  return matches[0] ?? NO_MATCH
}

/**
 * Check if all patterns match within a corpus, also considering normalization
 *
 * NOTE: depending on normalization options, the string length can change,
 * and in that case, match position can be incorrect.
 *
 * Also NOTE: if there are no patterns given, the result will be true.
 * 
 * @param rawCorpus - The text to search in
 * @param patterns - Array of patterns to search for
 * @param options - Normalization options
 * @returns True if all patterns match
 */
export const hasTextMatchesForAll = (
  rawCorpus: string | null | undefined,
  patterns: (string | undefined)[],
  options: NormalizerOptions = {},
): boolean =>
  patterns
    .filter(pattern => !!pattern)
    .every(pattern => findTextMatch(rawCorpus, [pattern], options) !== NO_MATCH)

export interface TrimAroundOptions extends NormalizerOptions {
  /**
   * What should be the length of the fragment delivered, which
   * has the pattern inside it?
   *
   * The default value is 80.
   */
  fragmentLength?: number
}

/**
 * Return a part of the corpus that contains the match to the pattern, if any
 *
 * If the corpus is undefined or empty, undefined is returned.
 *
 * If either the pattern is undefined or empty, or there is no match,
 * an adequately sized part from the beginning of the corpus is returned.
 *
 * If there is a match, but the corpus is at most as long as the desired fragment length,
 * the whole corpus is returned.
 *
 * If there is a match, and the corpus is longer than the desired fragment length,
 * then a part of a corpus is returned, so that the match is within the returned part,
 * around the middle.
 * 
 * @param corpus - The text to trim
 * @param pattern - Array of patterns to search for
 * @param options - Trimming and normalization options
 * @returns Object containing the trimmed part
 */
export function trimAroundMatch(
  corpus: string | undefined,
  pattern: (string | undefined)[],
  options: TrimAroundOptions = {},
): {
  part: string | undefined
} {
  const { fragmentLength = 80, ...matchOptions } = options

  if (!corpus) {
    // there is nothing to see here
    return { part: undefined }
  }

  // do we have a match?
  const matches = findTextMatches(corpus, pattern, matchOptions)

  const match = matches.length
    ? {
        startPos: Math.min(...matches.map(m => m.startPos)),
        endPos: Math.max(...matches.map(m => m.endPos)),
      }
    : NO_MATCH

  if (corpus.length <= fragmentLength) {
    // the whole corpus fits into the max size, no need to cut.
    return { part: corpus }
  }

  // how much extra space do we have?
  const buffer = match === NO_MATCH ? fragmentLength : fragmentLength - (match.endPos - match.startPos)

  const matchStart = match === NO_MATCH ? 0 : match.startPos

  // We will start before the start of the match, by buffer / 2 chars
  const startPos = Math.max(Math.min(matchStart - Math.floor(buffer / 2), corpus.length - fragmentLength), 0)
  const endPos = Math.min(startPos + fragmentLength, corpus.length)

  // Do the trimming
  const prefix = startPos ? '…' : ''
  const postFix = endPos < corpus.length - 1 ? '…' : ''
  const part = prefix + corpus.substring(startPos, endPos) + postFix

  // compile the result
  return { part }
}

