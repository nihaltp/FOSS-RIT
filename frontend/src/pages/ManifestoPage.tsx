import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Quote } from 'lucide-react';

export const ManifestoPage: React.FC = () => {
  return (
    <div style={{
      background: 'var(--paper)',
      minHeight: '100vh',
      paddingBottom: 'var(--space-4xl)',
    }}>
      <div className="container" style={{ maxWidth: '900px', paddingTop: 'var(--space-3xl)' }}>

        {/* Back nav */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <Link
            to="/"
            className="btn btn-ghost btn-sm"
            style={{
              paddingLeft: 0,
              color: 'var(--ink)',
              borderColor: 'var(--ink-4)',
            }}
          >
            <ArrowLeft size={16} /> Back to Overview
          </Link>
        </div>

        {/* Page Header Banner — ink on paper, hard border */}
        <div style={{
          background: 'var(--ink)',
          color: 'var(--paper)',
          border: '3px solid var(--ink)',
          padding: 'var(--space-2xl)',
          marginBottom: 'var(--space-2xl)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Accent stripe */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: '6px', height: '100%',
            background: 'var(--acid)',
          }} />
          <div style={{ paddingLeft: 'var(--space-lg)' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--acid)',
              marginBottom: 'var(--space-xs)',
            }}>
              OUR PHILOSOPHY & VALUES
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--paper)',
              marginBottom: 'var(--space-sm)',
              lineHeight: 1.05,
            }}>
              The FOSS RIT Manifesto
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#B0ADA8', maxWidth: '680px', lineHeight: 1.6 }}>
              We believe that knowledge should be free, open, and accessible to everyone. Explore the foundational software freedoms and the Guerilla Open Access Manifesto that guide our community at RIT Kottayam.
            </p>
          </div>
        </div>

        {/* Section 1: The Four Software Freedoms */}
        <section style={{ marginBottom: 'var(--space-3xl)' }}>
          <div style={{
            background: 'var(--chalk)',
            border: '2px solid var(--ink)',
            padding: 'var(--space-2xl)',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--moss)',
              marginBottom: 'var(--space-xs)',
            }}>
              OUR VALUES
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: 'var(--ink)',
              marginBottom: 'var(--space-sm)',
              letterSpacing: '-0.03em',
            }}>
              The Four Software Freedoms
            </h2>
            <p style={{ marginBottom: 'var(--space-xl)', color: '#3D3A35', maxWidth: '680px', fontSize: '1rem', lineHeight: 1.65 }}>
              Software freedom is about empowering users and communities to control the tools and technology they depend on every day.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 'var(--space-md)',
            }}>
              {[
                { num: 'FREEDOM 0', color: 'var(--moss)', text: 'The freedom to run the program as you wish, for any purpose.' },
                { num: 'FREEDOM 1', color: 'var(--cobalt)', text: 'The freedom to study how the program works and adapt it to your needs.' },
                { num: 'FREEDOM 2', color: 'var(--gold)', text: 'The freedom to redistribute copies so you can help your peers.' },
                { num: 'FREEDOM 3', color: 'var(--rust)', text: 'The freedom to distribute copies of your modified versions to the public.' },
              ].map(({ num, color, text }) => (
                <div key={num} style={{
                  padding: 'var(--space-lg)',
                  background: 'var(--paper)',
                  border: '2px solid var(--ink)',
                  borderLeft: `5px solid ${color}`,
                  borderRadius: 0,
                  transition: 'box-shadow 0.12s ease, transform 0.12s ease',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `3px 3px 0 var(--ink)`;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translate(-2px, -2px)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                    (e.currentTarget as HTMLDivElement).style.transform = '';
                  }}
                >
                  <div style={{
                    color,
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {num}
                  </div>
                  <p style={{ fontSize: '0.95rem', color: 'var(--ink)', margin: 0, lineHeight: 1.55 }}>
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
            background: 'var(--chalk)',
            border: '2px solid var(--ink)',
            padding: 'var(--space-2xl)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-xs)' }}>
              <Quote color="var(--moss)" size={22} />
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--moss)',
              }}>
                HISTORIC DECLARATION
              </div>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              marginBottom: '4px',
            }}>
              Guerilla Open Access Manifesto
            </h2>

            <div style={{
              fontSize: '0.88rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--moss)',
              marginBottom: 'var(--space-2xl)',
              fontWeight: 600,
            }}>
              By Aaron Swartz — July 2008, Eremo, Italy
            </div>

            {/* Divider */}
            <div style={{ height: '2px', background: 'var(--ink)', marginBottom: 'var(--space-2xl)' }} />

            <article style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-lg)',
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--ink)',
            }}>
              <p style={{ color: 'var(--ink)' }}>
                Information is power. But like all power, there are those who want to keep it for themselves. The world's entire scientific and cultural heritage, published over centuries in books and journals, is increasingly being digitized and locked up by a handful of private corporations. Want to read the papers featuring the most famous results of the sciences? You'll need to send enormous amounts to publishers like Reed Elsevier.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                There are those struggling to change this. The Open Access Movement has fought valiantly to ensure that scientists do not sign their copyrights away but instead ensure their work is published on the Internet, under terms that allow anyone to access it. But even under the best scenarios, their work will only apply to things published in the future. Everything up until now will have been lost.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                That is too high a price to pay. Forcing academics to pay money to read the work of their colleagues? Scanning entire libraries but only allowing the folks at Google to read them? Providing scientific articles to those at elite universities in the First World, but not to children in the Global South? It's outrageous and unacceptable.
              </p>
              <p style={{
                background: 'var(--ink)',
                color: 'var(--paper)',
                padding: 'var(--space-md) var(--space-lg)',
                borderLeft: '5px solid var(--acid)',
                borderRadius: 0,
                fontStyle: 'italic',
                lineHeight: 1.7,
              }}>
                "I agree," many say, "but what can we do? The companies hold the copyrights, they make enormous amounts of money by charging for access, and it's perfectly legal — there's nothing we can do to stop them." But there is something we can, something that's already being done: we can fight back.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                Those with access to these resources — students, librarians, scientists — you have been given a privilege. You get to feed at this banquet of knowledge while the rest of the world is locked out. But you need not — indeed, morally, you cannot — keep this privilege for yourselves. You have a duty to share it with the world. And you have: trading passwords with colleagues, filling download requests for friends.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                Meanwhile, those who have been locked out are not standing idly by. You have been sneaking through holes and climbing over fences, liberating the information locked up by the publishers and sharing them with your friends.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                But all of this action goes on in the dark, hidden underground. It's called stealing or piracy, as if sharing a wealth of knowledge were the moral equivalent of plundering a ship and murdering its crew. But sharing isn't immoral — it's a moral imperative. Only those blinded by greed would refuse to let a friend make a copy.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                Large corporations, of course, are blinded by greed. The laws under which they operate require it — their shareholders would revolt at anything less. And the politicians they have bought off back them, passing laws giving them the exclusive power to decide who can make copies.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                There is no justice in following unjust laws. It's time to come into the light and, in the grand tradition of civil disobedience, declare our opposition to this private theft of public culture.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                We need to take information, wherever it is stored, make our copies and share them with the world. We need to take stuff that's out of copyright and add it to the archive. We need to buy secret databases and put them on the Web. We need to download scientific journals and upload them to file sharing networks. We need to fight for Guerilla Open Access.
              </p>
              <p style={{ color: 'var(--ink)' }}>
                With enough of us, around the world, we'll not just send a strong message opposing the privatization of knowledge — we'll make it a thing of the past.
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 900,
                fontFamily: 'var(--font-display)',
                color: 'var(--moss)',
                letterSpacing: '-0.03em',
              }}>
                Will you join us?
              </p>

              <div style={{
                marginTop: 'var(--space-md)',
                paddingTop: 'var(--space-md)',
                borderTop: '2px solid var(--ink)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}>Aaron Swartz</span>
                <span style={{
                  fontSize: '0.82rem',
                  color: 'var(--dust)',
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
