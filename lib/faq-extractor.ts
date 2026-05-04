/**
 * lib/faq-extractor.ts
 *
 * Scans a PortableText block array for a "Frequently Asked Questions" H2
 * and extracts H3 questions + following paragraph answers as FAQPage JSON-LD.
 * Returns null if fewer than 2 Q&A pairs are found.
 */

interface PortableTextBlock {
  _type: string
  style?: string
  children?: Array<{ _type: string; text?: string }>
}

function blockText(block: PortableTextBlock): string {
  return (block.children ?? [])
    .filter((s) => s._type === 'span' && s.text)
    .map((s) => s.text ?? '')
    .join('')
    .trim()
}

export function extractFAQSchema(
  blocks: PortableTextBlock[],
): object | null {
  // Find the FAQ section header
  let faqStart = -1
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]
    if (b._type === 'block' && b.style === 'h2') {
      const text = blockText(b).toLowerCase()
      if (text.includes('frequently asked') || text.includes('faq')) {
        faqStart = i + 1
        break
      }
    }
  }
  if (faqStart === -1) return null

  const pairs: Array<{ question: string; answer: string }> = []
  let currentQuestion: string | null = null
  const answerLines: string[] = []

  const flush = () => {
    if (currentQuestion && answerLines.length > 0) {
      pairs.push({ question: currentQuestion, answer: answerLines.join(' ').trim() })
    }
    currentQuestion = null
    answerLines.length = 0
  }

  for (let i = faqStart; i < blocks.length; i++) {
    const b = blocks[i]
    if (b._type !== 'block') continue

    // Stop at next H2 (new section)
    if (b.style === 'h2') break

    if (b.style === 'h3') {
      flush()
      currentQuestion = blockText(b)
    } else if (b.style === 'normal' && currentQuestion) {
      const text = blockText(b)
      if (text) answerLines.push(text)
    }
  }
  flush()

  if (pairs.length < 2) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}
