import Link from 'next/link'
import type { ReactNode } from 'react'

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 999,
        color: 'rgba(255,255,255,0.7)',
        transition: 'color 0.18s ease, background 0.18s ease',
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
    </a>
  )
}

export default function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ marginBottom: '12px' }}>
              <img src="/legacy-home-team-logo.png" alt="Legacy Home Team" style={{ height: 36, width: 'auto', filter: 'brightness(0) invert(1)' }} />
            </div>
            <p>Barry Jenkins and the Legacy Home Team help families buy and sell across Virginia Beach, Chesapeake, Norfolk, and all of Hampton Roads.</p>
          </div>
          <div className="footer-col">
            <h4>Navigate</h4>
            <Link href="/">Home</Link>
            <Link href="/team">Our Team</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h4>Communities</h4>
            <Link href="/virginia-beach">Virginia Beach</Link>
            <Link href="/chesapeake">Chesapeake</Link>
            <Link href="/norfolk">Norfolk</Link>
            <Link href="/suffolk">Suffolk</Link>
            <Link href="/hampton">Hampton</Link>
            <Link href="/newport-news">Newport News</Link>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="tel:+17578164037">(757) 816-4037</a>
            <a href="mailto:barry@yourfriendlyagent.net">barry@yourfriendlyagent.net</a>
            <a href="https://maps.google.com/?q=1545+Crossways+Blvd+Suite+250+Chesapeake+VA+23320" target="_blank" rel="noopener noreferrer">1545 Crossways Blvd, Ste 250<br />Chesapeake, VA 23320</a>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
          <SocialIcon href="https://www.facebook.com/profile.php?id=61562934842651" label="Facebook">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </SocialIcon>
          <SocialIcon href="https://www.instagram.com/legacyhometeamlpt" label="Instagram">
            <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
          </SocialIcon>
          <SocialIcon href="https://www.youtube.com/@legacyhometeamlpt-vb" label="YouTube">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </SocialIcon>
          <SocialIcon href="https://www.tiktok.com/@legacy.home.team" label="TikTok">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.85 4.85 0 0 1-1.84-.31z" />
          </SocialIcon>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Legacy Home Team. All rights reserved.</span>
          <span>Virginia Beach &amp; Hampton Roads Real Estate</span>
        </div>
      </div>
    </footer>
  )
}
