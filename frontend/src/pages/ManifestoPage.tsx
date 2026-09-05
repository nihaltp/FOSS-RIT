import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Quote } from 'lucide-react';

export const ManifestoPage: React.FC = () => {
  return (
    <div style={{
      background: 'var(--paper-base)',
      minHeight: '100vh',
      paddingBottom: 'var(--space-4xl)',
    }}>
      <div className="container" style={{ maxWidth: '920px', paddingTop: 'var(--space-3xl)' }}>

        {/* Back nav */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Link
            to="/"
            className="btn btn-ghost btn-sm"
            style={{
              paddingLeft: '8px',
              color: 'var(--ink-black)',
              borderColor: 'var(--border-tech)',
            }}
          >
            <ArrowLeft size={15} /> [BACK TO OVERVIEW]
          </Link>
        </div>

        {/* Page Header Banner — Archival Frontispiece */}
        <div className="page-header-banner" style={{
          backgroundColor: 'var(--paper-lift)',
          backgroundImage: 'var(--paper-grain)',
          backgroundRepeat: 'repeat',
          color: 'var(--ink-black)',
          border: '2px solid var(--border-tech)',
          boxShadow: '3px 3px 0 var(--border-tech)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-2xl)',
          position: 'relative',
        }}>
          {/* Accent top rule */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0,
            height: '4px',
            background: 'var(--vibe-accent)',
          }} />
          <div>
            <div className="section-tag">
              [DECLARATION // HISTORIC MANIFESTO]
            </div>
            <h1 style={{
              fontFamily: 'var(--font-ndot)',
              fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
              fontWeight: 400,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              color: 'var(--ink-black)',
              marginTop: '6px',
              marginBottom: 'var(--space-sm)',
              lineHeight: 1.05,
            }}>
              The FOSS RIT Manifesto
            </h1>
            <p style={{ fontSize: '1.02rem', color: 'var(--ink-soft)', maxWidth: '720px', lineHeight: 1.65 }}>
              We believe knowledge, source code, and educational tools should be free, open, and accessible to everyone. Explore the foundational software freedoms and the Guerilla Open Access Manifesto that guide our community at RIT Kottayam.
            </p>
          </div>
        </div>

        {/* Section 1: The Four Software Freedoms */}
        <section style={{ marginBottom: 'var(--space-3xl)' }}>
          <div style={{
            backgroundColor: 'var(--paper-lift)',
            backgroundImage: 'var(--paper-grain)',
            backgroundRepeat: 'repeat',
            border: '2px solid var(--border-tech)',
            boxShadow: '3px 3px 0 var(--border-tech)',
            padding: 'var(--space-2xl)',
          }}>
            <div className="section-tag">
              [CORE PRINCIPLES // GNU FOSS]
            </div>
            <h2 style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--ink-black)',
              marginBottom: 'var(--space-xs)',
              letterSpacing: '-0.02em',
            }}>
              The Four Software Freedoms
            </h2>
            <p style={{ marginBottom: 'var(--space-xl)', color: 'var(--ink-soft)', maxWidth: '720px', fontSize: '0.98rem', lineHeight: 1.65 }}>
              Software freedom empowers students and developers to inspect, modify, and distribute the tools they rely on every day.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--space-md)',
            }}>
              {[
                { num: '[FREEDOM 0]', color: 'var(--vibe-accent)', text: 'The freedom to run the program as you wish, for any purpose.' },
                { num: '[FREEDOM 1]', color: 'var(--cobalt-tech)', text: 'The freedom to study how the program works and adapt it to your needs.' },
                { num: '[FREEDOM 2]', color: 'var(--amber-crt)', text: 'The freedom to redistribute copies so you can help your peers.' },
                { num: '[FREEDOM 3]', color: 'var(--accent-signal)', text: 'The freedom to distribute copies of your modified versions to the public.' },
              ].map(({ num, color, text }) => (
                <div key={num} style={{
                  padding: 'var(--space-lg)',
                  background: 'var(--paper-warm)',
                  border: '1.5px solid var(--border-tech)',
                  borderLeft: `5px solid ${color}`,
                  borderRadius: 0,
                  boxShadow: '2px 2px 0 var(--border-tech)',
                  transition: 'box-shadow 0.12s ease, transform 0.12s ease',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `3px 3px 0 var(--border-tech)`;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translate(-2px, -2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '2px 2px 0 var(--border-tech)';
                    (e.currentTarget as HTMLDivElement).style.transform = '';
                  }}
                >
                  <div style={{
                    color,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {num}
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--ink-black)', margin: 0, lineHeight: 1.55 }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Guerilla Open Access Manifesto */}
        <section>
          <div style={{
            backgroundColor: 'var(--paper-lift)',
            backgroundImage: 'var(--paper-grain)',
            backgroundRepeat: 'repeat',
            border: '2px solid var(--border-tech)',
            boxShadow: '3px 3px 0 var(--border-tech)',
            padding: 'var(--space-2xl)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xs)' }}>
              <Quote color="var(--vibe-accent)" size={20} />
              <div className="section-tag" style={{ margin: 0 }}>
                [HISTORIC CITATION // EREMO 2008]
              </div>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              color: 'var(--ink-black)',
              marginBottom: '4px',
            }}>
              Guerilla Open Access Manifesto
            </h2>

            <div style={{
              fontSize: '0.85rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--vibe-accent)',
              marginBottom: 'var(--space-xl)',
              fontWeight: 700,
            }}>
              By Aaron Swartz — July 2008, Eremo, Italy
            </div>

            {/* Double Horizontal Rule Divider */}
            <div style={{ height: '4px', borderTop: '1px solid var(--border-tech)', borderBottom: '1px solid var(--border-tech)', marginBottom: 'var(--space-xl)' }} />

            <article style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-lg)',
              fontSize: '1.02rem',
              lineHeight: 1.75,
              color: 'var(--ink-soft)',
            }}>
              <p>
                Information is power. But like all power, there are those who want to keep it for themselves. The world's entire scientific and cultural heritage, published over centuries in books and journals, is increasingly being digitized and locked up by a handful of private corporations. Want to read the papers featuring the most famous results of the sciences? You'll need to send enormous amounts to publishers like Reed Elsevier.
              </p>
              <p>
                There are those struggling to change this. The Open Access Movement has fought valiantly to ensure that scientists do not sign their copyrights away but instead ensure their work is published on the Internet, under terms that allow anyone to access it. But even under the best scenarios, their work will only apply to things published in the future. Everything up until now will have been lost.
              </p>
              <p>
                That is too high a price to pay. Forcing academics to pay money to read the work of their colleagues? Scanning entire libraries but only allowing the folks at Google to read them? Providing scientific articles to those at elite universities in the First World, but not to children in the Global South? It's outrageous and unacceptable.
              </p>

              {/* Inset Quote Plate */}
              <p style={{
                background: 'var(--paper-warm)',
                color: 'var(--ink-black)',
                padding: 'var(--space-md) var(--space-lg)',
                border: '1.5px solid var(--border-tech)',
                borderLeft: '5px solid var(--vibe-accent)',
                borderRadius: 0,
                boxShadow: '2px 2px 0 var(--border-tech)',
                fontStyle: 'italic',
                lineHeight: 1.65,
                fontFamily: 'var(--font-sans)',
              }}>
                "I agree," many say, "but what can we do? The companies hold the copyrights, they make enormous amounts of money by charging for access, and it's perfectly legal — there's nothing we can do to stop them." But there is something we can, something that's already being done: we can fight back.
              </p>

              <p>
                Those with access to these resources — students, librarians, scientists — you have been given a privilege. You get to feed at this banquet of knowledge while the rest of the world is locked out. But you need not — indeed, morally, you cannot — keep this privilege for yourselves. You have a duty to share it with the world. And you have: trading passwords with colleagues, filling download requests for friends.
              </p>
              <p>
                Meanwhile, those who have been locked out are not standing idly by. You have been sneaking through holes and climbing over fences, liberating the information locked up by the publishers and sharing them with your friends.
              </p>
              <p>
                But all of this action goes on in the dark, hidden underground. It's called stealing or piracy, as if sharing a wealth of knowledge were the moral equivalent of plundering a ship and murdering its crew. But sharing isn't immoral — it's a moral imperative. Only those blinded by greed would refuse to let a friend make a copy.
              </p>
              <p>
                Large corporations, of course, are blinded by greed. The laws under which they operate require it — their shareholders would revolt at anything less. And the politicians they have bought off back them, passing laws giving them the exclusive power to decide who can make copies.
              </p>
              <p>
                There is no justice in following unjust laws. It's time to come into the light and, in the grand tradition of civil disobedience, declare our opposition to this private theft of public culture.
              </p>
              <p>
                We need to take information, wherever it is stored, make our copies and share them with the world. We need to take stuff that's out of copyright and add it to the archive. We need to buy secret databases and put them on the Web. We need to download scientific journals and upload them to file sharing networks. We need to fight for Guerilla Open Access.
              </p>
              <p>
                With enough of us, around the world, we'll not just send a strong message opposing the privatization of knowledge — we'll make it a thing of the past.
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'var(--font-headline)',
                color: 'var(--vibe-accent)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}>
                Will you join us?
              </p>

              <div style={{
                marginTop: 'var(--space-md)',
                paddingTop: 'var(--space-md)',
                borderTop: '2px solid var(--border-tech)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: 'var(--ink-black)',
                  letterSpacing: '0.04em',
                }}>AARON SWARTZ</span>
                <span style={{
                  fontSize: '0.78rem',
                  color: 'var(--ink-muted)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}>July 2008, Eremo, Italy</span>
              </div>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManifestoPage;
